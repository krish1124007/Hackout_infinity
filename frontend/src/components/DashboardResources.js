import React from 'react';

const DashboardResources = ({ dashboardData }) => {
    return (
        <div className="resources-section">
            <div className="section-header">
                <h2>Resource Management</h2>
                <p>Comprehensive resource allocation and optimization</p>
            </div>
            
            {dashboardData?.landoptimizer?.suggested_locations && (
                <div className="resource-overview-grid">
                    <div className="resource-card card">
                        <h3>Energy Resources</h3>
                        <div className="energy-breakdown">
                            <div className="energy-item">
                                <i className="fas fa-solar-panel" style={{ color: '#67C090' }}></i>
                                <span>Solar Capacity: {dashboardData.landoptimizer.suggested_locations[0].resource_sizing.solar_panels_required}</span>
                            </div>
                            <div className="energy-item">
                                <i className="fas fa-wind" style={{ color: '#26667F' }}></i>
                                <span>Wind Capacity: {dashboardData.landoptimizer.suggested_locations[0].resource_sizing.wind_turbines_required}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="efficiency-card card">
                        <h3>Production Efficiency</h3>
                        <div className="efficiency-metrics">
                            <div className="metric">
                                <span className="metric-value">92%</span>
                                <span className="metric-label">Energy Conversion</span>
                            </div>
                            <div className="metric">
                                <span className="metric-value">85%</span>
                                <span className="metric-label">Capacity Utilization</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardResources;
