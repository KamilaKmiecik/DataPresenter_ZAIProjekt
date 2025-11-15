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

const ChartView = ({ measurements, series, selectedMeasurement }) => {
    // Grupowanie pomiarów po czasie dla wykresu
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
                        r={8}
                        fill="white"
                        stroke={props.stroke}
                        strokeWidth={3}
                    />
                    <circle cx={cx} cy={cy} r={4} fill={props.stroke} />
                </g>
            );
        }

        return <Dot {...props} r={3} />;
    };

    const formatXAxis = (timestamp) => {
        return format(new Date(timestamp), 'dd.MM HH:mm', { locale: pl });
    };

    const formatTooltip = (value, name) => {
        const seriesId = parseInt(name.replace('series_', ''));
        const seriesData = series.find((s) => s.id === seriesId);
        return [`${value} ${seriesData?.unit || ''}`, seriesData?.name || name];
    };

    if (measurements.length === 0) {
        return (
            <div className="card">
                <h2 className="text-xl font-bold mb-4">Wykres pomiarów</h2>
                <div className="h-96 flex items-center justify-center text-gray-500">
                    No data for this time period
                </div>
            </div>
        );
    }

    return (
        <div className="card print-full-width">
            <h2 className="text-xl font-bold mb-4">Measurements graph</h2>

            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={formatXAxis}
                        stroke="#6b7280"
                    />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                        formatter={formatTooltip}
                        labelFormatter={(label) =>
                            format(new Date(label), 'dd MMMM yyyy, HH:mm', { locale: pl })
                        }
                    />
                    <Legend />

                    {series.map((s) => (
                        <Line
                            key={s.id}
                            type="monotone"
                            dataKey={`series_${s.id}`}
                            stroke={s.color}
                            name={s.name}
                            strokeWidth={2}
                            dot={<CustomDot />}
                            activeDot={{ r: 6 }}
                            connectNulls
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                    Wyœwietlono <strong>{measurements.length}</strong> pomiarów
                </p>
            </div>
        </div>
    );
};

export default ChartView;