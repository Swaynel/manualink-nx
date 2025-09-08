export default function Hero() {
  return (
    <section id="home" className="relative bg-cover bg-center py-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e)' }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="container relative z-10 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Manual Work Opportunities Across Kenya</h1>
          <p className="text-xl mb-8">Connect with employers looking for skilled workers or find reliable workers for your projects in Nairobi, Mombasa, Kisumu, and beyond.</p>
          
          <div className="search-box flex flex-col md:flex-row gap-3 mb-8">
            <input 
              type="text" 
              id="searchJob" 
              placeholder="Search for jobs (e.g., construction, farming...)" 
              className="flex-grow px-4 py-3 rounded text-gray-800"
            />
            <input 
              type="text" 
              id="searchLocation" 
              placeholder="Location (e.g., Nairobi, Nakuru)" 
              className="flex-grow px-4 py-3 rounded text-gray-800"
            />
            <button className="btn btn-primary px-6">Search</button>
          </div>
          
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-primary btn-large">I need work</button>
            <button className="btn btn-secondary btn-large">I need workers</button>
          </div>
        </div>
      </div>
    </section>
  );
}