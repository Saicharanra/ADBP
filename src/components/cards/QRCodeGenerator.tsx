'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCodeGenerator({ value, size = 70, className = '' }: QRCodeProps) {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    if (!value) return;
    QRCode.toDataURL(value, {
      margin: 1,
      width: size,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setDataUrl(url))
      .catch(err => console.error('QR code generation error:', err));
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`bg-slate-100 border border-slate-300 flex items-center justify-center text-[9px] text-slate-400 font-mono ${className}`}
      >
        QR
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt="Client QR Code"
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`object-contain ${className}`}
    />
  );
}
