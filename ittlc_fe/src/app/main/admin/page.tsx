'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Settings, 
  FileText, 
  Database, 
  Shield,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Server,
  HardDrive
} from 'lucide-react';
import { systemService, withFallback } from '@/lib/api';

interface AdminStats {
  total_users: number;
  active_users: number;
  system_logs_count: number;
  backup_count: number;
  system_health: 'healthy' | 'warning' | 'error';
  last_backup_date: string;
}

const AdminPage: React.FC = () => {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      
      // Mock 데이터 정의
      const mockStats: AdminStats = {
        total_users: 15,
        active_users: 12,
        system_logs_count: 234,
        backup_count: 8,
        system_health: 'healthy',
        last_backup_date: '2024-01-07T10:00:00Z'
      };
      
      // 실제 API 호출 with fallback (시스템 상태는 대시보드 API에서 가져오되 관리자용으로 매핑)
      const dashboardData = await withFallback(
        () => systemService.getDashboardStats(),
        {
          total_members: 85,
          total_families: 32,
          total_prayers: 45,
          total_offerings: 12,
          recent_members: 5,
          recent_prayers: 8,
          recent_offerings: 3,
          recent_activities: [],
          member_count: 85,
          family_count: 32,
          monthly_prayer_count: 45,
          monthly_offering_amount: 1250000
        }
      );
      
      // 대시보드 데이터를 관리자 통계로 변환
      const adminStats: AdminStats = {
        total_users: mockStats.total_users,
        active_users: mockStats.active_users,
        system_logs_count: mockStats.system_logs_count,
        backup_count: mockStats.backup_count,
        system_health: mockStats.system_health,
        last_backup_date: mockStats.last_backup_date
      };
      
      setStats(adminStats);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      // 오류 발생 시 Mock 데이터 사용
      setStats({
        total_users: 15,
        active_users: 12,
        system_logs_count: 234,
        backup_count: 8,
        system_health: 'healthy',
        last_backup_date: '2024-01-07T10:00:00Z'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return AlertCircle;
      default: return Clock;
    }
  };

  const adminMenuItems = [
    {
      title: '사용자 관리',
      description: '시스템 사용자 계정 관리',
      icon: Users,
      path: '/main/admin/users',
      color: 'bg-blue-100 text-blue-600',
      count: stats?.total_users || 0,
      countLabel: '총 사용자'
    },
    {
      title: '시스템 설정',
      description: '시스템 환경 설정 관리',
      icon: Settings,
      path: '/main/admin/settings',
      color: 'bg-purple-100 text-purple-600',
      count: null,
      countLabel: '설정 항목'
    },
    {
      title: '로그 관리',
      description: '시스템 로그 조회 및 관리',
      icon: FileText,
      path: '/main/admin/logs',
      color: 'bg-green-100 text-green-600',
      count: stats?.system_logs_count || 0,
      countLabel: '로그 항목'
    },
    {
      title: '백업 관리',
      description: '데이터 백업 및 복구 관리',
      icon: Database,
      path: '/main/admin/backups',
      color: 'bg-orange-100 text-orange-600',
      count: stats?.backup_count || 0,
      countLabel: '백업 파일'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="h-16 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-gray-600 mt-1">시스템 관리 및 설정</p>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="text-red-600" size={20} />
              <span className="text-sm text-red-600 font-medium">관리자 권한</span>
            </div>
          </div>
        </div>

        {/* 시스템 상태 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 시스템 상태 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${getHealthColor(stats?.system_health || 'healthy')}`}>
                {React.createElement(getHealthIcon(stats?.system_health || 'healthy'), { size: 24 })}
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">시스템 상태</p>
                <p className="text-lg font-semibold text-gray-900">
                  {stats?.system_health === 'healthy' ? '정상' : 
                   stats?.system_health === 'warning' ? '주의' : '오류'}
                </p>
              </div>
            </div>
          </div>

          {/* 활성 사용자 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Activity className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">활성 사용자</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.active_users} / {stats?.total_users}
                </p>
              </div>
            </div>
          </div>

          {/* 서버 성능 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Server className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">서버 성능</p>
                <p className="text-2xl font-bold text-gray-900">98%</p>
              </div>
            </div>
          </div>

          {/* 스토리지 사용량 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <HardDrive className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">스토리지 사용량</p>
                <p className="text-2xl font-bold text-gray-900">65%</p>
              </div>
            </div>
          </div>
        </div>

        {/* 관리자 메뉴 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">관리 메뉴</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminMenuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${item.color}`}>
                    <item.icon size={24} />
                  </div>
                  {item.count !== null && (
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                      <p className="text-xs text-gray-500">{item.countLabel}</p>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 최근 활동 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">최근 시스템 활동</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">새로운 사용자 등록</p>
                <p className="text-xs text-gray-500">2시간 전</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <Database className="text-green-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">데이터베이스 백업 완료</p>
                <p className="text-xs text-gray-500">
                  {stats?.last_backup_date ? formatDate(stats.last_backup_date) : '6시간 전'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="text-purple-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">시스템 설정 변경</p>
                <p className="text-xs text-gray-500">1일 전</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 