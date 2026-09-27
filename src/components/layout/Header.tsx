'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSession, clearSession, resetAllData } from '@/lib/storage';
import { UserSession } from '@/lib/types';
import { UOH_LOGO_SVG } from '@/lib/mockData';
import { LogOut, RefreshCw, User, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';
import { useToast } from '../ui/Toast';

export function Header() {
  const router = useRouter();
  const { showToast } = useToast();
  const [session, setSessionState] = useState<UserSession | null>(null);

  useEffect(() => {
    setSessionState(getSession());

    const handleStorageChange = () => {
      setSessionState(getSession());
    };

    window.addEventListener('adps-storage-update', handleStorageChange);
    return () => window.removeEventListener('adps-storage-update', handleStorageChange);
  }, []);

  const handleLogout = () => {
    clearSession();
    showToast('Logged out', 'You have been safely logged out.', 'info');
    router.push('/login');
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all demo data to initial defaults?')) {
      resetAllData();
      showToast('Demo Data Reset', 'All localStorage data has been restored to default mock records.');
    }
  };

  return (
    <header className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white shadow-lg border-b border-slate-800/80 print:hidden sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Titles */}
          <Link
            href={session?.role === 'admin' ? '/admin' : session?.role === 'operator' ? '/operator' : '/login'}
            className="flex items-center space-x-3.5 group"
          >
            <div className="relative">
              <div className="w-12 h-12 flex-shrink-0 bg-slate-900/90 p-1 rounded-full border border-amber-500/40 shadow-md group-hover:border-amber-400 group-hover:scale-105 transition-all duration-300">
                <img src={UOH_LOGO_SVG} alt="UOH Seal" className="w-full h-full object-contain" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-0.5 border border-slate-950 shadow-xs">
                <Sparkles className="w-2.5 h-2.5 text-slate-950" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base md:text-lg text-white tracking-tight group-hover:text-amber-300 transition">
                  University of Hyderabad
                </span>
                <span className="text-[10px] text-amber-300 font-bold px-2 py-0.5 bg-amber-950/70 rounded-full border border-amber-500/40 tracking-wide uppercase shadow-xs">
                  A Central University
                </span>
              </div>
              <h1 className="text-xs sm:text-sm font-medium text-slate-300 tracking-wide flex items-center gap-1.5 mt-0.5">
                <span className="text-amber-400 font-extrabold tracking-wider bg-slate-950 px-1.5 py-0.2 rounded border border-amber-500/30">
                  ADPS
                </span>
                <span className="text-slate-400">&bull;</span>
                Automated Document Printing System
              </h1>
            </div>
          </Link>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleResetData}
              title="Reset initial demo data in localStorage"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-amber-950/50 text-slate-300 hover:text-amber-300 border border-slate-700/80 hover:border-amber-500/50 transition-all shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span className="hidden md:inline">Reset Demo Data</span>
            </button>

            {session ? (
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-white flex items-center justify-end gap-1.5">
                    {session.role === 'admin' ? (
                      <ShieldCheck className="w-4 h-4 text-amber-400 inline" />
                    ) : (
                      <UserCheck className="w-4 h-4 text-emerald-400 inline" />
                    )}
                    {session.name}
                  </div>
                  <span className={`text-[9px] uppercase tracking-wider px-2 py-0.2 rounded-full font-extrabold border ${
                    session.role === 'admin'
                      ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                  }`}>
                    {session.role === 'admin' ? 'Administrator' : 'Operator'}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-950/60 hover:bg-rose-900 text-rose-200 border border-rose-700/60 transition shadow-xs"
                  title="Sign out of system"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition shadow-md"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
