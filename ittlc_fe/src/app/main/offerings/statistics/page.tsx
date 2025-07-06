'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Users, 
  FileText,
  BarChart3,
  PieChart,
  Download
} from 'lucide-react';

interface OfferingStats {
  total_amount: number;
  total_count: number;
  average_amount: number;
  by_type: Array<{
    offering_type: string;
    amount: number;
    count: number;
  }>;
  by_month: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
  by_member: Array<{
    member_name: string;
    amount: number;
    count: number;
  }>;
}

const OfferingStatisticsPage: React.FC = () => {
  const router = useRouter();
  const [stats, setStats] = useState<OfferingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // 올해 1월 1일
    end: new Date().toISOString().split('T')[0] // 오늘
  });

  useEffect(() => {
    fetchStatistics();
  }, [dateRange]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      // TODO: 실제 API 호출로 변경
      // const response = await fetch(`/api/v1/offerings/statistics/period?start_date=${dateRange.start}&end_date=${dateRange.end}`);
      // const data = await response.json();
      
      // 임시 데이터 (실제 API 구현 후 변경)
      const mockStats: OfferingStats = {
        total_amount: 5750000,
        total_count: 28,
        average_amount: 205357,
        by_type: [
          { offering_type: '십일조', amount: 2500000, count: 8 },
          { offering_type: '주일헌금', amount: 1200000, count: 12 },
          { offering_type: '감사헌금', amount: 800000, count: 4 },
          { offering_type: '선교헌금', amount: 600000, count: 2 },
          { offering_type: '건축헌금', amount: 400000, count: 1 },
          { offering_type: '절기헌금', amount: 250000, count: 1 }
        ],
        by_month: [
          { month: '2024-01', amount: 1500000, count: 8 },
          { month: '2024-02', amount: 1200000, count: 6 },
          { month: '2024-03', amount: 1100000, count: 5 },
          { month: '2024-04', amount: 980000, count: 4 },
          { month: '2024-05', amount: 970000, count: 5 }
        ],
        by_member: [
          { member_name: '김철수', amount: 1200000, count: 6 },
          { member_name: '이영희', amount: 800000, count: 8 },
          { member_name: '박민수', amount: 600000, count: 4 },
          { member_name: '정수연', amount: 500000, count: 3 },
          { member_name: '최민정', amount: 400000, count: 2 }
        ]
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const formatMonth = (monthStr: string) => {
    const date = new Date(monthStr + '-01');
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getOfferingTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      '십일조': 'bg-blue-500',
      '주일헌금': 'bg-green-500',
      '감사헌금': 'bg-purple-500',
      '선교헌금': 'bg-orange-500',
      '건축헌금': 'bg-red-500',
      '특별헌금': 'bg-yellow-500',
      '절기헌금': 'bg-pink-500',
      '기타헌금': 'bg-gray-500'
    };
    return colorMap[type] || 'bg-gray-500';
  };

  const handleExport = () => {
    // TODO: 실제 엑셀 내보내기 구현
    alert('통계 데이터를 엑셀로 내보내는 기능을 구현 중입니다');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">통계 데이터를 불러올 수 없습니다</h1>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <h1 className="text-3xl font-bold text-gray-900">헌금 통계</h1>
                <p className="text-gray-600 mt-1">헌금 현황 및 통계 정보</p>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="inline mr-2" size={16} />
              엑셀 내보내기
            </button>
          </div>

          {/* 날짜 범위 선택 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <label className="text-sm font-medium text-gray-700">조회 기간</label>
              </div>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-gray-500">~</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">총 헌금액</p>
                <p className="text-2xl font-bold text-gray-900">{formatAmount(stats.total_amount)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">총 건수</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_count.toLocaleString()}건</p>
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
                <p className="text-2xl font-bold text-gray-900">{formatAmount(stats.average_amount)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="text-orange-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">헌금 참여자</p>
                <p className="text-2xl font-bold text-gray-900">{stats.by_member.length}명</p>
              </div>
            </div>
          </div>
        </div>

        {/* 차트 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 헌금 종류별 통계 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <PieChart className="text-gray-700 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">헌금 종류별 통계</h3>
            </div>
            <div className="space-y-4">
              {stats.by_type.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${getOfferingTypeColor(item.offering_type)}`}></div>
                    <span className="text-sm font-medium text-gray-700">{item.offering_type}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{formatAmount(item.amount)}</div>
                    <div className="text-xs text-gray-500">{item.count}건</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 월별 통계 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <BarChart3 className="text-gray-700 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">월별 헌금 통계</h3>
            </div>
            <div className="space-y-4">
              {stats.by_month.map((item, index) => {
                const maxAmount = Math.max(...stats.by_month.map(m => m.amount));
                const widthPercentage = (item.amount / maxAmount) * 100;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{formatMonth(item.month)}</span>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">{formatAmount(item.amount)}</div>
                        <div className="text-xs text-gray-500">{item.count}건</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${widthPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 성도별 헌금 현황 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <Users className="text-gray-700 mr-2" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">성도별 헌금 현황 (상위 5명)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">순위</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">성도명</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">총 헌금액</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">헌금 건수</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">평균 헌금액</th>
                </tr>
              </thead>
              <tbody>
                {stats.by_member.map((member, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{member.member_name}</td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">
                      {formatAmount(member.amount)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-700">{member.count}건</td>
                    <td className="py-3 px-4 text-right text-gray-700">
                      {formatAmount(member.amount / member.count)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferingStatisticsPage; 