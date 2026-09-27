'use client';

import React, { useState } from 'react';
import { X, Users, Image } from 'lucide-react';
import { Dependent, DependentRelationship, Gender, BloodGroup } from '@/lib/types';
import { getDependentsForEmployee, saveDependent } from '@/lib/storage';
import { generateAvatarSvg } from '@/lib/mockData';
import { useToast } from '../ui/Toast';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  dependent?: Dependent | null;
}

export function DependentModal({ isOpen, onClose, employeeId, dependent }: ModalProps) {
  const { showToast } = useToast();

  // Auto-generate dependent ID if creating new
  const existingList = getDependentsForEmployee(employeeId);
  const nextNumber = existingList.length + 1;
  const autoId = dependent ? dependent.id : `${employeeId}_${nextNumber < 10 ? '0' : ''}${nextNumber}`;

  const [name, setName] = useState(dependent ? dependent.name : '');
  const [dob, setDob] = useState(dependent ? dependent.dob : '');
  const [age, setAge] = useState<number | string>(dependent?.age !== undefined ? dependent.age : '');
  const [gender, setGender] = useState<Gender>(dependent ? dependent.gender : 'Male');
  const [relationship, setRelationship] = useState<DependentRelationship>(
    dependent ? dependent.relationship : 'Spouse'
  );
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(dependent ? dependent.bloodGroup : 'O+');
  const [status, setStatus] = useState<'Active' | 'In-Active'>(dependent ? dependent.status : 'Active');
  const [photoUrl, setPhotoUrl] = useState<string>(dependent ? dependent.photoUrl : '');

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Photo must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPhotoUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const calculateAgeFromDob = (dobStr: string) => {
    if (!dobStr) return;
    const birthDate = new Date(dobStr);
    const today = new Date();
    let computedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      computedAge--;
    }
    setAge(computedAge);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter dependent name');
      return;
    }

    const finalPhoto = photoUrl || generateAvatarSvg(name, gender, 'be185d');

    const depData: Dependent = {
      id: autoId,
      employeeId,
      name,
      dob: dob || '2000-01-01',
      age: age !== '' ? Number(age) : 25,
      gender,
      relationship,
      bloodGroup,
      photoUrl: finalPhoto,
      status
    };

    saveDependent(depData);
    showToast(
      dependent ? 'Dependent Updated' : 'Dependent Added',
      `Dependent ${name} (${autoId}) saved successfully.`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-base">
              {dependent ? 'Edit Dependent' : 'Add New Dependent'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Dependent ID (Auto-generated)</label>
            <input
              type="text"
              value={autoId}
              disabled
              className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md text-xs font-mono text-slate-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Smt. Sudha Sharma / Aarav Sharma"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship *</label>
              <select
                value={relationship}
                onChange={e => setRelationship(e.target.value as DependentRelationship)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Spouse">Spouse</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender *</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as Gender)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={e => {
                  setDob(e.target.value);
                  calculateAgeFromDob(e.target.value);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Age (Years)</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                placeholder="e.g. 14"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={e => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-emerald-500"
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as 'Active' | 'In-Active')}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Active">Active</option>
                <option value="In-Active">In-Active</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Image className="w-3.5 h-3.5 text-slate-500" />
              Dependent Photo (JPG/PNG &lt; 2MB)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handlePhotoUpload}
              className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
            />
            {photoUrl && (
              <div className="mt-2 w-16 h-16 rounded border overflow-hidden bg-slate-50">
                <img src={photoUrl} alt="Dependent Preview" className="w-full h-full object-cover" />
              </div>
            )}
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
              Save Dependent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
