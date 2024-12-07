// src/app/dashboard/page.tsx (or the relevant path)
import HomeLayout from '@/components/layouts/HomeLayout';
import Slider from '@/components/common/Slider';
import Counter from '@/components/common/Counter';
import ListWithFilters from '@/components/common/ListWithFilters';
import HeroSection from '@/components/common/HeroSection';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'July Revulationary Alliance',
  description: 'Know the history of July revulation in Bangladesh.',
}

export default function DashboardPage() {
  
  return (
    <HomeLayout>
      <Slider />
      <Counter />
      <ListWithFilters />
      <HeroSection />
    </HomeLayout>
  );
}
