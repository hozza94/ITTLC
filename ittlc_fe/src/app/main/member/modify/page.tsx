'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Member, memberAPI } from '@/lib/api';

export default function MemberModifyPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 목 데이터 (실제로는 API에서 가져올 데이터)
  const mockMembers: Member[] = [
    {
      id: 1,
      name: '김철수',
      name_en: 'Kim Chul Su',
      birth_date: '1980-05-15',
      gender: '남',
      phone: '010-1234-5678',
      email: 'kim@example.com',
      address: '서울시 강남구 테헤란로 123',
      job: '회사원',
      registration_date: '2020-01-15',
      baptism_date: '2020-03-01',
      position: '집사',
      district: '1교구',
      family_id: 1,
      family_role: '가장',
      is_active: true,
      notes: '교회 봉사에 열심히 참여하고 있음',
      created_by: 1,
      created_at: '2020-01-15T10:00:00Z',
      updated_at: '2023-01-15T10:00:00Z',
      family_name: '김철수 가정',
      created_by_username: 'admin'
    },
    {
      id: 2,
      name: '이영희',
      name_en: 'Lee Young Hee',
      birth_date: '1985-08-22',
      gender: '여',
      phone: '010-9876-5432',
      email: 'lee@example.com',
      address: '서울시 서초구 반포대로 456',
      job: '간호사',
      registration_date: '2019-06-10',
      baptism_date: '2019-08-15',
      position: '권사',
      district: '2교구',
      family_id: 2,
      family_role: '배우자',
      is_active: true,
      notes: '찬양대 활동 중',
      created_by: 1,
      created_at: '2019-06-10T10:00:00Z',
      updated_at: '2023-06-10T10:00:00Z',
      family_name: '이영희 가정',
      created_by_username: 'admin'
    },
    {
      id: 3,
      name: '박민수',
      name_en: 'Park Min Su',
      birth_date: '1992-12-03',
      gender: '남',
      phone: '010-5555-1234',
      email: 'park@example.com',
      address: '서울시 용산구 한강대로 789',
      job: '교사',
      registration_date: '2021-09-05',
      baptism_date: '2021-11-14',
      position: '성도',
      district: '1교구',
      family_id: undefined,
      family_role: undefined,
      is_active: true,
      notes: '청년부 활동 중',
      created_by: 1,
      created_at: '2021-09-05T10:00:00Z',
      updated_at: '2023-09-05T10:00:00Z',
      family_name: undefined,
      created_by_username: 'admin'
    },
    {
      id: 4,
      name: '최지은',
      name_en: 'Choi Ji Eun',
      birth_date: '1975-03-18',
      gender: '여',
      phone: '010-7777-8888',
      email: 'choi@example.com',
      address: '서울시 마포구 월드컵로 321',
      job: '주부',
      registration_date: '2018-04-20',
      baptism_date: '2018-06-10',
      position: '장로',
      district: '3교구',
      family_id: 3,
      family_role: '배우자',
      is_active: true,
      notes: '여선교회 회장',
      created_by: 1,
      created_at: '2018-04-20T10:00:00Z',
      updated_at: '2023-04-20T10:00:00Z',
      family_name: '최지은 가정',
      created_by_username: 'admin'
    },
    {
      id: 5,
      name: '정한국',
      name_en: 'Jung Han Guk',
      birth_date: '1995-07-29',
      gender: '남',
      phone: '010-3333-4444',
      email: 'jung@example.com',
      address: '서울시 종로구 세종대로 654',
      job: '개발자',
      registration_date: '2022-02-14',
      baptism_date: undefined,
      position: '성도',
      district: '2교구',
      family_id: undefined,
      family_role: undefined,
      is_active: true,
      notes: '새신자 관리 중',
      created_by: 1,
      created_at: '2022-02-14T10:00:00Z',
      updated_at: '2023-02-14T10:00:00Z',
      family_name: undefined,
      created_by_username: 'admin'
    }
  ];

  const loadMembers = async () => {
    try {
      setLoading(true);
      // 실제 API 호출 시 사용할 코드
      // const data = await memberAPI.getMembers();
      // setMembers(data);
      
      // 현재는 목 데이터 사용
      await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
      setMembers(mockMembers);
    } catch (err) {
      setError('성도 목록을 불러오는데 실패했습니다.');
      console.error('Error loading members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // 검색 필터링
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.name_en && member.name_en.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (member.phone && member.phone.includes(searchTerm)) ||
    (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectMember = (member: Member) => {
    router.push(`/main/member/${member.id}`);
  };

  // 나이 계산
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">성도 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">성도 정보 수정</h1>
        <button
          onClick={() => router.push('/main/member/list')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          전체 목록
        </button>
      </div>

      {/* 검색 */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            수정할 성도 검색
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="이름, 연락처, 이메일로 검색하세요"
          />
        </div>
      </div>

      {/* 성도 목록 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            성도 목록 ({filteredMembers.length}명)
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredMembers.map(member => (
            <div 
              key={member.id}
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleSelectMember(member)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                    {member.name_en && (
                      <p className="text-sm text-gray-500">{member.name_en}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">나이:</span> {calculateAge(member.birth_date)}세
                  </div>
                  <div>
                    <span className="font-medium">직분:</span> {member.position}
                  </div>
                  {member.phone && (
                    <div>
                      <span className="font-medium">연락처:</span> {member.phone}
                    </div>
                  )}
                  {member.district && (
                    <div>
                      <span className="font-medium">교구:</span> {member.district}
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {member.is_active ? '활성' : '비활성'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">검색 조건에 맞는 성도가 없습니다.</div>
        </div>
      )}
    </div>
  );
} 