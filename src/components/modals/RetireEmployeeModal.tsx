'use client';

import React, { useState } from 'react';
import { X, UserMinus, Calendar, FileText } from 'lucide-react';
import { Employee } from '@/lib/types';
import { retireEmployee } from '@/lib/storage';
import { useToast } from '../ui/Toast';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  onSuccess?: () => void;
}

export function RetireEmployeeModal({ isOpen, onClose, employee, onSuccess }: ModalProps) {
  const { showToast } = useToast();
  const [dateOfRetirement, setDateOfRetirement] = useState(
    employee.dor || new Date().toISOString().split('T')[0]
  );
  const [pensionOrderNo, setPensionOrderNo] = useState(
    `PPO/UOH/${new Date().getFullYear()}/${employee.id}`
  );
  const [pensionPayOrder, setPensionPayOrder] = useState(
    `PPO/UOH/${new Date().getFullYear()}/${employee.id}`
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateOfRetirement) {
      alert('Please select date of retirement');
      return;
    }

    const pensioner = retireEmployee(employee.id, dateOfRetirement, pensionOrderNo, pensionPayOrder);
    if (pensioner) {
      showToast(
        'Employee Retired',
        `Employee ${employee.name} (${employee.id}) has been retired and converted to a Pensioner record.`
      );
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-amber-900 text-white">
          <div className="flex items-center space-x-2">
            <UserMinus className="w-5 h-5 text-amber-300" />
            <h3 className="font-semibold text-base">Retire Employee</h3>
          </div>
          <button onClick={onClose} className="text-amber-200 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
            <p className="font-semibold">{employee.name} (ID: {employee.id})</p>
            <p className="mt-0.5 opacity-90">{employee.designation} &bull; {employee.department}</p>
            <p className="mt-1 text-[11px] text-amber-800">
              Retiring will mark this employee as &quot;Retired&quot; and automatically generate a Pensioner record carrying forward all basic profile, photo, and signature assets.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Retirement *</label>
            <div className="relative">
              <input
                type="date"
                value={dateOfRetirement}
                onChange={e => setDateOfRetirement(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500"
                required
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pension Payment Order (PPO) No.</label>
            <div className="relative">
              <input
                type="text"
                value={pensionOrderNo}
                onChange={e => {
                  setPensionOrderNo(e.target.value);
                  setPensionPayOrder(e.target.value);
                }}
                placeholder="PPO/UOH/2026/..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500"
              />
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-600 rounded-md transition shadow"
            >
              Confirm Retirement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
