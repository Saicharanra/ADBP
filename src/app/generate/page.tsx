'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  getEmployees,
  getPensioners,
  getDependentsForEmployee,
  getCardTemplate,
  addActivityLog
} from '@/lib/storage';
import { CardTemplate, CardType, Employee, Pensioner, Dependent } from '@/lib/types';
import { CardPreview } from '@/components/cards/CardPreview';
import { useToast } from '@/components/ui/Toast';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import {
  Printer,
  Download,
  Search,
  FileCheck
} from 'lucide-react';

function CardGenerationContent() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const initialPersonId = searchParams?.get('personId') || '';
  const initialCardType = (searchParams?.get('cardType') as CardType) || 'ID Card';

  const [cardType, setCardType] = useState<CardType>(initialCardType);
  const [employees, setEmployees] = useState<Employee[]>(getEmployees());
  const [pensioners, setPensioners] = useState<Pensioner[]>(getPensioners());

  const [selectedPersonId, setSelectedPersonId] = useState<string>(
    initialPersonId || (employees[0]?.id || '')
  );
  const [personSearch, setPersonSearch] = useState('');
  const [logoCount, setLogoCount] = useState<1 | 2>(2);

  const [template, setTemplate] = useState<CardTemplate>(getCardTemplate(cardType));

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEmployees(getEmployees());
    setPensioners(getPensioners());
  }, []);

  useEffect(() => {
    const tmpl = getCardTemplate(cardType);
    setTemplate({ ...tmpl, numberOfLogos: logoCount });
  }, [cardType, logoCount]);

  // Determine current selected person
  const isPensionerCard = cardType === 'Pensioner Card';
  const personList: (Employee | Pensioner)[] = isPensionerCard ? pensioners : employees;

  const currentPerson = personList.find(p => p.id === selectedPersonId) || personList[0];
  const dependents: Dependent[] = currentPerson ? getDependentsForEmployee(currentPerson.id) : [];

  const filteredPersonList = personList.filter(p =>
    p.name.toLowerCase().includes(personSearch.toLowerCase()) || p.id.includes(personSearch)
  );

  const handlePrint = () => {
    if (!currentPerson) return;
    addActivityLog('CARD_PRINTED', `Printed ${cardType} for ${currentPerson.name} (${currentPerson.id})`);
    showToast('Printing Card', 'Sending card layout to printer...');
    window.print();
  };

  const handleDownloadPng = async () => {
    if (!cardRef.current || !currentPerson) return;
    try {
      showToast('Exporting PNG', 'Generating high-resolution card image...');
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `ADPS_${cardType.replace(/\s+/g, '_')}_${currentPerson.id}.png`;
      link.href = dataUrl;
      link.click();
      addActivityLog('CARD_DOWNLOADED_PNG', `Downloaded ${cardType} PNG for ${currentPerson.id}`);
    } catch (err) {
      console.error('PNG export error:', err);
      showToast('Export Error', 'Failed to generate PNG card image.', 'error');
    }
  };

  const handleDownloadPdf = async () => {
    if (!cardRef.current || !currentPerson) return;
    try {
      showToast('Exporting PDF', 'Creating vector PDF document...');
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 3 });
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98 * 2.5]
      });
      pdf.addImage(dataUrl, 'PNG', 2, 2, 81.6, 120);
      pdf.save(`ADPS_${cardType.replace(/\s+/g, '_')}_${currentPerson.id}.pdf`);
      addActivityLog('CARD_DOWNLOADED_PDF', `Downloaded ${cardType} PDF for ${currentPerson.id}`);
    } catch (err) {
      console.error('PDF export error:', err);
      showToast('Export Error', 'Failed to generate PDF document.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Printer className="w-6 h-6 text-amber-600" />
            Card Generation &amp; Printing Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Select card template and employee/pensioner record to render front/back previews with live QR codes
          </p>
        </div>

        {currentPerson && (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadPng}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-xs transition"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export PNG</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-xs transition"
            >
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-extrabold shadow-md transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Card Now</span>
            </button>
          </div>
        )}
      </div>

      {/* CONTROLS PANEL */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6 print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. SELECT CARD TYPE */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              1. Select Card Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['ID Card', 'Health Card', 'Pensioner Card'] as CardType[]).map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setCardType(type);
                    const list = type === 'Pensioner Card' ? pensioners : employees;
                    if (list.length > 0 && !list.find(p => p.id === selectedPersonId)) {
                      setSelectedPersonId(list[0].id);
                    }
                  }}
                  className={`py-2 px-2 text-[11px] font-bold rounded-lg border text-center transition ${
                    cardType === type
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 2. SELECT PERSON */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              2. Select {isPensionerCard ? 'Pensioner' : 'Employee'} Record
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={personSearch}
                  onChange={e => setPersonSearch(e.target.value)}
                  placeholder="Search by ID or Name..."
                  className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              <select
                value={selectedPersonId}
                onChange={e => setSelectedPersonId(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-amber-500 max-w-md truncate"
              >
                {filteredPersonList.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.id} — {p.name} ({(p as Employee).designation || (p as Pensioner).lastDesignation})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-4">
            <label className="font-semibold text-slate-700">Logo Count:</label>
            <label className="inline-flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                name="logos"
                checked={logoCount === 1}
                onChange={() => setLogoCount(1)}
                className="text-amber-600 focus:ring-amber-500"
              />
              <span>1 Logo (UoH Seal)</span>
            </label>
            <label className="inline-flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                name="logos"
                checked={logoCount === 2}
                onChange={() => setLogoCount(2)}
                className="text-amber-600 focus:ring-amber-500"
              />
              <span>2 Logos (UoH Seal + NAAC)</span>
            </label>
          </div>

          {currentPerson && (
            <div className="text-right">
              <span className="font-bold text-slate-900">{currentPerson.name}</span>
              <span className="text-slate-400 text-[11px] ml-2 font-mono">(ID: {currentPerson.id})</span>
            </div>
          )}
        </div>
      </div>

      {/* PRINT / PREVIEW CONTAINER */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center print:border-none print:shadow-none print:p-0">
        <div className="inline-block" ref={cardRef}>
          {currentPerson ? (
            <CardPreview
              template={template}
              person={currentPerson}
              dependents={dependents}
              side="both"
              printMode={true}
            />
          ) : (
            <div className="p-12 text-slate-400 italic">No person record selected.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CardGenerationPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="p-6 text-center text-xs text-slate-500">Loading Card Console...</div>}>
        <CardGenerationContent />
      </Suspense>
    </AppLayout>
  );
}
