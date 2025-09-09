import Image from 'next/image';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 100); // slight delay for animation
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="relative h-[600px] md:h-[800px] w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="/image/hero.jpeg"
        alt="Hero background"
        fill
        className="object-cover"
        priority
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
        <div className="max-w-3xl mx-auto space-y-6">
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
              'search-box flex flex-col md:flex-row gap-3 transition-opacity duration-1000 delay-400',
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
            <button
              className="btn btn-primary px-6 py-3 rounded-md text-white hover:bg-blue-700 transition-colors"
              aria-label="Search jobs"
            >
              Search
            </button>
          </div>

          {/* Hero Buttons */}
          <div
            className={clsx(
              'hero-buttons flex flex-col sm:flex-row gap-4 justify-center transition-opacity duration-1000 delay-600',
              loaded ? 'opacity-100' : 'opacity-0'
            )}
          >
            <button className="btn btn-primary px-8 py-4 rounded-md text-lg hover:bg-blue-700 transition-colors">
              I need work
            </button>
            <button className="btn btn-secondary px-8 py-4 rounded-md text-lg hover:bg-gray-700 transition-colors">
              I need workers
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
