import type { Metadata } from 'next';
import ClientLayout from './ClientLayout';
import '../globals.css';

export const metadata: Metadata = {
  title: 'ITTLC',
  description: 'ITTLC 메인 페이지',
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}