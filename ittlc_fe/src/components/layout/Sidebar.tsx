import Link from 'next/link';
import React, { useState } from 'react';

type MenuItem = {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  subItems?: {
    id: string;
    label: string;
    href?: string;
  }[];
};

const Sidebar = () => {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  }; 

  const menuItems: MenuItem[] = [
    {
      id:'dashboard',
      label:'대시보드',
      href:'/main/dashboard'
    },
    {
      id: 'member',
      label: '성도관리',
      // href:'/main/member',
      subItems: [
        { id: 'member_list', label: '성도 조회', href:'/main/member/list' },
        { id: 'member_registration', label: '성도 등록', href:'/main/member/registration' },
        { id: 'member_modify', label: '정보 수정', href:'/main/member/modify' },
      ],
    },
    {
      id: 'prayer_request',
      label: '기도',
      // href:'/main/prayer_request',
      subItems: [
        { id: 'pray_list', label: '기도 제목', href:'/main/prayer_request/list' },
        { id: 'pray_registration', label: '기도 등록', href:'/main/prayer_request/registration' },
      ],
    },
    { id: 'admin', label: '관리자', href:'/main/admin' },
  ];

  return (
    <div className="w-48 bg-white shadow-lg flex flex-col">
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-2">
          {menuItems.map((item) => (
            <li key={item.id} className="border-b border-gray-100">
              <Link href={item.href || '#'}>
              <div 
                className="px-4 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                onClick={() => item.subItems && toggleMenu(item.id)}
              >
                <span>{item.label}</span>
                {item.subItems && (
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${expandedMenus[item.id] ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
              </Link>
              {item.subItems && (
                <div 
                  className={`accordion-content ${expandedMenus[item.id] ? 'open' : ''}`}
                >
                  <ul className="bg-gray-50">
                    {item.subItems.map((subItem) => (
                      <li 
                        key={subItem.id} 
                        className="px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                      >
                        <Link href={subItem.href || '#'}>{subItem.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
