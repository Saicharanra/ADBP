'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { getPensioners, deletePensioner, savePensioner, getSession } from '@/lib/storage';
import { Pensioner } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';
import {
  UserSquare2,
  Search,
  Printer,
  Edit,
  Trash2,
  X
} from 'lucide-react';

export default function PensionersPage() {
  const { showToast } = useToast();
  const session = getSession();

  const [pensioners, setPensioners] = useState<Pensioner[]>([]);
  const [search, setSearch] = useState('');
  const [editingPensioner, setEditingPensioner] = useState<Pensioner | null>(null);

  const reloadData = () => {
    setPensioners(getPensioners());
  };

  useEffect(() => {
    reloadData();
    window.addEventListener('adps-storage-update', reloadData);
    return () => window.removeEventListener('adps-storage-update', reloadData);
  }, []);

  const filteredPensioners = useMemo(() => {
    return pensioners.filter(p => {
      return (
        search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.includes(search) ||
        p.pensionOrderNo.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [pensioners, search]);

  const handleDelete = (p: Pensioner) => {
    if (confirm(`Are you sure you want to delete pensioner record ${p.name} (${p.id})?`)) {
      deletePensioner(p.id);
      showToast('Pensioner Deleted', `Pensioner ID ${p.id} was removed.`);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPensioner) return;
    savePensioner(editingPensioner);
    showToast('Pensioner Updated', `Updated details for ${editingPensioner.name}`);
    setEditingPensioner(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <UserSquare2 className="w-6 h-6 text-amber-600" />
              Pensioners Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Retired university personnel, PPO order numbers &amp; pensioner identity records
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/generate?cardType=Pensioner Card"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow transition"
            >
              <Printer className="w-4 h-4" />
              <span>Issue Pensioner Card</span>
            </Link>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="relative max-w-md">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by Name, Pensioner ID, or PPO Order No..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* PENSIONERS TABLE */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Photo</th>
                  <th className="py-3 px-4">Pensioner ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Last Designation &amp; Department</th>
                  <th className="py-3 px-4">PPO Order No.</th>
                  <th className="py-3 px-4">Retirement Date</th>
                  <th className="py-3 px-4">Contact &amp; Blood</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPensioners.length > 0 ? (
                  filteredPensioners.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-4">
                        <div className="w-10 h-10 rounded-full border border-slate-300 overflow-hidden bg-slate-100 shadow-xs">
                          <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-amber-900 bg-amber-50/50 rounded">
                        {p.id}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{p.name}</td>
                      <td className="py-2.5 px-4 max-w-xs">
                        <p className="font-semibold text-slate-800">{p.lastDesignation}</p>
                        <p className="text-[11px] text-slate-500 truncate">{p.lastDepartment}</p>
                      </td>
                      <td className="py-2.5 px-4 font-mono text-xs font-semibold text-slate-700">
                        {p.pensionOrderNo}
                      </td>
                      <td className="py-2.5 px-4 font-medium text-slate-600">
                        {p.dateOfRetirement}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="font-semibold text-rose-700">{p.bloodGroup}</span>
                        <p className="text-[11px] text-slate-500">{p.contactNumber}</p>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setEditingPensioner(p)}
                            className="p-1.5 rounded hover:bg-blue-50 text-blue-600 hover:text-blue-800"
                            title="Edit Pensioner Details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {session?.role === 'admin' && (
                            <button
                              onClick={() => handleDelete(p)}
                              className="p-1.5 rounded hover:bg-rose-50 text-rose-600 hover:text-rose-800"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          <Link
                            href={`/generate?personId=${p.id}&cardType=Pensioner Card`}
                            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-amber-400"
                            title="Generate Pensioner Card"
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
                      No pensioner records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* EDIT PENSIONER MODAL */}
      {editingPensioner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-semibold text-base">Edit Pensioner Record ({editingPensioner.id})</h3>
              <button onClick={() => setEditingPensioner(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pensioner Name</label>
                <input
                  type="text"
                  value={editingPensioner.name}
                  onChange={e => setEditingPensioner({ ...editingPensioner, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Last Designation</label>
                  <input
                    type="text"
                    value={editingPensioner.lastDesignation}
                    onChange={e => setEditingPensioner({ ...editingPensioner, lastDesignation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">PPO Order No.</label>
                  <input
                    type="text"
                    value={editingPensioner.pensionOrderNo}
                    onChange={e => setEditingPensioner({ ...editingPensioner, pensionOrderNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Retirement</label>
                <input
                  type="date"
                  value={editingPensioner.dateOfRetirement}
                  onChange={e => setEditingPensioner({ ...editingPensioner, dateOfRetirement: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Address</label>
                <textarea
                  rows={2}
                  value={editingPensioner.address}
                  onChange={e => setEditingPensioner({ ...editingPensioner, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingPensioner(null)}
                  className="px-4 py-2 text-xs text-slate-600 bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md"
                >
                  Save Pensioner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
