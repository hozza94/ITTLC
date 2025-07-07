'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Filter, 
  DollarSign, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Users,
  FileText
} from 'lucide-react';
import OfferingCard from '@/components/offerings/OfferingCard';
import { Offering, offeringService, withFallback } from '@/lib/api';

interface OfferingFilter {
  member_id?: number;
  offering_type?: string;
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
}

const OfferingsPage: React.FC = () => {
  const router = useRouter();
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<OfferingFilter>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOfferings, setTotalOfferings] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // 헌금 종류 목록
  const offeringTypes = [
    '십일조', '주일헌금', '감사헌금', '선교헌금', 
    '건축헌금', '특별헌금', '절기헌금', '기타헌금'
  ];

  useEffect(() => {
    fetchOfferings();
  }, [currentPage, filters]);

  const fetchOfferings = async () => {
    try {
      setLoading(true);
      
      // Mock 데이터 정의
      const mockOfferings = [
        {
          id: 1,
          member_id: 1,
          member_name: '김철수',
          offering_date: '2024-01-07',
          offering_type: '십일조',
          amount: 500000,
          memo: '1월 십일조',
          created_by: 1,
          created_by_username: 'admin',
          created_at: '2024-01-07T10:00:00Z',
          updated_at: '2024-01-07T10:00:00Z'
        },
        {
          id: 2,
          member_id: 2,
          member_name: '이영희',
          offering_date: '2024-01-07',
          offering_type: '주일헌금',
          amount: 100000,
          memo: '주일 감사헌금',
          created_by: 1,
          created_by_username: 'admin',
          created_at: '2024-01-07T11:00:00Z',
          updated_at: '2024-01-07T11:00:00Z'
        },
        {
          id: 3,
          member_id: 3,
          member_name: '박민수',
          offering_date: '2024-01-06',
          offering_type: '감사헌금',
          amount: 200000,
          memo: '승진 감사헌금',
          created_by: 1,
          created_by_username: 'admin',
          created_at: '2024-01-06T15:00:00Z',
          updated_at: '2024-01-06T15:00:00Z'
        },
        {
          id: 4,
          member_id: 4,
          member_name: '정수연',
          offering_date: '2024-01-05',
          offering_type: '선교헌금',
          amount: 300000,
          memo: '해외선교 후원',
          created_by: 1,
          created_by_username: 'admin',
          created_at: '2024-01-05T14:00:00Z',
          updated_at: '2024-01-05T14:00:00Z'
        },
        {
          id: 5,
          member_id: 1,
          member_name: '김철수',
          offering_date: '2024-01-01',
          offering_type: '절기헌금',
          amount: 150000,
          memo: '신년감사예배',
          created_by: 1,
          created_by_username: 'admin',
          created_at: '2024-01-01T09:00:00Z',
          updated_at: '2024-01-01T09:00:00Z'
        }
      ];

      // 실제 API 호출 with fallback
      const params = {
        skip: (currentPage - 1) * 10,
        limit: 10,
        ...filters
      };
      
      const data = await withFallback(
        () => offeringService.getOfferings(params),
        mockOfferings
      );

      setOfferings(data);
      setTotalOfferings(data.length);
      setTotalAmount(data.reduce((sum, offering) => sum + offering.amount, 0));
      setTotalPages(Math.ceil(data.length / 10));
    } catch (error) {
      console.error('Error fetching offerings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof OfferingFilter, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleViewDetails = (offeringId: number) => {
    router.push(`/main/offerings/${offeringId}`);
  };

  const handleEdit = (offeringId: number) => {
    router.push(`/main/offerings/${offeringId}/edit`);
  };

  const handleDelete = async (offeringId: number) => {
    if (window.confirm('정말로 이 헌금 기록을 삭제하시겠습니까?')) {
      try {
        // TODO: 실제 API 호출로 변경
        // await fetch(`/api/v1/offerings/${offeringId}`, { method: 'DELETE' });
        
        setOfferings(prev => prev.filter(offering => offering.id !== offeringId));
        alert('헌금 기록이 삭제되었습니다.');
      } catch (error) {
        console.error('Error deleting offering:', error);
        alert('헌금 기록 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const filteredOfferings = offerings.filter(offering => {
    const matchesSearch = searchTerm === '' || 
      offering.member_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offering.offering_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offering.memo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">헌금 관리</h1>
              <p className="text-gray-600 mt-1">교회 헌금 기록을 관리합니다</p>
            </div>
            <button
              onClick={() => router.push('/main/offerings/new')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="mr-2" size={16} />
              새 헌금 등록
            </button>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">총 헌금 건수</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOfferings.toLocaleString()}건</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">총 헌금액</p>
                  <p className="text-2xl font-bold text-gray-900">{formatAmount(totalAmount)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="text-purple-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">평균 헌금액</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatAmount(totalOfferings > 0 ? totalAmount / totalOfferings : 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 검색 및 필터 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="성도명, 헌금 종류, 메모로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="inline mr-2" size={16} />
                필터
              </button>
            </div>

            {/* 필터 옵션 */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      헌금 종류
                    </label>
                    <select
                      value={filters.offering_type || ''}
                      onChange={(e) => handleFilterChange('offering_type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">모든 종류</option>
                      {offeringTypes.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      시작 날짜
                    </label>
                    <input
                      type="date"
                      value={filters.start_date || ''}
                      onChange={(e) => handleFilterChange('start_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      종료 날짜
                    </label>
                    <input
                      type="date"
                      value={filters.end_date || ''}
                      onChange={(e) => handleFilterChange('end_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    필터 초기화
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 헌금 목록 */}
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
          ) : filteredOfferings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <DollarSign className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                등록된 헌금이 없습니다
              </h3>
              <p className="text-gray-500 mb-4">
                새로운 헌금 기록을 등록해보세요
              </p>
              <button
                onClick={() => router.push('/main/offerings/new')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="mr-2" size={16} />
                새 헌금 등록
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOfferings.map(offering => (
                <OfferingCard
                  key={offering.id}
                  offering={offering}
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

export default OfferingsPage; 