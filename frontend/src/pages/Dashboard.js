import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SolarPanel from '../3dModels/SolarPanel';
import WindPower from '../3dModels/WindPower';
import DashboardOverview from '../components/DashboardOverview'; // Import the new component
import DashboardVisualization from '../components//DashboardVisualization'; // Import the new component
import DashboardProjects from '../components//DashboardProjects'; // Import the new component
import DashboardAnalytics from '../components//DashboardAnalytics'; // Import the new component
import DashboardResources from '../components//DashboardResources'; // Import the new component
import DashboardReports from '../components//DashboardReports'; // Import the new component

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    // Chart refs
    const productionChartRef = useRef(null);
    const costChartRef = useRef(null);
    const revenueChartRef = useRef(null);
    const resourceChartRef = useRef(null);
    const chartInstances = useRef({});

    useEffect(() => {
        // Register Chart.js components
        // Chart.Chart.register(
        //     Chart.CategoryScale,
        //     Chart.LinearScale,
        //     Chart.PointElement,
        //     Chart.LineElement,
        //     Chart.BarElement,
        //     Chart.ArcElement,
        //     Chart.LineController, // Add this
        //     Chart.BarController,  // Add this
        //     Chart.DoughnutController, // Add this
        //     Chart.RadarController, // Add this
        //     Chart.RadialLinearScale, // Add this
        //     Chart.Title,
        //     Chart.Tooltip,
        //     Chart.Legend,
        //     Chart.ArcElement
        // );
        // Fetch data from localStorage
        const fetchDataFromStorage = () => {
            try {
                const storedData = localStorage.getItem('apiResponseData');
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    console.log('Parsed data structure:', parsedData);
                    
                    // CORRECTED: Access parsedData.data.data
                    if (parsedData.data && parsedData.data.success && parsedData.data.data) {
                        setDashboardData(parsedData.data.data);
                    } else if (parsedData.data) {
                        setDashboardData(parsedData.data);
                    } else {
                        console.warn('Unexpected data structure:', parsedData);
                        setDashboardData(parsedData); // Fallback
                    }
                } else {
                    console.warn('No data found in localStorage');
                    navigate('/qna'); // Redirect to /qna if no data
                }
            } catch (error) {
                console.error('Error fetching data from localStorage:', error);
                navigate('/qna'); // Also redirect on error
            } finally {
                setLoading(false);
            }
        };

        fetchDataFromStorage();

        return () => {
            // Cleanup chart instances
            Object.values(chartInstances.current).forEach(chart => {
                if (chart) chart.destroy();
            });
        };
    }, []);

    useEffect(() => {
        // if (dashboardData && activeTab === 'analytics') {
        //     createCharts();
        // }
    }, [dashboardData, activeTab]);

    // const createCharts = () => {
    //     if (!dashboardData?.landoptimizer?.suggested_locations?.[0]) return;

    //     const location = dashboardData.landoptimizer.suggested_locations[0];
        
    //     // Destroy existing charts
    //     Object.values(chartInstances.current).forEach(chart => {
    //         if (chart) chart.destroy();
    //     });

    //     // Production Capacity Chart
    //     if (productionChartRef.current) {
    //         const ctx = productionChartRef.current.getContext('2d');
    //         chartInstances.current.production = new Chart.Chart(ctx, {
    //             type: 'line',
    //             data: {
    //                 labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    //                 datasets: [{
    //                     label: 'Monthly Production (tons)',
    //                     data: [3500, 4200, 4800, 4100, 4600, 5000],
    //                     borderColor: '#67C090',
    //                     backgroundColor: 'rgba(103, 192, 144, 0.1)',
    //                     tension: 0.4,
    //                     fill: true
    //                 }]
    //             },
    //             options: {
    //                 responsive: true,
    //                 maintainAspectRatio: false,
    //                 plugins: {
    //                     legend: { display: false }
    //                 },
    //                 scales: {
    //                     y: { beginAtZero: true }
    //                 }
    //             }
    //         });
    //     }

    //     // Cost Breakdown Chart
    //     if (costChartRef.current) {
    //         const ctx = costChartRef.current.getContext('2d');
    //         const costData = location.cost_breakdown;
    //         chartInstances.current.cost = new Chart.Chart(ctx, {
    //             type: 'doughnut',
    //             data: {
    //                 labels: Object.keys(costData).map(key => key.replace(/_/g, ' ').replace(/cost/g, '').trim()),
    //                 datasets: [{
    //                     data: Object.values(costData).map(val => parseInt(val.replace(/[^\d]/g, ''))),
    //                     backgroundColor: ['#DDF4E7', '#67C090', '#26667F', '#124170', '#8FD3B0', '#4A90A4']
    //                 }]
    //             },
    //             options: {
    //                 responsive: true,
    //                 maintainAspectRatio: false,
    //                 plugins: {
    //                     legend: { position: 'bottom' }
    //                 }
    //             }
    //         });
    //     }

    //     // Revenue Chart
    //     if (revenueChartRef.current) {
    //         const ctx = revenueChartRef.current.getContext('2d');
    //         const revenueData = location.revenue_estimation;
    //         chartInstances.current.revenue = new Chart.Chart(ctx, {
    //             type: 'bar',
    //             data: {
    //                 labels: ['Domestic Sales', 'Export Revenue', 'Carbon Credits'],
    //                 datasets: [{
    //                     label: 'Revenue (Million INR)',
    //                     data: [
    //                         parseInt(revenueData.domestic_sales_revenue.replace(/[^\d]/g, '')),
    //                         parseInt(revenueData.export_revenue.replace(/[^\d]/g, '')),
    //                         parseInt(revenueData.carbon_credit_revenue.replace(/[^\d]/g, ''))
    //                     ],
    //                     backgroundColor: ['#67C090', '#26667F', '#124170']
    //                 }]
    //             },
    //             options: {
    //                 responsive: true,
    //                 maintainAspectRatio: false,
    //                 plugins: {
    //                     legend: { display: false }
    //                 }
    //             }
    //         });
    //     }

    //     // Resource Utilization Chart
    //     if (resourceChartRef.current) {
    //         const ctx = resourceChartRef.current.getContext('2d');
    //         const resources = location.resource_sizing;
    //         chartInstances.current.resource = new Chart.Chart(ctx, {
    //             type: 'radar',
    //             data: {
    //                 labels: ['Solar Panels', 'Wind Turbines', 'Electrolyzers', 'Storage Capacity', 'Distribution'],
    //                 datasets: [{
    //                     label: 'Resource Utilization %',
    //                     data: [85, 92, 78, 88, 75],
    //                     borderColor: '#26667F',
    //                     backgroundColor: 'rgba(38, 102, 127, 0.2)',
    //                     pointBackgroundColor: '#67C090'
    //                 }]
    //             },
    //             options: {
    //                 responsive: true,
    //                 maintainAspectRatio: false,
    //                 scales: {
    //                     r: {
    //                         beginAtZero: true,
    //                         max: 100
    //                     }
    //                 }
    //             }
    //         });
    //     }
    // };

    const getProjectsFromData = () => {
        if (!dashboardData?.landoptimizer?.suggested_locations) return [];
        
        const location = dashboardData.landoptimizer.suggested_locations[0];
        return [
            {
                id: 1,
                name: location.plant_location.name,
                status: 'active',
                progress: 75,
                timeline: 'Q4 2024',
                budget: location.total_project_cost,
                team: 12,
                location: location.plant_location.address
            }
        ];
    };

    const getSatelliteMapData = () => {
        if (!dashboardData?.landoptimizer?.suggested_locations) return null;
        
        const location = dashboardData.landoptimizer.suggested_locations[0];
        const consumers = location.nearby_consumers || [];
        
        return {
            plant: location.plant_location,
            consumers: consumers,
            coverage: {
                radius: 100, // km
                efficiency: 92
            }
        };
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return '#67C090';
            case 'completed': return '#26667F';
            case 'planning': return '#DDF4E7';
            case 'delayed': return '#124170';
            default: return '#9E9E9E';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return 'fas fa-play-circle';
            case 'completed': return 'fas fa-check-circle';
            case 'planning': return 'fas fa-clock';
            case 'delayed': return 'fas fa-exclamation-circle';
            default: return 'fas fa-question-circle';
        }
    };

    const renderSatelliteMap = () => {
        const mapData = getSatelliteMapData();
        if (!mapData) return <div>Loading map data...</div>;

        return (
            <div className="satellite-map">
                <div className="map-header">
                    <h3>Satellite Infrastructure View</h3>
                    <div className="map-controls">
                        <button className="map-btn active">Satellite</button>
                        <button className="map-btn">Terrain</button>
                    </div>
                </div>
                <div className="map-container">
                    <div className="satellite-view">
                        <div className="plant-marker main-plant" style={{
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}>
                            <div className="plant-icon">
                                <i className="fas fa-industry"></i>
                            </div>
                            <div className="plant-info">
                                <strong>{mapData.plant.name}</strong>
                                <span>{mapData.plant.address}</span>
                            </div>
                        </div>
                        
                        {mapData.consumers.map((consumer, index) => (
                            <div key={index} className="consumer-marker" style={{
                                left: `${30 + index * 25}%`,
                                top: `${25 + index * 15}%`
                            }}>
                                <div className="consumer-icon">
                                    <i className="fas fa-building"></i>
                                </div>
                                <div className="consumer-info">
                                    <strong>{consumer.name}</strong>
                                    <span>{consumer.distance_from_plant}</span>
                                </div>
                            </div>
                        ))}
                        
                        <div className="coverage-area"></div>
                        <div className="grid-overlay"></div>
                    </div>
                </div>
                <div className="map-legend">
                    <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: '#67C090' }}></div>
                        <span>Production Plant</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: '#26667F' }}></div>
                        <span>Consumers</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: 'rgba(103, 192, 144, 0.3)' }}></div>
                        <span>Coverage Area</span>
                    </div>
                </div>
            </div>
        );
    };

    const renderVisualization = () => {
        if (!dashboardData?.landoptimizer?.suggested_locations) {
            return <div className="loading">Loading visualization data...</div>;
        }

        const location = dashboardData.landoptimizer.suggested_locations[0];
        const resources = location.resource_sizing;
        const solarPanels = parseInt(resources.solar_panels_required.replace(/[^\d]/g, '')) / 1000;
        const windTurbines = parseInt(resources.wind_turbines_required.replace(/[^\d]/g, ''));

        return (
            <div className="visualization-section">
                <div className="section-header">
                    <h2>3D Infrastructure Visualization</h2>
                    <p>Interactive 3D models and satellite view of green hydrogen infrastructure.</p>
                </div>

                <div className="visualization-content">
                    <div className="map-section card">
                        {renderSatelliteMap()}
                    </div>

                    <div className="models-section">
                        {solarPanels > 0 && (
                            <div className="model-card card">
                                <h3>Solar Panel Array</h3>
                                <div className="model-container">
                                    <SolarPanel 
                                        solarPanelCount={Math.min(solarPanels, 10)} 
                                        electrolysisCount={parseInt(resources.electrolyzers_required)} 
                                    />
                                </div>
                                <div className="model-stats">
                                    <div className="stat-item">
                                        <i className="fas fa-solar-panel"></i>
                                        <span>{resources.solar_panels_required} Solar Panels</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {windTurbines > 0 && (
                            <div className="model-card card">
                                <h3>Wind Power Array</h3>
                                <div className="model-container">
                                    <WindPower 
                                        windTurbineCount={Math.min(windTurbines, 5)} 
                                        electrolysisCount={parseInt(resources.electrolyzers_required)} 
                                    />
                                </div>
                                <div className="model-stats">
                                    <div className="stat-item">
                                        <i className="fas fa-wind"></i>
                                        <span>{resources.wind_turbines_required} Wind Turbines</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderOverview = () => {
        if (!dashboardData?.landoptimizer?.suggested_locations) {
            return <div className="loading">Loading overview data...</div>;
        }

        const location = dashboardData.landoptimizer.suggested_locations[0];
        const revenue = location.revenue_estimation;
        const resources = location.resource_sizing;

        return (
            <div className="dashboard-overview">
                <div className="stats-grid">
                    <div className="stat-card card">
                        <div className="stat-icon" style={{ background: 'rgba(103, 192, 144, 0.1)' }}>
                            <i className="fas fa-industry" style={{ color: '#67C090' }}></i>
                        </div>
                        <div className="stat-content">
                            <h3>{location.land_size_required}</h3>
                            <p>Land Required</p>
                        </div>
                    </div>
                    <div className="stat-card card">
                        <div className="stat-icon" style={{ background: 'rgba(38, 102, 127, 0.1)' }}>
                            <i className="fas fa-flask" style={{ color: '#26667F' }}></i>
                        </div>
                        <div className="stat-content">
                            <h3>{revenue.annual_production_capacity}</h3>
                            <p>Annual Production</p>
                        </div>
                    </div>
                    <div className="stat-card card">
                        <div className="stat-icon" style={{ background: 'rgba(18, 65, 112, 0.1)' }}>
                            <i className="fas fa-rupee-sign" style={{ color: '#124170' }}></i>
                        </div>
                        <div className="stat-content">
                            <h3>{revenue.total_revenue}</h3>
                            <p>Projected Revenue</p>
                        </div>
                    </div>
                    <div className="stat-card card">
                        <div className="stat-icon" style={{ background: 'rgba(221, 244, 231, 0.5)' }}>
                            <i className="fas fa-leaf" style={{ color: '#67C090' }}></i>
                        </div>
                        <div className="stat-content">
                            <h3>{location.total_project_cost}</h3>
                            <p>Total Investment</p>
                        </div>
                    </div>
                </div>

                <div className="quick-insights">
                    <div className="insight-card card">
                        <h3>Resource Overview</h3>
                        <div className="resource-grid">
                            <div className="resource-item">
                                <i className="fas fa-solar-panel"></i>
                                <span>{resources.solar_panels_required}</span>
                                <small>Solar Panels</small>
                            </div>
                            <div className="resource-item">
                                <i className="fas fa-wind"></i>
                                <span>{resources.wind_turbines_required}</span>
                                <small>Wind Turbines</small>
                            </div>
                            <div className="resource-item">
                                <i className="fas fa-battery-three-quarters"></i>
                                <span>{resources.electrolyzers_required}</span>
                                <small>Electrolyzers</small>
                            </div>
                        </div>
                    </div>

                    <div className="policy-card card">
                        <h3>Government Incentives</h3>
                        <div className="policy-content">
                            <h4>{dashboardData.policy.forlocation}</h4>
                            <p>{dashboardData.policy.onshort}</p>
                            <div className="benefits-list">
                                {dashboardData.policy.benifits.slice(0, 3).map((benefit, index) => (
                                    <div key={index} className="benefit-item">
                                        <i className="fas fa-check-circle" style={{ color: '#67C090' }}></i>
                                        <span>{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="consumer-analysis card">
                    <h3>Nearby Consumer Analysis</h3>
                    <div className="consumers-grid">
                        {location.nearby_consumers.map((consumer, index) => (
                            <div key={index} className="consumer-card">
                                <div className="consumer-header">
                                    <i className="fas fa-building" style={{ color: '#26667F' }}></i>
                                    <span className="consumer-name">{consumer.name}</span>
                                </div>
                                <div className="consumer-details">
                                    <div className="detail">
                                        <i className="fas fa-industry"></i>
                                        <span>{consumer.industry_type}</span>
                                    </div>
                                    <div className="detail">
                                        <i className="fas fa-map-marker-alt"></i>
                                        <span>{consumer.distance_from_plant}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderProjects = () => {
        const projects = getProjectsFromData();
        if (!dashboardData?.landoptimizer?.suggested_locations) {
            return <div className="loading">Loading project data...</div>;
        }

        const location = dashboardData.landoptimizer.suggested_locations[0];

        return (
            <div className="projects-section">
                <div className="section-header">
                    <h2>Project Portfolio</h2>
                    <button className="btn-primary">
                        <i className="fas fa-plus"></i> New Project
                    </button>
                </div>

                <div className="project-summary card">
                    <h3>Project Investment Breakdown</h3>
                    <div className="investment-grid">
                        {Object.entries(location.cost_breakdown).map(([key, value], index) => (
                            <div key={index} className="investment-item">
                                <div className="investment-icon">
                                    <i className={getInvestmentIcon(key)} style={{ color: getInvestmentColor(index) }}></i>
                                </div>
                                <div className="investment-content">
                                    <h4>{value}</h4>
                                    <p>{key.replace(/_/g, ' ').replace(/cost/g, '').trim()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="machinery-overview card">
                    <h3>Required Machinery & Equipment</h3>
                    <div className="machinery-grid">
                        {location.machines_required.map((machine, index) => (
                            <div key={index} className="machine-card">
                                <div className="machine-header">
                                    <i className={getMachineIcon(machine.name)} style={{ color: '#26667F' }}></i>
                                    <h4>{machine.name}</h4>
                                </div>
                                <div className="machine-details">
                                    <div className="machine-stat">
                                        <span className="label">Quantity:</span>
                                        <span className="value">{machine.quantity}</span>
                                    </div>
                                    <div className="machine-stat">
                                        <span className="label">Cost:</span>
                                        <span className="value">{machine.cost}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderAnalytics = () => (
        <div className="analytics-section">
            <div className="section-header">
                <h2>Performance Analytics</h2>
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
        </div>
    );

    const getInvestmentIcon = (key) => {
        const iconMap = {
            land_cost: 'fas fa-map-marked-alt',
            infrastructure_cost: 'fas fa-building',
            renewable_energy_cost: 'fas fa-bolt',
            machinery_cost: 'fas fa-cogs',
            operation_maintenance_cost: 'fas fa-tools',
            storage_transport_cost: 'fas fa-truck'
        };
        return iconMap[key] || 'fas fa-circle';
    };

    const getInvestmentColor = (index) => {
        const colors = ['#67C090', '#26667F', '#124170', '#DDF4E7', '#8FD3B0', '#4A90A4'];
        return colors[index % colors.length];
    };

    const getMachineIcon = (name) => {
        const iconMap = {
            'Electrolyzer': 'fas fa-flask',
            'Hydrogen Compressor': 'fas fa-compress',
            'Hydrogen Storage Tank': 'fas fa-database',
            'Hydrogen Purification Unit': 'fas fa-filter',
            'Pipeline/Distribution System': 'fas fa-route'
        };
        return iconMap[name] || 'fas fa-cog';
    };

    if (loading) {
        return (
            <div className="dashboard loading-screen">
                <div className="loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="dashboard error-screen">
                <div className="error-message">
                    <i className="fas fa-exclamation-triangle"></i>
                    <h2>No Data Available</h2>
                    <p>Please ensure data is properly stored in localStorage.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

                :root {
                    --primary-light: #DDF4E7;
                    --primary-main: #67C090;
                    --primary-dark: #26667F;
                    --primary-darker: #124170;
                    --white-pure: #FFFFFF;
                    --white-off: #F8FAFB;
                    --grey-light: #E5E7EB;
                    --grey-mid: #6B7280;
                    --text-dark: #1F2937;
                    --text-light: #9CA3AF;
                    --card-bg: rgba(255, 255, 255, 0.95);
                    --card-border: rgba(229, 231, 235, 0.8);
                    --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    --gradient-bg: linear-gradient(135deg, var(--primary-light) 0%, var(--white-off) 100%);
                }

                .dashboard {
                    min-height: 100vh;
                    background: var(--gradient-bg);
                    color: var(--text-dark);
                    padding: 30px;
                    font-family: 'Inter', sans-serif;
                    margin-left : 80px;
                }

                .loading-screen, .error-screen {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 80vh;
                    text-align: center;
                }

                .loading-spinner i {
                    font-size: 3rem;
                    color: var(--primary-main);
                    margin-bottom: 20px;
                }

                .error-message i {
                    font-size: 3rem;
                    color: var(--primary-dark);
                    margin-bottom: 20px;
                }

                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 40px;
                    padding: 30px;
                    background: var(--card-bg);
                    border-radius: 16px;
                    box-shadow: var(--card-shadow);
                    border: 1px solid var(--card-border);
                }

                .dashboard-header h1 {
                    font-size: 2.8rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, var(--primary-main), var(--primary-dark));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin: 0;
                }

                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .user-avatar {
                    width: 55px;
                    height: 55px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--primary-main), var(--primary-dark));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--white-pure);
                    font-weight: 600;
                    font-size: 1.3rem;
                    box-shadow: 0 4px 15px rgba(103, 192, 144, 0.3);
                }

                .user-info h3 {
                    margin: 0;
                    font-size: 1.2rem;
                    color: var(--text-dark);
                    font-weight: 600;
                }

                .user-info p {
                    margin: 0;
                    color: var(--text-light);
                    font-size: 0.9rem;
                }

                .dashboard-tabs {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 40px;
                    padding: 8px;
                    background: var(--card-bg);
                    border-radius: 12px;
                    box-shadow: var(--card-shadow);
                    flex-wrap: wrap;
                }

                .tab-button {
                    padding: 14px 24px;
                    border: none;
                    border-radius: 8px;
                    background: transparent;
                    color: var(--text-dark);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 500;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .tab-button.active {
                    background: linear-gradient(135deg, var(--primary-main), var(--primary-dark));
                    color: var(--white-pure);
                    box-shadow: 0 4px 15px rgba(103, 192, 144, 0.3);
                }

                .tab-button:hover:not(.active) {
                    background: rgba(103, 192, 144, 0.1);
                    color: var(--primary-dark);
                }
                
                /* General Card Styles */
                .card {
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    border-radius: 16px;
                    padding: 30px;
                    box-shadow: var(--card-shadow);
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }
                
                .card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
                }

                /* Section Headers */
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                    gap: 20px;
                }

                .section-header h2 {
                    font-size: 2.2rem;
                    background: linear-gradient(135deg, var(--primary-dark), var(--primary-darker));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin: 0;
                    font-weight: 700;
                }

                .section-header p {
                    color: var(--text-light);
                    margin: 0;
                    font-size: 1.1rem;
                }

                .btn-primary {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 10px;
                    background: linear-gradient(135deg, var(--primary-main), var(--primary-dark));
                    color: var(--white-pure);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 4px 15px rgba(103, 192, 144, 0.3);
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(103, 192, 144, 0.4);
                }
                
                /* Grid Layouts */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 25px;
                    margin-bottom: 30px;
                }

                .analytics-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
                    gap: 25px;
                    margin-bottom: 30px;
                }

                .projects-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 25px;
                }

                /* Stat Cards */
                .stat-card {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    background: linear-gradient(135deg, var(--white-pure), var(--primary-light));
                }

                .stat-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.6rem;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }

                .stat-content h3 {
                    font-size: 2.4rem;
                    margin: 0;
                    color: var(--primary-darker);
                    font-weight: 700;
                }

                .stat-content p {
                    margin: 5px 0 0 0;
                    color: var(--text-light);
                    font-weight: 500;
                }

                /* Quick Insights */
                .quick-insights {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 25px;
                    margin: 30px 0;
                }

                .insight-card h3, .policy-card h3 {
                    color: var(--primary-darker);
                    margin-bottom: 20px;
                    font-size: 1.4rem;
                    font-weight: 600;
                }

                .resource-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                }

                .resource-item {
                    text-align: center;
                    padding: 20px;
                    background: linear-gradient(135deg, var(--primary-light), var(--white-pure));
                    border-radius: 12px;
                    border: 1px solid var(--primary-main);
                }

                .resource-item i {
                    font-size: 2rem;
                    color: var(--primary-main);
                    margin-bottom: 10px;
                    display: block;
                }

                .resource-item span {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--primary-darker);
                    display: block;
                    margin-bottom: 5px;
                }

                .resource-item small {
                    color: var(--text-light);
                    font-weight: 500;
                }

                .policy-content h4 {
                    color: var(--primary-dark);
                    margin-bottom: 10px;
                    font-size: 1.1rem;
                }

                .policy-content p {
                    color: var(--text-light);
                    margin-bottom: 15px;
                    line-height: 1.6;
                }

                .benefits-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .benefit-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 0.9rem;
                }

                /* Consumer Analysis */
                .consumer-analysis {
                    margin-top: 30px;
                }

                .consumer-analysis h3 {
                    color: var(--primary-darker);
                    margin-bottom: 20px;
                    font-size: 1.4rem;
                    font-weight: 600;
                }

                .consumers-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                }

                .consumer-card {
                    padding: 20px;
                    background: linear-gradient(135deg, var(--white-pure), var(--primary-light));
                    border-radius: 12px;
                    border: 1px solid var(--primary-main);
                }

                .consumer-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 15px;
                }

                .consumer-name {
                    font-weight: 600;
                    color: var(--primary-darker);
                    font-size: 1.1rem;
                }

                .consumer-details {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .detail {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--text-light);
                    font-size: 0.9rem;
                }

                /* Satellite Map Styles */
                .satellite-map {
                    height: 100%;
                }

                .map-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .map-header h3 {
                    color: var(--primary-darker);
                    margin: 0;
                    font-size: 1.3rem;
                    font-weight: 600;
                }

                .map-controls {
                    display: flex;
                    gap: 8px;
                }

                .map-btn {
                    padding: 8px 16px;
                    border: 1px solid var(--primary-main);
                    border-radius: 6px;
                    background: transparent;
                    color: var(--primary-dark);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.9rem;
                }

                .map-btn.active {
                    background: var(--primary-main);
                    color: var(--white-pure);
                }

                .map-container {
                    height: 400px;
                    border-radius: 12px;
                    overflow: hidden;
                    position: relative;
                    border: 2px solid var(--primary-main);
                }

                .satellite-view {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, 
                        #2D5A4F 0%, 
                        #3E6B5C 25%, 
                        #4F7C69 50%, 
                        #608D76 75%, 
                        #719E83 100%);
                    position: relative;
                    overflow: hidden;
                }

                .grid-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
                    background-size: 40px 40px;
                    pointer-events: none;
                }

                .coverage-area {
                    position: absolute;
                    top: 30%;
                    left: 30%;
                    width: 40%;
                    height: 40%;
                    border: 2px dashed rgba(103, 192, 144, 0.8);
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(103, 192, 144, 0.2) 0%, transparent 70%);
                    animation: pulse 3s infinite;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.05); opacity: 0.6; }
                }

                .plant-marker, .consumer-marker {
                    position: absolute;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .plant-marker:hover, .consumer-marker:hover {
                    transform: scale(1.1);
                }

                .plant-icon, .consumer-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    color: var(--white-pure);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                    margin-bottom: 8px;
                }

                .plant-icon {
                    background: linear-gradient(135deg, var(--primary-main), var(--primary-dark));
                }

                .consumer-icon {
                    background: linear-gradient(135deg, var(--primary-dark), var(--primary-darker));
                }

                .plant-info, .consumer-info {
                    background: rgba(0, 0, 0, 0.8);
                    color: var(--white-pure);
                    padding: 8px 12px;
                    border-radius: 8px;
                    text-align: center;
                    min-width: 120px;
                    backdrop-filter: blur(10px);
                }

                .plant-info strong, .consumer-info strong {
                    display: block;
                    font-size: 0.9rem;
                    margin-bottom: 2px;
                }

                .plant-info span, .consumer-info span {
                    font-size: 0.8rem;
                    opacity: 0.8;
                }

                .map-legend {
                    display: flex;
                    justify-content: center;
                    gap: 30px;
                    margin-top: 15px;
                    flex-wrap: wrap;
                }

                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.9rem;
                    color: var(--text-dark);
                }

                .legend-color {
                    width: 16px;
                    height: 16px;
                    border-radius: 4px;
                }

                /* Visualization Content */
                .visualization-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin-top: 20px;
                }

                .models-section {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    
                }

                .model-card {
                    padding: 20px;
                }

                .model-card h3 {
                    color: var(--primary-darker);
                    margin-bottom: 15px;
                    font-size: 1.3rem;
                    font-weight: 600;
                }

                .model-container {
                    height: 30px;
                    border-radius: 12px;
                    overflow: hidden;
                    background: linear-gradient(135deg, var(--primary-light), var(--white-pure));
                    margin-bottom: 15px;
                }

                .model-stats {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                }

                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 15px;
                    background: var(--primary-light);
                    border-radius: 8px;
                    color: var(--primary-darker);
                    font-weight: 500;
                }

                /* Project Summary */
                .project-summary {
                    margin-bottom: 30px;
                }

                .project-summary h3 {
                    color: var(--primary-darker);
                    margin-bottom: 20px;
                    font-size: 1.4rem;
                    font-weight: 600;
                }

                .investment-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                }

                .investment-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 20px;
                    background: linear-gradient(135deg, var(--white-pure), var(--primary-light));
                    border-radius: 12px;
                    border: 1px solid var(--primary-main);
                }

                .investment-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.3rem;
                    background: rgba(255, 255, 255, 0.8);
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                .investment-content h4 {
                    margin: 0;
                    font-size: 1.2rem;
                    color: var(--primary-darker);
                    font-weight: 700;
                }

                .investment-content p {
                    margin: 5px 0 0 0;
                    color: var(--text-light);
                    font-size: 0.9rem;
                    text-transform: capitalize;
                }

                /* Machinery Overview */
                .machinery-overview {
                    margin-top: 30px;
                }

                .machinery-overview h3 {
                    color: var(--primary-darker);
                    margin-bottom: 20px;
                    font-size: 1.4rem;
                    font-weight: 600;
                }

                .machinery-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                }

                .machine-card {
                    padding: 20px;
                    background: linear-gradient(135deg, var(--white-pure), var(--primary-light));
                    border-radius: 12px;
                    border: 1px solid var(--primary-main);
                    transition: all 0.3s ease;
                }

                .machine-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                }

                .machine-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 15px;
                }

                .machine-header i {
                    font-size: 1.4rem;
                }

                .machine-header h4 {
                    margin: 0;
                    color: var(--primary-darker);
                    font-size: 1.1rem;
                    font-weight: 600;
                }

                .machine-details {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .machine-stat {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .machine-stat .label {
                    color: var(--text-light);
                    font-size: 0.9rem;
                }

                .machine-stat .value {
                    color: var(--primary-darker);
                    font-weight: 600;
                }

                /* Chart Styles */
                .chart-card {
                    background: var(--card-bg);
                    border-radius: 16px;
                    padding: 25px;
                    box-shadow: var(--card-shadow);
                }

                .chart-card h3 {
                    color: var(--primary-darker);
                    margin-bottom: 20px;
                    font-size: 1.3rem;
                    font-weight: 600;
                    text-align: center;
                }

                .chart-container {
                    height: 300px;
                    position: relative;
                }

                /* Comparison Analysis */
                .comparison-analysis {
                    margin-top: 30px;
                }

                .comparison-analysis h3 {
                    color: var(--primary-darker);
                    margin-bottom: 25px;
                    font-size: 1.4rem;
                    font-weight: 600;
                    text-align: center;
                }

                .comparison-grid {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr auto;
                    gap: 30px;
                    align-items: center;
                    text-align: center;
                }

                .comparison-item h4 {
                    color: var(--text-light);
                    margin-bottom: 10px;
                    font-size: 1rem;
                    font-weight: 500;
                }

                .cost-value {
                    font-size: 2rem;
                    font-weight: 700;
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 10px;
                }

                .cost-value.base {
                    background: linear-gradient(135deg, #ffebee, #ffcdd2);
                    color: #c62828;
                }

                .cost-value.optimized {
                    background: linear-gradient(135deg, var(--primary-light), var(--primary-main));
                    color: var(--primary-darker);
                }

                .comparison-arrow {
                    font-size: 2rem;
                    color: var(--primary-main);
                }

                .savings-highlight {
                    background: linear-gradient(135deg, var(--primary-main), var(--primary-dark));
                    color: var(--white-pure);
                    padding: 25px;
                    border-radius: 12px;
                    text-align: center;
                }

                .savings-amount {
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin-bottom: 5px;
                }

                .savings-label {
                    font-size: 1rem;
                    opacity: 0.9;
                }

                /* Responsive Design */
                @media (max-width: 1200px) {
                    .visualization-content {
                        grid-template-columns: 1fr;
                    }
                    .analytics-grid {
                        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    }
                }

                @media (max-width: 768px) {
                    .dashboard {
                        padding: 20px;
                    }
                    
                    .dashboard-header {
                        flex-direction: column;
                        text-align: center;
                        gap: 20px;
                        padding: 20px;
                    }
                    
                    .dashboard-header h1 {
                        font-size: 2.2rem;
                    }
                    
                    .section-header {
                        flex-direction: column;
                        text-align: center;
                        gap: 15px;
                    }
                    
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .quick-insights {
                        grid-template-columns: 1fr;
                    }
                    
                    .resource-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .analytics-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .comparison-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    
                    .comparison-arrow {
                        transform: rotate(90deg);
                    }
                    
                    .dashboard-tabs {
                        overflow-x: auto;
                        white-space: nowrap;
                        padding: 8px;
                        -webkit-overflow-scrolling: touch;
                    }
                    
                    .tab-button {
                        flex-shrink: 0;
                        padding: 12px 20px;
                    }
                }

                @media (max-width: 480px) {
                    .dashboard {
                        padding: 15px;
                    }
                    
                    .card {
                        padding: 20px;
                    }
                    
                    .stat-card {
                        flex-direction: column;
                        text-align: center;
                        gap: 15px;
                    }
                    
                    .map-container {
                        height: 300px;
                    }
                    
                    .model-container {
                        height: 250px;
                    }
                }
                `}
            </style>

            <div className="dashboard">
                <div className="dashboard-header">
                    <h1>Green Hydrogen Dashboard</h1>
                    <div className="user-profile">
                        <div className="user-avatar">AS</div>
                        <div className="user-info">
                            <h3>Arjun Singh</h3>
                            <p>Project Manager</p>
                        </div>
                    </div>
                </div>

                <div className="dashboard-tabs">
                <button
                        className={`tab-button ${activeTab === 'visualization' ? 'active' : ''}`}
                        onClick={() => setActiveTab('visualization')}
                    >
                        <i className="fas fa-globe"></i> Visualization
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        <i className="fas fa-chart-line"></i> Analytics
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <i className="fas fa-home"></i> Overview
                    </button>
                    
                    <button
                        className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
                        onClick={() => setActiveTab('projects')}
                    >
                        <i className="fas fa-project-diagram"></i> Projects
                    </button>
                    
                    <button
                        className={`tab-button ${activeTab === 'resources' ? 'active' : ''}`}
                        onClick={() => setActiveTab('resources')}
                    >
                        <i className="fas fa-users"></i> Resources
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reports')}
                    >
                        <i className="fas fa-file-alt"></i> Reports
                    </button>
                </div>

                {activeTab === 'overview' && <DashboardOverview dashboardData={dashboardData} />}
                {activeTab === 'visualization' && <DashboardVisualization dashboardData={dashboardData} />}
                {activeTab === 'projects' && <DashboardProjects dashboardData={dashboardData} />}
                {activeTab === 'analytics' && <DashboardAnalytics dashboardData={dashboardData} />}

              

                {activeTab === 'reports' && <DashboardReports dashboardData={dashboardData} />}
            </div>

            <style jsx>{`
                .energy-breakdown, .efficiency-metrics {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .energy-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 15px;
                    background: rgba(255, 255, 255, 0.6);
                    border-radius: 8px;
                    font-weight: 500;
                    font-size : 1.4rem;
                }

                .resource-overview-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 25px;
                }

                .resource-card h3, .efficiency-card h3 {
                    color: var(--primary-darker);
                    margin-bottom: 20px;
                    font-size: 3rem;
                    font-weight: 600;
                }

                .metric {
                    text-align: center;
                    padding: 20px;
                    background: linear-gradient(135deg, var(--white-pure), var(--primary-light));
                    border-radius: 10px;
                    margin-bottom: 15px;
                }

                .metric-value {
                    display: block;
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--primary-darker);
                    margin-bottom: 5px;
                }

                .metric-label {
                    color: var(--text-light);
                    font-size: 0.9rem;
                }

                .policy-report h3 {
                    color: var(--primary-darker);
                    margin-bottom: 25px;
                    font-size: 1.4rem;
                    font-weight: 600;
                }

                .policy-overview h4 {
                    color: var(--primary-dark);
                    margin-bottom: 15px;
                    font-size: 1.2rem;
                }

                .policy-overview p {
                    color: var(--text-dark);
                    line-height: 1.6;
                    margin-bottom: 20px;
                }

                .benefits-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 15px;
                    margin: 20px 0;
                }

                .benefit-card {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 15px;
                    background: linear-gradient(135deg, var(--primary-light), var(--white-pure));
                    border-radius: 10px;
                    border: 1px solid var(--primary-main);
                    font-size: 0.9rem;
                    color: var(--text-dark);
                }

                .policy-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    background: var(--primary-main);
                    color: var(--white-pure);
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    margin-top: 20px;
                }

                .policy-link:hover {
                    background: var(--primary-dark);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(103, 192, 144, 0.3);
                }
            `}</style>
        </>
    );
};

export default Dashboard;