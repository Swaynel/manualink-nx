"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type SubmitStatus = "success" | null;

const initialFormData: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactsPage() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((currentValue) => ({
      ...currentValue,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData(initialFormData);

      window.setTimeout(() => setSubmitStatus(null), 5000);
    }, 2000);
  };

  return (
    <div className="section-padding min-h-screen bg-gray-50">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-2 text-center text-3xl font-bold">Contact Us</h1>
          <p className="mb-8 text-center text-gray-600">
            We&apos;d love to hear from you. Get in touch with our team.
          </p>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">Get In Touch</h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-4 rounded-full bg-blue-100 p-3">
                    <i className="fas fa-map-marker-alt text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-gray-600">Embakasi, Nairobi, Kenya</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 rounded-full bg-blue-100 p-3">
                    <i className="fas fa-phone text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-gray-600">+254108091783</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 rounded-full bg-blue-100 p-3">
                    <i className="fas fa-envelope text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">info@manualink.co.ke</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 rounded-full bg-blue-100 p-3">
                    <i className="fas fa-clock text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Working Hours</h3>
                    <p className="text-gray-600">Mon - Fri: 8:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Sat: 9:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-2 font-medium">Follow Us</h3>
                <div className="flex space-x-4">
                  {["facebook-f", "twitter", "instagram", "linkedin-in"].map((icon) => (
                    <a
                      key={icon}
                      href="#"
                      className="text-gray-600 transition-colors hover:text-blue-600"
                    >
                      <i className={`fab fa-${icon} text-xl`} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">Send us a Message</h2>

              {submitStatus === "success" && (
                <div className="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
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
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="mb-6 text-center text-2xl font-bold">
              Frequently Asked Questions
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                {
                  question: "How do I create an account?",
                  answer:
                    "Click on the Register button at the top right corner and fill in your details. You can register as either a worker or employer.",
                },
                {
                  question: "How do payments work?",
                  answer:
                    "Payments are arranged directly between workers and employers. We recommend using secure methods like M-Pesa for transactions.",
                },
                {
                  question: "Is there a fee for using ManuaLink?",
                  answer:
                    "Creating an account and browsing jobs is free. We may charge a small commission for premium features in the future.",
                },
                {
                  question: "How do I report an issue?",
                  answer:
                    "You can report any issues through this contact form or email us directly at support@manualink.co.ke.",
                },
              ].map((faq) => (
                <div key={faq.question} className="rounded-lg bg-white p-6 shadow-md">
                  <h3 className="mb-2 font-semibold">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
