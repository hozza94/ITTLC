import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, Info, AlertTriangle, XCircle } from 'lucide-react';
import { SystemLog, dashboardAPI } from '@/lib/api';

const RecentActivity: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getRecentLogs(10);
      setLogs(data);
      setError(null);
    } catch (err) {
      setError('최근 활동 조회 중 오류가 발생했습니다');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLogIcon = (logLevel: string) => {
    switch (logLevel.toLowerCase()) {
      case 'error':
      case 'critical':
        return <XCircle className="text-red-500" size={16} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={16} />;
      case 'info':
        return <Info className="text-blue-500" size={16} />;
      default:
        return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  const getLogColor = (logLevel: string) => {
    switch (logLevel.toLowerCase()) {
      case 'error':
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
        <div className="text-center py-8">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">{error}</p>
          <button
            onClick={fetchLogs}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">최근 활동</h3>
        <Clock className="text-gray-400" size={18} />
      </div>
      
      {logs.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">최근 활동이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`p-3 rounded-lg border-l-4 ${getLogColor(log.log_level)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getLogIcon(log.log_level)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {log.log_type}
                    </p>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatDateTime(log.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{log.message}</p>
                  {log.username && (
                    <p className="text-xs text-gray-500 mt-1">
                      사용자: {log.username}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={fetchLogs}
          className="w-full text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          새로고침
        </button>
      </div>
    </div>
  );
};

export default RecentActivity; 