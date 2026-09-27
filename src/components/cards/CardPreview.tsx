'use client';

import React from 'react';
import { CardTemplate, Employee, Dependent, Pensioner, CompetentAuthority } from '@/lib/types';
import { UOH_LOGO_SVG, SECOND_LOGO_SVG } from '@/lib/mockData';
import { getCurrentAuthority } from '@/lib/storage';
import { QRCodeGenerator } from './QRCodeGenerator';

interface CardPreviewProps {
  template: CardTemplate;
  person: Employee | Pensioner;
  dependents?: Dependent[];
  authorityOverride?: CompetentAuthority;
  side?: 'front' | 'back' | 'both';
  scale?: number;
  printMode?: boolean;
}

export function CardPreview({
  template,
  person,
  dependents = [],
  authorityOverride,
  side = 'both',
  scale = 1,
  printMode = false
}: CardPreviewProps) {

  // Current competent authority signature
  const currentVC = authorityOverride || getCurrentAuthority('Vice-Chancellor');
  const currentReg = getCurrentAuthority('Registrar');
  const authorityToUse = currentVC || currentReg;

  // Compute QR Payload
  let qrPayload = person.id;
  if (template.cardType === 'Health Card') {
    qrPayload = JSON.stringify({
      empId: person.id,
      name: person.name,
      dept: 'department' in person ? person.department : person.lastDepartment,
      bloodGroup: person.bloodGroup,
      dependentsCount: dependents.length,
      dependents: dependents.map(d => ({ id: d.id, name: d.name, rel: d.relationship }))
    });
  }

  const isPensioner = 'pensionOrderNo' in person;

  // Front Card JSX
  const renderFront = () => (
    <div
      style={{
        width: `${template.widthMm * 4}px`, // ~342px
        height: `${template.heightMm * 4}px`, // ~216px
        backgroundColor: template.cardBgColor || '#ffffff',
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top left'
      }}
      className={`relative rounded-xl border border-slate-300 overflow-hidden flex flex-col justify-between text-slate-800 font-sans select-none ${
        printMode ? 'print:shadow-none print:border-black' : 'pvc-card-shadow pvc-card-shine'
      }`}
    >
      {/* Top Header Bar */}
      <div
        style={{
          backgroundColor: template.headerBgColor || '#1e3a8a',
          color: template.headerTextColor || '#ffffff'
        }}
        className="px-3 py-1.5 flex items-center justify-between relative shadow-xs"
      >
        {/* Left Logo */}
        <div className="w-8 h-8 flex-shrink-0 bg-white/15 rounded-full p-0.5 border border-white/30 shadow-xs">
          <img src={UOH_LOGO_SVG} alt="University Logo" className="w-full h-full object-contain" />
        </div>

        {/* Center Header Text */}
        <div className="flex-1 text-center px-1">
          {template.headerLines.map((line, idx) => (
            <p
              key={idx}
              className={`leading-tight ${
                idx === 0
                  ? 'font-black text-[11px] uppercase tracking-wide drop-shadow-xs'
                  : 'text-[8.5px] font-semibold opacity-90'
              }`}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Right Logo (if 2 logos enabled) */}
        {template.numberOfLogos === 2 && (
          <div className="w-8 h-8 flex-shrink-0 bg-white/15 rounded-full p-0.5 border border-white/30 shadow-xs">
            <img src={SECOND_LOGO_SVG} alt="NAAC Emblem" className="w-full h-full object-contain" />
          </div>
        )}
      </div>

      {/* Header Divider Line */}
      {template.hasHeaderDivider && (
        <div style={{ backgroundColor: template.accentColor || '#d97706' }} className="h-0.5 w-full shadow-xs" />
      )}

      {/* Card Title Strip */}
      <div
        style={{
          color: template.headerBgColor || '#1e3a8a',
          textAlign: template.titleAlignment || 'center',
          fontFamily: template.titleFont || 'sans-serif'
        }}
        className="px-3 py-0.5 font-extrabold text-[10px] tracking-widest uppercase border-b border-slate-200/80 bg-slate-50/90 shadow-2xs"
      >
        {template.titleText || template.cardType.toUpperCase()}
      </div>

      {/* Main Front Body */}
      <div className="flex-1 px-3 py-1.5 flex items-center space-x-3 overflow-hidden relative">
        {/* Holographic Seal Background Watermark */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <img src={UOH_LOGO_SVG} alt="Watermark" className="w-28 h-28 object-contain" />
        </div>

        {/* Person Photo */}
        {template.frontFields.photo && (
          <div className="flex flex-col items-center flex-shrink-0 z-10">
            <div
              style={{
                width: `${template.photoWidth || 75}px`,
                height: `${template.photoHeight || 90}px`
              }}
              className="rounded-lg border-2 border-slate-300/90 overflow-hidden bg-slate-100 shadow-sm"
            >
              <img src={person.photoUrl} alt={person.name} className="w-full h-full object-cover" />
            </div>
            {template.frontFields.signature && person.signatureUrl && (
              <div className="mt-1 h-6 w-20 flex items-center justify-center">
                <img src={person.signatureUrl} alt="Signature" className="max-h-full max-w-full object-contain" />
              </div>
            )}
          </div>
        )}

        {/* Info Fields Column */}
        <div className="flex-1 min-w-0 text-[10px] leading-tight space-y-0.5 z-10">
          {template.frontFields.name && (
            <div>
              <span className="text-[7.5px] uppercase tracking-wider text-slate-400 font-extrabold block">Full Name</span>
              <p className="font-extrabold text-slate-900 truncate text-[11px]">{person.name}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 pt-0.5">
            {template.frontFields.employeeId && (
              <div>
                <span className="text-[7.5px] uppercase tracking-wider text-slate-400 font-extrabold block">
                  {isPensioner ? 'Pensioner ID' : 'Employee ID'}
                </span>
                <p className="font-mono font-extrabold text-amber-900 bg-amber-100/80 px-1.5 py-0.2 rounded border border-amber-300/80 inline-block text-[10px] shadow-2xs">
                  {person.id}
                </p>
              </div>
            )}

            {template.frontFields.bloodGroup && (
              <div>
                <span className="text-[7.5px] uppercase tracking-wider text-slate-400 font-extrabold block">Blood Group</span>
                <p className="font-extrabold text-rose-700 text-[10px]">{person.bloodGroup}</p>
              </div>
            )}
          </div>

          {template.frontFields.designation && (
            <div>
              <span className="text-[7.5px] uppercase tracking-wider text-slate-400 font-extrabold block">
                {isPensioner ? 'Last Designation' : 'Designation'}
              </span>
              <p className="font-bold text-slate-800 truncate text-[9.5px]">
                {isPensioner ? (person as Pensioner).lastDesignation : (person as Employee).designation}
              </p>
            </div>
          )}

          {template.frontFields.department && (
            <div>
              <span className="text-[7.5px] uppercase tracking-wider text-slate-400 font-extrabold block">Department / School</span>
              <p className="font-semibold text-slate-700 truncate text-[9px]">
                {isPensioner ? (person as Pensioner).lastDepartment : (person as Employee).department}
              </p>
            </div>
          )}

          {isPensioner && (person as Pensioner).pensionOrderNo && (
            <div>
              <span className="text-[7.5px] uppercase tracking-wider text-slate-400 font-extrabold block">PPO Order No.</span>
              <p className="font-mono text-[8.5px] text-slate-800 font-bold">{ (person as Pensioner).pensionOrderNo }</p>
            </div>
          )}

          <div className="flex items-center space-x-3 text-[8.5px] text-slate-600 pt-0.5">
            {template.frontFields.dob && person.dob && (
              <span>DOB: <strong className="text-slate-800">{person.dob}</strong></span>
            )}
            {template.frontFields.doj && 'doj' in person && (person as Employee).doj && (
              <span>DOJ: <strong className="text-slate-800">{(person as Employee).doj}</strong></span>
            )}
          </div>
        </div>

        {/* QR Code Column */}
        {template.frontFields.qrCode && (
          <div className="flex-shrink-0 flex flex-col items-center justify-center p-1 bg-white rounded-lg border border-slate-200/80 shadow-2xs z-10">
            <QRCodeGenerator value={qrPayload} size={template.qrSize || 60} />
            <span className="text-[6.5px] text-slate-400 font-mono font-bold mt-0.5 tracking-wider uppercase">SECURE QR</span>
          </div>
        )}
      </div>

      {/* Bottom Accent Bar */}
      <div style={{ backgroundColor: template.headerBgColor || '#1e3a8a' }} className="h-1.5 w-full shadow-2xs" />
    </div>
  );

  // Back Card JSX
  const renderBack = () => (
    <div
      style={{
        width: `${template.widthMm * 4}px`,
        height: `${template.heightMm * 4}px`,
        backgroundColor: template.cardBgColor || '#ffffff',
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top left'
      }}
      className={`relative rounded-xl border border-slate-300 overflow-hidden flex flex-col justify-between text-slate-800 font-sans select-none ${
        printMode ? 'print:shadow-none print:border-black' : 'pvc-card-shadow pvc-card-shine'
      }`}
    >
      {/* Top Strip */}
      <div
        style={{
          backgroundColor: template.headerBgColor || '#1e3a8a',
          color: template.headerTextColor || '#ffffff'
        }}
        className="px-3 py-1 flex items-center justify-between text-[9px] font-extrabold tracking-wider uppercase shadow-2xs"
      >
        <span>{template.cardType} — BACK SIDE</span>
        <span className="text-[8px] font-mono opacity-90">ID: {person.id}</span>
      </div>

      {/* Main Back Content */}
      <div className="flex-1 px-3 py-1.5 flex flex-col justify-between overflow-hidden">
        {/* Health Card Dependents Row Grid */}
        {template.cardType === 'Health Card' && template.backFields.dependentsGrid ? (
          <div className="flex-1 flex flex-col justify-start">
            <div className="flex items-center justify-between mb-1 pb-0.5 border-b border-emerald-300">
              <span className="text-[9px] font-black text-emerald-950 uppercase tracking-wider">
                Covered Dependents ({dependents.length})
              </span>
              <span className="text-[7.5px] font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300">
                UoH Medical Scheme
              </span>
            </div>

            {dependents.length > 0 ? (
              <div className="grid grid-cols-4 gap-1.5 overflow-hidden">
                {dependents.map((dep) => (
                  <div
                    key={dep.id}
                    className="flex flex-col items-center text-center p-1 bg-white rounded border border-emerald-200/90 shadow-2xs"
                  >
                    <div className="w-9 h-11 rounded border border-slate-300 overflow-hidden bg-slate-50 mb-0.5 shadow-2xs">
                      <img src={dep.photoUrl} alt={dep.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="font-bold text-[8px] text-slate-900 truncate w-full leading-tight">{dep.name}</p>
                    <p className="text-[7.5px] text-emerald-800 font-bold leading-tight">
                      {dep.relationship} {dep.age ? `(${dep.age}y)` : ''}
                    </p>
                    <span className="text-[6.5px] font-mono text-slate-500 font-extrabold">{dep.bloodGroup}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center text-[10px] text-slate-400 italic bg-slate-50 rounded-lg border border-dashed border-slate-200">
                No registered dependents on file.
              </div>
            )}
          </div>
        ) : (
          /* Address & Instructions layout */
          <div className="space-y-1 text-[9px]">
            {template.backFields.presentAddress && (
              <div>
                <span className="text-[7.5px] uppercase font-extrabold text-slate-400 block">Present Address</span>
                <p className="text-[8.5px] leading-tight text-slate-800 font-semibold line-clamp-2">
                  {'presentAddress' in person ? person.presentAddress : person.address}
                </p>
              </div>
            )}

            {template.backFields.permanentAddress && 'permanentAddress' in person && person.permanentAddress && (
              <div>
                <span className="text-[7.5px] uppercase font-extrabold text-slate-400 block">Permanent Address</span>
                <p className="text-[8.5px] leading-tight text-slate-800 font-medium line-clamp-2">{person.permanentAddress}</p>
              </div>
            )}

            {template.backFields.instructions && (
              <div className="pt-0.5 border-t border-slate-200">
                <span className="text-[7.5px] uppercase font-extrabold text-slate-400 block mb-0.5">Terms &amp; Instructions</span>
                <ul className="text-[8px] text-slate-700 font-medium leading-tight space-y-0.5">
                  {template.instructions.slice(0, 4).map((inst, idx) => (
                    <li key={idx} className="truncate">{inst}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Footer Authority Signature */}
        <div className="mt-1 pt-1 border-t border-slate-200 flex items-end justify-between text-[8px]">
          <div>
            <span className="text-slate-400 text-[7px] block uppercase font-extrabold">Emergency Hotline</span>
            <span className="font-extrabold text-slate-800">{person.contactNumber || '040-23130000'}</span>
          </div>

          {template.backFields.authoritySignature && authorityToUse && (
            <div className="text-right flex flex-col items-end">
              {authorityToUse.signatureUrl && (
                <img
                  src={authorityToUse.signatureUrl}
                  alt="Authority Signature"
                  className="h-5 object-contain mb-0.5"
                />
              )}
              <span className="font-extrabold text-slate-900 text-[8px]">{authorityToUse.name}</span>
              <span className="text-[7px] text-slate-500 font-bold uppercase">{authorityToUse.type}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`inline-flex flex-col sm:flex-row gap-6 ${printMode ? 'print:flex-col print:gap-4' : ''}`}>
      {(side === 'front' || side === 'both') && (
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider print:hidden">Front Side</span>
          {renderFront()}
        </div>
      )}
      {(side === 'back' || side === 'both') && (
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider print:hidden">Back Side</span>
          {renderBack()}
        </div>
      )}
    </div>
  );
}
