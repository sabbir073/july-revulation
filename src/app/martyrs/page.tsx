// src/app/dashboard/page.tsx (or the relevant path)
import HomeLayout from '@/components/layouts/HomeLayout';
import ListOfMartyres from '@/components/common/ListOfMartyres';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Martyrs | July Revulationary Alliance',
  description: 'Know the history of July revulation in Bangladesh.',
}

export default function DashboardPage() {
  return (
    <HomeLayout>
      <ListOfMartyres />
    </HomeLayout>
  );
}
