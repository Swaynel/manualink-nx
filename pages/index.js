import dynamic from 'next/dynamic';
import Hero from '../components/Hero';
import JobPlatform from '../components/JobPlatform';
import FeaturedJobs from '../components/FeaturedJobs';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';

// Dynamically import JobMap to avoid SSR issues with Leaflet
const JobMap = dynamic(() => import('../components/JobMap'), { ssr: false });

export default function Home() {
  return (
    <>
      <Hero />
      <JobPlatform />
      <FeaturedJobs />
      <JobMap />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </>
  );
}