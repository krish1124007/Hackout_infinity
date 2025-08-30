import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const [mapExpanded, setMapExpanded] = useState(false);
  const [countersAnimated, setCountersAnimated] = useState(false);
  const statsRef = useRef(null);
  const navigate = useNavigate();
  
  // Refs for GSAP animations
  const heroContentRef = useRef(null);
  const heroVisualRef = useRef(null);
  const featureCardsRef = useRef([]);
  const statsRefs = useRef([]);
  const useCasesRef = useRef([]);
  const sectionTitleRef = useRef(null);
  const ctaRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const threeDModelRef = useRef(null);

  // Initialize Leaflet map
  useEffect(() => {
    if (mapExpanded && mapContainerRef.current && !mapRef.current) {
      // Initialize map
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([51.505, -0.09], 13);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);
      
      // Add custom markers
      const hydrogenIcon = L.divIcon({
        className: 'hydrogen-marker',
        html: '<div class="pulse-dot"></div><i class="fas fa-industry"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      
      // Sample markers for hydrogen facilities
      const facilities = [
        { lat: 51.505, lng: -0.09, name: 'London Hydrogen Plant' },
        { lat: 51.51, lng: -0.08, name: 'Thames Hydrogen Hub' },
        { lat: 51.50, lng: -0.10, name: 'Green Energy Station' },
        { lat: 51.515, lng: -0.095, name: 'Eco Fuel Center' }
      ];
      
      facilities.forEach(facility => {
        L.marker([facility.lat, facility.lng], { icon: hydrogenIcon })
          .addTo(mapRef.current)
          .bindPopup(facility.name);
      });
      
      // Add zoom control
      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
      
      // Fit map to show all markers
      const group = new L.featureGroup(facilities.map(f => L.marker([f.lat, f.lng])));
      mapRef.current.fitBounds(group.getBounds().pad(0.1));
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapExpanded]);

  // 3D model animation with GSAP
  useEffect(() => {
    if (threeDModelRef.current) {
      gsap.to(threeDModelRef.current, {
        rotationY: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
      });
    }
  }, []);

  // Initialize GSAP animations
  useEffect(() => {
    // Hero section animations
    const heroTl = gsap.timeline();
    heroTl.fromTo(heroContentRef.current, 
      { opacity: 0, y: 100 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.5,
        ease: "power3.out",
      }
    ).fromTo(heroVisualRef.current, 
      { opacity: 0, x: 100, rotationY: 180 },
      { 
        opacity: 1, 
        x: 0, 
        rotationY: 0,
        duration: 1.5,
        ease: "power3.out",
      }, "-=1"
    );
    
    // Animated background elements
    gsap.to('.floating-particle', {
      y: -20,
      x: "random(-20, 20)",
      rotation: "random(-30, 30)",
      duration: "random(3, 5)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.2
    });

    // Feature cards animation
    gsap.fromTo(featureCardsRef.current, 
      { 
        opacity: 0, 
        y: 100,
        rotationX: -45
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 1.2,
        stagger: 0.3,
        scrollTrigger: {
          trigger: '.features',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
    
    // Section title animations
    gsap.fromTo('.section-title', 
      { opacity: 0, y: 80, skewY: 5 },
      {
        opacity: 1,
        y: 0,
        skewY: 0,
        duration: 1.2,
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.section-title',
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      }
    );
    
    // Stats counter animation
    gsap.fromTo(statsRefs.current, 
      { 
        opacity: 0, 
        y: 50,
        scale: 0.8 
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.stats',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
    
    // Use cases animation
    gsap.fromTo(useCasesRef.current, 
      { 
        opacity: 0, 
        x: -100,
        rotationZ: -5 
      },
      {
        opacity: 1,
        x: 0,
        rotationZ: 0,
        duration: 1.1,
        stagger: 0.25,
        scrollTrigger: {
          trigger: '.use-cases',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
    
    // CTA section animation
    gsap.fromTo(ctaRef.current, 
      { 
        opacity: 0, 
        y: 80,
        scale: 0.95 
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.3,
        scrollTrigger: {
          trigger: '.cta',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
    
    // Interactive map animation
    gsap.fromTo('.interactive-map', 
      { 
        opacity: 0, 
        y: 100,
        rotationX: 15 
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 1.4,
        scrollTrigger: {
          trigger: '.interactive-map',
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      }
    );
    
    // Clean up ScrollTrigger on component unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: element,
        ease: "power2.inOut"
      });
    }
  };

  // Counter animation
  const animateCounters = () => {
    if (countersAnimated) return;
    
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
      const suffix = counter.textContent.replace(/[\d\.\,]/g, '');
      
      gsap.to(counter, {
        innerText: target,
        duration: 3,
        snap: { innerText: 1 },
        stagger: 0.5,
        onUpdate: function() {
          counter.textContent = Math.floor(this.targets()[0].innerText) + suffix;
        },
        ease: "elastic.out(1, 0.3)"
      });
    });
    
    setCountersAnimated(true);
  };

  // Intersection Observer for counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounters();
          }
        });
      },
      { threshold: 0.5, rootMargin: '0px 0px -100px 0px' }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [countersAnimated]);

  // Enhanced floating particles effect with hydrogen theme
  useEffect(() => {
    const createFloatingParticle = () => {
      const particle = document.createElement('div');
      const size = Math.random() * 8 + 4;
      particle.classList.add('floating-particle');
      particle.style.position = 'fixed';
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.background = 'radial-gradient(circle, var(--accent-mint) 0%, var(--accent-aqua) 70%, transparent 100%)';
      particle.style.borderRadius = '50%';
      particle.style.left = Math.random() * window.innerWidth + 'px';
      particle.style.top = window.innerHeight + 50 + 'px';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '1';
      particle.style.boxShadow = '0 0 15px 3px rgba(144, 238, 144, 0.7)';
      particle.style.opacity = '0';
      
      document.getElementById('particle-container').appendChild(particle);
      
      gsap.to(particle, {
        y: -window.innerHeight - 100,
        x: `+=${(Math.random() - 0.5) * 200}`,
        rotation: Math.random() * 360,
        opacity: 0.8,
        duration: Math.random() * 10 + 10,
        ease: "none",
        onComplete: () => {
          if (particle.parentNode) particle.remove();
        }
      });
    };

    const interval = setInterval(createFloatingParticle, 300);
    return () => clearInterval(interval);
  }, []);

  const toggleMapView = () => {
    setMapExpanded(!mapExpanded);
    if (!mapExpanded) {
      // Animate map expansion
      gsap.to('.interactive-map', {
        height: 500,
        duration: 1,
        ease: "power2.inOut"
      });
    } else {
      // Animate map contraction
      gsap.to('.interactive-map', {
        height: 300,
        duration: 1,
        ease: "power2.inOut"
      });
    }
  };

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
    
    // GSAP animation for button click
    gsap.to(button, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
      onComplete: () => {
        navigate('/auth');
      }
    });
    
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
          --glow-primary: 0 0 20px rgba(39, 174, 96, 0.6);
          --glow-secondary: 0 0 15px rgba(45, 156, 219, 0.5);
          --gradient-overlay: linear-gradient(135deg, rgba(8, 28, 21, 0.9) 0%, rgba(27, 67, 50, 0.7) 100%);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: var(--primary-dark);
          color: var(--text-light);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          overflow-x: hidden;
        }

        #particle-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .floating-particle {
          position: absolute;
          border-radius: 50%;
          z-index: 1;
        }

        .bg-animation {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          opacity: 0.1;
          background: 
            radial-gradient(circle at 20% 50%, var(--accent-aqua) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, var(--accent-green) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, var(--accent-teal) 0%, transparent 50%);
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
          position: relative;
          overflow: hidden;
          padding: 70px 0 50px;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            linear-gradient(
              90deg, 
              var(--primary-dark) 0%, 
              transparent 40%
            ),
            url('/images/hero_Image.webp') no-repeat right center;
          background-size: cover;
          z-index: -2;
          transform: scale(1.1);
          transition: transform 10s ease;
        }

        .hero:hover::before {
          transform: scale(1.05);
        }

        .hero::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--gradient-overlay);
          z-index: -1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 600px;
          backdrop-filter: blur(5px);
          padding: 2rem;
          border-radius: 20px;
          background: rgba(8, 28, 21, 0.3);
          border: 1px solid rgba(39, 174, 96, 0.2);
        }

        .hero-content h1 {
          font-size: 3.5rem;
          font-weight: 800;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          text-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .hero-content p {
          font-size: 1.2rem;
          color: var(--text-muted);
          margin-bottom: 2rem;
          line-height: 1.7;
        }

        .btn-primary-custom {
          background: var(--gradient-primary);
          border: none;
          padding: 16px 45px;
          font-weight: 600;
          font-size: 1.1rem;
          border-radius: 50px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          transition: all 0.4s ease;
          box-shadow: var(--glow-primary);
          position: relative;
          overflow: hidden;
          color: var(--text-light);
          transform: translateY(0);
        }

        .btn-primary-custom:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(39, 174, 96, 0.6);
          color: var(--text-light);
        }

        .btn-outline-success-custom {
          border: 2px solid var(--accent-teal);
          color: var(--accent-teal);
          background: transparent;
          padding: 14px 35px;
          border-radius: 50px;
          font-weight: 600;
          letter-spacing: 1.5px;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-outline-success-custom:hover {
          background: var(--accent-teal);
          color: var(--primary-dark);
          box-shadow: var(--glow-secondary);
          transform: translateY(-3px);
        }

        .hero-visual {
          position: relative;
          z-index: 2;
          perspective: 1000px;
        }

        .map-preview {
          width: 100%;
          height: 400px;
          background: var(--secondary-dark);
          border-radius: 20px;
          border: 2px solid rgba(39, 174, 96, 0.3);
          position: relative;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
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
            var(--accent-teal),
            var(--accent-green),
            var(--accent-mint),
            var(--accent-aqua),
            var(--accent-teal)
          );
          border-radius: 50%;
          filter: blur(15px) opacity(0.7);
          transform-style: preserve-3d;
          animation: hydrogenGlow 4s ease-in-out infinite;
        }

        @keyframes hydrogenGlow {
          0%, 100% { 
            filter: blur(15px) opacity(0.7);
            transform: translate(-50%, -50%) scale(1);
          }
          50% { 
            filter: blur(25px) opacity(0.9);
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        .electron {
          position: absolute;
          width: 20px;
          height: 20px;
          background: radial-gradient(circle, var(--accent-mint) 0%, transparent 70%);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform-origin: 100px;
        }

        .electron:nth-child(1) { 
          animation: orbitElectron1 6s linear infinite;
          transform: rotate(0deg) translateX(100px) rotate(0deg);
        }
        
        .electron:nth-child(2) { 
          animation: orbitElectron2 8s linear infinite;
          transform: rotate(120deg) translateX(100px) rotate(-120deg);
        }
        
        .electron:nth-child(3) { 
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

        .map-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 10;
        }

        .pulse-dot {
          width: 15px;
          height: 15px;
          background: var(--accent-teal);
          border-radius: 50%;
          position: absolute;
          animation: pulse 2s infinite;
          box-shadow: 0 0 0 0 rgba(45, 156, 219, 0.7);
        }

        .pulse-dot:nth-child(1) { top: 30%; left: 20%; animation-delay: 0s; }
        .pulse-dot:nth-child(2) { top: 60%; left: 70%; animation-delay: 0.7s; }
        .pulse-dot:nth-child(3) { top: 80%; left: 40%; animation-delay: 1.4s; }

        @keyframes pulse {
          0% { 
            transform: scale(1); 
            box-shadow: 0 0 0 0 rgba(45, 156, 219, 0.7); 
          }
          70% { 
            transform: scale(1.3); 
            box-shadow: 0 0 0 15px rgba(45, 156, 219, 0); 
          }
          100% { 
            transform: scale(1); 
            box-shadow: 0 0 0 0 rgba(45, 156, 219, 0); 
          }
        }

        .features {
          padding: 120px 0;
          background: var(--secondary-dark);
          position: relative;
          overflow: hidden;
        }

        .features::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(39, 174, 96, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(45, 156, 219, 0.1) 0%, transparent 50%);
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
          font-size: 1.3rem;
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto;
        }

        .feature-card {
          background: rgba(27, 67, 50, 0.8);
          border: 1px solid rgba(39, 174, 96, 0.3);
          border-radius: 20px;
          padding: 40px 30px;
          text-align: center;
          transition: all 0.4s ease;
          height: 100%;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(39, 174, 96, 0.15) 0%, rgba(45, 156, 219, 0.15) 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: -1;
        }

        .feature-card:hover {
          transform: translateY(-15px) rotateX(5deg);
          border-color: var(--accent-green);
          box-shadow: 0 25px 50px rgba(39, 174, 96, 0.2);
        }

        .feature-card:hover::before {
          opacity: 1;
        }

        .feature-icon {
          font-size: 3.5rem;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1.5rem;
          display: block;
          transition: all 0.4s ease;
          filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.2));
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.2) rotate(10deg);
        }

        .feature-title {
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text-light);
          position: relative;
        }

        .feature-desc {
          color: var(--text-muted);
          line-height: 1.8;
          font-size: 1.05rem;
        }

        .stats {
          padding: 100px 0;
          background: var(--primary-dark);
          position: relative;
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

        .stat-number {
          font-size: 4rem;
          font-weight: 900;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
          line-height: 1;
          margin-bottom: 0.5rem;
          text-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .stat-label {
          color: var(--text-muted);
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 600;
        }

        .use-cases {
          padding: 120px 0;
          background: var(--secondary-dark);
          position: relative;
        }

        .use-case-item {
          background: rgba(8, 28, 21, 0.7);
          border-left: 5px solid var(--accent-teal);
          padding: 35px 30px;
          margin-bottom: 30px;
          border-radius: 0 20px 20px 0;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(5px);
        }

        .use-case-item:hover {
          background: rgba(8, 28, 21, 0.9);
          transform: translateX(15px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
        }

        .use-case-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(45, 156, 219, 0.3), transparent);
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
          transition: all 0.4s ease;
          display: inline-block;
        }

        .use-case-item:hover .use-case-icon {
          transform: scale(1.3);
        }

        .use-case-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 0.8rem;
          color: var(--text-light);
        }

        .use-case-desc {
          color: var(--text-muted);
          line-height: 1.7;
        }

        

        .cta {
          padding: 120px 0;
          background: linear-gradient(135deg, rgba(39, 174, 96, 0.2) 0%, rgba(45, 156, 219, 0.2) 100%);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="%2320B2AA" opacity="0.2"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
          z-index: -1;
        }

        .cta h2 {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cta p {
          font-size: 1.3rem;
          color: var(--text-muted);
          margin-bottom: 3rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .wave-divider {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
          transform: rotate(180deg);
        }

        .wave-divider svg {
          position: relative;
          display: block;
          width: calc(100% + 1.3px);
          height: 60px;
        }

        .wave-divider .shape-fill {
          fill: var(--primary-dark);
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

        .d-flex {
          display: flex;
        }

        .align-items-center {
          align-items: center;
        }

        .justify-content-center {
          justify-content: center;
        }

        .justify-content-between {
          justify-content: space-between;
        }

        .gap-3 {
          gap: 1rem;
        }

        .flex-wrap {
          flex-wrap: wrap;
        }

        .text-center {
          text-align: center;
        }

        .text-md-end {
          text-align: right;
        }

        .mb-3 { margin-bottom: 1rem; }
        .mb-5 { margin-bottom: 3rem; }
        .me-2 { margin-right: 0.5rem; }
        .me-3 { margin-right: 1rem; }
        .mt-3 { margin-top: 1rem; }

        .text-success { color: var(--accent-green) !important; }
        .text-muted { color: var(--text-muted) !important; }
        .text-light { color: var(--text-light) !important; }

        .badge {
          display: inline-block;
          padding: 0.35em 0.65em;
          font-size: 0.75em;
          font-weight: 700;
          line-height: 1;
          text-align: center;
          white-space: nowrap;
          vertical-align: baseline;
          border-radius: 0.25rem;
        }

        .bg-success {
          background: var(--gradient-primary) !important;
          color: var(--text-light) !important;
        }

        .bg-dark {
          background-color: var(--secondary-dark) !important;
        }

        .border-success {
          border-color: var(--accent-green) !important;
        }

        .card {
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.125);
        }

        .progress {
          display: flex;
          height: 1rem;
          overflow: hidden;
          font-size: 0.75rem;
          background-color: var(--secondary-dark);
          border-radius: 0.5rem;
        }

        .progress-bar {
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          color: #fff;
          text-align: center;
          white-space: nowrap;
          transition: width 0.6s ease;
          background: var(--gradient-primary);
          border-radius: 0.5rem;
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

        @media (max-width: 768px) {
          .hero-content h1 { font-size: 2.5rem; }
          .hero-content p { font-size: 1.1rem; }
          .section-title h2 { font-size: 2.5rem; }
          .stat-number { font-size: 3rem; }
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
            background: 
              linear-gradient(
                to bottom, 
                var(--primary-dark) 0%, 
                transparent 30%
              ),
              url('/images/hero_Image.webp') no-repeat center center;
            background-size: cover;
          }
        }

        @media (max-width: 576px) {
          .hero-content h1 {
            font-size: 2.2rem;
          }
          
          .btn-primary-custom, .btn-outline-success-custom {
            padding: 12px 25px;
            font-size: 0.9rem;
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
        }
          
        .interactive-map-section {
          padding: 100px 0;
          background: var(--primary-dark);
          position: relative;
        }

        .interactive-map {
          background: var(--secondary-dark);
          border-radius: 20px;
          padding: 0;
          margin: 50px 0;
          border: 2px solid rgba(39, 174, 96, 0.3);
          position: relative;
          height: ${mapExpanded ? '500px' : '300px'};
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .interactive-map:hover {
          border-color: var(--accent-teal);
          box-shadow: var(--glow-secondary);
        }

        .map-container {
          width: 100%;
          height: 100%;
          border-radius: 18px;
          overflow: hidden;
          position: relative;
        }

        .hydrogen-marker {
          background: radial-gradient(circle, var(--accent-mint) 0%, var(--accent-teal) 100%);
          border-radius: 50%;
          box-shadow: 0 0 15px var(--accent-green);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
        }

        .map-expand-btn {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: var(--gradient-primary);
          border: none;
          color: white;
          padding: 10px 20px;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          z-index: 1000;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .map-expand-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .map-overlay-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 10;
          color: white;
        }
      `}</style>

      <div className="bg-animation"></div>
      <div id="particle-container"></div>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="hero-content" ref={heroContentRef}>
                <h1>Green Hydrogen Infrastructure Mapping & Optimization</h1>
                <p>Visualize, analyze, and optimize hydrogen ecosystem development with our cutting-edge map-based platform. Drive strategic investments with data-driven insights for a sustainable energy future.</p>
                <div className="d-flex gap-3 flex-wrap">
                  <button 
                    className="btn btn-primary-custom"
                    onClick={handleButtonClick}
                  >
                    <i className="fas fa-map-marked-alt me-2"></i>Explore Platform
                  </button>
                  <button 
                    className="btn btn-outline-success-custom"
                    onClick={handleButtonClick}
                  >
                    <i className="fas fa-play me-2"></i>Watch Demo
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-visual" ref={heroVisualRef}>
                <div className="map-preview">
                  <div className="hydrogen-3d-model" ref={threeDModelRef}>
                    <div className="electron"></div>
                    <div className="electron"></div>
                    <div className="electron"></div>
                  </div>
                  <div className="pulse-dot"></div>
                  <div className="pulse-dot"></div>
                  <div className="pulse-dot"></div>
                  <div className="map-overlay">
                    <i className="fas fa-globe-americas fa-3x text-success mb-3"></i>
                    <h4 className="text-light">Interactive Infrastructure Map</h4>
                    <p className="text-muted">Real-time visualization of hydrogen assets</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="wave-divider">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
        </div>
        <div className="container">
          <div className="section-title" ref={sectionTitleRef}>
            <h2>Powerful Features</h2>
            <p>Advanced tools for hydrogen infrastructure planning and optimization</p>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="feature-card" ref={el => featureCardsRef.current[0] = el}>
                <i className="fas fa-network-wired feature-icon"></i>
                <h3 className="feature-title">Network Planning</h3>
                <p className="feature-desc">Plan and optimize hydrogen distribution networks to minimize costs while maximizing coverage and efficiency.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card" ref={el => featureCardsRef.current[1] = el}>
                <i className="fas fa-shield-alt feature-icon"></i>
                <h3 className="feature-title">Regulatory Intelligence</h3>
                <p className="feature-desc">Navigate complex regulatory landscapes with integrated policy data and compliance tracking across different jurisdictions.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card" ref={el => featureCardsRef.current[2] = el}>
                <i className="fas fa-chart-line feature-icon"></i>
                <h3 className="feature-title">Economic Analysis</h3>
                <p className="feature-desc">Evaluate project viability with comprehensive cost-benefit analysis and ROI projections based on real-time market data.</p>
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
              <div className="stat-item" ref={el => statsRefs.current[0] = el}>
                <span className="stat-number">500+</span>
                <div className="stat-label">Mapped Assets</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item" ref={el => statsRefs.current[1] = el}>
                <span className="stat-number">$2.5B</span>
                <div className="stat-label">Investment Optimized</div>
              </div>
            </div>
            <div className="col-md-3">
            <div className="stat-item" ref={el => statsRefs.current[2] = el}>
                <span className="stat-number">15</span>
                <div className="stat-label">Countries Covered</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item" ref={el => statsRefs.current[3] = el}>
                <span className="stat-number">95%</span>
                <div className="stat-label">Cost Reduction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="users" className="use-cases">
        <div className="wave-divider">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
        </div>
        <div className="container">
          <div className="section-title">
            <h2>Who Uses HydroMap Pro</h2>
            <p>Empowering key stakeholders in the hydrogen economy</p>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="use-case-item" ref={el => useCasesRef.current[0] = el}>
                <i className="fas fa-city use-case-icon"></i>
                <h4 className="use-case-title">Urban & Regional Planners</h4>
                <p className="use-case-desc">Plan sustainable hydrogen infrastructure integration into existing urban frameworks and regional development strategies.</p>
              </div>
              <div className="use-case-item" ref={el => useCasesRef.current[1] = el}>
                <i className="fas fa-bolt use-case-icon"></i>
                <h4 className="use-case-title">Energy Companies</h4>
                <p className="use-case-desc">Identify optimal locations for hydrogen production, storage, and distribution to maximize operational efficiency and market reach.</p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="use-case-item" ref={el => useCasesRef.current[2] = el}>
                <i className="fas fa-hammer use-case-icon"></i>
                <h4 className="use-case-title">Project Developers</h4>
                <p className="use-case-desc">Accelerate project development with comprehensive site analysis, risk assessment, and stakeholder mapping tools.</p>
              </div>
              <div className="use-case-item" ref={el => useCasesRef.current[3] = el}>
                <i className="fas fa-balance-scale use-case-icon"></i>
                <h4 className="use-case-title">Policy Analysts</h4>
                <p className="use-case-desc">Support evidence-based policy development with detailed infrastructure analysis and economic impact modeling.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section id="demo" className="interactive-map-section">
        <div className="container">
          <div className="section-title">
            <h2>Experience the Platform</h2>
            <p>Interactive preview of our hydrogen infrastructure mapping capabilities</p>
          </div>
          <div className="interactive-map">
            <div className="map-container" ref={mapContainerRef}>
              {!mapExpanded && (
                <div className="map-overlay-content">
                  <i className="fas fa-play-circle fa-4x text-success mb-3"></i>
                  <h4>Interactive Map Demo</h4>
                  <p>Click to explore hydrogen infrastructure mapping</p>
                </div>
              )}
            </div>
            <button className="map-expand-btn" onClick={toggleMapView}>
              <i className={`fas fa-${mapExpanded ? 'compress' : 'expand'} me-2`}></i>
              {mapExpanded ? 'Minimize Map' : 'Expand Map'}
            </button>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="stats">
        <div className="container">
          <div className="section-title text-center mb-5">
            <h2 className="text-light">Transformative Impact</h2>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="card card-dark text-center h-100" style={{padding: '2rem'}}>
                <i className="fas fa-bullseye fa-3x text-success mb-3"></i>
                <h4 className="text-light">Strategic Investment</h4>
                <p className="text-muted">Direct capital to high-impact, high-yield infrastructure projects with precision targeting and risk assessment.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card card-dark text-center h-100" style={{padding: '2rem'}}>
                <i className="fas fa-recycle fa-3x text-success mb-3"></i>
                <h4 className="text-light">Efficient Resource Use</h4>
                <p className="text-muted">Avoid redundant investments and minimize costs and land use through intelligent infrastructure coordination.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card card-dark text-center h-100" style={{padding: '2rem'}}>
                <i className="fas fa-leaf fa-3x text-success mb-3"></i>
                <h4 className="text-light">Net Zero Goals</h4>
                <p className="text-muted">Facilitate coordinated growth of hydrogen networks supporting ambitious net zero climate targets.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div ref={ctaRef}>
            <h2 className="glow-text">Ready to Transform Hydrogen Infrastructure Planning?</h2>
            <p>Join leading organizations already using HydroMap Pro to build the hydrogen economy of tomorrow.</p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <button 
                className="btn btn-primary-custom"
                style={{fontSize: '1.125rem', padding: '15px 40px'}}
                onClick={handleButtonClick}
              >
                <i className="fas fa-rocket me-2"></i>Start Free Trial
              </button>
              <button 
                className="btn btn-outline-success-custom"
                style={{fontSize: '1.125rem', padding: '15px 40px'}}
                onClick={handleButtonClick}
              >
                <i className="fas fa-calendar me-2"></i>Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;