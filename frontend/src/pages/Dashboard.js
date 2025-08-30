import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SolarPanel from '../3dModels/SolarPanel';
import WindPower from '../3dModels/WindPower';
import PlantLocationMap from '../components/PlantLocationMap';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [statsData, setStatsData] = useState({});
    const [projects, setProjects] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const navigate = useNavigate();

    // Sample data for demonstration
    useEffect(() => {
        // Simulate API call for stats
        setStatsData({
            totalProjects: 12,
            activeProjects: 8,
            completedProjects: 3,
            totalRevenue: '₹4.2Cr',
            co2Reduced: '1250 tons',
            hydrogenProduced: '25,000 kg'
        });

        // Sample projects data
        setProjects([
            {
                id: 1,
                name: 'Delhi Hydrogen Plant',
                status: 'active',
                progress: 75,
                timeline: 'Q4 2024',
                budget: '₹1.2Cr',
                team: 8
            },
            {
                id: 2,
                name: 'Mumbai Storage Facility',
                status: 'completed',
                progress: 100,
                timeline: 'Q2 2024',
                budget: '₹85L',
                team: 5
            },
            {
                id: 3,
                name: 'Bengaluru Distribution',
                status: 'planning',
                progress: 30,
                timeline: 'Q1 2025',
                budget: '₹2.1Cr',
                team: 12
            },
            {
                id: 4,
                name: 'Chennai Refueling Station',
                status: 'active',
                progress: 60,
                timeline: 'Q3 2024',
                budget: '₹65L',
                team: 4
            }
        ]);

        // Recent activities
        setRecentActivities([
            { id: 1, action: 'Project Update', project: 'Delhi Plant', user: 'Arjun Singh', time: '2 hours ago' },
            { id: 2, action: 'Document Uploaded', project: 'Mumbai Facility', user: 'Priya Sharma', time: '5 hours ago' },
            { id: 3, action: 'New Project Created', project: 'Hyderabad Expansion', user: 'Rahul Verma', time: '1 day ago' },
            { id: 4, action: 'Budget Approved', project: 'Chennai Station', user: 'Neha Gupta', time: '2 days ago' },
            { id: 5, action: 'Team Member Added', project: 'Bengaluru Distribution', user: 'Vikram Patel', time: '3 days ago' }
        ]);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return '#69F0AE'; // A vibrant green
            case 'completed': return '#4CAF50'; // A classic green
            case 'planning': return '#C6FF00'; // A bright lime green
            case 'delayed': return '#FFC107'; // A warning yellow
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

    const handleProjectClick = (projectId) => {
        navigate(`/project/${projectId}`);
    };

    const renderVisualization = () => (
        <div className="visualization-section">
            <div className="section-header">
                <h2>3D Infrastructure Visualization</h2>
                <p>Interactive 3D models of green hydrogen infrastructure.</p>
            </div>

            <div className="visualization-content">
                <div className="visualization-info card">
                <PlantLocationMap />
                </div>

                <div className="solar-visualization card">
                    <WindPower windTurbineCount={3} electrolysisCount={2} />
                    {/* <SolarPanel solarPanelCount={7} electrolysisCount={2} /> */}
                </div>
            </div>
        </div>
    );

    const renderOverview = () => (
        <div className="dashboard-overview">
            <div className="stats-grid">
                <div className="stat-card card">
                    <div className="stat-icon" style={{ background: 'rgba(76, 175, 80, 0.1)' }}>
                        <i className="fas fa-industry" style={{ color: '#4CAF50' }}></i>
                    </div>
                    <div className="stat-content">
                        <h3>{statsData.totalProjects}</h3>
                        <p>Total Projects</p>
                    </div>
                </div>
                <div className="stat-card card">
                    <div className="stat-icon" style={{ background: 'rgba(105, 240, 174, 0.1)' }}>
                        <i className="fas fa-tasks" style={{ color: '#69F0AE' }}></i>
                    </div>
                    <div className="stat-content">
                        <h3>{statsData.activeProjects}</h3>
                        <p>Active Projects</p>
                    </div>
                </div>
                <div className="stat-card card">
                    <div className="stat-icon" style={{ background: 'rgba(198, 255, 0, 0.1)' }}>
                        <i className="fas fa-rupee-sign" style={{ color: '#C6FF00' }}></i>
                    </div>
                    <div className="stat-content">
                        <h3>{statsData.totalRevenue}</h3>
                        <p>Total Revenue</p>
                    </div>
                </div>
                <div className="stat-card card">
                    <div className="stat-icon" style={{ background: 'rgba(76, 175, 80, 0.1)' }}>
                        <i className="fas fa-leaf" style={{ color: '#4CAF50' }}></i>
                    </div>
                    <div className="stat-content">
                        <h3>{statsData.co2Reduced}</h3>
                        <p>CO₂ Reduced</p>
                    </div>
                </div>
            </div>

            <div className="charts-section">
                <div className="chart-card card">
                    <h3>Project Status Distribution</h3>
                    <div className="project-chart">
                        <div className="chart-bar" style={{ '--width': '60%', '--color': '#69F0AE' }}>
                            <span>Active (60%)</span>
                        </div>
                        <div className="chart-bar" style={{ '--width': '25%', '--color': '#4CAF50' }}>
                            <span>Completed (25%)</span>
                        </div>
                        <div className="chart-bar" style={{ '--width': '15%', '--color': '#C6FF00' }}>
                            <span>Planning (15%)</span>
                        </div>
                    </div>
                </div>

                <div className="chart-card card">
                    <h3>Hydrogen Production Trend</h3>
                    <div className="production-chart">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path
                                d="M10,60 L30,40 L50,25 L70,15 L90,5"
                                fill="none"
                                stroke="#4CAF50"
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                            />
                            <circle cx="10" cy="60" r="2" fill="#4CAF50" />
                            <circle cx="30" cy="40" r="2" fill="#4CAF50" />
                            <circle cx="50" cy="25" r="2" fill="#4CAF50" />
                            <circle cx="70" cy="15" r="2" fill="#4CAF50" />
                            <circle cx="90" cy="5" r="2" fill="#4CAF50" />
                        </svg>
                        <div className="chart-labels">
                            <span>Jan</span>
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                            <span>May</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="recent-activities">
                <h3 style={{ marginTop: '20px' }}>Recent Activities</h3>
                <div className="activities-list">
                    {recentActivities.map(activity => (
                        <div key={activity.id} className="activity-item card">
                            <div className="activity-icon">
                                <i className="fas fa-bell"></i>
                            </div>
                            <div className="activity-content">
                                <p><strong>{activity.user}</strong> {activity.action} for <strong>{activity.project}</strong></p>
                                <span className="activity-time">{activity.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderProjects = () => (
        <div className="projects-section">
            <div className="section-header">
                <h2>Project Portfolio</h2>
                <button className="btn-primary">
                    <i className="fas fa-plus"></i> New Project
                </button>
            </div>

            <div className="projects-grid">
                {projects.map(project => (
                    <div key={project.id} className="project-card card" onClick={() => handleProjectClick(project.id)}>
                        <div className="project-header">
                            <h3>{project.name}</h3>
                            <span className="project-status" style={{ color: getStatusColor(project.status) }}>
                                <i className={getStatusIcon(project.status)}></i>
                                {project.status}
                            </span>
                        </div>
                        <div className="project-progress">
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${project.progress}%`,
                                        background: getStatusColor(project.status)
                                    }}
                                ></div>
                            </div>
                            <span>{project.progress}% Complete</span>
                        </div>
                        <div className="project-details">
                            <div className="detail-item">
                                <i className="fas fa-calendar" style={{ color: '#4CAF50' }}></i>
                                <span>{project.timeline}</span>
                            </div>
                            <div className="detail-item">
                                <i className="fas fa-rupee-sign" style={{ color: '#C6FF00' }}></i>
                                <span>{project.budget}</span>
                            </div>
                            <div className="detail-item">
                                <i className="fas fa-users" style={{ color: '#69F0AE' }}></i>
                                <span>{project.team} Members</span>
                            </div>
                        </div>
                        <button className="project-action-btn btn-primary">
                            View Details <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderAnalytics = () => (
        <div className="analytics-section">
            <div className="section-header">
                <h2>Performance Analytics</h2>
            </div>
            <div className="analytics-grid">
                <div className="analytics-card card">
                    <h3>Resource Allocation</h3>
                    <div className="resource-chart">
                        <div className="chart-item">
                            <span>Engineering</span>
                            <div className="chart-bar">
                                <div className="chart-fill" style={{ width: '65%', backgroundColor: '#69F0AE' }}></div>
                            </div>
                            <span>65%</span>
                        </div>
                        <div className="chart-item">
                            <span>Operations</span>
                            <div className="chart-bar">
                                <div className="chart-fill" style={{ width: '45%', backgroundColor: '#C6FF00' }}></div>
                            </div>
                            <span>45%</span>
                        </div>
                        <div className="chart-item">
                            <span>R&D</span>
                            <div className="chart-bar">
                                <div className="chart-fill" style={{ width: '30%', backgroundColor: '#4CAF50' }}></div>
                            </div>
                            <span>30%</span>
                        </div>
                    </div>
                </div>
                <div className="analytics-card card">
                    <h3>Budget Utilization</h3>
                    <div className="budget-chart">
                        <div className="budget-item">
                            <span>Infrastructure</span>
                            <div className="budget-amount">₹1.8Cr</div>
                        </div>
                        <div className="budget-item">
                            <span>Equipment</span>
                            <div className="budget-amount">₹1.2Cr</div>
                        </div>
                        <div className="budget-item">
                            <span>Personnel</span>
                            <div className="budget-amount">₹75L</div>
                        </div>
                        <div className="budget-item">
                            <span>R&D</span>
                            <div className="budget-amount">₹45L</div>
                        </div>
                    </div>
                </div>
                <div className="analytics-card card">
                    <h3>Key Performance Indicators</h3>
                    <div className="kpi-grid">
                        <div className="kpi-item">
                            <div className="kpi-value">92%</div>
                            <div className="kpi-label">Efficiency Rate</div>
                        </div>
                        <div className="kpi-item">
                            <div className="kpi-value">15</div>
                            <div className="kpi-label">Days Ahead</div>
                        </div>
                        <div className="kpi-item">
                            <div className="kpi-value">98%</div>
                            <div className="kpi-label">Quality Score</div>
                        </div>
                        <div className="kpi-item">
                            <div className="kpi-value">4.8/5</div>
                            <div className="kpi-label">Client Satisfaction</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


    return (
        <>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                :root {
                    --green-dark: #1B5E20;
                    --green-mid: #4CAF50;
                    --green-light: #C8E6C9;
                    --lime: #C6FF00;
                    --mint: #B9F6CA;
                    --white-pure:rgb(183, 255, 200);
                    --white-off:rgb(224, 237, 255);
                    --grey-light: #E0E0E0;
                    --grey-mid: #9E9E9E;
                    --text-dark: #212529;
                    --text-light: #F8F9FA;
                    --card-bg: rgba(255, 255, 255, 0.47);
                    --card-border: #E0E0E0;
                    --card-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                }

                .dashboard {
                    min-height: 100vh;
                    margin-left: 80px;
                    background-color: var(--white-off);
                    color: var(--text-dark);
                    padding: 30px;
                    font-family: 'Inter', sans-serif;
                    transition: margin-left 0.3s ease;
                }

                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 40px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid var(--grey-light);
                }

                .dashboard-header h1 {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: var(--green-dark);
                    margin: 0;
                }

                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .user-avatar {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background-color: var(--green-mid);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--white-pure);
                    font-weight: 600;
                    font-size: 1.2rem;
                }

                .user-info h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    color: var(--text-dark);
                }

                .user-info p {
                    margin: 0;
                    color: var(--grey-mid);
                    font-size: 0.9rem;
                }

                .dashboard-tabs {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 40px;
                    border-bottom: 2px solid var(--grey-light);
                    padding-bottom: 15px;
                    flex-wrap: wrap;
                }

                .tab-button {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    background: transparent;
                    color: var(--green-dark);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    border: 2px solid transparent;
                }

                .tab-button.active {
                    background-color: var(--green-mid);
                    color: var(--white-pure);
                    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.2);
                }

                .tab-button:hover:not(.active) {
                    color: var(--green-mid);
                    background-color: rgba(76, 175, 80, 0.1);
                    border-color: var(--green-mid);
                }
                
                /* General Card Styles */
                .card {
                    background-color: var(--card-bg);
                    border: 1px solid var(--card-border);
                    border-radius: 12px;
                    padding: 25px;
                    box-shadow: var(--card-shadow);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }

                /* Section Headers */
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    flex-wrap: wrap;
                }

                .section-header h2 {
                    font-size: 1.8rem;
                    color: var(--green-dark);
                    margin: 0;
                }

                .section-header p {
                    color: var(--grey-mid);
                    margin: 0;
                }

                .btn-primary {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    background-color: var(--green-mid);
                    color: var(--white-pure);
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .btn-primary:hover {
                    background-color: #43A047;
                }
                
                /* General Grid Layouts */
                .projects-grid, .stats-grid, .charts-section, .analytics-grid {
                    display: grid;
                    gap: 20px;
                }

                .stats-grid {
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                }

                .charts-section, .analytics-grid {
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    margin-top: 20px;
                }

                .projects-grid {
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                }

                /* Stat Cards */
                .stat-card {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .stat-icon {
                    width: 55px;
                    height: 55px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                }

                .stat-content h3 {
                    font-size: 2.2rem;
                    margin: 0;
                    color: var(--green-dark);
                    font-weight: 700;
                }

                /* Project Cards */
                .project-card {
                    display: flex;
                    flex-direction: column;
                }
                
                .project-card:hover {
                    cursor: pointer;
                }

                .project-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }

                .project-header h3 {
                    margin: 0;
                    font-size: 1.5rem;
                    color: var(--green-dark);
                }

                .project-status {
                    font-weight: 600;
                    text-transform: capitalize;
                }

                .project-progress {
                    margin: 15px 0;
                }

                .progress-bar {
                    height: 8px;
                    background-color: var(--grey-light);
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 8px;
                }

                .progress-fill {
                    height: 100%;
                    transition: width 0.4s ease;
                    border-radius: 4px;
                }
                
                .project-details {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-top: 15px;
                }

                .detail-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--grey-mid);
                }
                
                .project-action-btn {
                    margin-top: 20px;
                    padding: 12px 20px;
                    border-radius: 8px;
                    background-color: var(--green-mid);
                    color: var(--white-pure);
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: background-color 0.3s ease;
                }

                .project-action-btn:hover {
                    background-color: #43A047;
                }

                /* Visualization Section Styles */
                .visualization-content {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 30px;
                    margin-top: 20px;
                }
                
                .visualization-info {
                    padding: 25px;
                }

                .solar-visualization {
                    padding: 0;
                    height: 600px;
                    min-height: 350px;
                    overflow: hidden;
                }
                
                .visualization-stats {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-top: 20px;
                }

                .visualization-stats .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1.1rem;
                    color: var(--text-dark);
                }

                /* Charts */
                .project-chart {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-top: 20px;
                }

                .chart-bar {
                    height: 25px;
                    border-radius: 12px;
                    background-color: var(--grey-light);
                    position: relative;
                }

                .chart-bar span {
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-dark);
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .chart-bar::before {
                    content: '';
                    width: var(--width);
                    background-color: var(--color);
                    height: 100%;
                    display: block;
                    border-radius: 12px;
                    transition: width 0.4s ease;
                }
                
                .production-chart {
                    position: relative;
                    height: 200px;
                    margin-top: 20px;
                }

                .production-chart svg {
                    width: 100%;
                    height: 100%;
                    overflow: visible;
                }

                .production-chart .chart-labels {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 10px;
                    color: var(--grey-mid);
                    font-size: 0.8rem;
                }

                /* Recent Activities */
                .recent-activities .activities-list {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .activity-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                    padding: 15px;
                    background-color: var(--card-bg);
                    border: 1px solid var(--card-border);
                    border-radius: 10px;
                }

                .activity-icon {
                    font-size: 1.2rem;
                    color: var(--green-mid);
                    background-color: rgba(76, 175, 80, 0.1);
                    padding: 8px;
                    border-radius: 50%;
                }

                .activity-content p {
                    margin: 0;
                    font-size: 1rem;
                }

                .activity-content strong {
                    color: var(--green-dark);
                }

                .activity-time {
                    font-size: 0.8rem;
                    color: var(--grey-mid);
                }
                
                /* Responsive Design */
                @media (max-width: 1024px) {
                    .dashboard {
                        margin-left: 0;
                        padding: 20px;
                    }
                    .visualization-content {
                        grid-template-columns: 1fr;
                    }
                    .charts-section, .analytics-grid {
                        grid-template-columns: 1fr;
                    }
                }
                
                @media (max-width: 768px) {
                    .dashboard-header {
                        flex-direction: column;
                        text-align: center;
                        gap: 20px;
                    }
                    .section-header {
                        flex-direction: column;
                        text-align: center;
                        gap: 15px;
                    }
                    .projects-grid {
                        grid-template-columns: 1fr;
                    }
                    .tab-button {
                        padding: 10px 18px;
                    }
                    .dashboard-tabs {
                        overflow-x: auto;
                        white-space: nowrap;
                        padding-bottom: 10px;
                        -webkit-overflow-scrolling: touch;
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
                        className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        <i className="fas fa-chart-line"></i> Analytics
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

                {activeTab === 'visualization' && renderVisualization()}
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'projects' && renderProjects()}
                {activeTab === 'analytics' && renderAnalytics()}

                {activeTab === 'resources' && (
                    <div className="section-header">
                        <h2>Resource Management</h2>
                        <p>Content coming soon...</p>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="section-header">
                        <h2>Reports & Documentation</h2>
                        <p>Content coming soon...</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Dashboard;