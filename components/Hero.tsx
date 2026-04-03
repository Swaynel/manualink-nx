import { useEffect, useState } from 'react';

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section
      id="home"
      className="relative h-[650px] md:h-[850px] w-full bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: 'url(/image/hero.jpeg)' }}
    >
      {/* Hero content container */}
      <div
        className={`relative z-10 max-w-3xl w-full space-y-6 px-4 py-6 sm:px-6 sm:py-8 rounded-lg bg-black/45 transition-opacity duration-1000 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
          Find Manual Work Opportunities Across Kenya
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-white drop-shadow-md">
          Connect with employers looking for skilled workers or find reliable workers for your projects in Nairobi, Mombasa, Kisumu, and beyond.
        </p>

        {/* Search Box */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search for jobs (e.g., construction, farming...)"
            className="flex-1 px-4 py-3 rounded-md bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Location (e.g., Nairobi, Nakuru)"
            className="flex-1 px-4 py-3 rounded-md bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Search
          </button>
        </div>

        {/* Hero Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 transition-colors">
            I need work
          </button>
          <button className="px-8 py-4 bg-gray-600 text-white rounded-md text-lg hover:bg-gray-700 transition-colors">
            I need workers
          </button>
        </div>
      </div>

      {/* Scroll Down Arrow */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <svg
          className="w-8 h-8 text-white animate-bounce drop-shadow-lg"
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
