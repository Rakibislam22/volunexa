import { Hero } from "../components/home/Hero";
import { StatsSection } from "../components/home/StatsSection";
import { FeaturedEvents } from "../components/home/FeaturedEvents";
import { CategoryGrid } from "../components/home/CategoryGrid";
import { HowItWorks } from "../components/home/HowItWorks";
import { PlatformFeatures } from "../components/home/PlatformFeatures";
import { FAQSection } from "../components/home/FAQSection";
import { CTASection } from "../components/home/CTASection";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <StatsSection />
      <FeaturedEvents />
      <CategoryGrid />
      <HowItWorks />
      <PlatformFeatures />
      <FAQSection />
      <CTASection />
    </div>
  );
}
