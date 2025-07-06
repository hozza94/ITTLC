import React, { useState, useEffect } from 'react';
import { Save, X, Home, Crown, MapPin, Users } from 'lucide-react';
import { FamilyMember } from '@/lib/api';

interface FamilyFormData {
  family_name: string;
  head_member_id?: number;
  address?: string;
}

interface FamilyFormProps {
  initialData?: Partial<FamilyFormData>;
  isEditing?: boolean;
  onSubmit: (data: FamilyFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const FamilyForm: React.FC<FamilyFormProps> = ({
  initialData,
  isEditing = false,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<FamilyFormData>({
    family_name: initialData?.family_name || '',
    head_member_id: initialData?.head_member_id || undefined,
    address: initialData?.address || ''
  });

  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoadingData(true);
      
      // TODO: 실제 API 호출로 변경
      // const response = await fetch('/api/v1/members');
      // const data = await response.json();
      
      // 임시 데이터 (실제 API 구현 후 변경)
      const mockMembers: FamilyMember[] = [
        {
          id: 1,
          name: '김철수',
          phone: '010-1234-5678',
          email: 'kim@example.com',
          birth_date: '1980-01-15',
          gender: 'M',
          registration_date: '2023-01-15'
        },
        {
          id: 2,
          name: '이영희',
          phone: '010-2345-6789',
          email: 'lee@example.com',
          birth_date: '1985-03-20',
          gender: 'F',
          registration_date: '2023-02-10'
        },
        {
          id: 3,
          name: '박민수',
          phone: '010-3456-7890',
          email: 'park@example.com',
          birth_date: '1990-07-08',
          gender: 'M',
          registration_date: '2023-03-05'
        },
        {
          id: 4,
          name: '정수연',
          phone: '010-4567-8901',
          email: 'jung@example.com',
          birth_date: '1988-11-25',
          gender: 'F',
          registration_date: '2023-04-12'
        }
      ];
      
      setMembers(mockMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    let processedValue: string | number | undefined = value;
    
    if (name === 'head_member_id') {
      processedValue = value ? parseInt(value) : undefined;
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    
    // 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.family_name.trim()) {
      newErrors.family_name = '가족명을 입력해주세요';
    } else if (formData.family_name.length > 100) {
      newErrors.family_name = '가족명은 100자 이하로 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting family:', error);
    }
  };

  const getSelectedMemberName = (memberId?: number) => {
    if (!memberId) return '';
    const member = members.find(m => m.id === memberId);
    return member ? member.name : '';
  };

  if (loadingData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? '가족 정보 수정' : '새 가족 등록'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 가족명 */}
        <div>
          <label htmlFor="family_name" className="block text-sm font-medium text-gray-700 mb-2">
            <Home className="inline mr-1" size={14} />
            가족명 *
          </label>
          <input
            type="text"
            id="family_name"
            name="family_name"
            value={formData.family_name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.family_name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="예: 김철수 가정"
            maxLength={100}
          />
          {errors.family_name && <p className="mt-1 text-sm text-red-600">{errors.family_name}</p>}
          <p className="mt-1 text-xs text-gray-500">{formData.family_name.length}/100</p>
        </div>

        {/* 가장 선택 */}
        <div>
          <label htmlFor="head_member_id" className="block text-sm font-medium text-gray-700 mb-2">
            <Crown className="inline mr-1" size={14} />
            가장 선택 (선택사항)
          </label>
          <select
            id="head_member_id"
            name="head_member_id"
            value={formData.head_member_id || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">가장을 선택해주세요 (선택사항)</option>
            {members.map(member => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.birth_date ? new Date(member.birth_date).getFullYear() : '미상'}년생)
              </option>
            ))}
          </select>
          {formData.head_member_id && (
            <p className="mt-1 text-sm text-blue-600">
              선택된 가장: {getSelectedMemberName(formData.head_member_id)}
            </p>
          )}
        </div>

        {/* 주소 */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline mr-1" size={14} />
            주소 (선택사항)
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            placeholder="가족 주소를 입력해주세요"
          />
        </div>

        {/* 안내 메시지 */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
          <div className="flex items-start">
            <Users className="text-blue-600 mt-0.5 mr-2" size={16} />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">가족 구성원 관리 안내</p>
              <p>가족 등록 후 상세 페이지에서 구성원을 추가하거나 제거할 수 있습니다.</p>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="inline mr-1" size={14} />
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="inline mr-1" size={14} />
            {loading ? '저장 중...' : (isEditing ? '수정하기' : '등록하기')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FamilyForm; 