import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | CMSBVQ',
    default: 'CMSBVQ - Hệ thống bản quyền',
  },
  description: 'Hệ thống quản lý và kích hoạt bản quyền mã nguồn tự động.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className="bg-zinc-950 text-white antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
