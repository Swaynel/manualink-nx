export default function CTA() {
  return (
    <section className="cta" aria-labelledby="cta-heading">
      <div className="container">
        <h2 id="cta-heading">Ready to Get Started?</h2>
        <p>Join thousands of Kenyan workers and employers connecting every day</p>
        <div className="cta-buttons">
          <button className="btn btn-primary btn-large" id="ctaFindWork" aria-label="Find work opportunities">Find Work</button>
          <button className="btn btn-secondary btn-large" id="ctaHireWorkers" aria-label="Hire workers">Hire Workers</button>
        </div>
      </div>
    </section>
  );
}