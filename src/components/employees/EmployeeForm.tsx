'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Employee, EmployeeType, Gender, BloodGroup } from '@/lib/types';
import { getDepartments, getDesignations, getEmployeeById, saveEmployee } from '@/lib/storage';
import { generateAvatarSvg, generateSignatureSvg } from '@/lib/mockData';
import { useToast } from '../ui/Toast';
import { User, Image, FileSignature, Save, RotateCcw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface EmployeeFormProps {
  employeeId?: string; // If editing
}

export function EmployeeForm({ employeeId }: EmployeeFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const isEdit = !!employeeId;
  const existingEmployee = isEdit ? getEmployeeById(employeeId) : undefined;

  const departments = getDepartments();
  const designations = getDesignations();

  // Form Fields
  const [id, setId] = useState(existingEmployee ? existingEmployee.id : '');
  const [name, setName] = useState(existingEmployee ? existingEmployee.name : '');
  const [type, setType] = useState<EmployeeType>(existingEmployee ? existingEmployee.type : 'Teaching');
  const [designation, setDesignation] = useState(existingEmployee ? existingEmployee.designation : (designations[0]?.name || 'Professor'));
  const [department, setDepartment] = useState(existingEmployee ? existingEmployee.department : (departments[0]?.name || 'School of Computer and Information Sciences'));
  const [dob, setDob] = useState(existingEmployee ? existingEmployee.dob : '1985-05-15');
  const [doj, setDoj] = useState(existingEmployee ? existingEmployee.doj : '2010-08-01');
  const [dor, setDor] = useState(existingEmployee ? existingEmployee.dor : '2045-05-31');
  const [gender, setGender] = useState<Gender>(existingEmployee ? existingEmployee.gender : 'Male');

  const [permanentAddress, setPermanentAddress] = useState(existingEmployee ? existingEmployee.permanentAddress : '');
  const [presentAddress, setPresentAddress] = useState(existingEmployee ? existingEmployee.presentAddress : '');
  const [sameAsPermanent, setSameAsPermanent] = useState(false);

  const [contactNumber, setContactNumber] = useState(existingEmployee ? existingEmployee.contactNumber : '');
  const [altContactNumber, setAltContactNumber] = useState(existingEmployee ? existingEmployee.altContactNumber || '' : '');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(existingEmployee ? existingEmployee.bloodGroup : 'O+');
  const [status, setStatus] = useState<'Active' | 'Retired' | 'In-Active'>(existingEmployee ? existingEmployee.status : 'Active');

  const [photoUrl, setPhotoUrl] = useState<string>(existingEmployee ? existingEmployee.photoUrl : '');
  const [signatureUrl, setSignatureUrl] = useState<string>(existingEmployee ? existingEmployee.signatureUrl : '');

  const [error, setError] = useState('');

  // Handle "Present Address same as Permanent Address"
  useEffect(() => {
    if (sameAsPermanent) {
      setPresentAddress(permanentAddress);
    }
  }, [sameAsPermanent, permanentAddress]);

  const handleSameAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSameAsPermanent(checked);
    if (checked) {
      setPresentAddress(permanentAddress);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Photo file size must be less than 2MB');
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
        alert('Signature file size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setSignatureUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    if (existingEmployee) {
      setId(existingEmployee.id);
      setName(existingEmployee.name);
      setType(existingEmployee.type);
      setDesignation(existingEmployee.designation);
      setDepartment(existingEmployee.department);
      setDob(existingEmployee.dob);
      setDoj(existingEmployee.doj);
      setDor(existingEmployee.dor || '');
      setGender(existingEmployee.gender);
      setPermanentAddress(existingEmployee.permanentAddress);
      setPresentAddress(existingEmployee.presentAddress);
      setContactNumber(existingEmployee.contactNumber);
      setAltContactNumber(existingEmployee.altContactNumber || '');
      setBloodGroup(existingEmployee.bloodGroup);
      setPhotoUrl(existingEmployee.photoUrl);
      setSignatureUrl(existingEmployee.signatureUrl);
      setStatus(existingEmployee.status);
    } else {
      setId('');
      setName('');
      setType('Teaching');
      setDesignation(designations[0]?.name || '');
      setDepartment(departments[0]?.name || '');
      setDob('1985-05-15');
      setDoj('2010-08-01');
      setDor('2045-05-31');
      setGender('Male');
      setPermanentAddress('');
      setPresentAddress('');
      setSameAsPermanent(false);
      setContactNumber('');
      setAltContactNumber('');
      setBloodGroup('O+');
      setPhotoUrl('');
      setSignatureUrl('');
      setStatus('Active');
    }
    setError('');
    showToast('Form Reset', 'All input fields have been reset.', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!id.trim() || id.length !== 4 || !/^\d{4}$/.test(id)) {
      setError('Employee ID must be a unique 4-digit number (e.g. 1006)');
      return;
    }

    if (!isEdit && getEmployeeById(id)) {
      setError(`Employee ID ${id} already exists in the system. Please use a unique 4-digit ID.`);
      return;
    }

    if (!name.trim()) {
      setError('Please enter employee full name');
      return;
    }

    if (!contactNumber.trim()) {
      setError('Please enter contact number');
      return;
    }

    const finalPhoto = photoUrl || generateAvatarSvg(name, gender, '1e3a8a');
    const finalSignature = signatureUrl || generateSignatureSvg(name);

    const empData: Employee = {
      id,
      name,
      type,
      designation,
      department,
      dob,
      doj,
      dor,
      gender,
      permanentAddress,
      presentAddress: sameAsPermanent ? permanentAddress : presentAddress,
      contactNumber,
      altContactNumber,
      bloodGroup,
      photoUrl: finalPhoto,
      signatureUrl: finalSignature,
      status
    };

    saveEmployee(empData);
    showToast(
      isEdit ? 'Employee Updated' : 'Employee Created',
      `Employee ${name} (ID: ${id}) has been successfully saved.`
    );
    router.push('/employees');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <Link href="/employees" className="text-xs text-amber-600 hover:underline flex items-center gap-1 font-semibold mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Employee Directory
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isEdit ? `Edit Employee Record (${employeeId})` : 'Create New Employee Record'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            FRD compliant employee registration and profile configuration
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        {error && (
          <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg font-medium">
            {error}
          </div>
        )}

        {/* SECTION 1: BASIC INFORMATION */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-amber-600" />
            1. Basic Personnel Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Employee ID (4-Digit Unique) *</label>
              <input
                type="text"
                value={id}
                maxLength={4}
                disabled={isEdit}
                onChange={e => setId(e.target.value)}
                placeholder="e.g. 1006"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs font-mono font-bold text-amber-900 bg-amber-50/40 focus:ring-2 focus:ring-amber-500 disabled:opacity-75 disabled:cursor-not-allowed"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Not editable after creation</span>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name (with Honorific) *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Dr. Ramesh Chandra Sharma"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Employee Category *</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as EmployeeType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500"
              >
                <option value="Teaching">Teaching Faculty</option>
                <option value="Non-Teaching">Non-Teaching Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Designation *</label>
              <select
                value={designation}
                onChange={e => setDesignation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500"
              >
                {designations.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department / School *</label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender *</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as Gender)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: DATES & CONTACT & BLOOD */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            2. Service Dates &amp; Emergency Contact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Joining *</label>
              <input
                type="date"
                value={doj}
                onChange={e => setDoj(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Retirement</label>
              <input
                type="date"
                value={dor}
                onChange={e => setDor(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group *</label>
              <select
                value={bloodGroup}
                onChange={e => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs font-bold text-rose-700 focus:ring-2 focus:ring-amber-500"
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Contact *</label>
              <input
                type="tel"
                value={contactNumber}
                onChange={e => setContactNumber(e.target.value)}
                placeholder="e.g. 9849012345"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alt. / Emergency Contact</label>
              <input
                type="tel"
                value={altContactNumber}
                onChange={e => setAltContactNumber(e.target.value)}
                placeholder="e.g. 040-23134000"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: ADDRESS DETAILS */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            3. Address Information
          </h2>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Permanent Address *</label>
              <textarea
                rows={2}
                value={permanentAddress}
                onChange={e => setPermanentAddress(e.target.value)}
                placeholder="Plot / Qtr No., Street, City, State - Pincode"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Present Address</label>
                <label className="flex items-center space-x-1.5 cursor-pointer text-xs font-medium text-amber-700">
                  <input
                    type="checkbox"
                    checked={sameAsPermanent}
                    onChange={handleSameAddressChange}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Present Address same as Permanent Address</span>
                </label>
              </div>
              <textarea
                rows={2}
                value={presentAddress}
                onChange={e => setPresentAddress(e.target.value)}
                disabled={sameAsPermanent}
                placeholder="Plot / Qtr No., Street, Campus, City - Pincode"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: ASSETS & MEDIA */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            4. Photo &amp; Signature Uploads
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <Image className="w-4 h-4 text-slate-500" />
                Employee Photo (JPG/JPEG/PNG &lt; 2MB)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handlePhotoUpload}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
              />
              {photoUrl && (
                <div className="mt-3 flex items-center space-x-3">
                  <div className="w-16 h-20 rounded border border-slate-300 overflow-hidden bg-white shadow-xs">
                    <img src={photoUrl} alt="Photo Preview" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">● Photo loaded &amp; ready</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <FileSignature className="w-4 h-4 text-slate-500" />
                Specimen Signature (JPG/JPEG/PNG &lt; 2MB)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleSignatureUpload}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
              />
              {signatureUrl && (
                <div className="mt-3 flex items-center space-x-3">
                  <div className="h-10 w-28 rounded border border-slate-300 p-1 bg-white shadow-xs flex items-center justify-center">
                    <img src={signatureUrl} alt="Signature Preview" className="max-h-full max-w-full object-contain" />
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">● Signature loaded</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BUTTON BAR */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Form</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center space-x-1.5 px-6 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{isEdit ? 'Update Employee' : 'Submit & Save Record'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
