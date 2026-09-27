'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/storage';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push('/login');
    } else if (session.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/operator');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
      <p className="mt-4 text-sm font-medium text-slate-300">Loading ADPS System...</p>
    </div>
  );
}
