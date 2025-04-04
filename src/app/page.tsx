import { HeroSection } from '@/components/home/hero-section';
import { FeaturesSection } from '@/components/home/features-section';
import { PricingSection } from '@/components/home/pricing-section';
import { ContactSection } from '@/components/home/contact-section';
import { HomeScrollHandler } from '@/components/home/home-scroll-handler';

export default function HomePage() {
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
