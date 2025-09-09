import { useEffect, useState } from 'react';
import clsx from 'clsx';

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 100); // small delay for fade-in
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section
      id="home"
      className="relative h-[600px] md:h-[800px] w-full bg-cover bg-center flex items-center justify-center text-center px-4"
      style={{ backgroundImage: 'url(/image/hero.jpeg)' }}
    >
      <div className="max-w-3xl mx-auto space-y-6 z-10 relative">
        {/* Hero Title */}
        <h1
          className={clsx(
            'text-3xl sm:text-4xl md:text-5xl font-bold text-white transition-opacity duration-1000',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
        >
          Find Manual Work Opportunities Across Kenya
        </h1>

        {/* Hero Subtitle */}
        <p
          className={clsx(
            'text-lg sm:text-xl text-white transition-opacity duration-1000 delay-200',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
        >
          Connect with employers looking for skilled workers or find reliable workers for your projects in Nairobi, Mombasa, Kisumu, and beyond.
        </p>

        {/* Search Box */}
        <div
          className={clsx(
            'flex flex-col md:flex-row gap-3 transition-opacity duration-1000 delay-400',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
        >
          <input
            type="text"
            id="searchJob"
            placeholder="Search for jobs (e.g., construction, farming...)"
            className="flex-grow px-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Job search"
          />
          <input
            type="text"
            id="searchLocation"
            placeholder="Location (e.g., Nairobi, Nakuru)"
            className="flex-grow px-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Location search"
          />
          <button className="btn btn-primary px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Search
          </button>
        </div>

        {/* Hero Buttons */}
        <div
          className={clsx(
            'flex flex-col sm:flex-row gap-4 justify-center transition-opacity duration-1000 delay-600',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
        >
          <button className="btn btn-primary px-8 py-4 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 transition-colors">
            I need work
          </button>
          <button className="btn btn-secondary px-8 py-4 bg-gray-600 text-white rounded-md text-lg hover:bg-gray-700 transition-colors">
            I need workers
          </button>
        </div>
      </div>

      {/* Scroll Down Arrow */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <svg
          className="w-8 h-8 text-white animate-bounce"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
