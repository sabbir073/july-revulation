// src/app/dashboard/page.tsx (or the relevant path)
import HomeLayout from '@/components/layouts/HomeLayout';
import ListOfInjured from '@/components/common/ListOfInjured';

export default function DashboardPage() {
  return (
    <HomeLayout>
      <ListOfInjured />
    </HomeLayout>
  );
}
