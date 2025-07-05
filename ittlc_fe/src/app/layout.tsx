import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";

// 클라이언트 컴포넌트 임포트
import AuthProvider from '@/components/providers/AuthProvider';

// 기본 폰트 로드 (Inter는 Google Fonts에서 기본 제공)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "ITTLC",
  description: "ITTLC Manage System",
};

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="ko">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }
// src/app/layout.tsx

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In production, we want to catch any potential errors in the AuthProvider
  // but we don't want it to break the entire app
  let content = children;
  
  if (process.env.NODE_ENV === 'production') {
    try {
      content = (
        <AuthProvider>
          {children}
        </AuthProvider>
      );
    } catch (error) {
      console.error('Error in AuthProvider:', error);
      // Continue rendering without AuthProvider in case of error
      content = children;
    }
  } else {
    content = (
      <AuthProvider>
        {children}
      </AuthProvider>
    );
  }

  return (
    <html lang="ko">
      <body className={`${inter.variable} font-sans antialiased`}>
        {content}
      </body>
    </html>
  );
}