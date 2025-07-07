'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MemberForm from '@/components/members/MemberForm';
import { MemberCreate, memberService, Family, familyService, withFallback } from '@/lib/api';

export default function MemberRegistrationPage() {
  const router = useRouter();
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 가족 목록 불러오기
  const loadFamilies = async () => {
    try {
      // Mock 데이터 정의
      const mockFamilies: Family[] = [
        { id: 1, family_name: '김철수 가정', head_member_id: 1, address: '서울시 강남구', head_member_name: '김철수', created_at: '2020-01-15T10:00:00Z' },
        { id: 2, family_name: '이영희 가정', head_member_id: 2, address: '서울시 서초구', head_member_name: '이영희', created_at: '2019-06-10T10:00:00Z' },
        { id: 3, family_name: '최지은 가정', head_member_id: 4, address: '서울시 마포구', head_member_name: '최지은', created_at: '2018-04-20T10:00:00Z' }
      ];
      
      // 실제 API 호출 with fallback
      const data = await withFallback(
        () => familyService.getFamilies(0, 100),
        mockFamilies
      );
      setFamilies(data);
    } catch (err) {
      console.error('Error loading families:', err);
    }
  };

  useEffect(() => {
    loadFamilies();
  }, []);

  const handleSubmit = async (memberData: MemberCreate) => {
    try {
      setLoading(true);
      setError(null);
      
      // 실제 API 호출
      await memberService.createMember(memberData);
      
      alert('성도가 성공적으로 등록되었습니다.');
      router.push('/main/member/list');
    } catch (err) {
      setError('성도 등록에 실패했습니다.');
      console.error('Error creating member:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/main/member/list');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">성도 등록</h1>
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          목록으로
        </button>
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
        <MemberForm
          families={families}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={loading}
        />
      </div>
    </div>
  );
} 