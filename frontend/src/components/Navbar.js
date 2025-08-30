import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isHovering, setIsHovering] = useState(false);
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', path: '/dashboard' },
    { id: 'map', label: 'Hydrogen Map', icon: 'fas fa-map-marked-alt', path: '/map' },
    { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-line', path: '/analytics' },
    { id: 'infrastructure', label: 'Infrastructure', icon: 'fas fa-industry', path: '/infrastructure' },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog', path: '/settings' },
  ];

  // Set active item based on current path
  const getActiveItem = () => {
    const path = location.pathname;
    const item = menuItems.find(item => item.path === path);
    return item ? item.id : 'dashboard';
  };

  const [activeItem, setActiveItem] = useState(getActiveItem());

  // Update active item when location changes
  useEffect(() => {
    setActiveItem(getActiveItem());
  }, [location.pathname]);

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (itemId) => {
    setActiveItem(itemId);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <style>{`
        /* Custom Variables - Dark Theme */
        :root {
          --sidebar-width-expanded: 280px;
          --sidebar-width-collapsed: 80px;
          --primary-bg: #0A192F;
          --secondary-bg: #112240;
          --accent-green: #64ffda;
          --text-light: #ccd6f6;
          --text-muted: #8892b0;
          --border-color: #233554;
          --shadow-dark: 0 10px 30px -15px rgba(2, 12, 27, 0.7);
          --transition-fast: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          --transition-smooth: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        /* Main Sidebar Container */
        .custom-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: ${isOpen ? 'var(--sidebar-width-expanded)' : 'var(--sidebar-width-collapsed)'};
          background: var(--primary-bg);
          box-shadow: var(--shadow-dark);
          transition: var(--transition-smooth);
          z-index: 1050;
          overflow: hidden;
        }

        .custom-sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 1px;
          height: 100%;
          background: linear-gradient(180deg, transparent 0%, var(--accent-green) 50%, transparent 100%);
          opacity: 0.3;
        }

        /* Mobile Styles */
        @media (max-width: 767px) {
          .custom-sidebar {
            width: ${isOpen ? 'var(--sidebar-width-expanded)' : '0px'};
            transform: ${isOpen ? 'translateX(0)' : 'translateX(-100%)'};
          }
        }

        /* Mobile Toggle Button */
        .mobile-toggle-btn {
          position: fixed;
          top: 1rem;
          left: 1rem;
          z-index: 1055;
          width: 50px;
          height: 50px;
          background: var(--accent-green);
          border: none;
          border-radius: 12px;
          color: var(--primary-bg);
          font-size: 1.2rem;
          box-shadow: var(--shadow-dark);
          transition: var(--transition-fast);
          display: ${isMobile && !isOpen ? 'flex' : 'none'};
          align-items: center;
          justify-content: center;
        }

        .mobile-toggle-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(100, 255, 218, 0.3);
        }

        /* Mobile Backdrop */
        .mobile-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          z-index: 1040;
          opacity: ${isMobile && isOpen ? 1 : 0};
          visibility: ${isMobile && isOpen ? 'visible' : 'hidden'};
          transition: var(--transition-fast);
        }

        /* Header Section */
        .sidebar-header {
          padding: 1.5rem 1rem;
          border-bottom: 1px solid var(--border-color);
          background: var(--secondary-bg);
          position: relative;
          overflow: hidden;
        }

        .sidebar-header::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: var(--accent-green);
        }

        .logo-container {
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .logo-icon {
          width: 45px;
          height: 45px;
          background: var(--accent-green);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-bg);
          font-size: 1.5rem;
          box-shadow: var(--shadow-dark);
          transition: var(--transition-fast);
          flex-shrink: 0;
        }

        .logo-icon:hover {
          transform: rotate(15deg) scale(1.1);
          box-shadow: 0 0 20px rgba(100, 255, 218, 0.15);
        }

        .logo-text {
          margin-left: 1rem;
          opacity: ${isOpen ? 1 : 0};
          transform: ${isOpen ? 'translateX(0)' : 'translateX(-20px)'};
          transition: var(--transition-smooth);
        }

        .logo-title {
          color: var(--text-light);
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 0;
        }

        .logo-subtitle {
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 500;
          margin-bottom: 0;
        }

        /* Toggle Button */
        .toggle-btn {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 35px;
          height: 35px;
          background: var(--secondary-bg);
          border: 1px solid var(--border-color);
          border-radius: 50%;
          color: var(--text-muted);
          font-size: 0.9rem;
          transition: var(--transition-fast);
          display: ${isOpen || !isMobile ? 'flex' : 'none'};
          align-items: center;
          justify-content: center;
        }

        .toggle-btn:hover {
          background: var(--accent-green);
          color: var(--primary-bg);
          transform: translateY(-50%) scale(1.1);
          box-shadow: var(--shadow-dark);
        }

        /* Navigation Items */
        .nav-items-container {
          padding: 2rem 0.75rem;
          height: calc(100vh - 140px);
          overflow-y: auto;
        }

        .nav-items-container::-webkit-scrollbar {
          width: 4px;
        }

        .nav-items-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .nav-items-container::-webkit-scrollbar-thumb {
          background: var(--accent-green);
          border-radius: 2px;
        }

        .nav-item {
          margin-bottom: 0.5rem;
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          opacity: 0;
          transform: translateX(-20px);
          animation: slideInNav 0.6s ease forwards;
        }

        .nav-item:nth-child(1) { animation-delay: 0.1s; }
        .nav-item:nth-child(2) { animation-delay: 0.2s; }
        .nav-item:nth-child(3) { animation-delay: 0.3s; }
        .nav-item:nth-child(4) { animation-delay: 0.4s; }
        .nav-item:nth-child(5) { animation-delay: 0.5s; }

        @keyframes slideInNav {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .nav-link {
          display: flex;
          align-items: center;
          padding: 1rem;
          text-decoration: none;
          color: var(--text-muted);
          border-radius: 12px;
          border: 1px solid transparent;
          transition: var(--transition-fast);
          position: relative;
          overflow: hidden;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent 0%, rgba(100, 255, 218, 0.05) 50%, transparent 100%);
          transition: var(--transition-fast);
        }

        .nav-link:hover::before {
          left: 100%;
        }

        .nav-link:hover {
          color: var(--accent-green);
          background: rgba(100, 255, 218, 0.05);
          border-color: var(--border-color);
          transform: translateX(5px);
        }

        .nav-item.active .nav-link {
          color: var(--accent-green);
          background: rgba(100, 255, 218, 0.08);
          border-color: var(--accent-green);
          box-shadow: 0 0 15px rgba(100, 255, 218, 0.1);
        }

        .nav-item.active::after {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 70%;
          background: var(--accent-green);
          border-radius: 0 4px 4px 0;
        }

        .nav-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          transition: var(--transition-fast);
          flex-shrink: 0;
        }

        .nav-link:hover .nav-icon {
          transform: scale(1.1);
        }

        .nav-item.active .nav-icon {
          transform: scale(1.1);
          color: var(--accent-green);
        }

        .nav-text {
          margin-left: 1rem;
          font-weight: 500;
          font-size: 0.95rem;
          opacity: ${isOpen ? 1 : 0};
          transform: ${isOpen ? 'translateX(0)' : 'translateX(-10px)'};
          transition: var(--transition-smooth);
          white-space: nowrap;
        }

        /* Tooltip for Collapsed State */
        .nav-tooltip {
          position: absolute;
          left: 90px;
          top: 50%;
          transform: translateY(-50%);
          background: var(--secondary-bg);
          border: 1px solid var(--border-color);
          color: var(--text-light);
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: var(--transition-fast);
          z-index: 1060;
          box-shadow: var(--shadow-dark);
        }

        .nav-tooltip::before {
          content: '';
          position: absolute;
          left: -6px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-right: 6px solid var(--border-color);
        }

        .nav-item:hover .nav-tooltip {
          opacity: ${!isOpen && !isMobile ? 1 : 0};
          visibility: ${!isOpen && !isMobile ? 'visible' : 'hidden'};
          transform: translateY(-50%) translateX(10px);
        }

        /* Bottom Toggle for Desktop */
        .bottom-toggle {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          width: 45px;
          height: 45px;
          background: var(--secondary-bg);
          border: 1px solid var(--border-color);
          border-radius: 50%;
          color: var(--text-muted);
          font-size: 1.1rem;
          transition: var(--transition-fast);
          display: ${isMobile ? 'none' : 'flex'};
          align-items: center;
          justify-content: center;
        }

        .bottom-toggle:hover {
          background: var(--accent-green);
          color: var(--primary-bg);
          transform: translateX(-50%) scale(1.1);
          box-shadow: var(--shadow-dark);
        }

        /* Content Spacer */
        .content-spacer {
          width: ${isMobile ? '0px' : (isOpen ? 'var(--sidebar-width-expanded)' : 'var(--sidebar-width-collapsed)')};
          transition: var(--transition-smooth);
          flex-shrink: 0;
        }

        /* Responsive Adjustments */
        @media (max-width: 991px) {
          .custom-sidebar {
            --sidebar-width-expanded: 260px;
          }
        }

        @media (max-width: 575px) {
          .custom-sidebar {
            --sidebar-width-expanded: 100vw;
          }
        }
      `}</style>

      {/* Mobile Backdrop */}
      <div className="mobile-backdrop" onClick={() => setIsOpen(false)} />

      {/* Mobile Toggle Button */}
      <button className="mobile-toggle-btn" onClick={toggleSidebar}>
        <i className="fas fa-bars" />
      </button>

      {/* Main Sidebar */}
      <nav
        className="custom-sidebar"
        onMouseEnter={() => !isMobile && setIsHovering(true)}
        onMouseLeave={() => !isMobile && setIsHovering(false)}
      >
        {/* Header */}
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">
              <i className="fas fa-atom" />
            </div>
            <div className="logo-text">
              <h4 className="logo-title">HydroMap</h4>
              <p className="logo-subtitle">Pro Dashboard</p>
            </div>
          </div>

          <button className="toggle-btn" onClick={toggleSidebar}>
            <i className={`fas ${isMobile ? 'fa-times' : (isOpen ? 'fa-chevron-left' : 'fa-chevron-right')}`} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="nav-items-container">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
              onClick={() => handleNavigation(item.id)}
            >
              <Link to={item.path} className="nav-link">
                <div className="nav-icon">
                  <i className={item.icon} />
                </div>
                <span className="nav-text">{item.label}</span>
                <div className="nav-tooltip">{item.label}</div>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Toggle Button (Desktop Only) */}
        <button className="bottom-toggle" onClick={toggleSidebar}>
          <i className={`fas ${isOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`} />
        </button>
      </nav>

      {/* Content Spacer */}
      <div className="content-spacer" />
    </>
  );
};

export default Navbar;