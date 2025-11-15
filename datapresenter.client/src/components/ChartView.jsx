import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Dot,
} from 'recharts';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { TrendingUp, BarChart3 } from 'lucide-react';

const ChartView = ({ measurements, series, selectedMeasurement }) => {
    const chartData = React.useMemo(() => {
        const grouped = measurements.reduce((acc, m) => {
            const timeKey = new Date(m.timestamp).getTime();
            if (!acc[timeKey]) {
                acc[timeKey] = { timestamp: m.timestamp, time: timeKey };
            }
            acc[timeKey][`series_${m.seriesId}`] = m.value;
            acc[timeKey][`id_${m.seriesId}`] = m.id;
            return acc;
        }, {});

        return Object.values(grouped).sort((a, b) => a.time - b.time);
    }, [measurements]);

    const CustomDot = (props) => {
        const { cx, cy, payload, dataKey } = props;
        const seriesId = parseInt(dataKey.replace('series_', ''));
        const measurementId = payload[`id_${seriesId}`];
        const isSelected = selectedMeasurement?.id === measurementId;

        if (isSelected) {
            return (
                <g>
                    <circle
                        cx={cx}
                        cy={cy}
                        r={10}
                        fill="white"
                        stroke={props.stroke}
                        strokeWidth={4}
                    />
                    <circle cx={cx} cy={cy} r={5} fill={props.stroke} />
                    <circle cx={cx} cy={cy} r={12} fill={props.stroke} fillOpacity={0.2} />
                </g>
            );
        }

        return <Dot {...props} r={4} />;
    };

    const formatXAxis = (timestamp) => {
        return format(new Date(timestamp), 'dd.MM HH:mm', { locale: pl });
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: 'white',
                    padding: '16px',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                    border: '2px solid rgba(102, 126, 234, 0.2)'
                }}>
                    <p style={{
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        color: '#374151',
                        fontSize: '13px'
                    }}>
                        {format(new Date(label), 'dd MMMM yyyy, HH:mm', { locale: pl })}
                    </p>
                    {payload.map((entry, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginTop: '4px'
                        }}>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: entry.color,
                                boxShadow: `0 2px 8px ${entry.color}40`
                            }} />
                            <span style={{ fontSize: '13px', color: '#6b7280' }}>
                                {entry.name}:
                            </span>
                            <span style={{
                                fontWeight: 'bold',
                                color: entry.color,
                                fontSize: '14px'
                            }}>
                                {entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

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
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Measurements graph
                    </h2>
                </div>
                <div className="h-96 flex flex-col items-center justify-center">
                    <BarChart3 className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No data to display</p>
                    <p className="text-gray-400 text-sm mt-2">Choose a series</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card print-full-width">
            <div className="flex items-center gap-3 mb-6">
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
                    <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    Measurements graph
                </h2>
            </div>

            <div style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)',
                padding: '20px',
                borderRadius: '16px',
                border: '2px solid rgba(102, 126, 234, 0.05)'
            }}>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                        <defs>
                            {series.map((s) => (
                                <linearGradient key={s.id} id={`gradient-${s.id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={s.color} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={s.color} stopOpacity={0.1} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(102, 126, 234, 0.1)" />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={formatXAxis}
                            stroke="#9ca3af"
                            style={{ fontSize: '12px', fontWeight: '600' }}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            style={{ fontSize: '12px', fontWeight: '600' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{
                                paddingTop: '20px',
                                fontSize: '13px',
                                fontWeight: '600'
                            }}
                        />

                        {series.map((s) => (
                            <Line
                                key={s.id}
                                type="monotone"
                                dataKey={`series_${s.id}`}
                                stroke={s.color}
                                name={s.name}
                                strokeWidth={3}
                                dot={<CustomDot />}
                                activeDot={{ r: 8, strokeWidth: 2 }}
                                connectNulls
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 pt-4 border-t-2" style={{ borderColor: 'rgba(102, 126, 234, 0.1)' }}>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Displaying <span className="stats-badge">{measurements.length}</span> measurements
                    </p>
                    {selectedMeasurement && (
                        <span style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                            color: '#059669',
                            fontSize: '12px',
                            fontWeight: '600'
                        }}>
                            Measure selected
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChartView;