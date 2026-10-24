import { Hero } from "../components/home/Hero";
import { StatsSection } from "../components/home/StatsSection";
import { FeaturedEvents } from "../components/home/FeaturedEvents";
import { CategoryGrid } from "../components/home/CategoryGrid";
import { CTASection } from "../components/home/CTASection";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <StatsSection />
      <FeaturedEvents />
      <CategoryGrid />
      <CTASection />
    </div>
  );
}
