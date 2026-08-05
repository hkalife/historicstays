import { HeroSection } from '@/components/home/hero-section';
import { SearchResults } from '@/components/home/search-results';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <HeroSection />
      <SearchResults />
    </div>
  );
}
