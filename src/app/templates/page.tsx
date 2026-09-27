'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { getCardTemplates, saveCardTemplate, getEmployees, getDependents } from '@/lib/storage';
import { CardTemplate, CardType } from '@/lib/types';
import { CardPreview } from '@/components/cards/CardPreview';
import { useToast } from '@/components/ui/Toast';
import { CreditCard, Save, Eye, Settings2, SlidersHorizontal, ListChecks } from 'lucide-react';

export default function CardTemplatesPage() {
  const { showToast } = useToast();

  const [selectedCardType, setSelectedCardType] = useState<CardType>('ID Card');
  const [activeTemplate, setActiveTemplate] = useState<CardTemplate>(
    getCardTemplates().find(t => t.cardType === 'ID Card') || getCardTemplates()[0]
  );

  // Sample person & dependents for live preview
  const samplePerson = getEmployees()[0];
  const sampleDependents = getDependents().slice(0, 3);

  useEffect(() => {
    const list = getCardTemplates();
    const found = list.find(t => t.cardType === selectedCardType);
    if (found) setActiveTemplate(JSON.parse(JSON.stringify(found)));
  }, [selectedCardType]);

  const handleSave = () => {
    saveCardTemplate(activeTemplate);
    showToast(
      'Template Saved',
      `Card template for "${activeTemplate.cardType}" updated and activated successfully.`
    );
  };

  const handleInstructionChange = (index: number, val: string) => {
    const updated = [...activeTemplate.instructions];
    updated[index] = val;
    setActiveTemplate({ ...activeTemplate, instructions: updated });
  };

  const handleHeaderLineChange = (index: number, val: string) => {
    const updated = [...activeTemplate.headerLines];
    updated[index] = val;
    setActiveTemplate({ ...activeTemplate, headerLines: updated });
  };

  return (
    <AppLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-amber-600" />
              Card Template Configuration
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Customize dimensions, header titles, field visibility &amp; back-side instructions for document printing
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow transition"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Activate Template</span>
            </button>
          </div>
        </div>

        {/* CARD TYPE TABS */}
        <div className="flex space-x-2 border-b border-slate-200 pb-2">
          {(['ID Card', 'Health Card', 'Pensioner Card'] as CardType[]).map(type => (
            <button
              key={type}
              onClick={() => setSelectedCardType(type)}
              className={`px-4 py-2 text-xs font-bold rounded-lg border transition ${
                selectedCardType === type
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {type} Configuration
            </button>
          ))}
        </div>

        {/* 2-COLUMN LAYOUT: CONFIG EDITOR & LIVE PREVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* COLUMN 1: LIVE PREVIEW STICKY PANEL */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sticky top-20">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-amber-600" />
                  Live Redraw Preview
                </h3>
                <span className="text-[10px] font-mono bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200 font-bold">
                  {activeTemplate.cardType}
                </span>
              </div>

              <div className="flex justify-center p-2 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
                <CardPreview
                  template={activeTemplate}
                  person={samplePerson}
                  dependents={sampleDependents}
                  side="both"
                />
              </div>

              <div className="mt-3 text-[11px] text-slate-500 text-center font-medium">
                Changes in the editor reflect instantly in the card renderer above.
              </div>
            </div>
          </div>

          {/* COLUMN 2: CONFIGURATION INPUTS */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              {/* HEADER & BRANDING CONFIG */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                  <Settings2 className="w-4 h-4 text-amber-600" />
                  1. Header Text &amp; Branding Colors
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Header Line 1</label>
                    <input
                      type="text"
                      value={activeTemplate.headerLines[0] || ''}
                      onChange={e => handleHeaderLineChange(0, e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Header Line 2</label>
                    <input
                      type="text"
                      value={activeTemplate.headerLines[1] || ''}
                      onChange={e => handleHeaderLineChange(1, e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Card Title Text</label>
                    <input
                      type="text"
                      value={activeTemplate.titleText}
                      onChange={e => setActiveTemplate({ ...activeTemplate, titleText: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-bold text-amber-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Logos Count</label>
                    <select
                      value={activeTemplate.numberOfLogos}
                      onChange={e => setActiveTemplate({ ...activeTemplate, numberOfLogos: Number(e.target.value) as 1 | 2 })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
                    >
                      <option value={1}>1 Logo (University Seal Only)</option>
                      <option value={2}>2 Logos (University + NAAC/Emblem)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Header Background Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={activeTemplate.headerBgColor}
                        onChange={e => setActiveTemplate({ ...activeTemplate, headerBgColor: e.target.value })}
                        className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={activeTemplate.headerBgColor}
                        onChange={e => setActiveTemplate({ ...activeTemplate, headerBgColor: e.target.value })}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Card Accent Line Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={activeTemplate.accentColor}
                        onChange={e => setActiveTemplate({ ...activeTemplate, accentColor: e.target.value })}
                        className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={activeTemplate.accentColor}
                        onChange={e => setActiveTemplate({ ...activeTemplate, accentColor: e.target.value })}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* FIELD VISIBILITY TOGGLES */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                  <ListChecks className="w-4 h-4 text-emerald-600" />
                  2. Field Display Toggles (Front &amp; Back)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-xs">
                  {Object.keys(activeTemplate.frontFields).map(key => (
                    <label key={`front_${key}`} className="flex items-center space-x-2 bg-slate-50 p-2 rounded border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeTemplate.frontFields[key as keyof typeof activeTemplate.frontFields]}
                        onChange={e =>
                          setActiveTemplate({
                            ...activeTemplate,
                            frontFields: {
                              ...activeTemplate.frontFields,
                              [key]: e.target.checked
                            }
                          })
                        }
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span className="capitalize font-semibold text-slate-700">{key.replace(/([A-Z])/g, ' $1')} (Front)</span>
                    </label>
                  ))}

                  {Object.keys(activeTemplate.backFields).map(key => (
                    <label key={`back_${key}`} className="flex items-center space-x-2 bg-slate-50 p-2 rounded border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeTemplate.backFields[key as keyof typeof activeTemplate.backFields]}
                        onChange={e =>
                          setActiveTemplate({
                            ...activeTemplate,
                            backFields: {
                              ...activeTemplate.backFields,
                              [key]: e.target.checked
                            }
                          })
                        }
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span className="capitalize font-semibold text-slate-700">{key.replace(/([A-Z])/g, ' $1')} (Back)</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* PHOTO / SIGNATURE / QR SIZES */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-purple-600" />
                  3. Element Dimensions &amp; QR Code Placement
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Photo Width (px)</label>
                    <input
                      type="number"
                      value={activeTemplate.photoWidth}
                      onChange={e => setActiveTemplate({ ...activeTemplate, photoWidth: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Photo Height (px)</label>
                    <input
                      type="number"
                      value={activeTemplate.photoHeight}
                      onChange={e => setActiveTemplate({ ...activeTemplate, photoHeight: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">QR Code Size (px)</label>
                    <input
                      type="number"
                      value={activeTemplate.qrSize}
                      onChange={e => setActiveTemplate({ ...activeTemplate, qrSize: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* BACK-SIDE INSTRUCTIONS */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
                  4. Back-Side Terms &amp; Instructions (FRD 4 Default Lines Pre-filled)
                </h3>
                <div className="space-y-2 mt-4">
                  {activeTemplate.instructions.map((line, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="font-mono text-xs text-slate-400 font-bold">{idx + 1}.</span>
                      <input
                        type="text"
                        value={line}
                        onChange={e => handleInstructionChange(idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 text-right">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-lg shadow transition inline-flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Save Template Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
