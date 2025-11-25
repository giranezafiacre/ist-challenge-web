'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Plus,
  Receipt,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['staff', 'approver_level_1', 'approver_level_2', 'finance'],
    },
    {
      name: 'My Requests',
      path: '/requests',
      icon: FileText,
      roles: ['staff'],
    },
    {
      name: 'Create Request',
      path: '/requests/create',
      icon: Plus,
      roles: ['staff'],
    },
    {
      name: 'Pending Approvals',
      path: '/approvals',
      icon: CheckSquare,
      roles: ['approver_level_1', 'approver_level_2'],
    },
    {
      name: 'All Requests',
      path: '/requests',
      icon: FileText,
      roles: ['approver_level_1', 'approver_level_2', 'finance'],
    },
  ];

  const visibleItems = menuItems.filter((item) =>
    item.roles.includes(user?.role || '')
  );

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200">
      <nav className="p-4 space-y-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
