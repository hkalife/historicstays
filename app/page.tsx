import { HeroSection } from '@/components/home/hero-section';
import { PopularDestinations } from '@/components/home/popular-destinations';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <HeroSection />
      <PopularDestinations />
    </div>
  );
}
