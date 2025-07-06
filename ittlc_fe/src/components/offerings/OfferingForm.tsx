import React, { useState, useEffect } from 'react';
import { Save, X, DollarSign, User, Calendar } from 'lucide-react';

interface OfferingType {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

interface Member {
  id: number;
  name: string;
  // 추가 필드들...
}

interface OfferingFormData {
  member_id: number;
  offering_date: string;
  offering_type: string;
  amount: number;
  memo?: string;
}

interface OfferingFormProps {
  initialData?: Partial<OfferingFormData>;
  isEditing?: boolean;
  onSubmit: (data: OfferingFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const OfferingForm: React.FC<OfferingFormProps> = ({
  initialData,
  isEditing = false,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<OfferingFormData>({
    member_id: initialData?.member_id || 0,
    offering_date: initialData?.offering_date || new Date().toISOString().split('T')[0],
    offering_type: initialData?.offering_type || '',
    amount: initialData?.amount || 0,
    memo: initialData?.memo || ''
  });

  const [offeringTypes, setOfferingTypes] = useState<OfferingType[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingData, setLoadingData] = useState(true);

  // 기본 헌금 종류 (API에서 가져오기 전까지 사용)
  const defaultOfferingTypes = [
    '십일조', '주일헌금', '감사헌금', '선교헌금', 
    '건축헌금', '특별헌금', '절기헌금', '기타헌금'
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoadingData(true);
      
      // TODO: 실제 API 호출로 변경
      // const [typesResponse, membersResponse] = await Promise.all([
      //   fetch('/api/v1/offerings/types'),
      //   fetch('/api/v1/members')
      // ]);
      
      // 임시 데이터 (실제 API 구현 후 변경)
      const mockTypes = defaultOfferingTypes.map((type, index) => ({
        id: index + 1,
        name: type,
        description: `${type} 설명`,
        is_active: true,
        created_at: new Date().toISOString()
      }));
      
      const mockMembers = [
        { id: 1, name: '김철수' },
        { id: 2, name: '이영희' },
        { id: 3, name: '박민수' },
        { id: 4, name: '정수연' }
      ];
      
      setOfferingTypes(mockTypes);
      setMembers(mockMembers);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    let processedValue: string | number = value;
    
    if (name === 'amount') {
      processedValue = parseFloat(value) || 0;
    } else if (name === 'member_id') {
      processedValue = parseInt(value) || 0;
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    
    // 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.member_id || formData.member_id === 0) {
      newErrors.member_id = '성도를 선택해주세요';
    }

    if (!formData.offering_date.trim()) {
      newErrors.offering_date = '헌금일을 선택해주세요';
    }

    if (!formData.offering_type.trim()) {
      newErrors.offering_type = '헌금 종류를 선택해주세요';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = '헌금액을 입력해주세요';
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
      console.error('Error submitting offering:', error);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  if (loadingData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
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
          {isEditing ? '헌금 기록 수정' : '새 헌금 기록 등록'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 성도 선택 */}
        <div>
          <label htmlFor="member_id" className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline mr-1" size={14} />
            성도 선택 *
          </label>
          <select
            id="member_id"
            name="member_id"
            value={formData.member_id}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.member_id ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value={0}>성도를 선택해주세요</option>
            {members.map(member => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          {errors.member_id && <p className="mt-1 text-sm text-red-600">{errors.member_id}</p>}
        </div>

        {/* 헌금일 */}
        <div>
          <label htmlFor="offering_date" className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline mr-1" size={14} />
            헌금일 *
          </label>
          <input
            type="date"
            id="offering_date"
            name="offering_date"
            value={formData.offering_date}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.offering_date ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.offering_date && <p className="mt-1 text-sm text-red-600">{errors.offering_date}</p>}
        </div>

        {/* 헌금 종류 */}
        <div>
          <label htmlFor="offering_type" className="block text-sm font-medium text-gray-700 mb-2">
            헌금 종류 *
          </label>
          <select
            id="offering_type"
            name="offering_type"
            value={formData.offering_type}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.offering_type ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">헌금 종류를 선택해주세요</option>
            {offeringTypes.map(type => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.offering_type && <p className="mt-1 text-sm text-red-600">{errors.offering_type}</p>}
        </div>

        {/* 헌금액 */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="inline mr-1" size={14} />
            헌금액 *
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            min="0"
            step="1000"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.amount ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="헌금액을 입력해주세요"
          />
          {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
          {formData.amount > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              {formatAmount(formData.amount)}원
            </p>
          )}
        </div>

        {/* 메모 */}
        <div>
          <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-2">
            메모 (선택사항)
          </label>
          <textarea
            id="memo"
            name="memo"
            value={formData.memo}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            placeholder="추가 메모나 특이사항을 입력해주세요"
          />
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

export default OfferingForm; 