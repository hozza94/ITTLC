import React from 'react';
import { Home, Users, MapPin, Edit, Trash2, Eye, Crown } from 'lucide-react';
import { Family } from '@/lib/api';

interface FamilyCardProps {
  family: Family;
  onViewDetails?: (familyId: number) => void;
  onEdit?: (familyId: number) => void;
  onDelete?: (familyId: number) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const FamilyCard: React.FC<FamilyCardProps> = ({
  family,
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Home className="text-blue-600" size={20} />
            <h3 className="text-xl font-semibold text-gray-900">
              {family.family_name}
            </h3>
          </div>
          
          {/* 가장 정보 */}
          {family.head_member_name && (
            <div className="flex items-center space-x-2 mb-2">
              <Crown className="text-amber-500" size={16} />
              <span className="text-sm text-gray-700">
                가장: <span className="font-medium">{family.head_member_name}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 주소 */}
      {family.address && (
        <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
          <MapPin size={14} />
          <span>{family.address}</span>
        </div>
      )}

      {/* 가족 구성원 수 */}
      <div className="flex items-center space-x-2 mb-4">
        <Users className="text-green-600" size={16} />
        <span className="text-sm text-gray-700">
          가족 구성원: <span className="font-semibold text-green-700">{family.member_count || 0}명</span>
        </span>
      </div>

      {/* 하단 정보 */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          <div>등록일: {formatDate(family.created_at)}</div>
        </div>

        <div className="flex items-center space-x-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(family.id)}
              className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title="상세 보기"
            >
              <Eye size={14} />
            </button>
          )}
          
          {canEdit && onEdit && (
            <button
              onClick={() => onEdit(family.id)}
              className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              title="수정"
            >
              <Edit size={14} />
            </button>
          )}
          
          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(family.id)}
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

export default FamilyCard; 