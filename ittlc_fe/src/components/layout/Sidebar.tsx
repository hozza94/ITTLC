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
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const toggleMenu = (menuId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 현재 펼쳐진 메뉴가 클릭된 메뉴와 같으면 닫기, 다르면 해당 메뉴만 열기
    setExpandedMenu(prev => prev === menuId ? null : menuId);
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
      id: 'prayers',
      label: '기도',
      // href:'/main/prayers',
      subItems: [
        { id: 'prayer_list', label: '기도 제목', href:'/main/prayers' },
        { id: 'prayer_registration', label: '기도 등록', href:'/main/prayers/new' },
      ],
    },
    {
      id: 'offerings',
      label: '헌금',
      // href:'/main/offerings',
      subItems: [
        { id: 'offering_list', label: '헌금 조회', href:'/main/offerings' },
        { id: 'offering_entry', label: '헌금 입력', href:'/main/offerings/new' },
        { id: 'offering_statistics', label: '헌금 통계', href:'/main/offerings/statistics' },
      ],
    },
    {
      id: 'families',
      label: '가족',
      // href:'/main/families',
      subItems: [
        { id: 'family_list', label: '가족 조회', href:'/main/families' },
        { id: 'family_registration', label: '가족 등록', href:'/main/families/new' },
      ],
    },
    {
      id: 'admin',
      label: '관리자',
      // href:'/main/admin',
      subItems: [
        { id: 'admin_dashboard', label: '관리자 대시보드', href:'/main/admin' },
        { id: 'admin_users', label: '사용자 관리', href:'/main/admin/users' },
        { id: 'admin_settings', label: '시스템 설정', href:'/main/admin/settings' },
        { id: 'admin_logs', label: '로그 관리', href:'/main/admin/logs' },
        { id: 'admin_backups', label: '백업 관리', href:'/main/admin/backups' },
      ],
    },
  ];

  return (
    <div className="w-48 bg-white shadow-lg flex flex-col">
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-2">
          {menuItems.map((item) => (
            <li key={item.id} className="border-b border-gray-100">
              {item.subItems ? (
                // 서브메뉴가 있는 경우
                <div 
                  className="px-4 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                  onClick={(e) => toggleMenu(item.id, e)}
                >
                  <span>{item.label}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${expandedMenu === item.id ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              ) : (
                // 서브메뉴가 없는 경우 (직접 링크)
                <Link href={item.href || '#'} className="block px-4 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span>{item.label}</span>
                  </div>
                </Link>
              )}
              {item.subItems && (
                <div 
                  className={`accordion-content ${expandedMenu === item.id ? 'open' : ''}`}
                >
                  <ul className="bg-gray-50">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.id}>
                        <Link 
                          href={subItem.href || '#'}
                          className="block px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                        >
                          {subItem.label}
                        </Link>
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
