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
          setSuccessMessage('Login successful! Redirecting...');
          // Store token and user data
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          // Redirect to dashboard after a brief delay
          setTimeout(() => {
            window.location.href = '/dashboard';
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
          setSuccessMessage('Account created successfully! You can now login.');
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
      const size = Math.random() * 6 + 3;
      particle.style.position = 'fixed';
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.background = 'radial-gradient(circle, rgba(144,238,144,0.8) 0%, rgba(32,178,170,0.4) 70%, transparent 100%)';
      particle.style.borderRadius = '50%';
      particle.style.left = Math.random() * window.innerWidth + 'px';
      particle.style.top = window.innerHeight + 'px';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '0';
      particle.style.boxShadow = '0 0 10px 2px rgba(144, 238, 144, 0.5)';
      
      document.getElementById('auth-container').appendChild(particle);
      
      const duration = Math.random() * 4000 + 3000;
      const horizontalMovement = (Math.random() - 0.5) * 100;
      
      particle.animate([
        { transform: 'translateY(0px) translateX(0px)', opacity: 0 },
        { transform: 'translateY(-30px) translateX(0px)', opacity: 0.8, offset: 0.1 },
        { transform: `translateY(-${window.innerHeight + 200}px) translateX(${horizontalMovement}px)`, opacity: 0 }
      ], {
        duration: duration,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }).onfinish = () => {
        if (particle.parentNode) particle.remove();
      };
    };

    const interval = setInterval(createFloatingParticle, 600);
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
          --primary-dark: #081C15;
          --secondary-dark: #1B4332;
          --accent-teal: #2D9CDB;
          --accent-green: #27AE60;
          --accent-mint: #90EE90;
          --accent-aqua: #20B2AA;
          --text-light: #F8F9FA;
          --text-muted: #ADB5BD;
          --gradient-primary: linear-gradient(135deg, var(--accent-green) 0%, var(--accent-teal) 100%);
          --gradient-secondary: linear-gradient(135deg, var(--accent-mint) 0%, var(--accent-aqua) 100%);
          --glow-primary: 0 0 20px rgba(39, 174, 96, 0.4);
          --glow-secondary: 0 0 15px rgba(45, 156, 219, 0.3);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: var(--primary-dark);
          color: var(--text-light);
          font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
          padding: 2rem;
        }

        .auth-bg-animation {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          opacity: 0.15;
          background: 
            radial-gradient(circle at 20% 50%, var(--accent-aqua) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, var(--accent-green) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, var(--accent-teal) 0%, transparent 50%);
          animation: float 25s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1); 
          }
          33% { 
            transform: translateY(-20px) rotate(120deg) scale(1.05);
          }
          66% { 
            transform: translateY(10px) rotate(240deg) scale(0.95);
          }
        }

        /* Hydrogen Atom Animation */
        .atom-container {
          position: absolute;
          top: 50%;
          left: 20%;
          transform: translateY(-50%);
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .atom-nucleus {
          position: absolute;
          width: 30px;
          height: 30px;
          background: radial-gradient(circle,rgb(255, 42, 0) 0%, rgb(255, 128, 0) 100%);
          border-radius: 50%;
          box-shadow: 0 0 20px rgb(255, 42, 0), 0 0 40px rgb(255, 128, 0);
          animation: pulse-nucleus 3s ease-in-out infinite;
          z-index: 10;
        }

        .electron-orbit {
          position: absolute;
          width: 150px;
          height: 150px;
          border: 1px solid rgba(163, 204, 228, 0.51);
          border-radius: 50%;
          animation: rotate-orbit 15s linear infinite;
        }

        .electron {
          position: absolute;
          width: 12px;
          height: 12px;
          background: radial-gradient(circle, var(--accent-aqua) 0%, var(--accent-aqua) 100%);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--accent-aqua), 0 0 20px var(--accent-aqua);
          z-index: 5;
          animation: orbit-electron 3s linear infinite;
        }

        .energy-wave {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(144, 238, 144, 0.1);
        }

        .wave-1 {
          width: 100%;
          height: 100%;
          animation: pulse-wave 5s ease-out infinite;
        }

        .wave-2 {
          width: 130%;
          height: 130%;
          animation: pulse-wave 5s ease-out 1.5s infinite;
        }

        .wave-3 {
          width: 160%;
          height: 160%;
          animation: pulse-wave 5s ease-out 3s infinite;
        }

        @keyframes pulse-nucleus {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes rotate-orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes orbit-electron {
          0% {
            transform: 
              rotate(0deg) 
              translateX(75px) 
              rotate(0deg);
          }
          100% {
            transform: 
              rotate(360deg) 
              translateX(75px) 
              rotate(-360deg);
          }
        }

        @keyframes pulse-wave {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .auth-card {
          background: rgba(27, 67, 50, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(39, 174, 96, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25), var(--glow-primary);
          animation: slideUp 0.8s ease-out;
          position: relative;
          overflow: hidden;
          z-index: 10;
          transition: all 0.4s ease;
        }

        .auth-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3), 0 0 30px rgba(39, 174, 96, 0.5);
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

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-logo {
          font-weight: 700;
          font-size: 2.5rem;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: var(--glow-secondary);
          margin-bottom: 0.5rem;
          letter-spacing: 1px;
        }

        .auth-subtitle {
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          background: rgba(8, 28, 21, 0.7);
          border: 1px solid rgba(39, 174, 96, 0.2);
          border-radius: 10px;
          color: var(--text-light);
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--accent-green);
          box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.2);
          transform: translateY(-2px);
        }

        .form-input::placeholder {
          color: var(--text-muted);
        }

        .form-input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--accent-teal);
          transition: all 0.3s ease;
        }

        .form-group:focus-within .form-input-icon {
          color: var(--accent-green);
          transform: translateY(-50%) scale(1.1);
        }

        .auth-btn {
          background: var(--gradient-primary);
          border: none;
          padding: 1rem;
          border-radius: 10px;
          color: var(--text-light);
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          margin-top: 0.5rem;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .auth-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(39, 174, 96, 0.3);
          letter-spacing: 1px;
        }

        .auth-btn:active {
          transform: translateY(-1px);
        }

        .auth-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-toggle {
          text-align: center;
          margin-top: 2rem;
          color: var(--text-muted);
        }

        .auth-toggle-btn {
          background: none;
          border: none;
          color: var(--accent-teal);
          cursor: pointer;
          font-weight: 600;
          text-decoration: underline;
          transition: all 0.3s ease;
          padding: 0.25rem 0.5rem;
          border-radius: 5px;
        }

        .auth-toggle-btn:hover {
          color: var(--accent-mint);
          background: rgba(144, 238, 144, 0.1);
        }

        .message {
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          text-align: center;
          font-weight: 500;
        }

        .error-message {
          background: rgba(220, 53, 69, 0.2);
          color: #f8d7da;
          border: 1px solid rgba(220, 53, 69, 0.3);
        }

        .success-message {
          background: rgba(25, 135, 84, 0.2);
          color: #d1e7dd;
          border: 1px solid rgba(25, 135, 84, 0.3);
        }

        .floating-icon {
          position: absolute;
          color: var(--accent-teal);
          animation: floatIcon 5s ease-in-out infinite;
          z-index: -1;
          opacity: 0.7;
          transition: all 0.5s ease;
        }

        .floating-icon:hover {
          opacity: 1;
          transform: scale(1.2);
          color: var(--accent-mint);
        }

        .floating-icon:nth-child(1) { top: 20%; left: 15%; animation-delay: 0s; }
        .floating-icon:nth-child(2) { top: 70%; left: 80%; animation-delay: 1s; }
        .floating-icon:nth-child(3) { top: 50%; left: 60%; animation-delay: 2s; }
        .floating-icon:nth-child(4) { top: 30%; left: 70%; animation-delay: 3s; }

        @keyframes floatIcon {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); 
            opacity: 0.7; 
          }
          33% { 
            transform: translateY(-15px) translateX(5px) rotate(5deg) scale(1.1); 
            opacity: 1; 
          }
          66% { 
            transform: translateY(-5px) translateX(-5px) rotate(-5deg) scale(0.9); 
            opacity: 0.8; 
          }
        }

        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
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

        @media (max-width: 1200px) {
          .atom-container {
            left: 10%;
          }
        }

        @media (max-width: 992px) {
          .atom-container {
            display: none;
          }
        }

        @media (max-width: 768px) {
          #auth-container {
            padding: 1rem;
          }
          
          .auth-card {
            padding: 2rem 1.5rem;
          }
        }

        @media (max-width: 576px) {
          .auth-card {
            padding: 1.5rem;
          }
          
          .auth-logo {
            font-size: 2rem;
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
          <i className="fas fa-industry fa-2x"></i>
        </div>
        <div className="floating-icon">
          <i className="fas fa-wind fa-2x"></i>
        </div>
        <div className="floating-icon">
          <i className="fas fa-warehouse fa-2x"></i>
        </div>
        <div className="floating-icon">
          <i className="fas fa-truck fa-2x"></i>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-logo">HydroMap Pro</h1>
            <p className="auth-subtitle">
              {isLogin ? 'Sign in to access your account' : 'Create your company account'}
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
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          <div className="auth-toggle">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                className="auth-toggle-btn"
                onClick={toggleForm}
                disabled={isLoading}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;