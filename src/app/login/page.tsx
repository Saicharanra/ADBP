'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, setSession, initializeStorage } from '@/lib/storage';
import { UOH_LOGO_SVG } from '@/lib/mockData';
import { ShieldCheck, UserCheck, User, Lock, ArrowRight, RefreshCw, Building2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'operator' | 'admin'>('operator');

  // Form states
  const [operatorId, setOperatorId] = useState('');
  const [operatorPassword, setOperatorPassword] = useState('');

  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    initializeStorage();
    const session = getSession();
    if (session) {
      if (session.role === 'admin') router.push('/admin');
      else router.push('/operator');
    }
  }, [router]);

  const fillOperatorDemo = () => {
    setOperatorId('1003');
    setOperatorPassword('operator123');
    setError('');
  };

  const fillAdminDemo = () => {
    setAdminUsername('admin');
    setAdminPassword('admin123');
    setError('');
  };

  const handleOperatorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorId.trim() || !operatorPassword.trim()) {
      setError('Please enter both Employee ID and password.');
      return;
    }

    setSession({
      username: operatorId,
      role: 'operator',
      name: `Operator (ID: ${operatorId})`,
      employeeId: operatorId
    });

    showToast('Welcome Operator!', 'Successfully logged into Operator Dashboard.');
    router.push('/operator');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUsername.trim() || !adminPassword.trim()) {
      setError('Please enter both Username and password.');
      return;
    }

    setSession({
      username: adminUsername,
      role: 'admin',
      name: 'System Administrator'
    });

    showToast('Welcome Admin!', 'Successfully logged into Administrator Dashboard.');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Background Decorative Blur Spheres */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 px-6 py-4 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 p-1 bg-slate-900 rounded-full border border-amber-500/40 shadow-md">
              <img src={UOH_LOGO_SVG} alt="University of Hyderabad Emblem" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-black text-white tracking-tight">University of Hyderabad</h1>
                <span className="text-[10px] text-amber-300 font-bold px-2 py-0.5 bg-amber-950/70 rounded-full border border-amber-500/40 uppercase">
                  A Central University
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Automated Document Printing System (ADPS) Portal
              </p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs font-mono text-slate-400 block font-semibold">ADPS v2.4.0 Production</span>
            <span className="text-[11px] text-emerald-400 font-bold flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Local Storage Mode Active
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Form */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8 relative z-10">
        <div className="max-w-md w-full glass-dark rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden">
          {/* Card Header Title */}
          <div className="p-6 bg-slate-950/80 border-b border-slate-800/80 text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-400 shadow-inner">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Automatic Document Printing System
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Official Card Generation &amp; Identity Printing Platform
            </p>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-2 bg-slate-950/90 border-b border-slate-800 p-1.5 gap-1.5">
            <button
              onClick={() => { setActiveTab('operator'); setError(''); }}
              className={`py-3 text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition rounded-xl ${
                activeTab === 'operator'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md border border-amber-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Employee Login</span>
            </button>
            <button
              onClick={() => { setActiveTab('admin'); setError(''); }}
              className={`py-3 text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition rounded-xl ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md border border-amber-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Administrator Login</span>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {error && (
              <div className="p-3 text-xs text-rose-300 bg-rose-950/90 border border-rose-800 rounded-lg font-semibold">
                {error}
              </div>
            )}

            {/* TAB 1: OPERATOR / EMPLOYEE LOGIN */}
            {activeTab === 'operator' && (
              <form onSubmit={handleOperatorLogin} className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-bold text-slate-300">Operator Authentication</span>
                  <button
                    type="button"
                    onClick={fillOperatorDemo}
                    className="text-amber-400 hover:underline flex items-center gap-1 font-mono text-[11px] font-bold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Fill Demo Credentials
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Employee ID / Operator ID</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={operatorId}
                      onChange={e => setOperatorId(e.target.value)}
                      placeholder="e.g. 1001 or 1003"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono"
                      required
                    />
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={operatorPassword}
                      onChange={e => setOperatorPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 text-sm mt-2"
                >
                  <span>Sign In as Operator</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* TAB 2: ADMIN LOGIN */}
            {activeTab === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-bold text-slate-300">Administrator Access</span>
                  <button
                    type="button"
                    onClick={fillAdminDemo}
                    className="text-amber-400 hover:underline flex items-center gap-1 font-mono text-[11px] font-bold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Fill Demo Credentials
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Administrator Username</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={adminUsername}
                      onChange={e => setAdminUsername(e.target.value)}
                      placeholder="e.g. admin"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono"
                      required
                    />
                    <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={e => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 text-sm mt-2"
                >
                  <span>Sign In as Administrator</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <div className="pt-4 border-t border-slate-800/80 text-center text-[11px] text-slate-400 font-medium">
              <p>Demo Mode Active: Enter any non-empty input to log in.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 relative z-10">
        Developed by CC/CNF, University of Hyderabad
      </footer>
    </div>
  );
}
