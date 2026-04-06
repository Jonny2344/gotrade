import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import MobileStickyCTA from '../components/MobileStickyCTA';

export default function Home() {
  return (
    <main className="bg-base pb-20 text-slate-100 sm:pb-0">
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
      <MobileStickyCTA />
    </main>
  );
}
