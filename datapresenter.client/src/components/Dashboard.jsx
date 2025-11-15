import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { seriesAPI, measurementsAPI } from '../services/api';
import ChartView from './ChartView';
import TableView from './TableView';
import Filters from './Filters';
import Header from './Header';
import AddMeasurementModal from './AddMeasurementModal';

const Dashboard = () => {
    const { isAuthenticated } = useAuth();
    const [series, setSeries] = useState([]);
    const [measurements, setMeasurements] = useState([]);
    const [filteredMeasurements, setFilteredMeasurements] = useState([]);
    const [selectedSeries, setSelectedSeries] = useState([]);
    const [selectedMeasurement, setSelectedMeasurement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    const [filters, setFilters] = useState({
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [measurements, selectedSeries, filters]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [seriesRes, measurementsRes] = await Promise.all([
                seriesAPI.getAll(),
                measurementsAPI.getAll(),
            ]);

            setSeries(seriesRes.data);
            setMeasurements(measurementsRes.data);
            setSelectedSeries(seriesRes.data.map((s) => s.id));
        } catch (error) {
            console.error('Error loading data:', error);
        }
        setLoading(false);
    };

    const applyFilters = () => {
        let filtered = [...measurements];

        if (selectedSeries.length > 0) {
            filtered = filtered.filter((m) => selectedSeries.includes(m.seriesId));
        }

        if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            filtered = filtered.filter((m) => new Date(m.timestamp) >= startDate);
        }

        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter((m) => new Date(m.timestamp) <= endDate);
        }

        setFilteredMeasurements(filtered);
    };

    const handleSeriesToggle = (seriesId) => {
        setSelectedSeries((prev) =>
            prev.includes(seriesId)
                ? prev.filter((id) => id !== seriesId)
                : [...prev, seriesId]
        );
    };

    const handleMeasurementSelect = (measurement) => {
        setSelectedMeasurement(measurement);
    };

    const handleMeasurementAdded = () => {
        loadData();
        setShowAddModal(false);
    };

    const handleMeasurementUpdated = () => {
        loadData();
    };

    const handleMeasurementDeleted = () => {
        loadData();
        setSelectedMeasurement(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header onAddClick={() => setShowAddModal(true)} />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <Filters
                    series={series}
                    selectedSeries={selectedSeries}
                    onSeriesToggle={handleSeriesToggle}
                    filters={filters}
                    onFiltersChange={setFilters}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    <div className="lg:col-span-2">
                        <ChartView
                            measurements={filteredMeasurements}
                            series={series}
                            selectedMeasurement={selectedMeasurement}
                        />
                    </div>

                    <div>
                        <TableView
                            measurements={filteredMeasurements}
                            series={series}
                            selectedMeasurement={selectedMeasurement}
                            onMeasurementSelect={handleMeasurementSelect}
                            onMeasurementUpdated={handleMeasurementUpdated}
                            onMeasurementDeleted={handleMeasurementDeleted}
                        />
                    </div>
                </div>
            </main>

            {showAddModal && isAuthenticated && (
                <AddMeasurementModal
                    series={series}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={handleMeasurementAdded}
                />
            )}
        </div>
    );
};

export default Dashboard;