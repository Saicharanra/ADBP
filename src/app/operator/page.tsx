'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { getEmployees, getDependents, getPensioners } from '@/lib/storage';
import { ChangePasswordModal } from '@/components/modals/ChangePasswordModal';
import {
  Users,
  GraduationCap,
  Briefcase,
  UserCheck,
  UserSquare2,
  Search,
  Printer,
  KeyRound,
  ArrowRight
} from 'lucide-react';

export default function OperatorDashboard() {
  const [employees, setEmployees] = useState(getEmployees());
  const [dependents, setDependents] = useState(getDependents());
  const [pensioners, setPensioners] = useState(getPensioners());
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const reloadData = () => {
    setEmployees(getEmployees());
    setDependents(getDependents());
    setPensioners(getPensioners());
  };

  useEffect(() => {
    reloadData();
    window.addEventListener('adps-storage-update', reloadData);
    return () => window.removeEventListener('adps-storage-update', reloadData);
  }, []);

  const totalTeaching = employees.filter(e => e.type === 'Teaching' && e.status !== 'In-Active').length;
  const totalNonTeaching = employees.filter(e => e.type === 'Non-Teaching' && e.status !== 'In-Active').length;
  const totalEmployees = employees.filter(e => e.status !== 'In-Active').length;
  const totalDependents = dependents.filter(d => d.status === 'Active').length;
  const totalPensioners = pensioners.filter(p => p.status === 'Active').length;

  return (
    <AppLayout allowedRoles={['operator']}>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Operator Dashboard</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Quick access to personnel records, dependent search &amp; document card printing
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shadow transition"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Change Password</span>
            </button>
            <Link
              href="/generate"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow transition"
            >
              <Printer className="w-4 h-4" />
              <span>Generate Card</span>
            </Link>
          </div>
        </div>

        {/* READ-ONLY STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Employees</span>
              <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-black text-slate-900">{totalEmployees}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">University staff on record</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Teaching Staff</span>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-black text-blue-900">{totalTeaching}</p>
              <p className="text-[11px] text-blue-600 font-medium mt-0.5">Faculty members</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Non-Teaching Staff</span>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-black text-emerald-900">{totalNonTeaching}</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Administrative &amp; Tech</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Dependents</span>
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-black text-purple-900">{totalDependents}</p>
              <p className="text-[11px] text-purple-600 font-medium mt-0.5">Family health members</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Pensioners</span>
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <UserSquare2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-black text-amber-900">{totalPensioners}</p>
              <p className="text-[11px] text-amber-700 font-medium mt-0.5">Retirees</p>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS GRID */}
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-4">Operator Workflows &amp; Direct Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/generate"
              className="p-5 bg-gradient-to-br from-amber-500 to-amber-700 text-white rounded-xl shadow-md hover:shadow-lg transition group flex flex-col justify-between min-h-[140px]"
            >
              <div className="flex items-center justify-between">
                <Printer className="w-6 h-6" />
                <ArrowRight className="w-4 h-4 opacity-75 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <h3 className="font-extrabold text-base">Generate &amp; Print Card</h3>
                <p className="text-xs text-amber-100 mt-1">Select employee or pensioner, preview card with QR &amp; print/download</p>
              </div>
            </Link>

            <Link
              href="/employees"
              className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400 transition group flex flex-col justify-between min-h-[140px]"
            >
              <div className="flex items-center justify-between">
                <Users className="w-6 h-6 text-blue-600" />
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-700">Employee Directory</h3>
                <p className="text-xs text-slate-500 mt-1">Search staff by ID, name, designation or department</p>
              </div>
            </Link>

            <Link
              href="/employees"
              className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-purple-400 transition group flex flex-col justify-between min-h-[140px]"
            >
              <div className="flex items-center justify-between">
                <Search className="w-6 h-6 text-purple-600" />
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-purple-700">Dependent Search</h3>
                <p className="text-xs text-slate-500 mt-1">View profile &amp; family health dependents list for any employee</p>
              </div>
            </Link>

            <Link
              href="/pensioners"
              className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-400 transition group flex flex-col justify-between min-h-[140px]"
            >
              <div className="flex items-center justify-between">
                <UserSquare2 className="w-6 h-6 text-amber-600" />
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-amber-700">Pensioners List</h3>
                <p className="text-xs text-slate-500 mt-1">Browse retired university staff &amp; issue pensioner identity cards</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {isChangePasswordOpen && (
        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
        />
      )}
    </AppLayout>
  );
}
