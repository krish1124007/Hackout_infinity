// Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: 'fas fa-tachometer-alt', path: '/dashboard' },
    { id: 'map', icon: 'fas fa-map-marked-alt', path: '/map' },
    { id: 'News', icon: 'fas fa-newspaper', path: '/news' },
    { id: 'Machinary', icon: 'fas fa-screwdriver', path: '/machinary' },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getActiveItem = () => {
    const path = location.pathname;
    const item = menuItems.find(item => item.path === path);
    return item ? item.id : 'dashboard';
  };

  const [activeItem, setActiveItem] = useState(getActiveItem());
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    setActiveItem(getActiveItem());
  }, [location.pathname]);

  const handleNavigation = (itemId) => {
    setActiveItem(itemId);
    if (isMobile) {
      setIsExpanded(false);
    }
  };

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <nav className={`custom-sidebar ${isMobile ? 'mobile' : ''} ${isExpanded ? 'expanded' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">
              <i className="fas fa-atom" />
            </div>
            {!isMobile && (
              <div className="logo-pulse"></div>
            )}
          </div>
          
          {isMobile && (
            <button className="menu-toggle" onClick={toggleMenu}>
              <i className={`fas ${isExpanded ? 'fa-times' : 'fa-bars'}`} />
            </button>
          )}
        </div>

        <div className={`nav-items-container ${isExpanded ? 'expanded' : ''}`}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
              onClick={() => handleNavigation(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link to={item.path} className="nav-link">
                <div className="nav-icon">
                  <i className={item.icon} />
                </div>
                {hoveredItem === item.id && !isMobile && (
                  <div className="nav-tooltip">
                    {item.id}
                  </div>
                )}
                {activeItem === item.id && (
                  <div className="active-indicator"></div>
                )}
              </Link>
            </div>
          ))}
        </div>

        {!isMobile && (
          <div className="nav-footer">
            <div className="energy-pulse">
              <div className="pulse-ring"></div>
              <div className="pulse-ring delay-1"></div>
              <div className="pulse-ring delay-2"></div>
              <i className="fas fa-bolt"></i>
            </div>
          </div>
        )}
      </nav>

      {isMobile && isExpanded && (
        <div className="mobile-overlay" onClick={() => setIsExpanded(false)} />
      )}

      <div className={`content-spacer ${isMobile ? 'mobile' : ''} ${isExpanded ? 'expanded' : ''}`} />
    </>
  );
};

export default Navbar;