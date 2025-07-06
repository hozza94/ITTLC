import React from 'react';
import { Member } from '@/lib/api';

interface MemberCardProps {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (memberId: number) => void;
  onViewDetails: (memberId: number) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onEdit, onDelete, onViewDetails }) => {
  // 나이 계산
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // 성별 표시 색상
  const getGenderColor = (gender: '남' | '여') => {
    return gender === '남' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800';
  };

  // 직분 표시 색상
  const getPositionColor = (position: string) => {
    const colors = {
      '목사': 'bg-purple-100 text-purple-800',
      '장로': 'bg-indigo-100 text-indigo-800',
      '권사': 'bg-green-100 text-green-800',
      '집사': 'bg-yellow-100 text-yellow-800',
      '성도': 'bg-gray-100 text-gray-800'
    };
    return colors[position as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {member.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
            {member.name_en && (
              <p className="text-sm text-gray-500">{member.name_en}</p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGenderColor(member.gender)}`}>
            {member.gender}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(member.position)}`}>
            {member.position}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">나이</p>
          <p className="text-base font-medium">{calculateAge(member.birth_date)}세</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">등록일</p>
          <p className="text-base font-medium">{new Date(member.registration_date).toLocaleDateString()}</p>
        </div>
        {member.phone && (
          <div>
            <p className="text-sm text-gray-600 mb-1">연락처</p>
            <p className="text-base font-medium">{member.phone}</p>
          </div>
        )}
        {member.district && (
          <div>
            <p className="text-sm text-gray-600 mb-1">교구</p>
            <p className="text-base font-medium">{member.district}</p>
          </div>
        )}
      </div>

      {member.family_name && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">가족</p>
          <p className="text-base font-medium">{member.family_name}</p>
        </div>
      )}

      {member.baptism_date && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">세례일</p>
          <p className="text-base font-medium">{new Date(member.baptism_date).toLocaleDateString()}</p>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onViewDetails(member.id)}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
        >
          상세보기
        </button>
        <button
          onClick={() => onEdit(member)}
          className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
        >
          수정
        </button>
        <button
          onClick={() => onDelete(member.id)}
          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default MemberCard; 