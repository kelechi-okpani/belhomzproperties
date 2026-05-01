'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/admin-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { data: session, status } = useSession();
  const router = useRouter();



  // if (status === 'loading') {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="text-lg">Loading...</div>
  //     </div>
  //   );
  // }


  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar  />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
