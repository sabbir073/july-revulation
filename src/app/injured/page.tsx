// src/app/dashboard/page.tsx (or the relevant path)
import HomeLayout from '@/components/layouts/HomeLayout';
import ListOfInjured from '@/components/common/ListOfInjured';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Injured | July Revulationary Alliance',
  description: 'Know the history of July revulation in Bangladesh.',
}

export default function DashboardPage() {
  return (
    <HomeLayout>
      <ListOfInjured />
    </HomeLayout>
  );
}
