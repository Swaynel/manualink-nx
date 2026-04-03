"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "ManuaLink helped me find consistent construction work in Nairobi. I've been able to support my family better since joining!",
    author: "Felix K.",
    role: "Construction Worker, Nairobi",
    image: "/image/testimonial1.jpg",
  },
  {
    quote:
      "As a farm owner in Machakos, finding reliable farm hands was always difficult. ManuaLink solved this problem for me completely.",
    author: "Agnes K.",
    role: "Farm Owner, Machakos",
    image: "/image/testimonial2.jpg",
  },
  {
    quote:
      "The platform is easy to use even with my basic phone. I get paid through M-Pesa immediately after completing jobs in Mombasa.",
    author: "Nick F.",
    role: "General Laborer, Mombasa",
    image: "/image/testimonial3.jpeg",
  },
];

export default function Testimonials() {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [slideInterval, setSlideInterval] = useState<number | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTestimonialIndex(
        (currentIndex) => (currentIndex + 1) % testimonials.length,
      );
    }, 5000);

    setSlideInterval(interval);

    return () => window.clearInterval(interval);
  }, []);

  const goToTestimonial = (index: number) => {
    setCurrentTestimonialIndex(index);

    if (slideInterval) {
      window.clearInterval(slideInterval);
    }

    const nextInterval = window.setInterval(() => {
      setCurrentTestimonialIndex(
        (currentIndex) => (currentIndex + 1) % testimonials.length,
      );
    }, 5000);

    setSlideInterval(nextInterval);
  };

  const goToPrev = () => {
    const newIndex =
      (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
    goToTestimonial(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentTestimonialIndex + 1) % testimonials.length;
    goToTestimonial(newIndex);
  };

  return (
    <section className="testimonials" aria-labelledby="testimonials-heading">
      <div className="container">
        <h2 id="testimonials-heading">What Our Kenyan Users Say</h2>
        <div className="testimonial-slider" role="region" aria-live="polite">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className={`testimonial ${
                index === currentTestimonialIndex ? "active" : ""
              }`}
            >
              <p className="quote">{testimonial.quote}</p>
              <div className="author">
                <Image
                  src={testimonial.image}
                  alt={`${testimonial.author}, ${testimonial.role}`}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
                <div>
                  <h4>{testimonial.author}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="slider-controls">
          <button
            className="slider-btn prev"
            aria-label="Previous testimonial"
            onClick={goToPrev}
          >
            <i className="fas fa-chevron-left" />
          </button>
          <div className="slider-dots">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.author}
                className={`dot ${index === currentTestimonialIndex ? "active" : ""}`}
                aria-label={`Testimonial ${index + 1}`}
                onClick={() => goToTestimonial(index)}
              />
            ))}
          </div>
          <button
            className="slider-btn next"
            aria-label="Next testimonial"
            onClick={goToNext}
          >
            <i className="fas fa-chevron-right" />
          </button>
        </div>
      </div>
    </section>
  );
}
