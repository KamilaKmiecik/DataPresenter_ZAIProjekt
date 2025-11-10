import React from 'react';
import { Calendar } from 'lucide-react';

const Filters = ({ series, selectedSeries, onSeriesToggle, filters, onFiltersChange }) => {
    return (
        <div className="card no-print">
            <h3 className="text-lg font-semibold mb-4">Filtry i kontrolki</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date range filters */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Zakres dat
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Od:</label>
                            <input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) =>
                                    onFiltersChange({ ...filters, startDate: e.target.value })
                                }
                                className="input-field text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Do:</label>
                            <input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) =>
                                    onFiltersChange({ ...filters, endDate: e.target.value })
                                }
                                className="input-field text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Series selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wybrane serie
                    </label>
                    <div className="space-y-2">
                        {series.map((s) => (
                            <label
                                key={s.id}
                                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedSeries.includes(s.id)}
                                    onChange={() => onSeriesToggle(s.id)}
                                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                />
                                <span
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: s.color }}
                                ></span>
                                <span className="text-sm font-medium">{s.name}</span>
                                <span className="text-xs text-gray-500">
                                    ({s.measurementCount} pomiarów)
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                    onClick={() => {
                        onSeriesToggle(-1);
                        const allSelected = selectedSeries.length === series.length;
                        series.forEach((s) => {
                            if (allSelected && selectedSeries.includes(s.id)) {
                                onSeriesToggle(s.id);
                            } else if (!allSelected && !selectedSeries.includes(s.id)) {
                                onSeriesToggle(s.id);
                            }
                        });
                    }}
                    className="text-sm text-primary-600 hover:text-primary-700"
                >
                    {selectedSeries.length === series.length
                        ? 'Odznacz wszystkie'
                        : 'Zaznacz wszystkie'}
                </button>
            </div>
        </div>
    );
};

export default Filters;