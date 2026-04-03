"use client";

import CTA from "../components/CTA";
import FeaturedJobs from "../components/FeaturedJobs";
import Hero from "../components/Hero";
import JobPlatform from "../components/JobPlatform";

export default function HomePage() {
  return (
    <main>
      <section id="hero">
        <Hero />
      </section>

      <section id="job-platform">
        <JobPlatform />
      </section>

      <section id="featured-jobs">
        <FeaturedJobs limit={3} />
      </section>

      <section id="cta">
        <CTA />
      </section>
    </main>
  );
}
