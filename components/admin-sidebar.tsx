'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/properties', label: 'Properties', icon: '🏠' },
  { href: '/admin/inquiries', label: 'Inquiries', icon: '💬' },
  { href: '/admin/staff', label: 'Staff', icon: '👥' },
];

export default function AdminSidebar({ userRole }: { userRole?: string }) {
  const pathname = usePathname();
  // const { data: session } = useSession();

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
        <p className="text-xs text-muted-foreground mt-1">{userRole?.toUpperCase()}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {adminLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <button
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </button>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Sign Out */}
      <div className="p-4 border-t border-border">
        <div className="mb-4 text-sm">
          <p className="text-muted-foreground">Signed in as</p>
          {/* <p className="font-medium text-foreground">{session?.user?.email}</p> */}
        </div>
        <button
          onClick={() => signOut()}
          className="w-full px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-sm font-medium"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
