import React, { useState } from 'react';

const Machinery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(new Set());

  const machineryData = [
    {
      id: 1,
      name: "HydroPro Elite 5000",
      category: "electrolyzer",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
      price: "$2,850,000",
      rating: 4.8,
      reviews: 124,
      power: "5 MW",
      efficiency: "78%",
      capacity: "1000 kg/day",
      description: "Advanced PEM electrolyzer with highest efficiency rating in its class. Perfect for industrial-scale hydrogen production.",
      features: ["Smart Grid Integration", "Remote Monitoring", "Auto-Optimization", "99.9% Uptime"],
      manufacturer: "HydroTech Solutions",
      warranty: "10 years"
    },
    {
      id: 2,
      name: "GreenFlow Compressor X7",
      category: "compressor",
      image: "https://images.unsplash.com/photo-1562408590-e32931084e23?w=400&h=300&fit=crop",
      price: "$485,000",
      rating: 4.6,
      reviews: 89,
      power: "250 kW",
      efficiency: "92%",
      capacity: "350 bar",
      description: "High-pressure hydrogen compressor designed for storage and transport applications with exceptional reliability.",
      features: ["Leak-Free Design", "Energy Recovery", "Smart Controls", "Low Maintenance"],
      manufacturer: "CompressTech Industries",
      warranty: "5 years"
    },
    {
      id: 3,
      name: "HydroStore Tank Pro 2000",
      category: "storage",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      price: "$320,000",
      rating: 4.9,
      reviews: 156,
      power: "N/A",
      efficiency: "99.8%",
      capacity: "2000 kg",
      description: "Ultra-safe composite hydrogen storage tank with advanced monitoring systems and leak detection.",
      features: ["Composite Material", "Pressure Monitoring", "Safety Sensors", "Modular Design"],
      manufacturer: "SafeStore Systems",
      warranty: "15 years"
    },
    {
      id: 4,
      name: "EcoCell Fuel Generator 850",
      category: "fuel-cell",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop",
      price: "$1,250,000",
      rating: 4.7,
      reviews: 67,
      power: "850 kW",
      efficiency: "65%",
      capacity: "24/7 Operation",
      description: "Commercial-grade fuel cell system for clean electricity generation from hydrogen with backup capabilities.",
      features: ["Zero Emissions", "Silent Operation", "Grid Backup", "Modular Stack"],
      manufacturer: "EcoPower Dynamics",
      warranty: "8 years"
    },
    {
      id: 5,
      name: "PurifyMax H2 Cleaner",
      category: "purification",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop",
      price: "$180,000",
      rating: 4.5,
      reviews: 43,
      power: "50 kW",
      efficiency: "99.99%",
      capacity: "500 kg/day",
      description: "Advanced hydrogen purification system ensuring 99.99% purity for critical applications.",
      features: ["Multi-Stage Filtration", "Real-time Analysis", "Automated Cleaning", "Compact Design"],
      manufacturer: "PureTech Solutions",
      warranty: "7 years"
    },
    {
      id: 6,
      name: "FlowMaster Distribution Hub",
      category: "distribution",
      image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=300&fit=crop",
      price: "$750,000",
      rating: 4.4,
      reviews: 91,
      power: "100 kW",
      efficiency: "96%",
      capacity: "Multi-Point",
      description: "Intelligent hydrogen distribution system with automated flow control and safety management.",
      features: ["Smart Routing", "Pressure Control", "Safety Interlocks", "Remote Access"],
      manufacturer: "FlowTech Engineering",
      warranty: "6 years"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Equipment', icon: 'fas fa-cogs' },
    { id: 'electrolyzer', name: 'Electrolyzers', icon: 'fas fa-bolt' },
    { id: 'compressor', name: 'Compressors', icon: 'fas fa-tachometer-alt' },
    { id: 'storage', name: 'Storage', icon: 'fas fa-database' },
    { id: 'fuel-cell', name: 'Fuel Cells', icon: 'fas fa-battery-three-quarters' },
    { id: 'purification', name: 'Purification', icon: 'fas fa-filter' },
    { id: 'distribution', name: 'Distribution', icon: 'fas fa-share-alt' }
  ];

  const filteredMachinery = machineryData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  return (
    <div>
      <style>{`
        :root {
          --color-light-green: #DDF4E7;
          --color-medium-green: #67C090;
          --color-teal: #26667F;
          --color-dark-blue: #124170;
        }

        body {
          background-color: var(--color-light-green);
        }

        .hero-section {
          background: linear-gradient(135deg, var(--color-dark-blue) 0%, var(--color-teal) 100%);
          position: relative;
          overflow: hidden;
          min-height: 70vh;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 80%, var(--color-medium-green) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
          opacity: 0.3;
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 700;
          color: white;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .hero-subtitle {
          font-size: 1.5rem;
          color: rgba(255,255,255,0.9);
        }

        .btn-primary-custom {
          background-color: var(--color-medium-green);
          border: none;
          color: var(--color-dark-blue);
          font-weight: 600;
          padding: 12px 32px;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .btn-primary-custom:hover {
          background-color: var(--color-medium-green);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(103, 192, 144, 0.3);
        }

        .btn-outline-custom {
          background-color: transparent;
          border: 2px solid var(--color-medium-green);
          color: var(--color-medium-green);
          font-weight: 600;
          padding: 12px 32px;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .btn-outline-custom:hover {
          background-color: white;
          color: var(--color-teal);
          transform: translateY(-2px);
        }

        .search-input {
          border: 2px solid var(--color-medium-green);
          border-radius: 12px;
          padding: 12px 20px 12px 50px;
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--color-teal);
          box-shadow: 0 0 0 3px rgba(38, 102, 127, 0.1);
        }

        .search-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          z-index: 10;
        }

        .category-btn {
          border: 2px solid var(--color-medium-green);
          background-color: white;
          color: var(--color-teal);
          border-radius: 10px;
          padding: 10px 20px;
          margin: 5px;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .category-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .category-btn.active {
          background-color: var(--color-teal);
          color: white;
          border-color: var(--color-teal);
        }

        .machinery-card {
          background: white;
          border: 3px solid var(--color-medium-green);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s ease;
          height: 100%;
        }

        .machinery-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          border-color: var(--color-teal);
        }

        .card-image {
          height: 200px;
          object-fit: cover;
          width: 100%;
        }

        .price-tag {
          color: var(--color-teal);
          font-size: 1.5rem;
          font-weight: 700;
        }

        .rating-stars {
          color: #ffc107;
        }

        .spec-badge {
          background-color: var(--color-light-green);
          color: var(--color-dark-blue);
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          text-align: center;
        }

        .feature-tag {
          background-color: var(--color-medium-green);
          color: white;
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 0.8rem;
          margin: 2px;
          display: inline-block;
        }

        .btn-cart {
          background-color: var(--color-teal);
          border: none;
          color: white;
          border-radius: 8px;
          padding: 10px;
          transition: all 0.3s ease;
        }

        .btn-cart:hover {
          background-color: var(--color-dark-blue);
          transform: translateY(-1px);
        }

        .btn-quote {
          background-color: var(--color-medium-green);
          border: none;
          color: white;
          border-radius: 8px;
          padding: 10px;
          transition: all 0.3s ease;
        }

        .btn-quote:hover {
          background-color: var(--color-teal);
          transform: translateY(-1px);
        }

        .favorite-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .favorite-btn:hover {
          transform: scale(1.1);
        }

        .favorite-btn.active {
          color: #dc3545;
        }

        .category-badge {
          position: absolute;
          bottom: 15px;
          left: 15px;
          background-color: var(--color-teal);
          color: white;
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .stats-card {
          background: white;
          border: 2px solid var(--color-medium-green);
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          height: 100%;
        }

        .stats-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .stats-icon {
          color: var(--color-teal);
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .stats-number {
          color: var(--color-dark-blue);
          font-size: 2.5rem;
          font-weight: 700;
        }

        .cta-section {
          background-color: var(--color-medium-green);
          padding: 5rem 0;
        }

        .features-section {
          background: white;
          padding: 5rem 0;
        }

        .feature-icon {
          background-color: var(--color-light-green);
          color: var(--color-teal);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin: 0 auto 1.5rem;
          transition: all 0.3s ease;
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.1);
          background-color: var(--color-medium-green);
          color: white;
        }

        .section-title {
          color: var(--color-dark-blue);
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .highlight-text {
          color: var(--color-medium-green);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          .hero-subtitle {
            font-size: 1.2rem;
          }
        }
      `}</style>

      <div>
        {/* Bootstrap CSS Link */}
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
          rel="stylesheet" 
        />
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          rel="stylesheet" 
        />

        {/* Hero Section */}
        <section className="hero-section d-flex align-items-center">
          <div className="container hero-content">
            <div className="row justify-content-center text-center">
              <div className="col-lg-10">
                <h1 className="hero-title mb-4">
                  Green Hydrogen <span className="highlight-text">Machinery</span>
                </h1>
                <p className="hero-subtitle mb-5">
                  Discover cutting-edge equipment for sustainable hydrogen production, storage, and distribution
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <button className="btn btn-primary-custom btn-lg">
                    <i className="fas fa-search me-2"></i>
                    Explore Equipment
                  </button>
                  <button className="btn btn-outline-custom btn-lg">
                    <i className="fas fa-calculator me-2"></i>
                    Get Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-5">
          <div className="container">
            <div className="row mb-4">
              <div className="col-lg-6 mb-3">
                <div className="search-wrapper">
                  <i className="fas fa-search search-icon"></i>
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Search machinery..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="d-flex flex-wrap justify-content-end">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    >
                      <i className={`${category.icon} me-2`}></i>
                      <span className="d-none d-sm-inline">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-5">
          <div className="container">
            <div className="row g-4">
              {[
                { label: "Equipment Available", value: "150+", icon: "fas fa-cogs" },
                { label: "Satisfied Customers", value: "500+", icon: "fas fa-award" },
                { label: "Countries Served", value: "25+", icon: "fas fa-globe" },
                { label: "Years Experience", value: "15+", icon: "fas fa-chart-line" }
              ].map((stat, index) => (
                <div key={index} className="col-6 col-md-3">
                  <div className="stats-card">
                    <i className={`${stat.icon} stats-icon`}></i>
                    <div className="stats-number">{stat.value}</div>
                    <div className="text-muted">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Machinery Grid */}
        <section className="py-5">
          <div className="container">
            <div className="row g-4">
              {filteredMachinery.map((machine) => (
                <div key={machine.id} className="col-md-6 col-lg-4">
                  <div className="machinery-card">
                    {/* Image Section */}
                    <div className="position-relative">
                      <img
                        src={machine.image}
                        alt={machine.name}
                        className="card-image"
                      />
                      <button
                        onClick={() => toggleFavorite(machine.id)}
                        className={`favorite-btn ${favorites.has(machine.id) ? 'active' : ''}`}
                      >
                        <i className={`fas fa-heart ${favorites.has(machine.id) ? 'text-danger' : 'text-muted'}`}></i>
                      </button>
                      <div className="category-badge">
                        {categories.find(c => c.id === machine.category)?.name || 'Equipment'}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="fw-bold mb-0" style={{color: 'var(--color-dark-blue)'}}>
                          {machine.name}
                        </h5>
                        <div className="price-tag">{machine.price}</div>
                      </div>

                      {/* Rating */}
                      <div className="d-flex align-items-center mb-3">
                        <div className="rating-stars me-2">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fas fa-star ${i < Math.floor(machine.rating) ? '' : 'text-muted'}`}
                            ></i>
                          ))}
                        </div>
                        <small className="text-muted">
                          {machine.rating} ({machine.reviews} reviews)
                        </small>
                      </div>

                      {/* Specs */}
                      <div className="row g-2 mb-3">
                        <div className="col-4">
                          <div className="spec-badge">
                            <div className="small text-muted">Power</div>
                            <div>{machine.power}</div>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="spec-badge">
                            <div className="small text-muted">Efficiency</div>
                            <div>{machine.efficiency}</div>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="spec-badge">
                            <div className="small text-muted">Capacity</div>
                            <div className="small">{machine.capacity}</div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted small mb-3">
                        {machine.description}
                      </p>

                      {/* Features */}
                      <div className="mb-3">
                        <h6 className="fw-semibold mb-2" style={{color: 'var(--color-dark-blue)'}}>
                          Key Features:
                        </h6>
                        <div>
                          {machine.features.map((feature, index) => (
                            <span key={index} className="feature-tag">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Manufacturer Info */}
                      <div className="d-flex justify-content-between small text-muted mb-3">
                        <span>By {machine.manufacturer}</span>
                        <span>{machine.warranty} warranty</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex gap-2">
                        <button className="btn btn-cart flex-fill">
                          <i className="fas fa-shopping-cart me-2"></i>
                          Add to Cart
                        </button>
                        <button className="btn btn-quote">
                          <i className="fas fa-file-invoice-dollar"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results Message */}
            {filteredMachinery.length === 0 && (
              <div className="text-center py-5">
                <div style={{fontSize: '4rem'}} className="mb-4">🔍</div>
                <h3 className="mb-3" style={{color: 'var(--color-dark-blue)'}}>
                  No machinery found
                </h3>
                <p className="text-muted mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="btn btn-primary-custom"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="cta-section">
          <div className="container text-center text-white">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <h2 className="display-4 fw-bold mb-4">
                  Ready to Go Green?
                </h2>
                <p className="fs-5 mb-5 opacity-75">
                  Join thousands of companies worldwide in the transition to clean hydrogen energy. 
                  Our expert team is ready to help you find the perfect solution.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <button className="btn btn-lg" style={{backgroundColor: 'var(--color-dark-blue)', border: 'none', color: 'white', padding: '12px 32px', borderRadius: '12px'}}>
                    <i className="fas fa-calendar-check me-2"></i>
                    Schedule Consultation
                  </button>
                  <button className="btn btn-outline-light btn-lg" style={{borderRadius: '12px', padding: '12px 32px'}}>
                    <i className="fas fa-download me-2"></i>
                    Download Catalog
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="section-title">
                Why Choose Our Equipment?
              </h2>
              <p className="fs-5 text-muted col-lg-8 mx-auto">
                Leading the hydrogen revolution with cutting-edge technology, unmatched reliability, and comprehensive support.
              </p>
            </div>

            <div className="row g-5">
              {[
                {
                  icon: "fas fa-award",
                  title: "Industry Leading",
                  description: "Highest efficiency ratings and performance standards in the industry with proven track record."
                },
                {
                  icon: "fas fa-cogs",
                  title: "Complete Solutions",
                  description: "End-to-end hydrogen solutions from production to distribution with integrated support systems."
                },
                {
                  icon: "fas fa-microchip",
                  title: "Smart Technology",
                  description: "IoT-enabled equipment with remote monitoring, predictive maintenance, and automated optimization."
                }
              ].map((feature, index) => (
                <div key={index} className="col-md-4">
                  <div className="feature-card text-center">
                    <div className="feature-icon">
                      <i className={feature.icon}></i>
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{color: 'var(--color-dark-blue)'}}>
                      {feature.title}
                    </h3>
                    <p className="text-muted">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-5" style={{backgroundColor: 'var(--color-light-green)'}}>
          <div className="container text-center">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <h2 className="h1 fw-bold mb-4" style={{color: 'var(--color-dark-blue)'}}>
                  Need Custom Solutions?
                </h2>
                <p className="fs-5 text-muted mb-4">
                  Our engineering team can design and manufacture custom hydrogen equipment tailored to your specific requirements.
                </p>
                <button className="btn btn-lg" style={{backgroundColor: 'var(--color-teal)', border: 'none', color: 'white', padding: '12px 32px', borderRadius: '12px'}}>
                  <i className="fas fa-tools me-2"></i>
                  Contact Engineering Team
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Bootstrap JS */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
      </div>
    </div>
  );
};

export default Machinery;