'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { getOperators, addOperator, getEmployees } from '@/lib/storage';
import { OperatorAccount } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';
import { UserPlus, UserCheck, Plus } from 'lucide-react';

export default function OperatorsPage() {
  const { showToast } = useToast();
  const [operators, setOperators] = useState<OperatorAccount[]>([]);
  const employees = getEmployees();

  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const reloadData = () => {
    setOperators(getOperators());
  };

  useEffect(() => {
    reloadData();
    window.addEventListener('adps-storage-update', reloadData);
    return () => window.removeEventListener('adps-storage-update', reloadData);
  }, []);

  const handleSelectEmp = (empId: string) => {
    setSelectedEmpId(empId);
    setUsername(empId);
  };

  const handleCreateOperator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert('Please enter username and password');
      return;
    }

    const emp = employees.find(e => e.id === selectedEmpId);

    const newOp: OperatorAccount = {
      id: `OP_${Date.now()}`,
      employeeId: selectedEmpId || 'STAFF',
      username,
      name: emp ? emp.name : `Operator (${username})`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    addOperator(newOp);
    showToast('Operator Provisioned', `Created operator login for ${newOp.name} (${newOp.username})`);
    setSelectedEmpId('');
    setUsername('');
    setPassword('');
  };

  return (
    <AppLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="pb-4 border-b border-slate-200">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-teal-600" />
            Create &amp; Manage Operator Logins
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Provision staff login credentials for Card Printing Operators
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* CREATE OPERATOR FORM */}
          <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-teal-600" />
              Provision New Operator
            </h2>

            <form onSubmit={handleCreateOperator} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select University Employee</label>
                <select
                  value={selectedEmpId}
                  onChange={e => handleSelectEmp(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="">-- Choose employee --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.id} - {emp.name} ({emp.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Operator Username / ID *</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="e.g. 1003 or operator2"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Password *</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-lg shadow transition"
              >
                Create Operator Login
              </button>
            </form>
          </div>

          {/* ACTIVE OPERATORS LIST */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Active Operator Accounts ({operators.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-semibold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Username</th>
                    <th className="py-2.5 px-3">Operator Name</th>
                    <th className="py-2.5 px-3">Emp ID</th>
                    <th className="py-2.5 px-3">Created Date</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {operators.map(op => (
                    <tr key={op.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-900">{op.username}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{op.name}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{op.employeeId}</td>
                      <td className="py-2.5 px-3 text-slate-500">{op.createdAt}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {op.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
