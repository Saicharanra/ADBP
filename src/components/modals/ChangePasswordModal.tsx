'use client';

import React, { useState } from 'react';
import { X, Lock, KeyRound, Check } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { addActivityLog } from '@/lib/storage';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ModalProps) {
  const { showToast } = useToast();
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass) {
      setError('Please enter your current password');
      return;
    }
    if (newPass.length < 4) {
      setError('New password must be at least 4 characters long');
      return;
    }
    if (newPass !== confirmPass) {
      setError('New passwords do not match');
      return;
    }

    addActivityLog('CHANGE_PASSWORD', 'Operator changed account password successfully.');
    showToast('Password Changed', 'Your password has been updated successfully.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center space-x-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-base">Change Operator Password</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-md font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
            <div className="relative">
              <input
                type="password"
                value={currentPass}
                onChange={e => { setCurrentPass(e.target.value); setError(''); }}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter current password"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type="password"
                value={newPass}
                onChange={e => { setNewPass(e.target.value); setError(''); }}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter new password"
                required
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <input
                type="password"
                value={confirmPass}
                onChange={e => { setConfirmPass(e.target.value); setError(''); }}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Re-enter new password"
                required
              />
              <Check className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-md transition shadow"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
