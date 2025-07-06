'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import OfferingForm from '@/components/offerings/OfferingForm';

interface OfferingFormData {
  member_id: number;
  offering_date: string;
  offering_type: string;
  amount: number;
  memo?: string;
}

const NewOfferingPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: OfferingFormData) => {
    setLoading(true);
    try {
      // TODO: 실제 API 호출로 변경
      // const response = await fetch('/api/v1/offerings', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     ...data,
      //     created_by: 1, // 현재 사용자 ID
      //   }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('헌금 등록에 실패했습니다');
      // }
      
      // 임시로 성공 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('헌금이 성공적으로 등록되었습니다');
      router.push('/main/offerings');
    } catch (error) {
      console.error('Error creating offering:', error);
      alert('헌금 등록 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/main/offerings');
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
              <h1 className="text-3xl font-bold text-gray-900">새 헌금 등록</h1>
              <p className="text-gray-600 mt-1">새로운 헌금 기록을 등록합니다</p>
            </div>
          </div>
        </div>

        {/* 헌금 등록 폼 */}
        <OfferingForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default NewOfferingPage; 