import React from 'react';
import { DollarSign, Calendar, User, Edit, Trash2, Eye } from 'lucide-react';

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

interface OfferingCardProps {
  offering: Offering;
  onViewDetails?: (offeringId: number) => void;
  onEdit?: (offeringId: number) => void;
  onDelete?: (offeringId: number) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const OfferingCard: React.FC<OfferingCardProps> = ({
  offering,
  onViewDetails,
  onEdit,
  onDelete,
  canEdit = false,
  canDelete = false
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="text-green-600" size={16} />
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getOfferingTypeColor(offering.offering_type)}`}>
              {offering.offering_type}
            </span>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <User className="text-gray-500" size={14} />
            <span className="text-sm text-gray-700 font-medium">
              {offering.member_name || `성도 ID: ${offering.member_id}`}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-gray-900">
            {formatAmount(offering.amount)}
          </div>
        </div>
      </div>

      {/* 날짜 정보 */}
      <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
        <Calendar size={14} />
        <span>헌금일: {formatDate(offering.offering_date)}</span>
      </div>

      {/* 메모 */}
      {offering.memo && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-700">{offering.memo}</p>
        </div>
      )}

      {/* 하단 정보 */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          <div>등록: {formatDate(offering.created_at)}</div>
          {offering.created_by_username && (
            <div>등록자: {offering.created_by_username}</div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(offering.id)}
              className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title="상세 보기"
            >
              <Eye size={14} />
            </button>
          )}
          
          {canEdit && onEdit && (
            <button
              onClick={() => onEdit(offering.id)}
              className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              title="수정"
            >
              <Edit size={14} />
            </button>
          )}
          
          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(offering.id)}
              className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              title="삭제"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferingCard; 