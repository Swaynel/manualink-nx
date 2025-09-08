export default function Footer() {
  return (
    <footer className="footer" id="contact" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <h3>ManuaLink</h3>
            <p>Connecting skilled Kenyan workers with employers who need them. Our mission is to create opportunities and support Kenya's workforce.</p>
            <div className="social-icons">
              <a href="#" aria-label="Follow us on Facebook"><i className="fab fa-facebook"></i></a>
              <a href="#" aria-label="Follow us on Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="Contact us on WhatsApp"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>
          <div className="footer-links">
            <h3>For Workers</h3>
            <ul>
              <li><a href="#jobs">Browse Jobs</a></li>
              <li><a href="#profile">Worker Dashboard</a></li>
              <li><a href="#">Worker Resources</a></li>
              <li><a href="#">Safety Tips</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h3>For Employers</h3>
            <ul>
              <li><a href="#" className="open-post-job">Post a Job</a></li>
              <li><a href="#workers">Browse Workers</a></li>
              <li><a href="#profile">Employer Dashboard</a></li>
              <li><a href="#">Pricing</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p><i className="fas fa-map-marker-alt" aria-hidden="true"></i> Embakasi, Nairobi, Kenya</p>
            <p><i className="fas fa-phone" aria-hidden="true"></i> +254108091783</p>
            <p><i className="fas fa-envelope" aria-hidden="true"></i> info@manualink.co.ke</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 ManuaLink. All rights reserved.</p>
          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}