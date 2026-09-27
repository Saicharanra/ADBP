'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { getActivityLogs } from '@/lib/storage';
import { ActivityLog } from '@/lib/types';
import { History, Clock } from 'lucide-react';

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  const reloadData = () => {
    setLogs(getActivityLogs());
  };

  useEffect(() => {
    reloadData();
    window.addEventListener('adps-storage-update', reloadData);
    return () => window.removeEventListener('adps-storage-update', reloadData);
  }, []);

  return (
    <AppLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="pb-4 border-b border-slate-200">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-600" />
            System Activity Log &amp; Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time audit log of user logins, card printings, authority changes &amp; record updates
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 inline mr-1.5 text-slate-400" />
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{log.username}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-900">{log.action}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
