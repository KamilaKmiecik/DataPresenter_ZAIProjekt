import React, { useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth';
import { measurementsAPI } from '../services/api';
import { Edit2, Trash2, Save, X } from 'lucide-react';

const TableView = ({
    measurements,
    series,
    selectedMeasurement,
    onMeasurementSelect,
    onMeasurementUpdated,
    onMeasurementDeleted,
}) => {
    const { isAuthenticated } = useAuth();
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [editTimestamp, setEditTimestamp] = useState('');
    const [error, setError] = useState('');

    const handleEditStart = (measurement) => {
        setEditingId(measurement.id);
        setEditValue(measurement.value.toString());
        setEditTimestamp(format(new Date(measurement.timestamp), "yyyy-MM-dd'T'HH:mm"));
        setError('');
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditValue('');
        setEditTimestamp('');
        setError('');
    };

    const handleEditSave = async (measurement) => {
        const seriesData = series.find((s) => s.id === measurement.seriesId);
        const newValue = parseFloat(editValue);

        if (isNaN(newValue)) {
            setError('Nieprawid³owa wartoœæ');
            return;
        }

        if (newValue < seriesData.minValue || newValue > seriesData.maxValue) {
            setError(
                `Wartoœæ musi byæ w zakresie ${seriesData.minValue} - ${seriesData.maxValue} ${seriesData.unit}`
            );
            return;
        }

        try {
            await measurementsAPI.update(measurement.id, {
                value: newValue,
                timestamp: new Date(editTimestamp).toISOString(),
                notes: measurement.notes,
            });

            setEditingId(null);
            setError('');
            onMeasurementUpdated();
        } catch (error) {
            setError(error.response?.data?.message || 'B³¹d aktualizacji');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Czy na pewno chcesz usun¹æ ten pomiar?')) {
            return;
        }

        try {
            await measurementsAPI.delete(id);
            onMeasurementDeleted();
        } catch (error) {
            alert(error.response?.data?.message || 'B³¹d usuwania');
        }
    };

    const handleKeyPress = (e, measurement) => {
        if (e.key === 'Enter') {
            handleEditSave(measurement);
        } else if (e.key === 'Escape') {
            handleEditCancel();
        }
    };

    const sortedMeasurements = [...measurements].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    if (measurements.length === 0) {
        return (
            <div className="card">
                <h2 className="text-xl font-bold mb-4">Tabela pomiarów</h2>
                <div className="text-center text-gray-500 py-8">
                    Brak danych do wyœwietlenia
                </div>
            </div>
        );
    }

    return (
        <div className="card print-full-width">
            <h2 className="text-xl font-bold mb-4">Tabela pomiarów</h2>

            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">
                                Data i czas
                            </th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">
                                Seria
                            </th>
                            <th className="px-3 py-2 text-right font-medium text-gray-700">
                                Wartoœæ
                            </th>
                            {isAuthenticated && (
                                <th className="px-3 py-2 text-center font-medium text-gray-700 no-print">
                                    Akcje
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedMeasurements.map((m) => {
                            const seriesData = series.find((s) => s.id === m.seriesId);
                            const isSelected = selectedMeasurement?.id === m.id;
                            const isEditing = editingId === m.id;

                            return (
                                <tr
                                    key={m.id}
                                    className={
                                        isSelected
                                            ? 'table-row-selected'
                                            : 'table-row border-b border-gray-100'
                                    }
                                    onClick={() => !isEditing && onMeasurementSelect(m)}
                                >
                                    <td className="px-3 py-2">
                                        {isEditing ? (
                                            <input
                                                type="datetime-local"
                                                value={editTimestamp}
                                                onChange={(e) => setEditTimestamp(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="input-field text-xs"
                                            />
                                        ) : (
                                            <div className="text-xs">
                                                <div>{format(new Date(m.timestamp), 'dd.MM.yyyy')}</div>
                                                <div className="text-gray-500">
                                                    {format(new Date(m.timestamp), 'HH:mm:ss')}
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-3 py-2">
                                        <span
                                            className="inline-block w-3 h-3 rounded-full mr-2"
                                            style={{ backgroundColor: seriesData?.color }}
                                        ></span>
                                        <span className="text-xs">{m.seriesName}</span>
                                    </td>
                                    <td className="px-3 py-2 text-right font-medium">
                                        {isEditing ? (
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onKeyDown={(e) => handleKeyPress(e, m)}
                                                    className="input-field text-right"
                                                    autoFocus
                                                />
                                                {error && (
                                                    <div className="text-xs text-red-600 mt-1">{error}</div>
                                                )}
                                            </div>
                                        ) : (
                                            `${m.value} ${m.seriesUnit}`
                                        )}
                                    </td>
                                    {isAuthenticated && (
                                        <td
                                            className="px-3 py-2 no-print"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {isEditing ? (
                                                <div className="flex gap-1 justify-center">
                                                    <button
                                                        onClick={() => handleEditSave(m)}
                                                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                        title="Zapisz"
                                                    >
                                                        <Save className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={handleEditCancel}
                                                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                                        title="Anuluj"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-1 justify-center">
                                                    <button
                                                        onClick={() => handleEditStart(m)}
                                                        className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                                                        title="Edytuj"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(m.id)}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                        title="Usuñ"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableView;