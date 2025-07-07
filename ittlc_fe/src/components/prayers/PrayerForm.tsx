import React, { useState, useEffect } from 'react';
import { Save, X, Eye, EyeOff, Users, Calendar, Tag } from 'lucide-react';
import { PrayerCreate, PrayerUpdate, PrayerCategory, prayerService, withFallback } from '@/lib/api';

interface PrayerFormProps {
  initialData?: Partial<PrayerUpdate>;
  isEditing?: boolean;
  onSubmit: (data: PrayerCreate | PrayerUpdate) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const PrayerForm: React.FC<PrayerFormProps> = ({
  initialData,
  isEditing = false,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    category: initialData?.category || '',
    is_anonymous: initialData?.is_anonymous || false,
    visibility: initialData?.visibility || 'public' as 'public' | 'members' | 'private',
    status: initialData?.status || 'active' as 'active' | 'answered' | 'completed',
    prayer_period_start: initialData?.prayer_period_start || '',
    prayer_period_end: initialData?.prayer_period_end || '',
    tags: initialData?.tags || '',
    answer_content: initialData?.answer_content || '',
    answer_date: initialData?.answer_date || '',
  });

  const [categories, setCategories] = useState<PrayerCategory[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      
      // Mock 데이터 정의
      const mockCategories: PrayerCategory[] = [
        { id: 1, name: '교회', description: '교회 관련 기도', is_active: true },
        { id: 2, name: '가족', description: '가족 관련 기도', is_active: true },
        { id: 3, name: '개인', description: '개인 관련 기도', is_active: true },
        { id: 4, name: '선교', description: '선교 관련 기도', is_active: true },
        { id: 5, name: '치유', description: '치유 관련 기도', is_active: true }
      ];
      
      // 실제 API 호출 with fallback
      const data = await withFallback(
        () => prayerService.getPrayerCategories(),
        mockCategories
      );
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // 오류 발생 시 기본 카테고리 설정
      setCategories([
        { id: 1, name: '일반', description: '일반 기도', is_active: true }
      ]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '기도 제목을 입력해주세요';
    } else if (formData.title.length > 200) {
      newErrors.title = '기도 제목은 200자 이하로 입력해주세요';
    }

    if (!formData.content.trim()) {
      newErrors.content = '기도 내용을 입력해주세요';
    }

    if (!formData.category.trim()) {
      newErrors.category = '카테고리를 선택해주세요';
    }

    if (formData.prayer_period_start && formData.prayer_period_end) {
      if (new Date(formData.prayer_period_start) > new Date(formData.prayer_period_end)) {
        newErrors.prayer_period_end = '종료일은 시작일 이후여야 합니다';
      }
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
      const submitData: any = { ...formData };
      
      // 빈 문자열을 undefined로 변환
      if (!submitData.prayer_period_start) delete submitData.prayer_period_start;
      if (!submitData.prayer_period_end) delete submitData.prayer_period_end;
      if (!submitData.tags) delete submitData.tags;
      if (!submitData.answer_content) delete submitData.answer_content;
      if (!submitData.answer_date) delete submitData.answer_date;

      if (isEditing) {
        await onSubmit(submitData as PrayerUpdate);
      } else {
        await onSubmit({
          ...submitData,
          user_id: 1 // TODO: 실제 사용자 ID로 변경
        } as PrayerCreate);
      }
    } catch (error) {
      console.error('Error submitting prayer:', error);
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'private':
        return <EyeOff size={16} />;
      case 'members':
        return <Users size={16} />;
      default:
        return <Eye size={16} />;
    }
  };

  const getVisibilityText = (visibility: string) => {
    switch (visibility) {
      case 'private':
        return '비공개 (본인만)';
      case 'members':
        return '성도공개 (성도들만)';
      default:
        return '전체공개 (모든 사람)';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? '기도 제목 수정' : '새 기도 제목 등록'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              기도 제목 *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="기도 제목을 입력해주세요"
              maxLength={200}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            <p className="mt-1 text-xs text-gray-500">{formData.title.length}/200</p>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              기도 내용 *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={6}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical ${
                errors.content ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="구체적인 기도 내용을 입력해주세요"
            />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              카테고리 *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.category ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={loadingCategories}
            >
              <option value="">카테고리를 선택해주세요</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>
        </div>

        {/* 공개 설정 */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900">공개 설정</h3>
          
          <div>
            <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-2">
              공개 범위
            </label>
            <div className="space-y-2">
              {(['public', 'members', 'private'] as const).map((visibility) => (
                <label key={visibility} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value={visibility}
                    checked={formData.visibility === visibility}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="flex items-center space-x-2">
                    {getVisibilityIcon(visibility)}
                    <span className="text-sm text-gray-700">
                      {getVisibilityText(visibility)}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="is_anonymous"
              name="is_anonymous"
              checked={formData.is_anonymous}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_anonymous" className="text-sm text-gray-700">
              익명으로 등록 (이름을 표시하지 않습니다)
            </label>
          </div>
        </div>

        {/* 기간 설정 */}
        <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 flex items-center space-x-2">
            <Calendar size={16} />
            <span>기도 기간 (선택사항)</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prayer_period_start" className="block text-sm font-medium text-gray-700 mb-2">
                시작일
              </label>
              <input
                type="date"
                id="prayer_period_start"
                name="prayer_period_start"
                value={formData.prayer_period_start}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="prayer_period_end" className="block text-sm font-medium text-gray-700 mb-2">
                종료일
              </label>
              <input
                type="date"
                id="prayer_period_end"
                name="prayer_period_end"
                value={formData.prayer_period_end}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.prayer_period_end ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.prayer_period_end && (
                <p className="mt-1 text-sm text-red-600">{errors.prayer_period_end}</p>
              )}
            </div>
          </div>
        </div>

        {/* 상태 및 응답 (수정 모드일 때만) */}
        {isEditing && (
          <div className="space-y-4 p-4 bg-green-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900">상태 및 응답</h3>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                기도 상태
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">진행중</option>
                <option value="answered">응답됨</option>
                <option value="completed">완료됨</option>
              </select>
            </div>

            {formData.status === 'answered' && (
              <>
                <div>
                  <label htmlFor="answer_content" className="block text-sm font-medium text-gray-700 mb-2">
                    응답 내용
                  </label>
                  <textarea
                    id="answer_content"
                    name="answer_content"
                    value={formData.answer_content}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                    placeholder="기도 응답에 대한 간증을 나눠주세요"
                  />
                </div>
                <div>
                  <label htmlFor="answer_date" className="block text-sm font-medium text-gray-700 mb-2">
                    응답일
                  </label>
                  <input
                    type="date"
                    id="answer_date"
                    name="answer_date"
                    value={formData.answer_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* 태그 */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
            <Tag size={16} />
            <span>태그 (선택사항)</span>
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="태그를 쉼표로 구분해서 입력해주세요 (예: 가족, 건강, 사업)"
          />
          <p className="mt-1 text-xs text-gray-500">
            태그는 기도 제목을 분류하고 검색할 때 도움이 됩니다
          </p>
        </div>

        {/* 버튼 */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <X size={16} />
            <span>취소</span>
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            <span>{loading ? '저장 중...' : (isEditing ? '수정' : '등록')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PrayerForm; 