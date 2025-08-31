import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const LandingPage = () => {
  const [mapExpanded, setMapExpanded] = useState(false);
  const [countersAnimated, setCountersAnimated] = useState(false);
  const [activeElectrolysis, setActiveElectrolysis] = useState(0);
  const navigate = useNavigate();
  
  // Refs for animations
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const heroVisualRef = useRef(null);
  const featureCardsRef = useRef([]);
  const statsRef = useRef(null);
  const statsItemsRef = useRef([]);
  const useCasesRef = useRef([]);
  const electrolysisRef = useRef([]);
  const processStepsRef = useRef([]);
  const ctaRef = useRef(null);
  const mapContainerRef = useRef(null);
  const threeDModelRef = useRef(null);
  const sectionTitlesRef = useRef([]);
  const atomsRef = useRef([]);

  // Electrolysis methods data
  const electrolysisMethods = [
    {
      name: "Alkaline Electrolysis",
      icon: "fas fa-flask",
      efficiency: "65-80%",
      description: "The most mature and cost-effective technology using liquid alkaline electrolyte (KOH). Proven technology with lower capital costs and long operational life.",
      advantages: ["Lower capital costs", "Proven technology", "Long lifespan (60,000+ hours)", "Good for large-scale production"],
      disadvantages: ["Lower efficiency", "Slower response time", "Uses corrosive electrolyte"]
    },
    {
      name: "PEM Electrolysis",
      icon: "fas fa-microchip",
      efficiency: "75-85%",
      description: "Uses a solid polymer electrolyte membrane for high efficiency and rapid response. Ideal for renewable energy integration with excellent dynamic operation.",
      advantages: ["High efficiency", "Fast response time", "Compact design", "Pure hydrogen output"],
      disadvantages: ["Higher capital costs", "Requires pure water", "Shorter lifespan"]
    },
    {
      name: "Solid Oxide Electrolysis",
      icon: "fas fa-fire",
      efficiency: "85-95%",
      description: "High-temperature electrolysis using solid ceramic electrolyte. Highest efficiency but requires significant heat input and careful thermal management.",
      advantages: ["Highest efficiency", "Can use steam", "Reversible operation", "High-grade waste heat"],
      disadvantages: ["High operating temperature", "Complex thermal management", "Development stage"]
    }
  ];
// Add this to your existing useEffect hooks
useEffect(() => {
  // Initialize Three.js animation for the hydrogen network
  const initThreeJS = () => {
    const canvas = document.querySelector('.hydrogen-canvas');
    if (!canvas) return;
    
    // Simplified Three.js setup (you would need to import Three.js)
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      canvas.offsetWidth / canvas.offsetHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    // Create hydrogen molecules
    const molecules = [];
    for (let i = 0; i < 20; i++) {
      const geometry = new THREE.SphereGeometry(0.1, 16, 16);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0x67C090,
        transparent: true,
        opacity: 0.6
      });
      const molecule = new THREE.Mesh(geometry, material);
      
      // Random position
      molecule.position.x = (Math.random() - 0.5) * 10;
      molecule.position.y = (Math.random() - 0.5) * 10;
      molecule.position.z = (Math.random() - 0.5) * 5;
      
      scene.add(molecule);
      molecules.push(molecule);
    }
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate molecules
      molecules.forEach(molecule => {
        molecule.rotation.x += 0.01;
        molecule.rotation.y += 0.02;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  };
  
  // Initialize if Three.js is available
  if (typeof THREE !== 'undefined') {
    initThreeJS();
  }
}, []);
  // Initialize animations with GSAP
  useEffect(() => {
    // Hero section animation
    gsap.fromTo(heroContentRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
    
    gsap.fromTo(heroVisualRef.current, 
      { opacity: 0, scale: 0.8, rotationY: -15 },
      { opacity: 1, scale: 1, rotationY: 0, duration: 1.2, ease: "power3.out", delay: 0.3 }
    );

    // Animate floating atoms
    atomsRef.current.forEach((atom, i) => {
      gsap.to(atom, {
        y: -20,
        rotation: 360,
        duration: 3 + i,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    // Section title animations
    sectionTitlesRef.current.forEach(title => {
      gsap.fromTo(title, 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: title,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    // Feature cards animation
    featureCardsRef.current.forEach((card, i) => {
      if (card) {
        gsap.fromTo(card, 
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.2,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      }
    });

    // Stats animation
    gsap.fromTo(statsRef.current, 
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        onEnter: () => animateCounters()
      }
    );

    // Use cases animation
    useCasesRef.current.forEach((item, i) => {
      if (item) {
        gsap.fromTo(item, 
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: i * 0.15,
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      }
    });

    // Electrolysis methods animation
    electrolysisRef.current.forEach((method, i) => {
      if (method) {
        gsap.fromTo(method, 
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.2,
            scrollTrigger: {
              trigger: method,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      }
    });

    // Process steps animation
    processStepsRef.current.forEach((step, i) => {
      if (step) {
        gsap.fromTo(step, 
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.15,
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      }
    });

    // CTA animation
    gsap.fromTo(ctaRef.current, 
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );

    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Electrolysis carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveElectrolysis(prev => (prev + 1) % electrolysisMethods.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Counter animation
  const animateCounters = () => {
    if (countersAnimated) return;
    
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach((counter, index) => {
      const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
      const suffix = counter.textContent.replace(/[\d\.\,]/g, '');
      let current = 0;
      
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.floor(current) + suffix;
      }, 50);
    });
    
    setCountersAnimated(true);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleConvert = () => {
    navigate('/assessment');
  }

  const toggleMapView = () => {
    setMapExpanded(!mapExpanded);
  };

  const handleButtonClick = (e) => {
    const button = e.currentTarget;
  
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        const token = localStorage.getItem("token");
  
        if (token) {
          navigate("/dashboard");
        } else {
          navigate("/auth")
        }
      },
    });
  };
  

  // Component for creating hydrogen atoms
  const HydrogenAtom = ({ size = 40, className = "", style = {} }) => (
    <div 
      className={`hydrogen-atom ${className}`} 
      style={{ width: size, height: size, ...style }}
      ref={el => atomsRef.current.push(el)}
    >
      <div className="proton" style={{
        width: size * 0.2 + 'px',
        height: size * 0.2 + 'px',
        top: '50%',
        left: '50%'
      }}></div>
      <div className="electron-orbit" style={{
        width: size * 0.8 + 'px',
        height: size * 0.8 + 'px',
        top: '50%',
        left: '50%'
      }}>
        <div className="electron" style={{
          width: size * 0.15 + 'px',
          height: size * 0.15 + 'px',
          top: -(size * 0.075) + 'px',
          left: '50%',
          transform: 'translateX(-50%)'
        }}></div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        :root {
          --primary-light: #DDF4E7;
          --primary-green: #67C090;
          --primary-teal: #26667F;
          --primary-dark: #124170;
          --accent-purple: #8A4FFF;
          --accent-pink: #FF6B9D;
          --text-dark: #1a1a1a;
          --text-light: #ffffff;
          --text-muted: #6c757d;
          --gradient-primary: linear-gradient(135deg, #67C090 0%, #26667F 100%);
          --gradient-secondary: linear-gradient(135deg, #26667F 0%, #124170 100%);
          --gradient-accent: linear-gradient(135deg, #DDF4E7 0%, #67C090 100%);
          --gradient-hero: linear-gradient(135deg, #8A4FFF 0%, #26667F 50%, #67C090 100%);
          --gradient-feature: linear-gradient(135deg, #FF6B9D 0%, #8A4FFF 100%);
          --shadow-primary: 0 10px 30px rgba(18, 65, 112, 0.15);
          --shadow-hover: 0 20px 40px rgba(18, 65, 112, 0.25);
          --border-radius: 16px;
          --border-radius-lg: 24px;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: linear-gradient(135deg, #f8fffe 0%, #f0f9f4 100%);
          color: var(--text-dark);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          overflow-x: hidden;
        }

        #atom-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .hydrogen-atom {
          position: absolute;
          pointer-events: none;
        }

        .proton {
          position: absolute;
          background: radial-gradient(circle, #ff6b6b 0%, #e55656 100%);
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(255, 107, 107, 0.6);
          animation: protonPulse 3s ease-in-out infinite;
        }

        @keyframes protonPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
        }

        .electron-orbit {
          position: absolute;
          border: 1px solid rgba(103, 192, 144, 0.4);
          border-radius: 50%;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .electron {
          position: absolute;
          background: radial-gradient(circle, #67C090 0%, #26667F 100%);
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(103, 192, 144, 0.8);
          animation: electronGlow 2s ease-in-out infinite;
        }

        @keyframes electronGlow {
          0%, 100% { box-shadow: 0 0 10px rgba(103, 192, 144, 0.8); }
          50% { box-shadow: 0 0 20px rgba(103, 192, 144, 1); }
        }

        @keyframes atomRotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .bg-animation {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -2;
          opacity: 0.05;
          background: 
            radial-gradient(circle at 20% 50%, #8A4FFF 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #26667F 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, #FF6B9D 0%, transparent 50%);
          animation: float 30s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1); 
          }
          33% { 
            transform: translateY(-30px) rotate(120deg) scale(1.1);
          }
          66% { 
            transform: translateY(20px) rotate(240deg) scale(0.9);
          }
        }

        .hero {
          display: flex;
          align-items: center;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          padding: 100px 0 80px;
        }

        .hero::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('./images/plant.gif');
          background-size: cover;
          background-position: center;
          filter: blur(2px);         
          transform: scale(1.1);     
          z-index: -1;                
        }

        .hero::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.64);
          z-index: -1;
        }


        @keyframes heroBlob {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg); 
            border-radius: 50%;
          }
          25% { 
            transform: translate(-50px, 50px) rotate(90deg); 
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          50% { 
            transform: translate(0, 100px) rotate(180deg); 
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
          }
          75% { 
            transform: translate(50px, 50px) rotate(270deg); 
            border-radius: 40% 60%;
          }
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 600px;
        }

        .hero-content h1 {
          font-size: 3.8rem;
          font-weight: 800;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          letter-spacing: -0.02em;
          text-shadow : 0px 0px 1px rgba(0, 199, 30, 0.34);
        }

        .hero-content p {
          font-size: 1.25rem;
          color: white;
          margin-bottom: 2.5rem;
          line-height: 1.6;
          font-weight: 400;
          text-shadow : 0px 0px 10px black;
        }

        .btn-primary-custom {
          background: var(--gradient-primary);
          border: none;
          padding: 18px 36px;
          font-weight: 600;
          font-size: 1rem;
          border-radius: 50px;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          box-shadow: var(--shadow-primary);
          position: relative;
          overflow: hidden;
          color: var(--text-light);
          transform: translateY(0);
          cursor: pointer;
        }

        .btn-primary-custom::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: 0.5s;
        }

        .btn-primary-custom:hover::before {
          left: 100%;
        }

        .btn-primary-custom:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-hover);
          color: var(--text-light);
        }

        .btn-outline-custom {
          border: 2px solid var(--primary-teal);
          color: rgb(255,255,255);
          background: transparent;
          padding: 16px 36px;
          border-radius: 50px;
          font-weight: 800;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          box-shadow :inset 0px 0px 20px var(--primary-teal), 0px 0px 20px var(--primary-teal);
         
        }

        .btn-outline-custom:hover {
          background: var(--primary-teal);
          color: var(--text-light);
          transform: translateY(-3px);
        }

        .hero-visual {
          position: relative;
          z-index: 2;
          perspective: 1000px;
        }

        .map-preview {
          width: 100%;
          height: 450px;
          background: var(--text-light);
          border-radius: var(--border-radius-lg);
          border: 1px solid rgba(103, 192, 144, 0.2);
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-primary);
          transform-style: preserve-3d;
        }

        .hydrogen-3d-model {
          width: 200px;
          height: 200px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: conic-gradient(
            from 0deg at 50% 50%,
            #67C090,
            #26667F,
            #124170,
            #67C090
          );
          border-radius: 50%;
          filter: blur(15px) opacity(0.8);
          transform-style: preserve-3d;
          animation: hydrogenGlow 4s ease-in-out infinite;
        }

        @keyframes hydrogenGlow {
          0%, 100% { 
            filter: blur(15px) opacity(0.8);
            transform: translate(-50%, -50%) scale(1);
          }
          50% { 
            filter: blur(25px) opacity(1);
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        .model-electron {
          position: absolute;
          width: 16px;
          height: 16px;
          background: radial-gradient(circle, #67C090 0%, transparent 70%);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform-origin: 100px;
        }

        .model-electron:nth-child(1) { 
          animation: orbitElectron1 6s linear infinite;
          transform: rotate(0deg) translateX(100px) rotate(0deg);
        }
        
        .model-electron:nth-child(2) { 
          animation: orbitElectron2 8s linear infinite;
          transform: rotate(120deg) translateX(100px) rotate(-120deg);
        }
        
        .model-electron:nth-child(3) { 
          animation: orbitElectron3 10s linear infinite;
          transform: rotate(240deg) translateX(100px) rotate(-240deg);
        }

        @keyframes orbitElectron1 {
          0% { transform: rotate(0deg) translateX(100px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
        }
        
        @keyframes orbitElectron2 {
          0% { transform: rotate(120deg) translateX(100px) rotate(-120deg); }
          100% { transform: rotate(480deg) translateX(100px) rotate(-480deg); }
        }
        
        @keyframes orbitElectron3 {
          0% { transform: rotate(240deg) translateX(100px) rotate(-240deg); }
          100% { transform: rotate(600deg) translateX(100px) rotate(-600deg); }
        }

        .pulse-dot {
          width: 12px;
          height: 12px;
          background: #67C090;
          border-radius: 50%;
          position: absolute;
          animation: pulse 2s infinite;
          box-shadow: 0 0 0 0 rgba(103, 192, 144, 0.7);
        }

        .pulse-dot:nth-child(1) { top: 30%; left: 20%; animation-delay: 0s; }
        .pulse-dot:nth-child(2) { top: 60%; left: 70%; animation-delay: 0.7s; }
        .pulse-dot:nth-child(3) { top: 80%; left: 40%; animation-delay: 1.4s; }

        @keyframes pulse {
          0% { 
            transform: scale(1); 
            box-shadow: 0 0 0 0 rgba(103, 192, 144, 0.7); 
          }
          70% { 
            transform: scale(1.5); 
            box-shadow: 0 0 0 15px rgba(103, 192, 144, 0); 
          }
          100% { 
            transform: scale(1); 
            box-shadow: 0 0 0 0 rgba(103, 192, 144, 0); 
          }
        }

        .features {
          padding: 120px 0;
          background: var(--text-light);
          position: relative;
          overflow: hidden;
        }

        .features::before {
          content: '';
          position: absolute;
          top: -100px;
          left: -100px;
          width: 300px;
          height: 300px;
          background: var(--gradient-feature);
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.05;
          z-index: 0;
        }

        .section-title {
          text-align: center;
          margin-bottom: 80px;
          position: relative;
        }

        .section-title h2 {
          font-size: 3.2rem;
          font-weight: 800;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1.5rem;
          position: relative;
          display: inline-block;
          letter-spacing: -0.02em;
        }

        .section-title h2::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: var(--gradient-primary);
          border-radius: 2px;
        }

        .section-title p {
          font-size: 1.2rem;
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto;
          font-weight: 400;
        }

        .feature-card {
          background: var(--text-light);
          border: 1px solid rgba(103, 192, 144, 0.1);
          border-radius: var(--border-radius-lg);
          padding: 40px 30px;
          text-align: center;
          transition: all 0.4s ease;
          height: 100%;
          position: relative;
          overflow: hidden;
          transform-style: preserve-3d;
          box-shadow: 0 5px 25px rgba(18, 65, 112, 0.06);
          backdrop-filter: blur(10px);
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--gradient-accent);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: -1;
        }

        .feature-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: var(--primary-green);
          box-shadow: 0 20px 40px rgba(103, 192, 144, 0.15);
        }

        .feature-card:hover::before {
          opacity: 0.05;
        }

        .feature-icon {
          font-size: 3rem;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1.5rem;
          display: block;
          transition: all 0.3s ease;
          position: relative;
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.1);
        }

        .feature-atom {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 40px;
          height: 40px;
          opacity: 0.2;
        }

        .feature-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text-dark);
        }

        .feature-desc {
          color: var(--text-muted);
          line-height: 1.7;
          font-size: 1rem;
        }

        .stats {
          padding: 100px 0;
          background: var(--primary-dark);
          position: relative;
          color: var(--text-light);
          overflow: hidden;
        }

        .stats::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--gradient-primary);
        }

        .stat-item {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
          padding: 20px;
        }

        .stat-atom {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 30px;
          height: 30px;
          opacity: 0.3;
        }

        .stat-number {
          font-size: 3.5rem;
          font-weight: 900;
          background: var(--gradient-accent);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 500;
        }

        .use-cases {
          padding: 120px 0;
          background: linear-gradient(135deg, #f8fffe 0%, #f0f9f4 100%);
          position: relative;
          overflow: hidden;
        }

        .use-case-item {
          background: var(--text-light);
          border-left: 4px solid var(--primary-green);
          padding: 35px 30px;
          margin-bottom: 30px;
          border-radius: 0 var(--border-radius-lg) var(--border-radius-lg) 0;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 5px 25px rgba(18, 65, 112, 0.06);
        }

        .use-case-item:hover {
          transform: translateX(10px);
          box-shadow: var(--shadow-hover);
          border-left-color: var(--primary-teal);
        }

        .use-case-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(103, 192, 144, 0.1), transparent);
          transition: left 0.7s ease;
        }

        .use-case-item:hover::before {
          left: 100%;
        }

        .use-case-icon {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 2.5rem;
          margin-bottom: 1.2rem;
          transition: all 0.3s ease;
          display: inline-block;
          position: relative;
        }

        .use-case-item:hover .use-case-icon {
          transform: scale(1.2);
        }

        .use-case-atom {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 35px;
          height: 35px;
          opacity: 0.2;
        }

        .use-case-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 0.8rem;
          color: var(--text-dark);
        }

        .use-case-desc {
          color: var(--text-muted);
          line-height: 1.7;
        }

        .electrolysis-section {
          padding: 120px 0;
          background: var(--primary-dark);
          position: relative;
          color: var(--text-light);
          overflow: hidden;
        }

        .electrolysis-method {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(103, 192, 144, 0.2);
          border-radius: var(--border-radius-lg);
          padding: 40px 30px;
          margin-bottom: 30px;
          transition: all 0.4s ease;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .electrolysis-method:hover {
          transform: translateY(-5px);
          border-color: var(--primary-green);
          box-shadow: 0 20px 40px rgba(103, 192, 144, 0.1);
        }

        .electrolysis-method.active {
          border-color: var(--primary-green);
          background: rgba(103, 192, 144, 0.1);
          transform: translateY(-5px);
        }

        .method-atom {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          opacity: 0.15;
        }

        .method-header {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .method-icon {
          font-size: 2.5rem;
          background: var(--gradient-accent);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-right: 1rem;
        }

        .method-name {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-light);
          margin: 0;
        }

        .method-efficiency {
          background: var(--gradient-primary);
          color: var(--text-light);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-left: auto;
        }

        .method-description {
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        .method-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .detail-group h5 {
          color: var(--primary-green);
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-list {
          list-style: none;
          padding: 0;
        }

        .detail-list li {
          color: rgba(255, 255, 255, 0.8);
          padding: 0.3rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .detail-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--primary-green);
          font-weight: bold;
        }

        .detail-list.disadvantages li::before {
          content: '⚠';
          color: #ff6b6b;
        }

        .process-flow {
          padding: 80px 0;
          background: linear-gradient(135deg, #f8fffe 0%, #f0f9f4 100%);
          position: relative;
          overflow: hidden;
        }

        .process-step {
          background: var(--text-light);
          border-radius: var(--border-radius-lg);
          padding: 30px;
          text-align: center;
          box-shadow: 0 5px 25px rgba(18, 65, 112, 0.06);
          position: relative;
          transition: all 0.3s ease;
        }

        .process-step:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-hover);
        }

        .process-step::after {
          content: '→';
          position: absolute;
          right: -30px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 2rem;
          color: var(--primary-green);
          font-weight: bold;
        }

        .process-step:last-child::after {
          display: none;
        }

        .process-atom {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 40px;
          height: 40px;
          opacity: 0.15;
        }

        .process-icon {
          background: var(--gradient-primary);
          color: var(--text-light);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin: 0 auto 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .process-icon::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          50% { transform: translateX(100%) translateY(100%) rotate(45deg); }
          100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
        }

        .process-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.8rem;
        }

        .process-desc {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .cta {
          padding: 120px 0;
          background: var(--gradient-secondary);
          text-align: center;
          position: relative;
          overflow: hidden;
          color: var(--text-light);
        }

        .cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="%23DDF4E7" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
          z-index: -1;
        }

        .cta h2 {
          font-size: 3.2rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          color: var(--text-light);
          letter-spacing: -0.02em;
          position: relative;
        }

        .cta-atom {
          position: absolute;
          top: 50%;
          left: 20%;
          width: 100px;
          height: 100px;
          opacity: 0.1;
          animation: ctaAtomFloat 15s ease-in-out infinite;
        }

        .cta-atom:nth-child(2) {
          left: 80%;
          top: 30%;
          animation-delay: -5s;
        }

        @keyframes ctaAtomFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }

        .cta p {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 3rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .interactive-map-section {
          padding: 120px 0;
          background: var(--text-light);
          position: relative;
          overflow: hidden;
          
        }

        .interactive-map {
          background: var(--text-light);
          border-radius: var(--border-radius-lg);
          padding: 0;
          margin: 50px 0;
          border: 1px solid rgba(103, 192, 144, 0.2);
          position: relative;
          height: ${mapExpanded ? '500px' : '300px'};
          overflow: hidden;
          box-shadow: var(--shadow-primary);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .interactive-map:hover {
          border-color: var(--primary-green);
          box-shadow: var(--shadow-hover);
        }

        .map-container {
          width: 100%;
          height: 100%;
          border-radius: calc(var(--border-radius-lg) - 1px);
          overflow: hidden;
          position: relative;
        }

        .map-atoms {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 5;
        }

        .map-atom {
          position: absolute;
          width: 60px;
          height: 60px;
          opacity: 0.3;
          animation: mapAtomFloat 12s ease-in-out infinite;
        }

        .map-atom:nth-child(1) { top: 20%; left: 15%; animation-delay: 0s; }
        .map-atom:nth-child(2) { top: 70%; left: 70%; animation-delay: -4s; }
        .map-atom:nth-child(3) { top: 40%; left: 80%; animation-delay: -8s; }

        @keyframes mapAtomFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33% { transform: translateY(-20px) rotate(120deg) scale(1.1); }
          66% { transform: translateY(10px) rotate(240deg) scale(0.9); }
        }

        .map-expand-btn {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: var(--gradient-primary);
          border: none;
          color: white;
          padding: 12px 24px;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          z-index: 1000;
          box-shadow: var(--shadow-primary);
          transition: all 0.3s ease;
        }

        .map-expand-btn:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-hover);
        }

        .map-overlay-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 10;
          color: var(--text-dark);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .row {
          display: flex;
          flex-wrap: wrap;
          margin: 0 -15px;
        }

        .col-lg-6, .col-md-4, .col-md-6, .col-md-3 {
          padding: 0 15px;
          margin-bottom: 30px;
        }

        .col-lg-6 { flex: 0 0 50%; }
        .col-md-4 { flex: 0 0 33.333333%; }
        .col-md-6 { flex: 0 0 50%; }
        .col-md-3 { flex: 0 0 25%; }

        .d-flex { display: flex; }
        .align-items-center { align-items: center; }
        .justify-content-center { justify-content: center; }
        .justify-content-between { justify-content: space-between; }
        .gap-3 { gap: 1rem; }
        .flex-wrap { flex-wrap: wrap; }
        .text-center { text-align: center; }
        .mb-3 { margin-bottom: 1rem; }
        .mb-5 { margin-bottom: 3rem; }
        .me-2 { margin-right: 0.5rem; }
        .me-3 { margin-right: 1rem; }
        .mt-3 { margin-top: 1rem; }
        .ms-2 { margin-left: 0.5rem; }

        .section-atoms {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .section-atom {
          position: absolute;
          opacity: 0.08;
          animation: sectionAtomFloat 20s ease-in-out infinite;
        }

        .section-atom:nth-child(1) { top: 10%; left: 10%; width: 80px; height: 80px; animation-delay: 0s; }
        .section-atom:nth-child(2) { top: 20%; right: 15%; width: 60px; height: 60px; animation-delay: -7s; }
        .section-atom:nth-child(3) { bottom: 20%; left: 20%; width: 70px; height: 70px; animation-delay: -14s; }
        .section-atom:nth-child(4) { bottom: 30%; right: 10%; width: 90px; height: 90px; animation-delay: -10s; }

        @keyframes sectionAtomFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-30px) rotate(90deg) scale(1.1); }
          50% { transform: translateY(0px) rotate(180deg) scale(0.9); }
          75% { transform: translateY(20px) rotate(270deg) scale(1.05); }
        }

        @media (max-width: 992px) {
          .method-details {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .process-step::after {
            content: '↓';
            right: 50%;
            top: auto;
            bottom: -30px;
            transform: translateX(50%);
          }
        }

        @media (max-width: 768px) {
          .hero {
              padding: 80px 0 60px;
              min-height: auto;
              background-image: url('./images/dashboard_hero_image.webp');
              background-size: cover;
              background-position: center; 
              background-color:transparent;
            }
                      
          .hero-content h1 { 
            font-size: 2.8rem; 
          }
          
          .hero-content p { 
            font-size: 1.1rem; 
          }
          
          .section-title h2 { 
            font-size: 2.5rem; 
          }
          
          .stat-number { 
            font-size: 2.8rem; 
          }
          
          .col-lg-6, .col-md-4, .col-md-6, .col-md-3 { 
            flex: 0 0 100%; 
          }
          
          .interactive-map {
            height: 250px !important;
          }
          
          .row {
            flex-direction: column;
          }
          
          .hero::before {
            width: 100%;
            height: 40%;
            bottom: 0;
            top: auto;
          }
          
          .electrolysis-section {
            padding: 80px 0;
          }
          
          .process-flow {
            padding: 60px 0;
          }
        }

        @media (max-width: 576px) {
          .hero-content h1 {
            font-size: 2.2rem;
          }
          
          .btn-primary-custom, .btn-outline-custom {
            padding: 14px 28px;
            font-size: 0.95rem;
            width: 100%;
            margin-bottom: 1rem;
          }
          
          .feature-icon {
            font-size: 2.5rem;
          }
          
          .stat-number {
            font-size: 2.5rem;
          }
          
          .section-title h2 {
            font-size: 2rem;
          }
          
          .method-header {
            flex-direction: column;
            text-align: center;
          }
          
          .method-efficiency {
            margin-left: 0;
            margin-top: 0.5rem;
          }
        }
      `}
      </style>
     
      <div id="atom-container"></div>
      <div className="bg-animation"></div>
      
      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="hero-content" ref={heroContentRef}>
                <h1>Green Hydrogen Revolution</h1>
                <p>Transforming renewable energy into sustainable fuel solutions for a cleaner tomorrow. Our advanced technology produces green hydrogen efficiently and cost-effectively.</p>
                <div className="d-flex gap-3 flex-wrap">
                  <button className="btn-primary-custom" onClick={handleButtonClick}>
                    Start From strach <i className="fas fa-arrow-right ms-2"></i>
                  </button>
                  <button className="btn-outline-custom" onClick={() => handleConvert}>
                    convert existing <i className="fas fa-book-open ms-2"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
  <div className="hero-visual" ref={heroVisualRef}>
    <div className="map-preview">
      {/* Enhanced Hydrogen Network Animation */}
      <div className="hydrogen-network">
        {/* Canvas for Three.js animation */}
        <canvas className="hydrogen-canvas" ref={threeDModelRef}></canvas>
        
        {/* Network connections */}
        <div className="network-connections">
          <div className="connection-line" style={{top: '30%', left: '40%', width: '25%', transform: 'rotate(30deg)'}}></div>
          <div className="connection-line" style={{top: '60%', left: '65%', width: '20%', transform: 'rotate(-15deg)'}}></div>
          <div className="connection-line" style={{top: '45%', left: '25%', width: '15%', transform: 'rotate(60deg)'}}></div>
        </div>
        
        {/* Facility nodes */}
        <div className="facility-node" style={{top: '30%', left: '40%'}}>
          <div className="node-pulse"></div>
          <div className="node-icon">🏭</div>
          <div className="node-tooltip">Production Facility</div>
        </div>
        
        <div className="facility-node" style={{top: '60%', left: '65%'}}>
          <div className="node-pulse"></div>
          <div className="node-icon">⚡</div>
          <div className="node-tooltip">Energy Plant</div>
        </div>
        
        <div className="facility-node" style={{top: '45%', left: '25%'}}>
          <div className="node-pulse"></div>
          <div className="node-icon">🔬</div>
          <div className="node-tooltip">Research Center</div>
        </div>
        
        {/* Energy particles moving between nodes */}
        <div className="energy-flow">
          <div className="energy-particle" style={{'--delay': '0s', '--path': 'node1-node2'}}></div>
          <div className="energy-particle" style={{'--delay': '1.5s', '--path': 'node2-node3'}}></div>
          <div className="energy-particle" style={{'--delay': '3s', '--path': 'node3-node1'}}></div>
        </div>
        
        {/* Data points floating around */}
        <div className="data-point" style={{top: '20%', left: '50%'}}>
          <div className="data-value">H₂</div>
        </div>
        <div className="data-point" style={{top: '70%', left: '30%'}}>
          <div className="data-value">O₂</div>
        </div>
        <div className="data-point" style={{top: '50%', left: '75%'}}>
          <div className="data-value">H₂O</div>
        </div>
      </div>
      
      <div className="map-overlay">
        <h3>Global Hydrogen Network</h3>
        <p>Interactive production facilities map</p>
        <button className="explore-btn" onClick={toggleMapView}>
          {mapExpanded ? 'Collapse View' : 'Explore Network'}
        </button>
      </div>
    </div>
  </div>
</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-title">
            <h2 ref={el => sectionTitlesRef.current[0] = el}>Why Choose Green Hydrogen?</h2>
            <p>Our innovative approach combines cutting-edge technology with sustainable practices to deliver exceptional results</p>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="feature-card" ref={el => featureCardsRef.current[0] = el}>
                <HydrogenAtom className="feature-atom" size={40} />
                <i className="fas fa-leaf feature-icon"></i>
                <h3 className="feature-title">Zero Emissions</h3>
                <p className="feature-desc">Produce clean hydrogen with no carbon footprint using renewable energy sources like solar and wind power.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card" ref={el => featureCardsRef.current[1] = el}>
                <HydrogenAtom className="feature-atom" size={40} />
                <i className="fas fa-bolt feature-icon"></i>
                <h3 className="feature-title">High Efficiency</h3>
                <p className="feature-desc">Our advanced electrolysis technology achieves up to 95% efficiency in energy conversion.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card" ref={el => featureCardsRef.current[2] = el}>
                <HydrogenAtom className="feature-atom" size={40} />
                <i className="fas fa-chart-line feature-icon"></i>
                <h3 className="feature-title">Cost Effective</h3>
                <p className="feature-desc">Reduce operational costs with our optimized production processes and scalable solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats" ref={statsRef}>
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <div className="stat-item" ref={el => statsItemsRef.current[0] = el}>
                <HydrogenAtom className="stat-atom" size={30} />
                <span className="stat-number">500+</span>
                <span className="stat-label">Tons Produced</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item" ref={el => statsItemsRef.current[1] = el}>
                <HydrogenAtom className="stat-atom" size={30} />
                <span className="stat-number">85%</span>
                <span className="stat-label">Efficiency Rate</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item" ref={el => statsItemsRef.current[2] = el}>
                <HydrogenAtom className="stat-atom" size={30} />
                <span className="stat-number">120+</span>
                <span className="stat-label">Projects Completed</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item" ref={el => statsItemsRef.current[3] = el}>
                <HydrogenAtom className="stat-atom" size={30} />
                <span className="stat-number">2.5M+</span>
                <span className="stat-label">CO₂ Reduced</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="use-cases">
        <div className="container">
          <div className="section-title">
            <h2 ref={el => sectionTitlesRef.current[1] = el}>Applications of Green Hydrogen</h2>
            <p>Discover how green hydrogen is transforming industries across the globe</p>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="use-case-item" ref={el => useCasesRef.current[0] = el}>
                <HydrogenAtom className="use-case-atom" size={35} />
                <i className="fas fa-car use-case-icon"></i>
                <h3 className="use-case-title">Transportation Fuel</h3>
                <p className="use-case-desc">Power fuel cell vehicles with zero emissions and fast refueling capabilities for a sustainable transportation future.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="use-case-item" ref={el => useCasesRef.current[1] = el}>
                <HydrogenAtom className="use-case-atom" size={35} />
                <i className="fas fa-industry use-case-icon"></i>
                <h3 className="use-case-title">Industrial Processes</h3>
                <p className="use-case-desc">Replace fossil fuels in manufacturing, refining, and chemical production with clean hydrogen alternatives.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="use-case-item" ref={el => useCasesRef.current[2] = el}>
                <HydrogenAtom className="use-case-atom" size={35} />
                <i className="fas fa-home use-case-icon"></i>
                <h3 className="use-case-title">Energy Storage</h3>
                <p className="use-case-desc">Store excess renewable energy as hydrogen for later use, enabling grid stability and reliable power supply.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="use-case-item" ref={el => useCasesRef.current[3] = el}>
                <HydrogenAtom className="use-case-atom" size={35} />
                <i className="fas fa-plug use-case-icon"></i>
                <h3 className="use-case-title">Power Generation</h3>
                <p className="use-case-desc">Generate electricity through fuel cells or hydrogen turbines for clean, dispatchable power generation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Electrolysis Methods Section */}
      <section className="electrolysis-section">
        <div className="container">
          <div className="section-title">
            <h2 ref={el => sectionTitlesRef.current[2] = el}>Advanced Electrolysis Technologies</h2>
            <p>Our cutting-edge methods for producing green hydrogen efficiently</p>
          </div>
          <div className="row">
            {electrolysisMethods.map((method, index) => (
              <div className="col-md-4" key={index}>
                <div 
                  className={`electrolysis-method ${index === activeElectrolysis ? 'active' : ''}`}
                  ref={el => electrolysisRef.current[index] = el}
                >
                  <HydrogenAtom className="method-atom" size={50} />
                  <div className="method-header">
                    <i className={`${method.icon} method-icon`}></i>
                    <h4 className="method-name">{method.name}</h4>
                    <span className="method-efficiency">{method.efficiency}</span>
                  </div>
                  <p className="method-description">{method.description}</p>
                  <div className="method-details">
                    <div className="detail-group">
                      <h5>Advantages</h5>
                      <ul className="detail-list">
                        {method.advantages.map((adv, i) => (
                          <li key={i}>{adv}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="detail-group">
                      <h5>Considerations</h5>
                      <ul className="detail-list disadvantages">
                        {method.disadvantages.map((dis, i) => (
                          <li key={i}>{dis}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow Section */}
      <section className="process-flow">
        <div className="container">
          <div className="section-title">
            <h2 ref={el => sectionTitlesRef.current[3] = el}>Our Production Process</h2>
            <p>From renewable energy to clean hydrogen fuel</p>
          </div>
          <div className="row">
            <div className="col-md-3">
              <div className="process-step" ref={el => processStepsRef.current[0] = el}>
                <HydrogenAtom className="process-atom" size={40} />
                <div className="process-icon">
                  <i className="fas fa-sun"></i>
                </div>
                <h3 className="process-title">Renewable Energy</h3>
                <p className="process-desc">Harness solar and wind power to generate clean electricity</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="process-step" ref={el => processStepsRef.current[1] = el}>
                <HydrogenAtom className="process-atom" size={40} />
                <div className="process-icon">
                  <i className="fas fa-tint"></i>
                </div>
                <h3 className="process-title">Water Supply</h3>
                <p className="process-desc">Source and purify water for the electrolysis process</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="process-step" ref={el => processStepsRef.current[2] = el}>
                <HydrogenAtom className="process-atom" size={40} />
                <div className="process-icon">
                  <i className="fas fa-bolt"></i>
                </div>
                <h3 className="process-title">Electrolysis</h3>
                <p className="process-desc">Split water molecules into hydrogen and oxygen using electricity</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="process-step" ref={el => processStepsRef.current[3] = el}>
                <HydrogenAtom className="process-atom" size={40} />
                <div className="process-icon">
                  <i className="fas fa-gas-pump"></i>
                </div>
                <h3 className="process-title">Distribution</h3>
                <p className="process-desc">Store and transport hydrogen to end users efficiently</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="interactive-map-section">
        <div className="container">
          <div className="section-title">
            <h2 ref={el => sectionTitlesRef.current[4] = el}>Global Hydrogen Network</h2>
            <p>Explore our worldwide production facilities and distribution network</p>
          </div>
          <div className="interactive-map">
            <div className="map-container" ref={mapContainerRef}>
              <div className="map-atoms">
                <HydrogenAtom className="map-atom" size={60} />
                <HydrogenAtom className="map-atom" size={60} />
                <HydrogenAtom className="map-atom" size={60} />
              </div>
            </div>
            <button className="map-expand-btn" onClick={toggleMapView}>
              {mapExpanded ? (
                <><i className="fas fa-compress me-2"></i> Collapse Map</>
              ) : (
                <><i className="fas fa-expand me-2"></i> Expand Map</>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta" ref={ctaRef}>
        <div className="container">
          <HydrogenAtom className="cta-atom" size={100} />
          <HydrogenAtom className="cta-atom" size={100} />
          <h2>Ready to Join the Green Hydrogen Revolution?</h2>
          <p>Start your journey towards sustainable energy solutions today. Our team of experts is ready to help you implement green hydrogen technology for your business needs.</p>
          <button className="btn-primary-custom" onClick={handleButtonClick}>
            Get Started Now <i className="fas fa-arrow-right ms-2"></i>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-4" style={{background: 'var(--primary-dark)', color: 'var(--text-light)'}}>
        <div className="container">
          <p>&copy; 2024 Green Hydrogen Solutions. All rights reserved.</p>
          <div className="d-flex justify-content-center gap-3 mt-3">
            <a href="#" style={{color: 'var(--text-light)'}}><i className="fab fa-facebook-f"></i></a>
            <a href="#" style={{color: 'var(--text-light)'}}><i className="fab fa-twitter"></i></a>
            <a href="#" style={{color: 'var(--text-light)'}}><i className="fab fa-linkedin-in"></i></a>
            <a href="#" style={{color: 'var(--text-light)'}}><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;