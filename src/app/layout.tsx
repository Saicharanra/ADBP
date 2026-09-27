import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'ADPS — Automatic Document Printing System | University of Hyderabad',
  description: 'Automated card generation, employee management, and document printing system for University of Hyderabad.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
