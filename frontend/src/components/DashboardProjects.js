import React from 'react';

const DashboardProjects = ({ dashboardData }) => {

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
                                <h4>₹ {parseFloat(value)}Cr</h4>
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
                                    <span className="value">₹ {parseFloat(machine.cost)}Cr</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardProjects;
