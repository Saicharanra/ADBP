'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { getEmployees, getDepartments, getDesignations, deleteEmployee, getSession } from '@/lib/storage';
import { Employee } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';
import { RetireEmployeeModal } from '@/components/modals/RetireEmployeeModal';
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Printer,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  UserMinus
} from 'lucide-react';

export default function EmployeesPage() {
  const { showToast } = useToast();
  const session = getSession();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState(getDepartments());
  const [designations, setDesignations] = useState(getDesignations());

  // Filter states
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [desgFilter, setDesgFilter] = useState<string>('ALL');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Retire Modal State
  const [retireTarget, setRetireTarget] = useState<Employee | null>(null);

  const reloadData = () => {
    setEmployees(getEmployees());
    setDepartments(getDepartments());
    setDesignations(getDesignations());
  };

  useEffect(() => {
    reloadData();
    window.addEventListener('adps-storage-update', reloadData);
    return () => window.removeEventListener('adps-storage-update', reloadData);
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchSearch =
        search === '' ||
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.id.includes(search) ||
        emp.contactNumber.includes(search);

      const matchType = typeFilter === 'ALL' || emp.type === typeFilter;
      const matchDept = deptFilter === 'ALL' || emp.department === deptFilter;
      const matchDesg = desgFilter === 'ALL' || emp.designation === desgFilter;

      return matchSearch && matchType && matchDept && matchDesg;
    });
  }, [employees, search, typeFilter, deptFilter, desgFilter]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(start, start + itemsPerPage);
  }, [filteredEmployees, currentPage]);

  const handleDelete = (emp: Employee) => {
    if (confirm(`Are you sure you want to delete employee ${emp.name} (${emp.id})?`)) {
      deleteEmployee(emp.id);
      showToast('Employee Deleted', `Employee ${emp.id} was removed.`);
    }
  };

  const handleBulkUpload = () => {
    showToast(
      'Bulk Excel Import (Stub)',
      'Bulk import feature is coming soon in the next production release.',
      'info'
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-600" />
              Employee Master Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage university teaching &amp; non-teaching employee profiles
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleBulkUpload}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition"
              title="Bulk Excel Parsing (Stub)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Bulk Excel Upload</span>
            </button>

            {session?.role === 'admin' && (
              <Link
                href="/employees/new"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Employee</span>
              </Link>
            )}
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative md:col-span-1">
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Search by ID, Name, Contact..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
              >
                <option value="ALL">All Employee Types</option>
                <option value="Teaching">Teaching Faculty</option>
                <option value="Non-Teaching">Non-Teaching Staff</option>
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <select
                value={deptFilter}
                onChange={e => { setDeptFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 truncate"
              >
                <option value="ALL">All Departments</option>
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Designation Filter */}
            <div>
              <select
                value={desgFilter}
                onChange={e => { setDesgFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 truncate"
              >
                <option value="ALL">All Designations</option>
                {designations.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* EMPLOYEES TABLE */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Photo</th>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Employee Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Designation &amp; Department</th>
                  <th className="py-3 px-4">Blood &amp; Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedEmployees.length > 0 ? (
                  paginatedEmployees.map(emp => (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-4">
                        <div className="w-10 h-10 rounded-full border border-slate-300 overflow-hidden bg-slate-100 shadow-xs">
                          <img src={emp.photoUrl} alt={emp.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-amber-900 bg-amber-50/50 rounded">
                        {emp.id}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">
                        <Link href={`/employees/${emp.id}`} className="hover:text-amber-600 transition">
                          {emp.name}
                        </Link>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          emp.type === 'Teaching' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {emp.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 max-w-xs">
                        <p className="font-semibold text-slate-800">{emp.designation}</p>
                        <p className="text-[11px] text-slate-500 truncate">{emp.department}</p>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="font-semibold text-rose-700">{emp.bloodGroup}</span>
                        <p className="text-[11px] text-slate-500">{emp.contactNumber}</p>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          emp.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <Link
                            href={`/employees/${emp.id}`}
                            className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                            title="View Employee Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {session?.role === 'admin' && (
                            <>
                              <Link
                                href={`/employees/${emp.id}/edit`}
                                className="p-1.5 rounded hover:bg-blue-50 text-blue-600 hover:text-blue-800"
                                title="Edit Employee"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                              {emp.status !== 'Retired' && (
                                <button
                                  onClick={() => setRetireTarget(emp)}
                                  className="p-1.5 rounded hover:bg-amber-50 text-amber-600 hover:text-amber-800"
                                  title="Retire Employee & Create Pensioner"
                                >
                                  <UserMinus className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(emp)}
                                className="p-1.5 rounded hover:bg-rose-50 text-rose-600 hover:text-rose-800"
                                title="Delete Employee"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          <Link
                            href={`/generate?personId=${emp.id}`}
                            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-amber-400"
                            title="Generate Card"
                          >
                            <Printer className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No employees match your search or filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION BAR */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div>
              Showing <strong className="text-slate-900">{filteredEmployees.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> to{' '}
              <strong className="text-slate-900">{Math.min(currentPage * itemsPerPage, filteredEmployees.length)}</strong> of{' '}
              <strong className="text-slate-900">{filteredEmployees.length}</strong> employees
            </div>

            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-2.5 py-1.5 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold"
              >
                <ChevronLeft className="w-4 h-4 inline" /> Previous
              </button>
              <span className="font-semibold text-slate-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-2.5 py-1.5 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold"
              >
                Next <ChevronRight className="w-4 h-4 inline" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {retireTarget && (
        <RetireEmployeeModal
          isOpen={!!retireTarget}
          onClose={() => setRetireTarget(null)}
          employee={retireTarget}
          onSuccess={reloadData}
        />
      )}
    </AppLayout>
  );
}
