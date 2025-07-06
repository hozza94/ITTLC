'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MemberForm from '@/components/members/MemberForm';
import { Member, MemberUpdate, memberAPI, Family, familyAPI } from '@/lib/api';

export default function MemberDetailPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = parseInt(params.id as string);

  const [member, setMember] = useState<Member | null>(null);
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 목 데이터 - 실제로는 API에서 가져올 데이터
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

  const mockFamilies: Family[] = [
    { id: 1, family_name: '김철수 가정', head_member_id: 1, address: '서울시 강남구', head_member_name: '김철수', created_at: '2020-01-15T10:00:00Z' },
    { id: 2, family_name: '이영희 가정', head_member_id: 2, address: '서울시 서초구', head_member_name: '이영희', created_at: '2019-06-10T10:00:00Z' },
    { id: 3, family_name: '최지은 가정', head_member_id: 4, address: '서울시 마포구', head_member_name: '최지은', created_at: '2018-04-20T10:00:00Z' }
  ];

  const loadMember = async () => {
    try {
      setLoading(true);
      
      // 실제 API 호출 시 사용할 코드
      // const data = await memberAPI.getMember(memberId);
      // setMember(data);
      
      // 현재는 목 데이터 사용
      await new Promise(resolve => setTimeout(resolve, 500));
      const foundMember = mockMembers.find(m => m.id === memberId);
      if (foundMember) {
        setMember(foundMember);
      } else {
        setError('성도를 찾을 수 없습니다.');
      }
    } catch (err) {
      setError('성도 정보를 불러오는데 실패했습니다.');
      console.error('Error loading member:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFamilies = async () => {
    try {
      // 실제 API 호출 시 사용할 코드
      // const data = await familyAPI.getFamilies();
      // setFamilies(data);
      
      // 현재는 목 데이터 사용
      setFamilies(mockFamilies);
    } catch (err) {
      console.error('Error loading families:', err);
    }
  };

  useEffect(() => {
    loadMember();
    loadFamilies();
  }, [memberId]);

  const handleUpdate = async (memberData: MemberUpdate) => {
    try {
      setUpdateLoading(true);
      setError(null);
      
      // 실제 API 호출 시 사용할 코드
      // const updatedMember = await memberAPI.updateMember(memberId, memberData);
      // setMember(updatedMember);
      
      // 현재는 업데이트 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (member) {
        const updatedMember = {
          ...member,
          ...memberData,
          updated_at: new Date().toISOString()
        };
        setMember(updatedMember);
      }
      
      setIsEditing(false);
      alert('성도 정보가 성공적으로 수정되었습니다.');
    } catch (err) {
      setError('성도 정보 수정에 실패했습니다.');
      console.error('Error updating member:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleDelete = async () => {
    if (confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        // 실제 API 호출 시 사용할 코드
        // await memberAPI.deleteMember(memberId);
        
        // 현재는 삭제 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 500));
        
        alert('성도가 삭제되었습니다.');
        router.push('/main/member/list');
      } catch (err) {
        alert('삭제에 실패했습니다.');
        console.error('Error deleting member:', err);
      }
    }
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
        <div className="text-lg">성도 정보를 불러오는 중...</div>
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

  if (!member) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">성도를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? '성도 정보 수정' : '성도 상세 정보'}
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => router.push('/main/member/list')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            목록으로
          </button>
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                삭제
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">오류가 발생했습니다</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        {isEditing ? (
          <MemberForm
            member={member}
            families={families}
            onSubmit={handleUpdate}
            onCancel={handleCancel}
            isLoading={updateLoading}
          />
        ) : (
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">이름</label>
                    <p className="mt-1 text-sm text-gray-900">{member.name}</p>
                  </div>
                  {member.name_en && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">영문 이름</label>
                      <p className="mt-1 text-sm text-gray-900">{member.name_en}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">생년월일</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(member.birth_date).toLocaleDateString()} ({calculateAge(member.birth_date)}세)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">성별</label>
                    <p className="mt-1 text-sm text-gray-900">{member.gender}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">직분</label>
                    <p className="mt-1 text-sm text-gray-900">{member.position}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">연락처 정보</h3>
                <div className="space-y-4">
                  {member.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">연락처</label>
                      <p className="mt-1 text-sm text-gray-900">{member.phone}</p>
                    </div>
                  )}
                  {member.email && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">이메일</label>
                      <p className="mt-1 text-sm text-gray-900">{member.email}</p>
                    </div>
                  )}
                  {member.address && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">주소</label>
                      <p className="mt-1 text-sm text-gray-900">{member.address}</p>
                    </div>
                  )}
                  {member.job && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">직업</label>
                      <p className="mt-1 text-sm text-gray-900">{member.job}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 교회 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">교회 정보</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">등록일</label>
                    <p className="mt-1 text-sm text-gray-900">{new Date(member.registration_date).toLocaleDateString()}</p>
                  </div>
                  {member.baptism_date && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">세례일</label>
                      <p className="mt-1 text-sm text-gray-900">{new Date(member.baptism_date).toLocaleDateString()}</p>
                    </div>
                  )}
                  {member.district && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">교구</label>
                      <p className="mt-1 text-sm text-gray-900">{member.district}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">상태</label>
                    <p className="mt-1 text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {member.is_active ? '활성' : '비활성'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">가족 정보</h3>
                <div className="space-y-4">
                  {member.family_name && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">가족</label>
                      <p className="mt-1 text-sm text-gray-900">{member.family_name}</p>
                    </div>
                  )}
                  {member.family_role && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">가족 내 역할</label>
                      <p className="mt-1 text-sm text-gray-900">{member.family_role}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 메모 */}
            {member.notes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">메모</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{member.notes}</p>
                </div>
              </div>
            )}

            {/* 시스템 정보 */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">시스템 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">등록자</label>
                  <p className="mt-1 text-sm text-gray-900">{member.created_by_username || '관리자'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">등록일시</label>
                  <p className="mt-1 text-sm text-gray-900">{new Date(member.created_at).toLocaleString()}</p>
                </div>
                {member.updated_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">최종 수정일시</label>
                    <p className="mt-1 text-sm text-gray-900">{new Date(member.updated_at).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 