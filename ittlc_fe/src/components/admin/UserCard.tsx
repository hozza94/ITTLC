import React from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  ShieldCheck, 
  Eye, 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';

interface User {
  id: number;
  email: string;
  username: string;
  role: 'admin' | 'user' | 'viewer';
  is_active: boolean;
  created_at: string;
  last_login?: string;
  full_name?: string;
}

interface UserCardProps {
  user: User;
  onEdit?: (userId: number) => void;
  onDelete?: (userId: number) => void;
  onToggleStatus?: (userId: number, currentStatus: boolean) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canToggleStatus?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  onToggleStatus,
  canEdit = false,
  canDelete = false,
  canToggleStatus = false
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'user': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'viewer': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return ShieldCheck;
      case 'user': return User;
      case 'viewer': return Eye;
      default: return User;
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return '관리자';
      case 'user': return '사용자';
      case 'viewer': return '뷰어';
      default: return role;
    }
  };

  const RoleIcon = getRoleIcon(user.role);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-full ${getRoleColor(user.role)}`}>
            <RoleIcon size={20} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {user.full_name || user.username}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                {getRoleName(user.role)}
              </span>
            </div>
            {user.full_name && (
              <p className="text-sm text-gray-600">@{user.username}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {user.is_active ? (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle size={16} />
              <span className="text-xs font-medium">활성</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-red-600">
              <XCircle size={16} />
              <span className="text-xs font-medium">비활성</span>
            </div>
          )}
        </div>
      </div>

      {/* 사용자 정보 */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Mail size={14} />
          <span>{user.email}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar size={14} />
          <span>가입일: {formatDate(user.created_at)}</span>
        </div>
        
        {user.last_login && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock size={14} />
            <span>최근 로그인: {formatDate(user.last_login)}</span>
          </div>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          ID: {user.id}
        </div>
        
        <div className="flex items-center space-x-2">
          {canToggleStatus && onToggleStatus && (
            <button
              onClick={() => onToggleStatus(user.id, user.is_active)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                user.is_active
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {user.is_active ? '비활성화' : '활성화'}
            </button>
          )}
          
          {canEdit && onEdit && (
            <button
              onClick={() => onEdit(user.id)}
              className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              title="수정"
            >
              <Edit size={14} />
            </button>
          )}
          
          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(user.id)}
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

export default UserCard; 