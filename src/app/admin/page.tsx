'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  getEmployees,
  getDependents,
  getPensioners,
  getCurrentAuthority
} from '@/lib/storage';
import { CompetentAuthority } from '@/lib/types';
import { CompetentAuthorityModal } from '@/components/modals/CompetentAuthorityModal';
import {
  Users,
  GraduationCap,
  Briefcase,
  UserCheck,
  UserSquare2,
  Award,
  Calendar,
  FileSignature,
  CreditCard,
  Building2,
  BadgeCheck,
  UserPlus,
  History,
  ArrowRight,
  Plus
} from 'lucide-react';

export default function AdminDashboard() {
  const [employees, setEmployees] = useState(getEmployees());
  const [dependents, setDependents] = useState(getDependents());
  const [pensioners, setPensioners] = useState(getPensioners());
  const [currentVC, setCurrentVC] = useState<CompetentAuthority | undefined>(getCurrentAuthority('Vice-Chancellor'));
  const [currentReg, setCurrentReg] = useState<CompetentAuthority | undefined>(getCurrentAuthority('Registrar'));

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedAuthType, setSelectedAuthType] = useState<'Vice-Chancellor' | 'Registrar'>('Vice-Chancellor');

  const reloadData = () => {
    setEmployees(getEmployees());
    setDependents(getDependents());
    setPensioners(getPensioners());
    setCurrentVC(getCurrentAuthority('Vice-Chancellor'));
    setCurrentReg(getCurrentAuthority('Registrar'));
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

  const openAuthModal = (type: 'Vice-Chancellor' | 'Registrar') => {
    setSelectedAuthType(type);
    setIsAuthModalOpen(true);
  };

  return (
    <AppLayout allowedRoles={['admin']}>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Administrator Dashboard</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Overview of university personnel, card generation statistics &amp; issuing authorities
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/employees/new"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </Link>
            <Link
              href="/generate"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow transition"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Generate Card</span>
            </Link>
          </div>
        </div>

        {/* STAT CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Employees</span>
              <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-black text-slate-900">{totalEmployees}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Active campus personnel</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Teaching Staff</span>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-black text-blue-900">{totalTeaching}</p>
              <p className="text-[11px] text-blue-600 font-medium mt-0.5">Professors &amp; Faculty</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Non-Teaching Staff</span>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-black text-emerald-900">{totalNonTeaching}</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Admin &amp; Tech Staff</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Dependents</span>
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-black text-purple-900">{totalDependents}</p>
              <p className="text-[11px] text-purple-600 font-medium mt-0.5">Health card members</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Pensioners</span>
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <UserSquare2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-black text-amber-900">{totalPensioners}</p>
              <p className="text-[11px] text-amber-700 font-medium mt-0.5">Retired staff on record</p>
            </div>
          </div>
        </div>

        {/* COMPETENT AUTHORITY PANEL */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Competent Issuing Authorities
              </h2>
              <p className="text-xs text-slate-500">
                Current authorized signatories printed on employee and health identity cards
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vice-Chancellor Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-20 rounded-lg overflow-hidden border border-slate-300 bg-white flex-shrink-0 shadow-xs">
                  <img
                    src={currentVC?.photoUrl}
                    alt={currentVC?.name || 'VC Photo'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                    Vice-Chancellor
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 mt-1 truncate">
                    {currentVC?.name || 'Not Designated'}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Effective Since: <strong className="text-slate-700">{currentVC?.effectiveFrom || 'N/A'}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    Order: {currentVC?.orderNo || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Signature Preview */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                <div className="flex items-center space-x-2">
                  <FileSignature className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-600">Official Signature</span>
                </div>
                {currentVC?.signatureUrl && (
                  <div className="h-8 w-28 bg-white border rounded p-1 flex items-center justify-center">
                    <img src={currentVC.signatureUrl} alt="VC Signature" className="max-h-full max-w-full object-contain" />
                  </div>
                )}
              </div>

              <button
                onClick={() => openAuthModal('Vice-Chancellor')}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition"
              >
                Change Vice-Chancellor
              </button>
            </div>

            {/* Registrar Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-20 rounded-lg overflow-hidden border border-slate-300 bg-white flex-shrink-0 shadow-xs">
                  <img
                    src={currentReg?.photoUrl}
                    alt={currentReg?.name || 'Registrar Photo'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Registrar
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 mt-1 truncate">
                    {currentReg?.name || 'Not Designated'}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Effective Since: <strong className="text-slate-700">{currentReg?.effectiveFrom || 'N/A'}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    Order: {currentReg?.orderNo || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Signature Preview */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                <div className="flex items-center space-x-2">
                  <FileSignature className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-600">Official Signature</span>
                </div>
                {currentReg?.signatureUrl && (
                  <div className="h-8 w-28 bg-white border rounded p-1 flex items-center justify-center">
                    <img src={currentReg.signatureUrl} alt="Registrar Signature" className="max-h-full max-w-full object-contain" />
                  </div>
                )}
              </div>

              <button
                onClick={() => openAuthModal('Registrar')}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition"
              >
                Change Registrar
              </button>
            </div>
          </div>
        </div>

        {/* QUICK NAVIGATION GRID */}
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-4">Master Configurations &amp; Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/employees"
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-400 transition group flex items-start justify-between"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-700 transition">Employee Master</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">Browse, filter, add, edit &amp; view employee records</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
            </Link>

            <Link
              href="/masters/designations"
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-400 transition group flex items-start justify-between"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <BadgeCheck className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition">Designation Master</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">Manage academic &amp; non-teaching designations</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
            </Link>

            <Link
              href="/masters/departments"
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-400 transition group flex items-start justify-between"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition">Department Master</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">Configure schools, centers, and admin branches</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
            </Link>

            <Link
              href="/templates"
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-400 transition group flex items-start justify-between"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-purple-700 transition">Card Templates</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">Configure ID, Health &amp; Pensioner card layouts</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition" />
            </Link>

            <Link
              href="/admin/operators"
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-400 transition group flex items-start justify-between"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <UserPlus className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition">Create Operator Login</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">Provision operator credentials for staff</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition" />
            </Link>

            <Link
              href="/admin/activity"
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-400 transition group flex items-start justify-between"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <History className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-700 transition">Activity Log</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">Audit log of system actions &amp; card printings</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
            </Link>
          </div>
        </div>
      </div>

      {isAuthModalOpen && (
        <CompetentAuthorityModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultType={selectedAuthType}
        />
      )}
    </AppLayout>
  );
}
