'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Home, 
  MapPin, 
  Users, 
  Crown,
  Plus,
  UserMinus,
  Phone,
  Mail,
  Calendar,
  UserCheck
} from 'lucide-react';
import FamilyForm from '@/components/families/FamilyForm';
import { Family, FamilyMember } from '@/lib/api';

interface FamilyFormData {
  family_name: string;
  head_member_id?: number;
  address?: string;
}

const FamilyDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const familyId = params.id as string;
  
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [availableMembers, setAvailableMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number>(0);
  const [selectedMemberRole, setSelectedMemberRole] = useState<string>('자녀');

  const familyRoles = ['가장', '배우자', '자녀', '부모', '조부모', '기타'];

  useEffect(() => {
    if (familyId) {
      fetchFamily();
      fetchFamilyMembers();
      fetchAvailableMembers();
    }
  }, [familyId]);

  const fetchFamily = async () => {
    try {
      setLoading(true);
      
      // TODO: 실제 API 호출로 변경
      // const data = await familyAPI.getFamily(parseInt(familyId));
      
      // 임시 데이터 (실제 API 구현 후 변경)
      const mockFamily: Family = {
        id: parseInt(familyId),
        family_name: '김철수 가정',
        head_member_id: 1,
        head_member_name: '김철수',
        address: '서울시 강남구 테헤란로 123',
        member_count: 4,
        created_at: '2023-01-15T10:00:00Z'
      };
      
      setFamily(mockFamily);
    } catch (error) {
      console.error('Error fetching family:', error);
      alert('가족 정보를 불러오는 중 오류가 발생했습니다');
      router.push('/main/families');
    } finally {
      setLoading(false);
    }
  };

  const fetchFamilyMembers = async () => {
    try {
      // TODO: 실제 API 호출로 변경
      // const data = await familyAPI.getFamilyMembers(parseInt(familyId));
      
      // 임시 데이터
      const mockMembers: FamilyMember[] = [
        {
          id: 1,
          name: '김철수',
          family_id: parseInt(familyId),
          family_role: '가장',
          phone: '010-1234-5678',
          email: 'kim@example.com',
          birth_date: '1980-01-15',
          gender: 'M',
          registration_date: '2023-01-15'
        },
        {
          id: 2,
          name: '김영희',
          family_id: parseInt(familyId),
          family_role: '배우자',
          phone: '010-2345-6789',
          email: 'kim.wife@example.com',
          birth_date: '1983-05-20',
          gender: 'F',
          registration_date: '2023-01-15'
        },
        {
          id: 3,
          name: '김민수',
          family_id: parseInt(familyId),
          family_role: '자녀',
          phone: '010-3456-7890',
          email: 'kim.son@example.com',
          birth_date: '2010-03-10',
          gender: 'M',
          registration_date: '2023-01-15'
        },
        {
          id: 4,
          name: '김수연',
          family_id: parseInt(familyId),
          family_role: '자녀',
          phone: '010-4567-8901',
          email: 'kim.daughter@example.com',
          birth_date: '2012-08-25',
          gender: 'F',
          registration_date: '2023-01-15'
        }
      ];
      
      setMembers(mockMembers);
    } catch (error) {
      console.error('Error fetching family members:', error);
    }
  };

  const fetchAvailableMembers = async () => {
    try {
      // TODO: 실제 API 호출로 변경 (가족이 없는 성도들만)
      const mockAvailableMembers: FamilyMember[] = [
        {
          id: 5,
          name: '박민수',
          phone: '010-5678-9012',
          email: 'park@example.com',
          birth_date: '1990-07-08',
          gender: 'M',
          registration_date: '2023-03-05'
        },
        {
          id: 6,
          name: '정수연',
          phone: '010-6789-0123',
          email: 'jung@example.com',
          birth_date: '1988-11-25',
          gender: 'F',
          registration_date: '2023-04-12'
        }
      ];
      
      setAvailableMembers(mockAvailableMembers);
    } catch (error) {
      console.error('Error fetching available members:', error);
    }
  };

  const handleEdit = async (data: FamilyFormData) => {
    setSubmitLoading(true);
    try {
      // TODO: 실제 API 호출로 변경
      // const updatedFamily = await familyAPI.updateFamily(parseInt(familyId), data);
      
      // 임시로 성공 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFamily(prev => prev ? { ...prev, ...data } : null);
      setIsEditing(false);
      alert('가족 정보가 성공적으로 수정되었습니다');
    } catch (error) {
      console.error('Error updating family:', error);
      alert('가족 정보 수정 중 오류가 발생했습니다');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 가족을 삭제하시겠습니까? 구성원들의 가족 연결이 해제됩니다.')) {
      try {
        // TODO: 실제 API 호출로 변경
        // await familyAPI.deleteFamily(parseInt(familyId));
        
        alert('가족이 성공적으로 삭제되었습니다');
        router.push('/main/families');
      } catch (error) {
        console.error('Error deleting family:', error);
        alert('가족 삭제 중 오류가 발생했습니다');
      }
    }
  };

  const handleAddMember = async () => {
    if (!selectedMemberId || selectedMemberId === 0) {
      alert('추가할 구성원을 선택해주세요');
      return;
    }

    try {
      // TODO: 실제 API 호출로 변경
      // await familyAPI.addMemberToFamily(parseInt(familyId), {
      //   member_id: selectedMemberId,
      //   family_role: selectedMemberRole
      // });
      
      // 임시 업데이트
      const memberToAdd = availableMembers.find(m => m.id === selectedMemberId);
      if (memberToAdd) {
        const newMember = {
          ...memberToAdd,
          family_id: parseInt(familyId),
          family_role: selectedMemberRole
        };
        setMembers(prev => [...prev, newMember]);
        setAvailableMembers(prev => prev.filter(m => m.id !== selectedMemberId));
      }
      
      setShowAddMember(false);
      setSelectedMemberId(0);
      setSelectedMemberRole('자녀');
      alert('가족 구성원이 추가되었습니다');
    } catch (error) {
      console.error('Error adding member:', error);
      alert('구성원 추가 중 오류가 발생했습니다');
    }
  };

  const handleRemoveMember = async (memberId: number, memberName: string) => {
    if (window.confirm(`${memberName}님을 가족에서 제거하시겠습니까?`)) {
      try {
        // TODO: 실제 API 호출로 변경
        // await familyAPI.removeMemberFromFamily(memberId);
        
        // 임시 업데이트
        const removedMember = members.find(m => m.id === memberId);
        if (removedMember) {
          setMembers(prev => prev.filter(m => m.id !== memberId));
          setAvailableMembers(prev => [...prev, {
            ...removedMember,
            family_id: undefined,
            family_role: undefined
          }]);
        }
        
        alert('가족 구성원이 제거되었습니다');
      } catch (error) {
        console.error('Error removing member:', error);
        alert('구성원 제거 중 오류가 발생했습니다');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!family) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">가족을 찾을 수 없습니다</h1>
            <button
              onClick={() => router.push('/main/families')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              가족 목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing ? '가족 정보 수정' : family.family_name}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isEditing ? '가족 정보를 수정합니다' : '가족 상세 정보'}
                </p>
              </div>
            </div>
            
            {!isEditing && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="inline mr-2" size={16} />
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="inline mr-2" size={16} />
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 가족 정보 */}
          <div className="lg:col-span-1">
            {isEditing ? (
              <FamilyForm
                initialData={{
                  family_name: family.family_name,
                  head_member_id: family.head_member_id,
                  address: family.address
                }}
                isEditing={true}
                onSubmit={handleEdit}
                onCancel={() => setIsEditing(false)}
                loading={submitLoading}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Home className="text-blue-600" size={24} />
                  <h2 className="text-xl font-semibold text-gray-900">가족 정보</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">가족명</p>
                    <p className="text-lg font-medium text-gray-900">{family.family_name}</p>
                  </div>

                  {family.head_member_name && (
                    <div className="flex items-center space-x-2">
                      <Crown className="text-amber-500" size={16} />
                      <div>
                        <p className="text-sm text-gray-600">가장</p>
                        <p className="text-lg font-medium text-gray-900">{family.head_member_name}</p>
                      </div>
                    </div>
                  )}

                  {family.address && (
                    <div className="flex items-start space-x-2">
                      <MapPin className="text-gray-500 mt-1" size={16} />
                      <div>
                        <p className="text-sm text-gray-600">주소</p>
                        <p className="text-gray-800">{family.address}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Users className="text-green-600" size={16} />
                    <div>
                      <p className="text-sm text-gray-600">구성원 수</p>
                      <p className="text-lg font-medium text-gray-900">{members.length}명</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600">등록일</p>
                    <p className="text-gray-800">{formatDate(family.created_at)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 가족 구성원 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Users className="text-green-600" size={24} />
                  <h2 className="text-xl font-semibold text-gray-900">가족 구성원</h2>
                </div>
                <button
                  onClick={() => setShowAddMember(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="inline mr-2" size={16} />
                  구성원 추가
                </button>
              </div>

              {/* 구성원 추가 폼 */}
              {showAddMember && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                  <h3 className="text-lg font-medium text-blue-900 mb-4">구성원 추가</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">성도 선택</label>
                      <select
                        value={selectedMemberId}
                        onChange={(e) => setSelectedMemberId(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value={0}>성도를 선택해주세요</option>
                        {availableMembers.map(member => (
                          <option key={member.id} value={member.id}>
                            {member.name} ({member.birth_date ? getAge(member.birth_date) : '미상'}세)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">가족 내 역할</label>
                      <select
                        value={selectedMemberRole}
                        onChange={(e) => setSelectedMemberRole(e.target.value)}
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {familyRoles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => {
                        setShowAddMember(false);
                        setSelectedMemberId(0);
                        setSelectedMemberRole('자녀');
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleAddMember}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      추가
                    </button>
                  </div>
                </div>
              )}

              {/* 구성원 목록 */}
              <div className="space-y-4">
                {members.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">등록된 구성원이 없습니다</p>
                  </div>
                ) : (
                  members.map(member => (
                    <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <UserCheck className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {member.family_role}
                              </span>
                              {member.id === family.head_member_id && (
                                <Crown className="text-amber-500" size={16} />
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              {member.phone && (
                                <div className="flex items-center space-x-1">
                                  <Phone size={14} />
                                  <span>{member.phone}</span>
                                </div>
                              )}
                              {member.email && (
                                <div className="flex items-center space-x-1">
                                  <Mail size={14} />
                                  <span>{member.email}</span>
                                </div>
                              )}
                              {member.birth_date && (
                                <div className="flex items-center space-x-1">
                                  <Calendar size={14} />
                                  <span>{getAge(member.birth_date)}세</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveMember(member.id, member.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="가족에서 제거"
                        >
                          <UserMinus size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyDetailPage; 