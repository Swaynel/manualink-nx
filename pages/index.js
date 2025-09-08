import Hero from "../components/Hero";
import JobPlatform from "../components/JobPlatform";
import FeaturedJobs from "../components/FeaturedJobs";
import CTA from "../components/CTA";

export default function Home() {
  return (
    <main>
      <section id="hero">
        <Hero />
      </section>

      <section id="job-platform">
        <JobPlatform />
      </section>

      <section id="featured-jobs">
        <FeaturedJobs limit={3} /> {/* show just a few */}
      </section>

      <section id="cta">
        <CTA />
      </section>
    </main>
  );
}
