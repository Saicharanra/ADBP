'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Role } from '@/lib/types';
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  Building2,
  BadgeCheck,
  CreditCard,
  Printer,
  History,
  UserPlus,
  KeyRound,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  role: Role;
  onChangePasswordClick?: () => void;
}

export function Sidebar({ role, onChangePasswordClick }: SidebarProps) {
  const pathname = usePathname();

  const adminNav = [
    { label: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Employee Master', href: '/employees', icon: Users },
    { label: 'Pensioners List', href: '/pensioners', icon: UserSquare2 },
    { label: 'Department Master', href: '/masters/departments', icon: Building2 },
    { label: 'Designation Master', href: '/masters/designations', icon: BadgeCheck },
    { label: 'Card Templates', href: '/templates', icon: CreditCard },
    { label: 'Generate Card', href: '/generate', icon: Printer },
    { label: 'Operator Logins', href: '/admin/operators', icon: UserPlus },
    { label: 'Activity Log', href: '/admin/activity', icon: History }
  ];

  const operatorNav = [
    { label: 'Operator Dashboard', href: '/operator', icon: LayoutDashboard },
    { label: 'Employee Directory', href: '/employees', icon: Users },
    { label: 'Pensioners Directory', href: '/pensioners', icon: UserSquare2 },
    { label: 'Generate Card', href: '/generate', icon: Printer }
  ];

  const items = role === 'admin' ? adminNav : operatorNav;

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 border-r border-slate-800/80 min-h-[calc(100vh-4.25rem)] flex flex-col flex-shrink-0 print:hidden shadow-xl">
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/50">
        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
          {role === 'admin' ? 'Administrator Controls' : 'Operator Portal'}
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && item.href !== '/operator' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-900/30 font-bold border border-amber-500/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white hover:border-slate-800 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-slate-950 font-black' : 'text-slate-400 group-hover:text-amber-400'}`} />
                <span>{item.label}</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 transition-opacity ${isActive ? 'opacity-100 text-slate-950 font-bold' : 'opacity-0 group-hover:opacity-100 text-slate-500'}`} />
            </Link>
          );
        })}

        {role === 'operator' && onChangePasswordClick && (
          <button
            onClick={onChangePasswordClick}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition text-left border border-transparent hover:border-slate-800 group"
          >
            <div className="flex items-center space-x-3">
              <KeyRound className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition" />
              <span>Change Password</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-slate-500 transition" />
          </button>
        )}
      </nav>
    </aside>
  );
}
