'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Home, 
  Users, 
  Crown,
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import FamilyCard from '@/components/families/FamilyCard';
import { Family } from '@/lib/api';

const FamiliesPage: React.FC = () => {
  const router = useRouter();
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFamilies, setTotalFamilies] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);

  useEffect(() => {
    fetchFamilies();
  }, [currentPage]);

  const fetchFamilies = async () => {
    try {
      setLoading(true);
      
      // TODO: 실제 API 호출로 변경
      // const response = await familyAPI.getFamilies({
      //   skip: (currentPage - 1) * 10,
      //   limit: 10
      // });
      
      // 임시 데이터 (실제 API 구현 후 변경)
      const mockFamilies: Family[] = [
        {
          id: 1,
          family_name: '김철수 가정',
          head_member_id: 1,
          head_member_name: '김철수',
          address: '서울시 강남구 테헤란로 123',
          member_count: 4,
          created_at: '2023-01-15T10:00:00Z'
        },
        {
          id: 2,
          family_name: '이영희 가정',
          head_member_id: 2,
          head_member_name: '이영희',
          address: '서울시 서초구 서초대로 456',
          member_count: 3,
          created_at: '2023-02-10T11:00:00Z'
        },
        {
          id: 3,
          family_name: '박민수 가정',
          head_member_id: 3,
          head_member_name: '박민수',
          address: '서울시 송파구 잠실로 789',
          member_count: 2,
          created_at: '2023-03-05T15:00:00Z'
        },
        {
          id: 4,
          family_name: '정수연 가정',
          head_member_id: 4,
          head_member_name: '정수연',
          address: '서울시 마포구 홍대입구역로 321',
          member_count: 5,
          created_at: '2023-04-12T14:00:00Z'
        },
        {
          id: 5,
          family_name: '최민정 가정',
          head_member_id: 5,
          head_member_name: '최민정',
          address: '서울시 용산구 이태원로 654',
          member_count: 1,
          created_at: '2023-05-20T09:00:00Z'
        }
      ];

      setFamilies(mockFamilies);
      setTotalFamilies(mockFamilies.length);
      setTotalMembers(mockFamilies.reduce((sum, family) => sum + (family.member_count || 0), 0));
      setTotalPages(Math.ceil(mockFamilies.length / 10));
    } catch (error) {
      console.error('Error fetching families:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (familyId: number) => {
    router.push(`/main/families/${familyId}`);
  };

  const handleEdit = (familyId: number) => {
    router.push(`/main/families/${familyId}/edit`);
  };

  const handleDelete = async (familyId: number) => {
    if (window.confirm('정말로 이 가족을 삭제하시겠습니까? 가족을 삭제하면 구성원들의 가족 연결이 해제됩니다.')) {
      try {
        // TODO: 실제 API 호출로 변경
        // await familyAPI.deleteFamily(familyId);
        
        setFamilies(prev => prev.filter(family => family.id !== familyId));
        alert('가족이 삭제되었습니다.');
      } catch (error) {
        console.error('Error deleting family:', error);
        alert('가족 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const filteredFamilies = families.filter(family => {
    const matchesSearch = searchTerm === '' || 
      family.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.head_member_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">가족 관리</h1>
              <p className="text-gray-600 mt-1">교회 가족들을 관리합니다</p>
            </div>
            <button
              onClick={() => router.push('/main/families/new')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="mr-2" size={16} />
              새 가족 등록
            </button>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Home className="text-blue-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">총 가족 수</p>
                  <p className="text-2xl font-bold text-gray-900">{totalFamilies.toLocaleString()}가정</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="text-green-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">총 구성원 수</p>
                  <p className="text-2xl font-bold text-gray-900">{totalMembers.toLocaleString()}명</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Crown className="text-purple-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">평균 가족 크기</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalFamilies > 0 ? (totalMembers / totalFamilies).toFixed(1) : 0}명
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 검색 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="가족명, 가장명, 주소로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 가족 목록 */}
        <div className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredFamilies.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Home className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? '검색 결과가 없습니다' : '등록된 가족이 없습니다'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? '다른 검색어를 시도해보세요' : '새로운 가족을 등록해보세요'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => router.push('/main/families/new')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="mr-2" size={16} />
                  새 가족 등록
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFamilies.map(family => (
                <FamilyCard
                  key={family.id}
                  family={family}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  canEdit={true}
                  canDelete={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamiliesPage; 