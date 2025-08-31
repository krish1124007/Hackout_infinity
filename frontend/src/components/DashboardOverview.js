import React from 'react';

const DashboardOverview = ({ dashboardData }) => {
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
                            {dashboardData.policy.benifits && Array.isArray(dashboardData.policy.benifits) && dashboardData.policy.benifits.slice(0, 3).map((benefit, index) => (
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

export default DashboardOverview;