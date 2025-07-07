'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import PrayerForm from '@/components/prayers/PrayerForm';
import { PrayerCreate, PrayerUpdate, prayerService } from '@/lib/api';

const NewPrayerPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: PrayerCreate | PrayerUpdate) => {
    try {
      setLoading(true);
      const result = await prayerService.createPrayer(data as PrayerCreate);
      
      // 성공 시 상세 페이지로 이동
      router.push(`/main/prayers/${result.id}`);
    } catch (error) {
      console.error('Error creating prayer:', error);
      alert('기도 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={handleCancel}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">새 기도 제목 등록</h1>
            <p className="text-gray-600 mt-1">하나님께 올려드릴 기도 제목을 등록해주세요</p>
          </div>
        </div>

        {/* 폼 */}
        <PrayerForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default NewPrayerPage; 