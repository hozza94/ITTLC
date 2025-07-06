import React, { useState, useEffect } from 'react';
import { Member, MemberCreate, MemberUpdate, Family } from '@/lib/api';

interface MemberFormProps {
  member?: Member;
  families?: Family[];
  onSubmit: (memberData: MemberCreate | MemberUpdate) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const MemberForm: React.FC<MemberFormProps> = ({ 
  member, 
  families = [], 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    name_en: member?.name_en || '',
    birth_date: member?.birth_date || '',
    gender: member?.gender || '남' as '남' | '여',
    phone: member?.phone || '',
    email: member?.email || '',
    address: member?.address || '',
    job: member?.job || '',
    registration_date: member?.registration_date || new Date().toISOString().split('T')[0],
    baptism_date: member?.baptism_date || '',
    position: member?.position || '성도',
    district: member?.district || '',
    family_id: member?.family_id || 0,
    family_role: member?.family_role || '',
    is_active: member?.is_active !== undefined ? member.is_active : true,
    notes: member?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 필수 필드 검증
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름은 필수 항목입니다.';
    }

    if (!formData.birth_date) {
      newErrors.birth_date = '생년월일은 필수 항목입니다.';
    }

    if (!formData.gender) {
      newErrors.gender = '성별은 필수 항목입니다.';
    }

    if (!formData.registration_date) {
      newErrors.registration_date = '등록일은 필수 항목입니다.';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      family_id: formData.family_id === 0 ? undefined : formData.family_id,
      baptism_date: formData.baptism_date || undefined,
      name_en: formData.name_en || undefined,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      address: formData.address || undefined,
      job: formData.job || undefined,
      district: formData.district || undefined,
      family_role: formData.family_role || undefined,
      notes: formData.notes || undefined
    };

    if (member) {
      // 수정 모드
      await onSubmit(submitData as MemberUpdate);
    } else {
      // 등록 모드
      await onSubmit({
        ...submitData,
        created_by: 1 // 임시로 1 사용, 실제로는 현재 사용자 ID 사용
      } as MemberCreate);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? 0 : parseInt(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // 에러 메시지 클리어
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 기본 정보 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이름 *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="이름을 입력하세요"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            영문 이름
          </label>
          <input
            type="text"
            name="name_en"
            value={formData.name_en}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="영문 이름을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            생년월일 *
          </label>
          <input
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleInputChange}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.birth_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.birth_date && <p className="mt-1 text-sm text-red-600">{errors.birth_date}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            성별 *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.gender ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="남">남성</option>
            <option value="여">여성</option>
          </select>
          {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            연락처
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="연락처를 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이메일
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="이메일을 입력하세요"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            직업
          </label>
          <input
            type="text"
            name="job"
            value={formData.job}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="직업을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            등록일 *
          </label>
          <input
            type="date"
            name="registration_date"
            value={formData.registration_date}
            onChange={handleInputChange}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.registration_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.registration_date && <p className="mt-1 text-sm text-red-600">{errors.registration_date}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            세례일
          </label>
          <input
            type="date"
            name="baptism_date"
            value={formData.baptism_date}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            직분
          </label>
          <select
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="성도">성도</option>
            <option value="집사">집사</option>
            <option value="권사">권사</option>
            <option value="장로">장로</option>
            <option value="목사">목사</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            교구
          </label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="교구를 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            가족
          </label>
          <select
            name="family_id"
            value={formData.family_id}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={0}>가족 선택</option>
            {families.map(family => (
              <option key={family.id} value={family.id}>
                {family.family_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            가족 내 역할
          </label>
          <select
            name="family_role"
            value={formData.family_role}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">역할 선택</option>
            <option value="가장">가장</option>
            <option value="배우자">배우자</option>
            <option value="자녀">자녀</option>
            <option value="부모">부모</option>
            <option value="조부모">조부모</option>
            <option value="기타">기타</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          주소
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="주소를 입력하세요"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          메모
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="메모를 입력하세요"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={formData.is_active}
          onChange={handleInputChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
          활성 상태
        </label>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? '처리 중...' : (member ? '수정' : '등록')}
        </button>
      </div>
    </form>
  );
};

export default MemberForm; 