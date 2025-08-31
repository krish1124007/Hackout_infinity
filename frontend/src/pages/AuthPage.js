import React, { useState, useEffect, useRef } from 'react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const BASE_URL = 'https://hackout2025-backend-infinity.onrender.com';

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear messages when user starts typing
    if (errorMessage || successMessage) {
      setErrorMessage('');
      setSuccessMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (isLogin) {
        // Handle login
        const response = await fetch(`${BASE_URL}/api/v1/user/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();
        
        if (response.ok) {
          setSuccessMessage('Welcome back! Redirecting to your dashboard...');
          // Store token and user data
          localStorage.setItem('token', data.data.data);
          localStorage.setItem('user', JSON.stringify(data.user));
          // Redirect to dashboard after a brief delay
          setTimeout(() => {
            window.location.href = '/qna';
          }, 1500);
        } else {
          setErrorMessage(data.message || 'Login failed. Please try again.');
        }
      } else {
        // Handle signup
        if (formData.password !== formData.confirmPassword) {
          setErrorMessage("Passwords don't match!");
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${BASE_URL}/api/v1/user/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.companyName,
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();
        
        if (response.ok) {
          setSuccessMessage('Welcome to the future of water management! You can now login.');
          // Switch to login form after successful registration
          setTimeout(() => {
            setIsLogin(true);
            setSuccessMessage('');
          }, 3000);
        } else {
          setErrorMessage(data.message || 'Registration failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Hydrogen atom animation with 1 proton and 1 electron
  useEffect(() => {
    const container = document.getElementById('atom-animation');
    if (!container) return;
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Create nucleus (proton)
    const nucleus = document.createElement('div');
    nucleus.className = 'atom-nucleus';
    container.appendChild(nucleus);
    
    // Create electron orbit
    const orbit = document.createElement('div');
    orbit.className = 'electron-orbit';
    container.appendChild(orbit);
    
    // Create single electron
    const electron = document.createElement('div');
    electron.className = 'electron';
    container.appendChild(electron);
    
    // Create energy waves
    for (let i = 0; i < 3; i++) {
      const wave = document.createElement('div');
      wave.className = `energy-wave wave-${i+1}`;
      container.appendChild(wave);
    }
    
  }, []);

  // Animation for floating elements
  useEffect(() => {
    const createFloatingParticle = () => {
      const particle = document.createElement('div');
      const size = Math.random() * 8 + 4;
      particle.style.position = 'fixed';
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.background = 'radial-gradient(circle, rgba(103, 192, 144, 0.8) 0%, rgba(38, 102, 127, 0.6) 50%, rgba(18, 65, 112, 0.4) 100%)';
      particle.style.borderRadius = '50%';
      particle.style.left = Math.random() * window.innerWidth + 'px';
      particle.style.top = window.innerHeight + 'px';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '0';
      particle.style.boxShadow = '0 0 12px 3px rgba(103, 192, 144, 0.6)';
      
      document.getElementById('auth-container').appendChild(particle);
      
      const duration = Math.random() * 5000 + 4000;
      const horizontalMovement = (Math.random() - 0.5) * 150;
      
      particle.animate([
        { transform: 'translateY(0px) translateX(0px)', opacity: 0 },
        { transform: 'translateY(-40px) translateX(0px)', opacity: 0.9, offset: 0.1 },
        { transform: `translateY(-${window.innerHeight + 250}px) translateX(${horizontalMovement}px)`, opacity: 0 }
      ], {
        duration: duration,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }).onfinish = () => {
        if (particle.parentNode) particle.remove();
      };
    };

    const interval = setInterval(createFloatingParticle, 500);
    return () => clearInterval(interval);
  }, []);

  const handleButtonClick = (e) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.height, rect.width);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) ripple.remove();
    }, 600);
  };

  return (
    <>
      <style>{`
        :root {
          --primary-light: #DDF4E7;
          --primary-green: #67C090;
          --primary-teal: #26667F;
          --primary-dark: #124170;
          --text-light: #FFFFFF;
          --text-muted: #B8BCC8;
          --gradient-primary: linear-gradient(135deg, #67C090 0%, #26667F 100%);
          --gradient-secondary: linear-gradient(135deg, #26667F 0%, #124170 100%);
          --gradient-accent: linear-gradient(45deg, #67C090, #26667F, #124170);
          --glow-primary: 0 0 30px rgba(103, 192, 144, 0.5);
          --glow-secondary: 0 0 20px rgba(38, 102, 127, 0.4);
          --shadow-deep: 0 25px 60px rgba(0, 0, 0, 0.4);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: var(--primary-dark);
          color: var(--text-light);
          font-family: 'Inter', 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          overflow-x: hidden;
          
        }

        #auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;          
          width:100%;
          background: url('./images/plant2.gif') cover no-repeat;
        }
        
        #auth-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(18, 65, 112, 0.85) 0%, rgba(38, 102, 127, 0.8) 100%);
          z-index: 0;
        }

        .auth-bg-animation {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          opacity: 0.12;
          background: 
            radial-gradient(circle at 20% 50%, var(--primary-green) 0%, transparent 60%),
            radial-gradient(circle at 80% 20%, var(--primary-teal) 0%, transparent 60%),
            radial-gradient(circle at 40% 80%, var(--primary-dark) 0%, transparent 60%);
          animation: float 30s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1); 
          }
          33% { 
            transform: translateY(-30px) rotate(120deg) scale(1.05);
          }
          66% { 
            transform: translateY(15px) rotate(240deg) scale(0.95);
          }
        }

        /* Hydrogen Atom Animation */
        .atom-container {
          position: absolute;
          top: 50%;
          left: 15%;
          transform: translateY(-50%);
          width: 250px;
          height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .atom-nucleus {
          position: absolute;
          width: 35px;
          height: 35px;
          background: radial-gradient(circle, #67C090 0%, #26667F 100%);
          border-radius: 50%;
          box-shadow: 0 0 25px #67C090, 0 0 45px #26667F;
          animation: pulse-nucleus 4s ease-in-out infinite;
          z-index: 10;
        }

        .electron-orbit {
          position: absolute;
          width: 180px;
          height: 180px;
          border: 1px solid rgba(221, 244, 231, 0.4);
          border-radius: 50%;
          animation: rotate-orbit 18s linear infinite;
        }

        .electron {
          position: absolute;
          width: 14px;
          height: 14px;
          background: radial-gradient(circle, var(--primary-light) 0%, var(--primary-green) 100%);
          border-radius: 50%;
          box-shadow: 0 0 12px var(--primary-light), 0 0 24px var(--primary-green);
          z-index: 5;
          animation: orbit-electron 3.5s linear infinite;
        }

        .energy-wave {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(103, 192, 144, 0.15);
        }

        .wave-1 {
          width: 100%;
          height: 100%;
          animation: pulse-wave 6s ease-out infinite;
        }

        .wave-2 {
          width: 130%;
          height: 130%;
          animation: pulse-wave 6s ease-out 2s infinite;
        }

        .wave-3 {
          width: 160%;
          height: 160%;
          animation: pulse-wave 6s ease-out 4s infinite;
        }

        @keyframes pulse-nucleus {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        @keyframes rotate-orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes orbit-electron {
          0% {
            transform: 
              rotate(0deg) 
              translateX(90px) 
              rotate(0deg);
          }
          100% {
            transform: 
              rotate(360deg) 
              translateX(90px) 
              rotate(-360deg);
          }
        }

        @keyframes pulse-wave {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        .main-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4rem;
          max-width: 1400px;
          width: 100%;
          z-index: 10;
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(221, 244, 231, 0.3);
          border-radius: 25px;
          padding: 3rem;
          width: 100%;
          max-width: 520px;
          box-shadow: var(--shadow-deep), var(--glow-primary);
          animation: slideInRight 1s ease-out;
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
        }

        .auth-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 35px 80px rgba(0, 0, 0, 0.4), 0 0 40px rgba(103, 192, 144, 0.6);
        }

        .auth-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: var(--gradient-primary);
        }

        .auth-card::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 0deg, transparent, rgba(103, 192, 144, 0.1), transparent, rgba(38, 102, 127, 0.1), transparent);
          animation: rotate 20s linear infinite;
          z-index: -1;
        }

        @keyframes rotate {
          100% { transform: rotate(360deg); }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(60px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .auth-logo {
          font-weight: 800;
          font-size: 2.8rem;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: var(--glow-secondary);
          margin-bottom: 0.8rem;
          letter-spacing: 1.5px;
        }

        .auth-subtitle {
          color: var(--text-light);
          font-size: 1.2rem;
          font-weight: 500;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.8rem;
        }

        .form-group {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 1.2rem 1.2rem 1.2rem 3.5rem;
          background: rgba(18, 65, 112, 0.8);
          border: 2px solid rgba(221, 244, 231, 0.2);
          border-radius: 15px;
          color: var(--text-light);
          font-size: 1.1rem;
          font-weight: 500;
          transition: all 0.4s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--primary-green);
          box-shadow: 0 0 0 4px rgba(103, 192, 144, 0.25);
          transform: translateY(-3px);
          background: rgba(18, 65, 112, 0.95);
        }

        .form-input::placeholder {
          color: var(--text-muted);
          font-weight: 400;
        }

        .form-input-icon {
          position: absolute;
          left: 1.2rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--primary-green);
          font-size: 1.1rem;
          transition: all 0.4s ease;
        }

        .form-group:focus-within .form-input-icon {
          color: var(--primary-light);
          transform: translateY(-50%) scale(1.15);
        }

        .auth-btn {
          background: var(--gradient-primary);
          border: none;
          padding: 1.3rem;
          border-radius: 15px;
          color: var(--text-light);
          font-weight: 700;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          margin-top: 0.8rem;
          letter-spacing: 0.8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          text-transform: uppercase;
          box-shadow: 0 8px 25px rgba(103, 192, 144, 0.3);
        }

        .auth-btn:hover:not(:disabled) {
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(103, 192, 144, 0.4);
          letter-spacing: 1.2px;
        }

        .auth-btn:active {
          transform: translateY(-2px);
        }

        .auth-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-toggle {
          text-align: center;
          margin-top: 2.5rem;
          color: var(--text-light);
          font-size: 1.1rem;
        }

        .auth-toggle-btn {
          background: none;
          border: none;
          color: var(--primary-light);
          cursor: pointer;
          font-weight: 700;
          text-decoration: underline;
          transition: all 0.3s ease;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 1.1rem;
        }

        .auth-toggle-btn:hover {
          color: var(--primary-green);
          background: rgba(221, 244, 231, 0.1);
          text-decoration: none;
        }

        .message {
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          text-align: center;
          font-weight: 600;
          font-size: 1rem;
        }

        .error-message {
          background: rgba(220, 53, 69, 0.2);
          color: #f8d7da;
          border: 1px solid rgba(220, 53, 69, 0.4);
        }

        .success-message {
          background: rgba(25, 135, 84, 0.2);
          color: #d1e7dd;
          border: 1px solid rgba(25, 135, 84, 0.4);
        }

        .floating-icon {
          position: absolute;
          color: var(--primary-green);
          animation: floatIcon 6s ease-in-out infinite;
          z-index: -1;
          opacity: 0.6;
          transition: all 0.5s ease;
          font-size: 2rem;
        }

        .floating-icon:hover {
          opacity: 1;
          transform: scale(1.3);
          color: var(--primary-light);
        }

        .floating-icon:nth-child(1) { top: 15%; right: 10%; animation-delay: 0s; }
        .floating-icon:nth-child(2) { top: 75%; right: 15%; animation-delay: 1.5s; }
        .floating-icon:nth-child(3) { top: 45%; right: 5%; animation-delay: 3s; }
        .floating-icon:nth-child(4) { top: 25%; right: 25%; animation-delay: 4.5s; }

        @keyframes floatIcon {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); 
            opacity: 0.6; 
          }
          33% { 
            transform: translateY(-20px) translateX(8px) rotate(8deg) scale(1.15); 
            opacity: 1; 
          }
          66% { 
            transform: translateY(-8px) translateX(-8px) rotate(-8deg) scale(0.9); 
            opacity: 0.8; 
          }
        }

        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transform: scale(0);
          animation: ripple-animation 0.6s linear;
          pointer-events: none;
        }

        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }

        @media (max-width: 1400px) {
          .main-content {
            flex-direction: column;
            gap: 3rem;
          }
          
          .atom-container {
            display: none;
          }
        }

        @media (max-width: 768px) {
          #auth-container {
            padding: 1rem;
          }
          
          .auth-card {
            padding: 2rem;
          }
          
          .auth-logo {
            font-size: 2.2rem;
          }
        }

        @media (max-width: 576px) {
          .auth-card {
            padding: 1.5rem;
          }
          
          .auth-logo {
            font-size: 1.8rem;
          }
          
          .floating-icon {
            display: none;
          }
        }
      `}</style>

      <div id="auth-container">
        <div className="auth-bg-animation"></div>
        
        {/* Hydrogen Atom Animation */}
        <div id="atom-animation" className="atom-container"></div>
        
        <div className="floating-icon">
          <i className="fas fa-industry"></i>
        </div>
        <div className="floating-icon">
          <i className="fas fa-tint"></i>
        </div>
        <div className="floating-icon">
          <i className="fas fa-leaf"></i>
        </div>
        <div className="floating-icon">
          <i className="fas fa-chart-line"></i>
        </div>

        <div className="main-content">
          {/* Auth Card */}
          <div className="auth-card">
            <div className="auth-header">
              <h1 className="auth-logo">HydroMap Pro</h1>
              <p className="auth-subtitle">
                {isLogin 
                  ? 'Welcome back! Ready to make an impact?' 
                  : 'Start your journey towards sustainable water management'
                }
              </p>
            </div>

            {errorMessage && (
              <div className="message error-message">
                <i className="fas fa-exclamation-circle"></i> {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="message success-message">
                <i className="fas fa-check-circle"></i> {successMessage}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-group">
                  <i className="fas fa-building form-input-icon"></i>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    className="form-input"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              )}

              <div className="form-group">
                <i className="fas fa-envelope form-input-icon"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <i className="fas fa-lock form-input-icon"></i>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <i className="fas fa-lock form-input-icon"></i>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="form-input"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              )}

              <button 
                type="submit" 
                className="auth-btn"
                onClick={handleButtonClick}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    {isLogin ? 'Signing In...' : 'Creating Your Future...'}
                  </>
                ) : (
                  <>
                    {isLogin ? (
                      <>
                        <i className="fas fa-sign-in-alt"></i>
                        Access Your Dashboard
                      </>
                    ) : (
                      <>
                        <i className="fas fa-rocket"></i>
                        Start Your Journey
                      </>
                    )}
                  </>
                )}
              </button>
            </form>

            <div className="auth-toggle">
              <p>
                {isLogin ? "Ready to transform your business? " : "Already part of the revolution? "}
                <button 
                  type="button" 
                  className="auth-toggle-btn"
                  onClick={toggleForm}
                  disabled={isLoading}
                >
                    
                  <div>
                  {isLogin ?'Sign Up Here' : 'Sign In Here'}
                  </div>
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;