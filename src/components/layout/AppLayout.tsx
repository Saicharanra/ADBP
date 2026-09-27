'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSession } from '@/lib/storage';
import { UserSession, Role } from '@/lib/types';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { ChangePasswordModal } from '../modals/ChangePasswordModal';

interface AppLayoutProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function AppLayout({ children, allowedRoles }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSessionState] = useState<UserSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      router.push('/login');
      return;
    }

    if (allowedRoles && !allowedRoles.includes(currentSession.role)) {
      if (currentSession.role === 'admin') router.push('/admin');
      else router.push('/operator');
      return;
    }

    setSessionState(currentSession);
    setIsLoaded(true);

    const handleStorageChange = () => {
      const updated = getSession();
      if (!updated) router.push('/login');
      else setSessionState(updated);
    };

    window.addEventListener('adps-storage-update', handleStorageChange);
    return () => window.removeEventListener('adps-storage-update', handleStorageChange);
  }, [router, pathname, allowedRoles]);

  if (!isLoaded || !session) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
        <span className="mt-3 text-xs text-slate-600 font-medium">Authenticating ADPS session...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      <Header />
      <div className="flex flex-1">
        <Sidebar
          role={session.role}
          onChangePasswordClick={() => setIsChangePasswordOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
      <Footer />

      {isChangePasswordOpen && (
        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
        />
      )}
    </div>
  );
}
