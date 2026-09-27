'use client';

import React, { useState } from 'react';
import { X, Award, Image, FileSignature } from 'lucide-react';
import { AuthorityType, CompetentAuthority } from '@/lib/types';
import { addAuthority, getEmployees } from '@/lib/storage';
import { generateAvatarSvg, generateSignatureSvg } from '@/lib/mockData';
import { useToast } from '../ui/Toast';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: AuthorityType;
}

export function CompetentAuthorityModal({ isOpen, onClose, defaultType = 'Vice-Chancellor' }: ModalProps) {
  const { showToast } = useToast();
  const employees = getEmployees();

  const [type, setType] = useState<AuthorityType>(defaultType);
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [name, setName] = useState('');
  const [effectiveFrom, setEffectiveFrom] = useState(new Date().toISOString().split('T')[0]);
  const [orderNo, setOrderNo] = useState('');
  const [remarks, setRemarks] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [signatureUrl, setSignatureUrl] = useState('');

  if (!isOpen) return null;

  const handleSelectEmployee = (empId: string) => {
    setSelectedEmpId(empId);
    if (empId === 'custom') {
      setName('');
      setPhotoUrl('');
      setSignatureUrl('');
      return;
    }
    const emp = employees.find(e => e.id === empId);
    if (emp) {
      setName(emp.name);
      setPhotoUrl(emp.photoUrl);
      setSignatureUrl(emp.signatureUrl);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPhotoUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setSignatureUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter authority name');
      return;
    }

    const finalPhoto = photoUrl || generateAvatarSvg(name, 'Male', '1e3a8a');
    const finalSignature = signatureUrl || generateSignatureSvg(name);

    const newAuth: CompetentAuthority = {
      id: `AUTH_${Date.now()}`,
      type,
      employeeId: selectedEmpId || 'CUSTOM',
      name,
      photoUrl: finalPhoto,
      signatureUrl: finalSignature,
      effectiveFrom: effectiveFrom || new Date().toISOString().split('T')[0],
      orderNo: orderNo || `F.No. UoH/${type === 'Vice-Chancellor' ? 'VC' : 'Reg'}/Ord/${new Date().getFullYear()}/01`,
      remarks: remarks || `Newly designated ${type}`
    };

    addAuthority(newAuth);
    showToast('Competent Authority Updated', `${type} authority updated to ${name}. Prior records kept in history.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-base">Change Competent Authority</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Authority Position</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('Vice-Chancellor')}
                className={`py-2 px-3 rounded-md text-xs font-semibold border transition ${
                  type === 'Vice-Chancellor'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Vice-Chancellor
              </button>
              <button
                type="button"
                onClick={() => setType('Registrar')}
                className={`py-2 px-3 rounded-md text-xs font-semibold border transition ${
                  type === 'Registrar'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Registrar
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Existing Employee or Custom</label>
            <select
              value={selectedEmpId}
              onChange={e => handleSelectEmployee(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500"
            >
              <option value="">-- Choose from existing employees --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.id} - {emp.name} ({emp.designation}, {emp.department})
                </option>
              ))}
              <option value="custom">-- Enter Custom Authority External Name --</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Prof. B. J. Rao / Dr. Devesh Nigam"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Effective Date *</label>
              <input
                type="date"
                value={effectiveFrom}
                onChange={e => setEffectiveFrom(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Order / Notification No.</label>
              <input
                type="text"
                value={orderNo}
                onChange={e => setOrderNo(e.target.value)}
                placeholder="F.No. UoH/VC/Ord/2026/..."
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Remarks / Note</label>
            <textarea
              rows={2}
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="e.g. Appointed as per University Executive Council resolution..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Photo & Signature Uploads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Image className="w-3.5 h-3.5 text-slate-500" />
                Authority Photo (JPG/PNG &lt; 2MB)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handlePhotoUpload}
                className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />
              {photoUrl && (
                <div className="mt-2 w-16 h-16 rounded border overflow-hidden bg-slate-50">
                  <img src={photoUrl} alt="Photo Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <FileSignature className="w-3.5 h-3.5 text-slate-500" />
                Official Signature (JPG/PNG &lt; 2MB)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleSignatureUpload}
                className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />
              {signatureUrl && (
                <div className="mt-2 h-10 w-28 rounded border p-1 bg-white">
                  <img src={signatureUrl} alt="Signature Preview" className="w-full h-full object-contain" />
                </div>
              )}
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
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition shadow"
            >
              Save Authority Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
