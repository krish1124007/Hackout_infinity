import React from 'react';

    const DashboardReports = ({ dashboardData }) => {
        return (
            <div className="reports-section">
                <div className="section-header">
                    <h2>Reports & Documentation</h2>
                    <p>Comprehensive project documentation and analysis reports</p>
                </div>
                
                {dashboardData?.policy && (
                    <div className="policy-report card">
                        <h3>Government Policy Analysis</h3>
                        <div className="policy-overview">
                            <h4>Location: {dashboardData.policy.forlocation}</h4>
                            <p>{dashboardData.policy.schem}</p>
                            <div className="benefits-grid">
                                {dashboardData.policy.benifits && Array.isArray(dashboardData.policy.benifits) && dashboardData.policy.benifits.map((benefit, index) => (
                                    <div key={index} className="benefit-card">
                                        <i className="fas fa-award" style={{ color: '#67C090' }}></i>
                                        <span>{benefit}</span>
                                    </div>
                                ))}
                            </div>
                            <a href={dashboardData.policy.websitelink} target="_blank" rel="noopener noreferrer" className="policy-link">
                                <i className="fas fa-external-link-alt"></i>
                                View Official Documentation
                            </a>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    export default DashboardReports;