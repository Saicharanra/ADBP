'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { getEmployeeById, getDependentsForEmployee, deleteDependent, getSession } from '@/lib/storage';
import { Employee, Dependent } from '@/lib/types';
import { DependentModal } from '@/components/modals/DependentModal';
import { RetireEmployeeModal } from '@/components/modals/RetireEmployeeModal';
import { useToast } from '@/components/ui/Toast';
import {
  ArrowLeft,
  Edit,
  UserMinus,
  Printer,
  Plus,
  Trash2,
  Users,
  Building2,
  BadgeCheck,
  Calendar,
  Phone,
  Droplet,
  MapPin
} from 'lucide-react';

export default function EmployeeProfilePage() {
  const params = useParams();
  const { showToast } = useToast();
  const session = getSession();

  const id = params?.id as string;

  const [employee, setEmployee] = useState<Employee | undefined>(undefined);
  const [dependents, setDependents] = useState<Dependent[]>([]);

  // Modal states
  const [isDepModalOpen, setIsDepModalOpen] = useState(false);
  const [selectedDep, setSelectedDep] = useState<Dependent | null>(null);
  const [isRetireModalOpen, setIsRetireModalOpen] = useState(false);

  const loadData = () => {
    if (id) {
      const emp = getEmployeeById(id);
      setEmployee(emp);
      setDependents(getDependentsForEmployee(id));
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('adps-storage-update', loadData);
    return () => window.removeEventListener('adps-storage-update', loadData);
  }, [id]);

  if (!employee) {
    return (
      <AppLayout>
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
          <p className="text-sm font-semibold text-slate-600">Employee record ID &quot;{id}&quot; not found.</p>
          <Link href="/employees" className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg">
            <ArrowLeft className="w-4 h-4" /> Back to Directory
          </Link>
        </div>
      </AppLayout>
    );
  }

  const handleDeleteDep = (dep: Dependent) => {
    if (confirm(`Are you sure you want to remove dependent ${dep.name} (${dep.id})?`)) {
      deleteDependent(dep.id);
      showToast('Dependent Removed', `Dependent ${dep.id} was deleted.`);
      loadData();
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <Link href="/employees" className="text-xs text-amber-600 hover:underline flex items-center gap-1 font-semibold mb-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Employee Master
            </Link>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{employee.name}</h1>
              <span className="font-mono font-bold text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                ID: {employee.id}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                employee.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {employee.status}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {session?.role === 'admin' && (
              <>
                <Link
                  href={`/employees/${employee.id}/edit`}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shadow transition"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </Link>

                {employee.status !== 'Retired' && (
                  <button
                    onClick={() => setIsRetireModalOpen(true)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold shadow transition"
                  >
                    <UserMinus className="w-4 h-4" />
                    <span>Retire Employee</span>
                  </button>
                )}
              </>
            )}

            <Link
              href={`/generate?personId=${employee.id}`}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow transition"
            >
              <Printer className="w-4 h-4" />
              <span>Generate Card</span>
            </Link>
          </div>
        </div>

        {/* PROFILE HEADER CARD */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start">
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-32 h-40 rounded-xl overflow-hidden border-2 border-slate-300 shadow-md bg-slate-100">
              <img src={employee.photoUrl} alt={employee.name} className="w-full h-full object-cover" />
            </div>
            {employee.signatureUrl && (
              <div className="mt-2 h-10 w-32 border rounded p-1 bg-white shadow-xs flex items-center justify-center">
                <img src={employee.signatureUrl} alt="Signature" className="max-h-full max-w-full object-contain" />
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category</span>
              <p className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-blue-600" />
                {employee.type} Staff
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Designation</span>
              <p className="font-bold text-slate-900 mt-0.5">{employee.designation}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Department / School</span>
              <p className="font-medium text-slate-800 mt-0.5 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                {employee.department}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Blood Group</span>
              <p className="font-bold text-rose-700 text-sm mt-0.5 flex items-center gap-1">
                <Droplet className="w-4 h-4 text-rose-600 inline" />
                {employee.bloodGroup}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date of Birth &amp; Gender</span>
              <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                {employee.dob} ({employee.gender})
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date of Joining &amp; Retirement</span>
              <p className="font-semibold text-slate-800 mt-0.5">
                DOJ: {employee.doj} {employee.dor ? `| DOR: ${employee.dor}` : ''}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Primary Contact</span>
              <p className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-slate-400" />
                {employee.contactNumber}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Alt. Contact</span>
              <p className="font-medium text-slate-700 mt-0.5">{employee.altContactNumber || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* ADDRESSES PANEL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              Present Address
            </span>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">{employee.presentAddress}</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              Permanent Address
            </span>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">{employee.permanentAddress}</p>
          </div>
        </div>

        {/* DEPENDENTS INLINE LIST */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Registered Family Dependents ({dependents.length})
              </h3>
              <p className="text-xs text-slate-500">Dependents printed on Health Pass back side</p>
            </div>

            <button
              onClick={() => { setSelectedDep(null); setIsDepModalOpen(true); }}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Dependent</span>
            </button>
          </div>

          {dependents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dependents.map(dep => (
                <div
                  key={dep.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-4 justify-between"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-12 h-14 rounded-lg overflow-hidden border border-slate-300 bg-white flex-shrink-0">
                      <img src={dep.photoUrl} alt={dep.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-mono text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1 rounded">
                        {dep.id}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 truncate mt-0.5">{dep.name}</h4>
                      <p className="text-[11px] text-slate-600 font-medium">
                        {dep.relationship} &bull; {dep.age ? `${dep.age} yrs` : dep.dob}
                      </p>
                      <p className="text-[10px] font-bold text-rose-700 mt-0.5">{dep.bloodGroup}</p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => { setSelectedDep(dep); setIsDepModalOpen(true); }}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      title="Edit Dependent"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDep(dep)}
                      className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                      title="Delete Dependent"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 italic bg-slate-50 rounded-lg border border-dashed border-slate-200">
              No dependents currently registered for this employee. Click &quot;Add Dependent&quot; to register family members.
            </div>
          )}
        </div>
      </div>

      {isDepModalOpen && (
        <DependentModal
          isOpen={isDepModalOpen}
          onClose={() => setIsDepModalOpen(false)}
          employeeId={employee.id}
          dependent={selectedDep}
        />
      )}

      {isRetireModalOpen && (
        <RetireEmployeeModal
          isOpen={isRetireModalOpen}
          onClose={() => setIsRetireModalOpen(false)}
          employee={employee}
          onSuccess={() => loadData()}
        />
      )}
    </AppLayout>
  );
}
