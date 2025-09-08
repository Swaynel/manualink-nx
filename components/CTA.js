export default function CTA() {
  return (
    <section className="bg-blue-600 py-16" aria-labelledby="cta-heading">
      <div className="container mx-auto px-4 text-center">
        <h2 
          id="cta-heading" 
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          Ready to Get Started?
        </h2>
        <p className="text-white text-lg mb-8">
          Join thousands of Kenyan workers and employers connecting every day
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <button 
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:shadow-lg transition w-full md:w-auto"
            id="ctaFindWork"
            aria-label="Find work opportunities"
          >
            Find Work
          </button>

          <button 
            className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition w-full md:w-auto"
            id="ctaHireWorkers"
            aria-label="Hire workers"
          >
            Hire Workers
          </button>
        </div>
      </div>
    </section>
  );
}
