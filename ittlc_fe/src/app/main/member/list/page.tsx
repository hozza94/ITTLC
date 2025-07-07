'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MemberCard from '@/components/members/MemberCard';
import { Member, memberService, withFallback } from '@/lib/api';

export default function MemberListPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

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
      setError(null);
      
      // 실제 API 호출 with fallback
      const data = await withFallback(
        () => memberService.getMembers(0, 100),
        mockMembers
      );
      setMembers(data);
    } catch (err) {
      setError('성도 목록을 불러오는데 실패했습니다.');
      console.error('Error loading members:', err);
      // 오류 발생 시 Mock 데이터로 fallback
      setMembers(mockMembers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // 필터링된 성도 목록
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.name_en && member.name_en.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (member.phone && member.phone.includes(searchTerm)) ||
                         (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDistrict = selectedDistrict === '' || member.district === selectedDistrict;
    const matchesPosition = selectedPosition === '' || member.position === selectedPosition;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && member.is_active) ||
                         (selectedStatus === 'inactive' && !member.is_active);

    return matchesSearch && matchesDistrict && matchesPosition && matchesStatus;
  });

  // 교구 목록
  const districts = Array.from(new Set(members.map(m => m.district).filter(Boolean)));
  // 직분 목록
  const positions = Array.from(new Set(members.map(m => m.position)));

  const handleEdit = (member: Member) => {
    router.push(`/main/member/${member.id}`);
  };

  const handleDelete = async (memberId: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        // 실제 API 호출
        await memberService.deleteMember(memberId);
        
        // 성공 시 목록에서 제거
        setMembers(prev => prev.filter(m => m.id !== memberId));
        alert('성도가 삭제되었습니다.');
      } catch (err) {
        alert('삭제에 실패했습니다.');
        console.error('Error deleting member:', err);
      }
    }
  };

  const handleViewDetails = (memberId: number) => {
    router.push(`/main/member/${memberId}`);
  };

  // 통계 계산
  const stats = {
    total: members.length,
    active: members.filter(m => m.is_active).length,
    baptized: members.filter(m => m.baptism_date).length,
    thisYear: members.filter(m => m.registration_date && new Date(m.registration_date).getFullYear() === new Date().getFullYear()).length
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
        <h1 className="text-2xl font-bold text-gray-900">성도 관리</h1>
        <button
          onClick={() => router.push('/main/member/registration')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          성도 등록
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-sm text-gray-600">총 성도 수</div>
          <div className="text-2xl font-bold text-blue-600">{stats.total}명</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-sm text-gray-600">활성 성도</div>
          <div className="text-2xl font-bold text-green-600">{stats.active}명</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-sm text-gray-600">세례 성도</div>
          <div className="text-2xl font-bold text-purple-600">{stats.baptized}명</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-sm text-gray-600">올해 등록</div>
          <div className="text-2xl font-bold text-orange-600">{stats.thisYear}명</div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">검색</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="이름, 연락처, 이메일 검색"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">교구</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">전체 교구</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">직분</label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">전체 직분</option>
              {positions.map(position => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="all">전체</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
          </div>
        </div>
      </div>

      {/* 성도 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map(member => (
          <MemberCard
            key={member.id}
            member={member}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">조건에 맞는 성도가 없습니다.</div>
        </div>
      )}
    </div>
  );
} 