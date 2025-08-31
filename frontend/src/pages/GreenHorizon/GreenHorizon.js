import React, { useState, useEffect } from 'react';
import './GreenHorizon.css';

const GreenHorizon = () => {
  const [email, setEmail] = useState('');
  const [newsItems] = useState([
    {
      title: "World's Largest Green Hydrogen Plant Begins Operations in China",
      date: "October 15, 2023",
      excerpt: "A 150MW green hydrogen facility has started production in Xinjiang, capable of producing 23,000 tons of green hydrogen annually.",
      icon: "🌍"
    },
    {
      title: "EU Approves €5.4 Billion for Green Hydrogen Projects",
      date: "October 12, 2023",
      excerpt: "The European Union has approved massive funding to support 32 green hydrogen projects across member states.",
      icon: "💶"
    },
    {
      title: "New Electrolyzer Technology Boosts Efficiency by 40%",
      date: "October 10, 2023",
      excerpt: "Scientists at MIT have developed a new electrolyzer design that significantly improves the efficiency of green hydrogen production.",
      icon: "🔬"
    },
    // Add more news items as needed (truncated for brevity)
    {
      title: "New Analysis Shows Green Hydrogen Can Meet 24% of Global Energy Needs by 2050",
      date: "May 15, 2023",
      excerpt: "The Hydrogen Council report highlights the significant role hydrogen will play in the energy transition.",
      icon: "🔮"
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with ${email}! You'll receive our latest updates soon.`);
    setEmail('');
  };

  return (
    <div className="green-horizon">
      {/* Header */}
      <header className="gh-header">
        <nav className="gh-navbar">
          <div className="gh-logo">
            <span className="gh-logo-icon">⚡</span>
            <span className="gh-logo-text">Green Horizon</span>
          </div>
          <ul className="gh-nav-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">News</a></li>
            <li><a href="#">Technology</a></li>
            <li><a href="#">Projects</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="gh-hero">
        <h1>The Future is Green Hydrogen</h1>
        <p>Stay updated with the latest developments, innovations, and breakthroughs in green hydrogen technology and infrastructure worldwide.</p>
        <a href="#news" className="gh-cta-button">Explore Latest News</a>
      </section>

      {/* News Grid */}
      <section className="gh-news-container" id="news">
        <h2 className="gh-section-title">Latest Updates</h2>
        <div className="gh-news-grid">
          {newsItems.map((news, index) => (
            <div className="gh-news-card" key={index}>
              <div className="gh-card-img">{news.icon}</div>
              <div className="gh-card-content">
                <div className="gh-card-date">{news.date}</div>
                <h3 className="gh-card-title">{news.title}</h3>
                <p className="gh-card-excerpt">{news.excerpt}</p>
                <a href="#" className="gh-read-more">Read more →</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="gh-newsletter">
        <h2>Stay Informed</h2>
        <p>Subscribe to our newsletter for the latest updates on green hydrogen projects and industry insights.</p>
        <form className="gh-newsletter-form" onSubmit={handleSubmit}>
          <input 
            type="email" 
            className="gh-newsletter-input" 
            placeholder="Your email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <button type="submit" className="gh-newsletter-button">Subscribe</button>
        </form>
      </section>

      {/* Footer */}
      <footer className="gh-footer">
        <div className="gh-footer-content">
          <div className="gh-footer-column">
            <h3>Green Horizon News portal</h3>
            <p>Your trusted source for the latest green hydrogen news, technology updates, and industry analysis.</p>
            <div className="gh-social-icons">
              <a href="#" className="gh-social-icon">f</a>
              <a href="#" className="gh-social-icon">t</a>
              <a href="#" className="gh-social-icon">in</a>
              <a href="#" className="gh-social-icon">ig</a>
            </div>
          </div>
          <div className="gh-footer-column">
            <h3>Quick Links</h3>
            <ul className="gh-footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Technology</a></li>
              <li><a href="#">Projects</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="gh-footer-column">
            <h3>Categories</h3>
            <ul className="gh-footer-links">
              <li><a href="#">New Projects</a></li>
              <li><a href="#">Technology</a></li>
              <li><a href="#">Policy & Regulations</a></li>
              <li><a href="#">Investment</a></li>
              <li><a href="#">International News</a></li>
            </ul>
          </div>
          <div className="gh-footer-column">
            <h3>Contact Us</h3>
            <ul className="gh-footer-links">
              <li>123 Green Avenue</li>
              <li>Eco City, EC 12345</li>
              <li>info@greenhorizon.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="gh-copyright">
          <p>&copy; 2023 Green Horizon. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default GreenHorizon;