// src/app/dashboard/page.tsx (or the relevant path)
import HomeLayout from '@/components/layouts/HomeLayout';
import ListOfMartyres from '@/components/common/ListOfMartyres';

export default function DashboardPage() {
  return (
    <HomeLayout>
      <ListOfMartyres />
    </HomeLayout>
  );
}
