import React, { useEffect, useRef, useState } from 'react';
import * as Chart from 'chart.js';

const DashboardAnalytics = ({ dashboardData }) => {
    // State for modal
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [modalTitle, setModalTitle] = useState('');
    const [modalType, setModalType] = useState('');

    // Chart refs
    const productionChartRef = useRef(null);
    const costChartRef = useRef(null);
    const revenueChartRef = useRef(null);
    const resourceChartRef = useRef(null);
    const modalChartRef = useRef(null);
    const chartInstances = useRef({});

    useEffect(() => {
        // Register Chart.js components
        Chart.Chart.register(
            Chart.CategoryScale,
            Chart.LinearScale,
            Chart.PointElement,
            Chart.LineElement,
            Chart.BarElement,
            Chart.ArcElement,
            Chart.LineController,
            Chart.BarController,
            Chart.DoughnutController,
            Chart.RadarController,
            Chart.RadialLinearScale,
            Chart.Title,
            Chart.Tooltip,
            Chart.Legend
        );

        return () => {
            // Cleanup chart instances
            Object.values(chartInstances.current).forEach(chart => {
                if (chart) chart.destroy();
            });
        };
    }, []);

    useEffect(() => {
        if (dashboardData) {
            createCharts();
        }
    }, [dashboardData]);

    const handleChartClick = (type) => {
        if (!dashboardData?.landoptimizer?.suggested_locations?.[0]) return;
        
        const location = dashboardData.landoptimizer.suggested_locations[0];
        let data = null;
        let title = '';
        
        switch(type) {
            case 'production':
                title = 'Production Trend Details';
                // Get production data from localStorage if available
                const productionData = JSON.parse(localStorage.getItem('productionData') || 'null');
                data = {
                    labels: productionData?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    values: productionData?.values || [3500, 4200, 4800, 4100, 4600, 5000],
                    type: 'line',
                    unit: 'tons'
                };
                break;
            case 'cost':
                title = 'Cost Breakdown Details';
                const costData = location.cost_breakdown;
                data = {
                    labels: Object.keys(costData).map(key => key.replace(/_/g, ' ').replace(/cost/g, '').trim()),
                    values: Object.values(costData).map(val => parseInt(val.replace(/[^\d]/g, ''))),
                    type: 'doughnut',
                    unit: 'INR'
                };
                break;
            case 'revenue':
                title = 'Revenue Streams Details';
                const revenueData = location.revenue_estimation;
                data = {
                    labels: ['Domestic Sales', 'Export Revenue', 'Carbon Credits'],
                    values: [
                        parseInt(revenueData.domestic_sales_revenue.replace(/[^\d]/g, '')),
                        parseInt(revenueData.export_revenue.replace(/[^\d]/g, '')),
                        parseInt(revenueData.carbon_credit_revenue.replace(/[^\d]/g, ''))
                    ],
                    type: 'bar',
                    unit: 'Million INR'
                };
                break;
            case 'resource':
                title = 'Resource Utilization Details';
                // Get resource data from localStorage if available
                const resourceData = JSON.parse(localStorage.getItem('resourceData') || 'null');
                data = {
                    labels: ['Solar Panels', 'Wind Turbines', 'Electrolyzers', 'Storage Capacity', 'Distribution'],
                    values: resourceData?.values || [85, 92, 78, 88, 75],
                    type: 'radar',
                    unit: '%'
                };
                break;
            default:
                return;
        }
        
        setModalData(data);
        setModalTitle(title);
        setModalType(type);
        setModalOpen(true);
    };

    useEffect(() => {
        if (modalOpen && modalData) {
            // Create chart in modal
            const ctx = modalChartRef.current.getContext('2d');
            
            // Destroy existing modal chart if it exists
            if (chartInstances.current.modal) {
                chartInstances.current.modal.destroy();
            }
            
            let config = {};
            
            switch(modalData.type) {
                case 'line':
                    config = {
                        type: 'line',
                        data: {
                            labels: modalData.labels,
                            datasets: [{
                                label: `Monthly Production (${modalData.unit})`,
                                data: modalData.values,
                                borderColor: '#67C090',
                                backgroundColor: 'rgba(103, 192, 144, 0.1)',
                                tension: 0.4,
                                fill: true
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                                title: { display: true, text: modalTitle }
                            },
                            scales: {
                                y: { beginAtZero: true }
                            }
                        }
                    };
                    break;
                case 'doughnut':
                    config = {
                        type: 'doughnut',
                        data: {
                            labels: modalData.labels,
                            datasets: [{
                                data: modalData.values,
                                backgroundColor: ['#DDF4E7', '#67C090', '#26667F', '#124170', '#8FD3B0', '#4A90A4']
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { position: 'bottom' },
                                title: { display: true, text: modalTitle }
                            }
                        }
                    };
                    break;
                case 'bar':
                    config = {
                        type: 'bar',
                        data: {
                            labels: modalData.labels,
                            datasets: [{
                                label: `Revenue (${modalData.unit})`,
                                data: modalData.values,
                                backgroundColor: ['#67C090', '#26667F', '#124170']
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                                title: { display: true, text: modalTitle }
                            }
                        }
                    };
                    break;
                case 'radar':
                    config = {
                        type: 'radar',
                        data: {
                            labels: modalData.labels,
                            datasets: [{
                                label: `Resource Utilization ${modalData.unit}`,
                                data: modalData.values,
                                borderColor: '#26667F',
                                backgroundColor: 'rgba(38, 102, 127, 0.2)',
                                pointBackgroundColor: '#67C090'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                title: { display: true, text: modalTitle }
                            },
                            scales: {
                                r: {
                                    beginAtZero: true,
                                    max: 100
                                }
                            }
                        }
                    };
                    break;
                default:
                    return;
            }
            
            chartInstances.current.modal = new Chart.Chart(ctx, config);
        }
    }, [modalOpen, modalData, modalTitle]);

    const createCharts = () => {
        if (!dashboardData?.landoptimizer?.suggested_locations?.[0]) return;

        const location = dashboardData.landoptimizer.suggested_locations[0];
        
        // Destroy existing charts
        Object.values(chartInstances.current).forEach(chart => {
            if (chart) chart.destroy();
        });

        // Production Capacity Chart
        if (productionChartRef.current) {
            const ctx = productionChartRef.current.getContext('2d');
            // Get production data from localStorage if available
            const productionData = JSON.parse(localStorage.getItem('productionData') || 'null');
            chartInstances.current.production = new Chart.Chart(ctx, {
                type: 'line',
                data: {
                    labels: productionData?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Monthly Production (tons)',
                        data: productionData?.values || [3500, 4200, 4800, 4100, 4600, 5000],
                        borderColor: '#67C090',
                        backgroundColor: 'rgba(103, 192, 144, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
            
            // Add click event to the chart
            productionChartRef.current.onclick = () => handleChartClick('production');
        }

        // Cost Breakdown Chart
        if (costChartRef.current) {
            const ctx = costChartRef.current.getContext('2d');
            const costData = location.cost_breakdown;
            chartInstances.current.cost = new Chart.Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(costData).map(key => key.replace(/_/g, ' ').replace(/cost/g, '').trim()),
                    datasets: [{
                        data: Object.values(costData).map(val => parseInt(val.replace(/[^\d]/g, ''))),
                        backgroundColor: ['#DDF4E7', '#67C090', '#26667F', '#124170', '#8FD3B0', '#4A90A4']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }
            });
            
            // Add click event to the chart
            costChartRef.current.onclick = () => handleChartClick('cost');
        }

        // Revenue Chart
        if (revenueChartRef.current) {
            const ctx = revenueChartRef.current.getContext('2d');
            const revenueData = location.revenue_estimation;
            chartInstances.current.revenue = new Chart.Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Domestic Sales', 'Export Revenue', 'Carbon Credits'],
                    datasets: [{
                        label: 'Revenue (Million INR)',
                        data: [
                            parseInt(revenueData.domestic_sales_revenue.replace(/[^\d]/g, '')),
                            parseInt(revenueData.export_revenue.replace(/[^\d]/g, '')),
                            parseInt(revenueData.carbon_credit_revenue.replace(/[^\d]/g, ''))
                        ],
                        backgroundColor: ['#67C090', '#26667F', '#124170']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
            
            // Add click event to the chart
            revenueChartRef.current.onclick = () => handleChartClick('revenue');
        }

        // Resource Utilization Chart
        if (resourceChartRef.current) {
            const ctx = resourceChartRef.current.getContext('2d');
            // Get resource data from localStorage if available
            const resourceData = JSON.parse(localStorage.getItem('resourceData') || 'null');
            chartInstances.current.resource = new Chart.Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Solar Panels', 'Wind Turbines', 'Electrolyzers', 'Storage Capacity', 'Distribution'],
                    datasets: [{
                        label: 'Resource Utilization %',
                        data: resourceData?.values || [85, 92, 78, 88, 75],
                        borderColor: '#26667F',
                        backgroundColor: 'rgba(38, 102, 127, 0.2)',
                        pointBackgroundColor: '#67C090'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
            
            // Add click event to the chart
            resourceChartRef.current.onclick = () => handleChartClick('resource');
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        if (chartInstances.current.modal) {
            chartInstances.current.modal.destroy();
            chartInstances.current.modal = null;
        }
    };

    return (
        <div className="analytics-section">
            <div className="section-header">
                <h2>Performance Analytics</h2>
                <p>Click on any chart to view detailed information</p>
            </div>
            
            <div className="analytics-grid">
                <div className="chart-card card">
                    <h3>Production Trend</h3>
                    <div className="chart-container">
                        <canvas ref={productionChartRef}></canvas>
                    </div>
                </div>

                <div className="chart-card card">
                    <h3>Cost Distribution</h3>
                    <div className="chart-container">
                        <canvas ref={costChartRef}></canvas>
                    </div>
                </div>

                <div className="chart-card card">
                    <h3>Revenue Streams</h3>
                    <div className="chart-container">
                        <canvas ref={revenueChartRef}></canvas>
                    </div>
                </div>

                <div className="chart-card card">
                    <h3>Resource Utilization</h3>
                    <div className="chart-container">
                        <canvas ref={resourceChartRef}></canvas>
                    </div>
                </div>
            </div>

            {dashboardData?.landoptimizer?.suggested_locations && (
                <div className="comparison-analysis card">
                    <h3>Cost Optimization Analysis</h3>
                    <div className="comparison-grid">
                        <div className="comparison-item">
                            <h4>Base Cost</h4>
                            <div className="cost-value base">{dashboardData.landoptimizer.suggested_locations[0].base_cost_estimate}</div>
                        </div>
                        <div className="comparison-arrow">
                            <i className="fas fa-arrow-right"></i>
                        </div>
                        <div className="comparison-item">
                            <h4>Optimized Cost</h4>
                            <div className="cost-value optimized">{dashboardData.landoptimizer.suggested_locations[0].optimized_cost_estimate}</div>
                        </div>
                        <div className="savings-highlight">
                            <div className="savings-amount">INR 50 Million</div>
                            <div className="savings-label">Potential Savings</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for detailed view */}
            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{modalTitle}</h3>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-chart">
                                <canvas ref={modalChartRef}></canvas>
                            </div>
                            <div className="modal-table">
                                <h4>Tabular Data</h4>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Category</th>
                                            <th>Value ({modalData?.unit})</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {modalData?.labels.map((label, index) => (
                                            <tr key={index}>
                                                <td>{label}</td>
                                                <td>{modalData.values[index].toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <style>
                {
                    `
                    .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 8px;
    padding: 20px;
    max-width: 90%;
    max-height: 90%;
    overflow: auto;
    width: 800px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
}

.modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

.modal-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.modal-chart {
    height: 300px;
}

.modal-table {
    max-height: 300px;
    overflow: auto;
}

.modal-table table {
    width: 100%;
    border-collapse: collapse;
}

.modal-table th, .modal-table td {
    padding: 8px 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
}

.modal-table th {
    background-color: #f5f5f5;
    font-weight: bold;
}

@media (max-width: 768px) {
    .modal-body {
        grid-template-columns: 1fr;
    }
    
    .modal-content {
        width: 95%;
    }
}
                    `
                }
            </style>
        </div>
    );
};

export default DashboardAnalytics;