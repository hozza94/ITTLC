'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import FamilyForm from '@/components/families/FamilyForm';

interface FamilyFormData {
  family_name: string;
  head_member_id?: number;
  address?: string;
}

const NewFamilyPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: FamilyFormData) => {
    setLoading(true);
    try {
      // TODO: 실제 API 호출로 변경
      // const response = await familyAPI.createFamily(data);
      
      // 임시로 성공 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('가족이 성공적으로 등록되었습니다');
      router.push('/main/families');
    } catch (error) {
      console.error('Error creating family:', error);
      alert('가족 등록 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/main/families');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">새 가족 등록</h1>
              <p className="text-gray-600 mt-1">새로운 가족을 등록합니다</p>
            </div>
          </div>
        </div>

        {/* 가족 등록 폼 */}
        <FamilyForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default NewFamilyPage; 