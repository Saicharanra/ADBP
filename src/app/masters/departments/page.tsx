'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { getDepartments, saveDepartment } from '@/lib/storage';
import { MasterItem } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';
import { Building2, Plus, Edit, X } from 'lucide-react';

export default function DepartmentsPage() {
  const { showToast } = useToast();
  const [departments, setDepartments] = useState<MasterItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterItem | null>(null);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'Active' | 'In-Active'>('Active');

  const reloadData = () => {
    setDepartments(getDepartments());
  };

  useEffect(() => {
    reloadData();
    window.addEventListener('adps-storage-update', reloadData);
    return () => window.removeEventListener('adps-storage-update', reloadData);
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setCode('');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (item: MasterItem) => {
    setEditingItem(item);
    setName(item.name);
    setCode(item.code || '');
    setStatus(item.status);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (item: MasterItem) => {
    const updated: MasterItem = {
      ...item,
      status: item.status === 'Active' ? 'In-Active' : 'Active'
    };
    saveDepartment(updated);
    showToast('Status Updated', `Department "${item.name}" set to ${updated.status}.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: MasterItem = {
      id: editingItem ? editingItem.id : `DEPT_${Date.now()}`,
      name,
      code: code || name.split(' ').map(w => w[0]).join('').substring(0, 5).toUpperCase(),
      status
    };

    saveDepartment(newItem);
    showToast(
      editingItem ? 'Department Updated' : 'Department Created',
      `Saved department "${name}"`
    );
    setIsModalOpen(false);
  };

  return (
    <AppLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-6 h-6 text-emerald-600" />
              Department Master
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Configure academic schools, research centers, and administrative departments
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </button>
        </div>

        {/* DEPARTMENTS TABLE */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Master ID</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Department / School Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {departments.map(d => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-500">{d.id}</td>
                  <td className="py-3 px-4 font-mono font-extrabold text-amber-900 bg-amber-50 px-2 py-0.5 rounded inline-block my-2">
                    {d.code || 'DEPT'}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{d.name}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleStatus(d)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                        d.status === 'Active'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                          : 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100'
                      }`}
                    >
                      {d.status} (Click to toggle)
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => openEditModal(d)}
                      className="p-1.5 rounded hover:bg-blue-50 text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-semibold text-base">{editingItem ? 'Edit Department' : 'Add New Department'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department / School Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. School of Physics"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. PHYS"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs font-mono focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as 'Active' | 'In-Active')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Active">Active</option>
                  <option value="In-Active">In-Active</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
