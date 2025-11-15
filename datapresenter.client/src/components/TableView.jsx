import React, { useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth';
import { measurementsAPI } from '../services/api';
import { Edit2, Trash2, Save, X, Table } from 'lucide-react';

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
                <div className="flex items-center gap-3 mb-4">
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                    }}>
                        <Table className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Measurements table
                    </h2>
                </div>
                <div className="text-center text-gray-500 py-8">
                    <Table className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium">No data for this time period</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card print-full-width">
            <div className="flex items-center gap-3 mb-4">
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                }}>
                    <Table className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    Measurements table
                </h2>
            </div>

            <div style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)',
                borderRadius: '16px',
                border: '2px solid rgba(102, 126, 234, 0.05)',
                overflow: 'hidden'
            }}>
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <table className="w-full text-sm">
                        <thead style={{
                            background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                            position: 'sticky',
                            top: 0,
                            zIndex: 10
                        }}>
                            <tr>
                                <th style={{
                                    padding: '14px 16px',
                                    textAlign: 'left',
                                    fontWeight: '700',
                                    color: '#374151',
                                    textTransform: 'uppercase',
                                    fontSize: '11px',
                                    letterSpacing: '0.5px'
                                }}>
                                   Date and time
                                </th>
                                <th style={{
                                    padding: '14px 16px',
                                    textAlign: 'left',
                                    fontWeight: '700',
                                    color: '#374151',
                                    textTransform: 'uppercase',
                                    fontSize: '11px',
                                    letterSpacing: '0.5px'
                                }}>
                                   Series   
                                </th>
                                <th style={{
                                    padding: '14px 16px',
                                    textAlign: 'right',
                                    fontWeight: '700',
                                    color: '#374151',
                                    textTransform: 'uppercase',
                                    fontSize: '11px',
                                    letterSpacing: '0.5px'
                                }}>
                                    Value
                                </th>
                                {isAuthenticated && (
                                    <th className="no-print" style={{
                                        padding: '14px 16px',
                                        textAlign: 'center',
                                        fontWeight: '700',
                                        color: '#374151',
                                        textTransform: 'uppercase',
                                        fontSize: '11px',
                                        letterSpacing: '0.5px'
                                    }}>
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
                                        className={isSelected ? 'table-row-selected' : 'table-row'}
                                        onClick={() => !isEditing && onMeasurementSelect(m)}
                                        style={{
                                            cursor: isEditing ? 'default' : 'pointer',
                                            borderBottom: '1px solid rgba(229, 231, 235, 0.5)'
                                        }}
                                    >
                                        <td style={{ padding: '12px 16px' }}>
                                            {isEditing ? (
                                                <input
                                                    type="datetime-local"
                                                    value={editTimestamp}
                                                    onChange={(e) => setEditTimestamp(e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="input-field text-xs"
                                                />
                                            ) : (
                                                <div style={{ fontSize: '13px' }}>
                                                    <div style={{ fontWeight: '600', color: '#374151' }}>
                                                        {format(new Date(m.timestamp), 'dd.MM.yyyy')}
                                                    </div>
                                                    <div style={{ color: '#9ca3af', fontSize: '12px' }}>
                                                        {format(new Date(m.timestamp), 'HH:mm:ss')}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span
                                                    style={{
                                                        width: '16px',
                                                        height: '16px',
                                                        borderRadius: '50%',
                                                        backgroundColor: seriesData?.color,
                                                        boxShadow: `0 2px 8px ${seriesData?.color}40`,
                                                        flexShrink: 0
                                                    }}
                                                ></span>
                                                <span style={{
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    color: '#374151'
                                                }}>
                                                    {m.seriesName}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
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
                                                        <div style={{
                                                            fontSize: '11px',
                                                            color: '#ef4444',
                                                            marginTop: '4px',
                                                            fontWeight: '600'
                                                        }}>
                                                            {error}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span style={{
                                                    fontWeight: '700',
                                                    fontSize: '14px',
                                                    color: seriesData?.color || '#374151'
                                                }}>
                                                    {m.value} <span style={{
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        color: '#9ca3af'
                                                    }}>{m.seriesUnit}</span>
                                                </span>
                                            )}
                                        </td>
                                        {isAuthenticated && (
                                            <td
                                                className="no-print"
                                                style={{ padding: '12px 16px' }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {isEditing ? (
                                                    <div style={{
                                                        display: 'flex',
                                                        gap: '6px',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <button
                                                            onClick={() => handleEditSave(m)}
                                                            style={{
                                                                padding: '6px',
                                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                                color: 'white',
                                                                borderRadius: '8px',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                                                            }}
                                                            title="Zapisz"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={handleEditCancel}
                                                            style={{
                                                                padding: '6px',
                                                                background: '#f3f4f6',
                                                                color: '#6b7280',
                                                                borderRadius: '8px',
                                                                border: 'none',
                                                                cursor: 'pointer'
                                                            }}
                                                            title="Anuluj"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div style={{
                                                        display: 'flex',
                                                        gap: '6px',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <button
                                                            onClick={() => handleEditStart(m)}
                                                            style={{
                                                                padding: '6px',
                                                                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                                                color: '#667eea',
                                                                borderRadius: '8px',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                            title="Edytuj"
                                                            onMouseEnter={(e) => {
                                                                e.target.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
                                                            }}
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(m.id)}
                                                            style={{
                                                                padding: '6px',
                                                                background: 'rgba(239, 68, 68, 0.1)',
                                                                color: '#ef4444',
                                                                borderRadius: '8px',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                            title="Usuñ"
                                                            onMouseEnter={(e) => {
                                                                e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                                                            }}
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
        </div>
    );
};

export default TableView;