import React from 'react';
import { Heart, MessageCircle, Users, Calendar, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Prayer } from '@/lib/api';

interface PrayerCardProps {
  prayer: Prayer;
  onParticipate?: (prayerId: number) => void;
  onViewDetails?: (prayerId: number) => void;
  participantCount?: number;
  commentCount?: number;
  isParticipating?: boolean;
}

const PrayerCard: React.FC<PrayerCardProps> = ({
  prayer,
  onParticipate,
  onViewDetails,
  participantCount = 0,
  commentCount = 0,
  isParticipating = false
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'answered':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'completed':
        return <CheckCircle className="text-blue-600" size={16} />;
      default:
        return <Heart className="text-red-600" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'answered':
        return '응답됨';
      case 'completed':
        return '완료됨';
      default:
        return '진행중';
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'private':
        return <EyeOff className="text-gray-500" size={14} />;
      case 'members':
        return <Users className="text-blue-500" size={14} />;
      default:
        return <Eye className="text-green-500" size={14} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {getStatusIcon(prayer.status)}
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(prayer.status)}`}>
              {getStatusText(prayer.status)}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {prayer.category}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {prayer.title}
          </h3>
        </div>
        <div className="flex items-center space-x-1 ml-4">
          {getVisibilityIcon(prayer.visibility)}
          {prayer.is_anonymous && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">익명</span>
          )}
        </div>
      </div>

      {/* 내용 */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {truncateContent(prayer.content)}
      </p>

      {/* 기간 표시 */}
      {(prayer.prayer_period_start || prayer.prayer_period_end) && (
        <div className="flex items-center space-x-2 mb-4 text-sm text-gray-500">
          <Calendar size={14} />
          <span>
            {prayer.prayer_period_start && formatDate(prayer.prayer_period_start)}
            {prayer.prayer_period_start && prayer.prayer_period_end && ' ~ '}
            {prayer.prayer_period_end && formatDate(prayer.prayer_period_end)}
          </span>
        </div>
      )}

      {/* 응답 내용 (있을 경우) */}
      {prayer.answer_content && (
        <div className="bg-green-50 border-l-4 border-green-400 p-3 mb-4">
          <div className="flex items-center space-x-2 mb-1">
            <CheckCircle className="text-green-600" size={14} />
            <span className="text-sm font-medium text-green-800">기도 응답</span>
            {prayer.answer_date && (
              <span className="text-xs text-green-600">
                {formatDate(prayer.answer_date)}
              </span>
            )}
          </div>
          <p className="text-sm text-green-700">
            {truncateContent(prayer.answer_content, 80)}
          </p>
        </div>
      )}

      {/* 하단 액션 */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Users size={14} />
            <span>{participantCount}명 참여</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle size={14} />
            <span>{commentCount}개 댓글</span>
          </div>
          <span className="text-xs">
            {formatDate(prayer.created_at)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {onParticipate && prayer.status === 'active' && (
            <button
              onClick={() => onParticipate(prayer.id)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                isParticipating
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {isParticipating ? (
                <div className="flex items-center space-x-1">
                  <Heart size={14} fill="currentColor" />
                  <span>참여중</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Heart size={14} />
                  <span>함께 기도</span>
                </div>
              )}
            </button>
          )}
          
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(prayer.id)}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              자세히
            </button>
          )}
        </div>
      </div>

      {/* 태그 */}
      {prayer.tags && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            {prayer.tags.split(',').map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrayerCard; 