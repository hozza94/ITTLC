'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  DollarSign, 
  Calendar, 
  User, 
  Clock,
  FileText
} from 'lucide-react';
import OfferingForm from '@/components/offerings/OfferingForm';

interface Offering {
  id: number;
  member_id: number;
  member_name?: string;
  offering_date: string;
  offering_type: string;
  amount: number;
  memo?: string;
  created_by: number;
  created_by_username?: string;
  created_at: string;
  updated_at: string;
}

interface OfferingFormData {
  member_id: number;
  offering_date: string;
  offering_type: string;
  amount: number;
  memo?: string;
}

const OfferingDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const offeringId = params.id as string;
  
  const [offering, setOffering] = useState<Offering | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (offeringId) {
      fetchOffering();
    }
  }, [offeringId]);

  const fetchOffering = async () => {
    try {
      setLoading(true);
      
      // TODO: 실제 API 호출로 변경
      // const response = await fetch(`/api/v1/offerings/${offeringId}`);
      // if (!response.ok) {
      //   throw new Error('헌금 기록을 찾을 수 없습니다');
      // }
      // const data = await response.json();
      
      // 임시 데이터 (실제 API 구현 후 변경)
      const mockOffering: Offering = {
        id: parseInt(offeringId),
        member_id: 1,
        member_name: '김철수',
        offering_date: '2024-01-07',
        offering_type: '십일조',
        amount: 500000,
        memo: '1월 십일조 헌금입니다',
        created_by: 1,
        created_by_username: 'admin',
        created_at: '2024-01-07T10:00:00Z',
        updated_at: '2024-01-07T10:00:00Z'
      };
      
      setOffering(mockOffering);
    } catch (error) {
      console.error('Error fetching offering:', error);
      alert('헌금 기록을 불러오는 중 오류가 발생했습니다');
      router.push('/main/offerings');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (data: OfferingFormData) => {
    setSubmitLoading(true);
    try {
      // TODO: 실제 API 호출로 변경
      // const response = await fetch(`/api/v1/offerings/${offeringId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // });
      
      // if (!response.ok) {
      //   throw new Error('헌금 수정에 실패했습니다');
      // }
      
      // 임시로 성공 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOffering(prev => prev ? { ...prev, ...data } : null);
      setIsEditing(false);
      alert('헌금이 성공적으로 수정되었습니다');
    } catch (error) {
      console.error('Error updating offering:', error);
      alert('헌금 수정 중 오류가 발생했습니다');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 헌금 기록을 삭제하시겠습니까?')) {
      try {
        // TODO: 실제 API 호출로 변경
        // const response = await fetch(`/api/v1/offerings/${offeringId}`, {
        //   method: 'DELETE',
        // });
        
        // if (!response.ok) {
        //   throw new Error('헌금 삭제에 실패했습니다');
        // }
        
        alert('헌금이 성공적으로 삭제되었습니다');
        router.push('/main/offerings');
      } catch (error) {
        console.error('Error deleting offering:', error);
        alert('헌금 삭제 중 오류가 발생했습니다');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const getOfferingTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      '십일조': 'bg-blue-100 text-blue-800 border-blue-200',
      '주일헌금': 'bg-green-100 text-green-800 border-green-200',
      '감사헌금': 'bg-purple-100 text-purple-800 border-purple-200',
      '선교헌금': 'bg-orange-100 text-orange-800 border-orange-200',
      '건축헌금': 'bg-red-100 text-red-800 border-red-200',
      '특별헌금': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      '절기헌금': 'bg-pink-100 text-pink-800 border-pink-200',
      '기타헌금': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colorMap[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!offering) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">헌금 기록을 찾을 수 없습니다</h1>
            <button
              onClick={() => router.push('/main/offerings')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              헌금 목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing ? '헌금 수정' : '헌금 상세'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isEditing ? '헌금 정보를 수정합니다' : '헌금 정보를 확인합니다'}
                </p>
              </div>
            </div>
            
            {!isEditing && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="inline mr-2" size={16} />
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="inline mr-2" size={16} />
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>

        {isEditing ? (
          <OfferingForm
            initialData={{
              member_id: offering.member_id,
              offering_date: offering.offering_date,
              offering_type: offering.offering_type,
              amount: offering.amount,
              memo: offering.memo
            }}
            isEditing={true}
            onSubmit={handleEdit}
            onCancel={() => setIsEditing(false)}
            loading={submitLoading}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* 헌금 정보 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <DollarSign className="text-green-600" size={24} />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {formatAmount(offering.amount)}
                    </h2>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getOfferingTypeColor(offering.offering_type)}`}>
                      {offering.offering_type}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 상세 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">헌금자</p>
                    <p className="text-lg font-medium text-gray-900">
                      {offering.member_name || `성도 ID: ${offering.member_id}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">헌금일</p>
                    <p className="text-lg font-medium text-gray-900">
                      {formatDate(offering.offering_date)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">등록일</p>
                    <p className="text-lg font-medium text-gray-900">
                      {formatDate(offering.created_at)}
                    </p>
                  </div>
                </div>
                
                {offering.created_by_username && (
                  <div className="flex items-center space-x-3">
                    <User className="text-gray-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">등록자</p>
                      <p className="text-lg font-medium text-gray-900">
                        {offering.created_by_username}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 메모 */}
            {offering.memo && (
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-start space-x-3">
                  <FileText className="text-gray-500 mt-1" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">메모</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-800 whitespace-pre-wrap">{offering.memo}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferingDetailPage; 