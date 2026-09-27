'use client';

import React from 'react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-4 border-t border-slate-800 text-center print:hidden mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <p className="font-medium text-slate-300">
          Developed by CC/CNF, University of Hyderabad
        </p>
        <p className="text-[11px] text-slate-500 mt-1">
          Automated Document Printing System (ADPS) — Frontend Prototype &bull; Local Storage Session
        </p>
      </div>
    </footer>
  );
}
