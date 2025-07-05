'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm h-16 flex-shrink-0 flex items-center border-b">
      <div className="flex items-center w-full px-4">
        <Link href="/main">
          <h1 className="text-xl font-bold mr-8">ITTLC</h1>
        </Link>
        <div className="flex-1"></div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-gray-700">{user.username}님</span>
              <button 
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer
                  active:translate-y-0.5 transition-transform duration-100"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer
                  active:translate-y-0.5 transition-transform duration-100">
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

// export default Header;

// const Header = () => {
//   return (
//     <header className="bg-white shadow-sm h-16 flex-shrink-0 flex items-center border-b">
//       <div className="flex items-center w-full px-4">
//           <Link href="/main">
//           <h1 className="text-xl font-bold mr-8">ITTLC</h1>
//           </Link>
//         <div className="flex-1"></div>
//         <div className="flex items-center space-x-4">
//           <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//             </svg>
//           </button>
//           <div className="relative">
//             <button className="flex items-center space-x-2 focus:outline-none">
//               <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                 </svg>
//               </div>
//               <span className="text-sm font-medium text-gray-700">사용자</span>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

export default Header;
