import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-100 overflow-hidden">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        {/* 메인 콘텐츠 */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
