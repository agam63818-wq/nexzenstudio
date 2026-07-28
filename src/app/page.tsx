import { Hero } from '@/components/sections/hero';
import { FeatureCards } from '@/components/sections/feature-cards';
import { StatsBar } from '@/components/sections/stats-bar';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <FeatureCards />
    </>
  );
}
