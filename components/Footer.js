export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200" id="contact" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">ManuaLink</h3>
            <p className="text-gray-400 mb-4">
              Connecting skilled Kenyan workers with employers who need them. Our mission is to create opportunities and support Kenya&apos;s workforce.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Follow us on Facebook" className="hover:text-white transition">
                <i className="fab fa-facebook fa-lg"></i>
              </a>
              <a href="#" aria-label="Follow us on Twitter" className="hover:text-white transition">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="#" aria-label="Contact us on WhatsApp" className="hover:text-white transition">
                <i className="fab fa-whatsapp fa-lg"></i>
              </a>
            </div>
          </div>

          {/* For Workers */}
          <div>
            <h3 className="text-xl font-bold mb-4">For Workers</h3>
            <ul className="space-y-2">
              <li><a href="#jobs" className="hover:text-white transition">Browse Jobs</a></li>
              <li><a href="#profile" className="hover:text-white transition">Worker Dashboard</a></li>
              <li><a href="#" className="hover:text-white transition">Worker Resources</a></li>
              <li><a href="#" className="hover:text-white transition">Safety Tips</a></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-xl font-bold mb-4">For Employers</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition open-post-job">Post a Job</a></li>
              <li><a href="#workers" className="hover:text-white transition">Browse Workers</a></li>
              <li><a href="#profile" className="hover:text-white transition">Employer Dashboard</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="flex items-center gap-2 mb-2">
              <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
              Embakasi, Nairobi, Kenya
            </p>
            <p className="flex items-center gap-2 mb-2">
              <i className="fas fa-phone" aria-hidden="true"></i>
              +254108091783
            </p>
            <p className="flex items-center gap-2">
              <i className="fas fa-envelope" aria-hidden="true"></i>
              info@manualink.co.ke
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© 2025 ManuaLink. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
