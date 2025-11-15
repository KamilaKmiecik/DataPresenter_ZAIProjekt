import React from 'react';
import { Calendar, Filter } from 'lucide-react';

const Filters = ({ series, selectedSeries, onSeriesToggle, filters, onFiltersChange }) => {
    const toggleAll = () => {
        const allSelected = selectedSeries.length === series.length;
        if (allSelected) {
            series.forEach((s) => {
                if (selectedSeries.includes(s.id)) {
                    onSeriesToggle(s.id);
                }
            });
        } else {
            series.forEach((s) => {
                if (!selectedSeries.includes(s.id)) {
                    onSeriesToggle(s.id);
                }
            });
        }
    };

    return (
        <div className="card no-print">
            <div className="flex items-center gap-2 mb-6">
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
                    <Filter className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    Filters and toggles
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div style={{
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '2px solid rgba(102, 126, 234, 0.1)'
                }}>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                        <Calendar className="w-4 h-4 inline mr-2" style={{ color: '#667eea' }} />
                        Choose date
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2">From:</label>
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
                            <label className="block text-xs font-semibold text-gray-600 mb-2">To:</label>
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

                <div style={{
                    background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.05) 0%, rgba(245, 87, 108, 0.05) 100%)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '2px solid rgba(240, 147, 251, 0.1)'
                }}>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                        Select series
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {series.map((s) => (
                            <label
                                key={s.id}
                                className="flex items-center gap-3 cursor-pointer hover:bg-white p-3 rounded-xl transition-all duration-200"
                                style={{
                                    border: selectedSeries.includes(s.id)
                                        ? '2px solid rgba(102, 126, 234, 0.2)'
                                        : '2px solid transparent'
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedSeries.includes(s.id)}
                                    onChange={() => onSeriesToggle(s.id)}
                                    className="w-5 h-5 rounded-lg"
                                    style={{ accentColor: '#667eea' }}
                                />
                                <span
                                    className="series-color-dot"
                                    style={{
                                        backgroundColor: s.color,
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        boxShadow: `0 2px 8px ${s.color}40`
                                    }}
                                ></span>
                                <span className="text-sm font-semibold flex-1">{s.name}</span>
                                <span className="stats-badge" style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    fontSize: '11px'
                                }}>
                                    {s.measurementCount || 0}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t-2" style={{ borderColor: 'rgba(102, 126, 234, 0.1)' }}>
                <button
                    onClick={toggleAll}
                    className="text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200"
                    style={{
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                        color: '#667eea'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
                    }}
                >
                    {selectedSeries.length === series.length
                        ? 'Select all'
                        : 'Deselect all'}
                </button>
            </div>
        </div>
    );
};

export default Filters;