'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Heart, Users, Calendar, RefreshCw } from 'lucide-react';
import PrayerCard from '@/components/prayers/PrayerCard';
import { Prayer, PrayerCategory, prayerAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

const PrayersPage = () => {
  const router = useRouter();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [categories, setCategories] = useState<PrayerCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 필터 상태
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    visibility: '',
  });

  // 통계 상태
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    answered: 0,
    myPrayers: 0,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchPrayers();
  }, [filters]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [prayersData, categoriesData] = await Promise.all([
        prayerAPI.getPrayers({ limit: 50 }),
        prayerAPI.getCategories()
      ]);
      
      setPrayers(prayersData);
      setCategories(categoriesData);
      calculateStats(prayersData);
      setError(null);
    } catch (err) {
      setError('데이터 로드 중 오류가 발생했습니다');
      console.error('Error fetching initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrayers = async () => {
    try {
      if (refreshing) return;
      
      const params: any = { limit: 50 };
      
      if (filters.category) params.category = filters.category;
      if (filters.status) params.status = filters.status;
      if (filters.visibility) params.visibility = filters.visibility;

      const data = await prayerAPI.getPrayers(params);
      
      // 검색 필터 적용 (클라이언트 사이드)
      const filteredData = filters.search
        ? data.filter(prayer =>
            prayer.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            prayer.content.toLowerCase().includes(filters.search.toLowerCase()) ||
            (prayer.tags && prayer.tags.toLowerCase().includes(filters.search.toLowerCase()))
          )
        : data;

      setPrayers(filteredData);
      calculateStats(filteredData);
    } catch (err) {
      console.error('Error fetching prayers:', err);
    }
  };

  const calculateStats = (prayerList: Prayer[]) => {
    const total = prayerList.length;
    const active = prayerList.filter(p => p.status === 'active').length;
    const answered = prayerList.filter(p => p.status === 'answered').length;
    const myPrayers = prayerList.filter(p => p.created_by === 1).length; // TODO: 실제 사용자 ID로 변경

    setStats({ total, active, answered, myPrayers });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInitialData();
    setRefreshing(false);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', status: '', visibility: '' });
  };

  const handleParticipate = async (prayerId: number) => {
    try {
      // TODO: 실제 사용자 ID로 변경
      await prayerAPI.participatePrayer(prayerId, 1);
      // 참여 후 목록 새로고침
      await fetchPrayers();
    } catch (error) {
      console.error('Error participating in prayer:', error);
    }
  };

  const handleViewDetails = (prayerId: number) => {
    router.push(`/main/prayers/${prayerId}`);
  };

  const handleCreatePrayer = () => {
    router.push('/main/prayers/new');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">기도 관리</h1>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          
          {/* 스켈레톤 로딩 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">기도 관리</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">데이터 로드 실패</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>다시 시도</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">기도 관리</h1>
            <p className="text-gray-600 mt-1">함께 기도하며 서로를 격려해요</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>새로고침</span>
            </button>
            <button
              onClick={handleCreatePrayer}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>기도 등록</span>
            </button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">전체 기도</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">진행중</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">응답됨</p>
                <p className="text-2xl font-bold text-gray-900">{stats.answered}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Heart className="w-6 h-6 text-green-600 fill-current" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">내 기도</p>
                <p className="text-2xl font-bold text-gray-900">{stats.myPrayers}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 필터 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">필터</h3>
            {(filters.search || filters.category || filters.status || filters.visibility) && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                필터 초기화
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="기도 제목, 내용, 태그 검색..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">모든 카테고리</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">모든 상태</option>
              <option value="active">진행중</option>
              <option value="answered">응답됨</option>
              <option value="completed">완료됨</option>
            </select>
            
            <select
              value={filters.visibility}
              onChange={(e) => handleFilterChange('visibility', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">모든 공개 범위</option>
              <option value="public">전체공개</option>
              <option value="members">성도공개</option>
              <option value="private">비공개</option>
            </select>
          </div>
        </div>

        {/* 기도 목록 */}
        {prayers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filters.search || filters.category || filters.status || filters.visibility
                ? '검색 결과가 없습니다'
                : '아직 등록된 기도가 없습니다'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {filters.search || filters.category || filters.status || filters.visibility
                ? '다른 조건으로 검색해보시거나 필터를 초기화해보세요'
                : '첫 번째 기도 제목을 등록해보세요'
              }
            </p>
            {!filters.search && !filters.category && !filters.status && !filters.visibility && (
              <button
                onClick={handleCreatePrayer}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>기도 등록</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {prayers.map((prayer) => (
              <PrayerCard
                key={prayer.id}
                prayer={prayer}
                onParticipate={handleParticipate}
                onViewDetails={handleViewDetails}
                participantCount={0} // TODO: 실제 참여자 수 구현
                commentCount={0}     // TODO: 실제 댓글 수 구현
                isParticipating={false} // TODO: 실제 참여 여부 구현
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayersPage; 