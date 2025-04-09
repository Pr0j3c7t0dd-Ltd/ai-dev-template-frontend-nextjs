import { HeroSection } from '@/components/home/hero-section';
import { FeaturesSection } from '@/components/home/features-section';
import { PricingSection } from '@/components/home/pricing-section';
import { ContactSection } from '@/components/home/contact-section';
import { HomeScrollHandler } from '@/components/home/home-scroll-handler';
import logger from '@/lib/logger';

export default function HomePage() {
  // Log home page access for testing file logging
  logger.info('[HomePage] Home page accessed');

  return (
    <div className="flex flex-col min-h-screen">
      <HomeScrollHandler />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <ContactSection />
    </div>
  );
}
