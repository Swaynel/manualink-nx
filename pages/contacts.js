import { useState } from 'react';
import Head from 'next/head';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 2000);
  };

  return (
    <>
      <Head>
        <title>Contact Us - ManuaLink</title>
        <meta
          name="description"
          content="Get in touch with ManuaLink for support, questions, or partnership opportunities."
        />
      </Head>

      <div className="section-padding bg-gray-50 min-h-screen">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-2">Contact Us</h1>
            <p className="text-gray-600 text-center mb-8">
              We&apos;d love to hear from you. Get in touch with our team.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Get In Touch</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <i className="fas fa-map-marker-alt text-blue-600"></i>
                    </div>
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-gray-600">Embakasi, Nairobi, Kenya</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <i className="fas fa-phone text-blue-600"></i>
                    </div>
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-gray-600">+254108091783</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <i className="fas fa-envelope text-blue-600"></i>
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600">info@manualink.co.ke</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <i className="fas fa-clock text-blue-600"></i>
                    </div>
                    <div>
                      <h3 className="font-medium">Working Hours</h3>
                      <p className="text-gray-600">Mon - Fri: 8:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Sat: 9:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                      <i className="fab fa-facebook-f text-xl"></i>
                    </a>
                    <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                      <i className="fab fa-twitter text-xl"></i>
                    </a>
                    <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                      <i className="fab fa-instagram text-xl"></i>
                    </a>
                    <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                      <i className="fab fa-linkedin-in text-xl"></i>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Send us a Message</h2>
                
                {submitStatus === 'success' && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    <p>Thank you for your message! We&apos;ll get back to you soon.</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="form-input"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading-spinner mr-2"></span>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>
            </div>
            
            {/* FAQ Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold mb-2">How do I create an account?</h3>
                  <p className="text-gray-600">Click on the Register button at the top right corner and fill in your details. You can register as either a worker or employer.</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold mb-2">How do payments work?</h3>
                  <p className="text-gray-600">Payments are arranged directly between workers and employers. We recommend using secure methods like M-Pesa for transactions.</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold mb-2">Is there a fee for using ManuaLink?</h3>
                  <p className="text-gray-600">Creating an account and browsing jobs is free. We may charge a small commission for premium features in the future.</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold mb-2">How do I report an issue?</h3>
                  <p className="text-gray-600">You can report any issues through this contact form or email us directly at support@manualink.co.ke.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
