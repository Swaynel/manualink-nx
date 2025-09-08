import { useState, useEffect } from 'react';

export default function Testimonials() {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [slideInterval, setSlideInterval] = useState(null);

  const testimonials = [
    {
      quote: "ManuaLink helped me find consistent construction work in Nairobi. I've been able to support my family better since joining!",
      author: "Felix K.",
      role: "Construction Worker, Nairobi",
      image: "/image/testimonial1.jpg"
    },
    {
      quote: "As a farm owner in Machakos, finding reliable farm hands was always difficult. ManuaLink solved this problem for me completely.",
      author: "Agnes K.",
      role: "Farm Owner, Machakos",
      image: "/image/testimonial2.jpg"
    },
    {
      quote: "The platform is easy to use even with my basic phone. I get paid through M-Pesa immediately after completing jobs in Mombasa.",
      author: "Nick F.",
      role: "General Laborer, Mombasa",
      image: "/image/testimonial3.jpeg"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => 
        (prevIndex + 1) % testimonials.length
      );
    }, 5000);

    setSlideInterval(interval);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToTestimonial = (index) => {
    setCurrentTestimonialIndex(index);
    if (slideInterval) {
      clearInterval(slideInterval);
      const newInterval = setInterval(() => {
        setCurrentTestimonialIndex((prevIndex) => 
          (prevIndex + 1) % testimonials.length
        );
      }, 5000);
      setSlideInterval(newInterval);
    }
  };

  const goToPrev = () => {
    const newIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
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
              key={index} 
              className={`testimonial ${index === currentTestimonialIndex ? 'active' : ''}`}
            >
              <div className="quote">"{testimonial.quote}"</div>
              <div className="author">
                <img src={testimonial.image} alt={`${testimonial.author}, ${testimonial.role}`} />
                <div>
                  <h4>{testimonial.author}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="slider-controls">
          <button className="slider-btn prev" aria-label="Previous testimonial" onClick={goToPrev}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="slider-dots">
            {testimonials.map((_, index) => (
              <span 
                key={index}
                className={`dot ${index === currentTestimonialIndex ? 'active' : ''}`}
                aria-label={`Testimonial ${index + 1}`}
                role="button"
                tabIndex="0"
                onClick={() => goToTestimonial(index)}
              ></span>
            ))}
          </div>
          <button className="slider-btn next" aria-label="Next testimonial" onClick={goToNext}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
}