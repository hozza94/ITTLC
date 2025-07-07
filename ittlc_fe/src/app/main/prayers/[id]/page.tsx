'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Users, 
  Calendar, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  Edit, 
  Trash2,
  Send,
  RefreshCw
} from 'lucide-react';
import { 
  Prayer, 
  prayerService 
} from '@/lib/api';

// 임시 타입 정의 (빌드 오류 해결용)
interface PrayerParticipant {
  id: number;
  user_id: number;
  user_name?: string;
  participated_at: string;
}

interface PrayerComment {
  id: number;
  user_id: number;
  user_name?: string;
  comment: string;
  is_anonymous: boolean;
  created_at: string;
}

const PrayerDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const prayerId = parseInt(params.id as string);

  const [prayer, setPrayer] = useState<Prayer | null>(null);
  const [participants, setParticipants] = useState<PrayerParticipant[]>([]);
  const [comments, setComments] = useState<PrayerComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isParticipating, setIsParticipating] = useState(false);

  // 댓글 작성
  const [newComment, setNewComment] = useState('');
  const [isAnonymousComment, setIsAnonymousComment] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (prayerId) {
      fetchPrayerDetails();
    }
  }, [prayerId]);

  const fetchPrayerDetails = async () => {
    try {
      setLoading(true);
      // 임시로 Mock 데이터 사용 (빌드 오류 해결용)
      const prayerData: Prayer = {
        id: prayerId,
        title: '샘플 기도 제목',
        content: '샘플 기도 내용입니다.',
        category: '일반',
        status: 'active',
        visibility: 'public',
        user_id: 1,
        user_name: '작성자',
        participants_count: 0,
        comments_count: 0,
        created_at: new Date().toISOString()
      };
      const participantsData: PrayerParticipant[] = [];
      const commentsData: PrayerComment[] = [];

      setPrayer(prayerData);
      setParticipants(participantsData);
      setComments(commentsData);
      
      // TODO: 실제 사용자 ID로 변경
      setIsParticipating(participantsData.some(p => p.user_id === 1));
      setError(null);
    } catch (err) {
      setError('기도 정보를 불러오는 중 오류가 발생했습니다');
      console.error('Error fetching prayer details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleParticipate = async () => {
    try {
      if (isParticipating) {
        // TODO: 참여 취소 API 구현
        return;
      }

      // TODO: 실제 사용자 ID로 변경
      await prayerAPI.participatePrayer(prayerId, 1);
      await fetchPrayerDetails();
    } catch (error) {
      console.error('Error participating in prayer:', error);
      alert('기도 참여 중 오류가 발생했습니다');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      await prayerAPI.createComment(prayerId, {
        user_id: 1, // TODO: 실제 사용자 ID로 변경
        comment: newComment.trim(),
        is_anonymous: isAnonymousComment
      });

      setNewComment('');
      setIsAnonymousComment(false);
      await fetchPrayerDetails();
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('댓글 작성 중 오류가 발생했습니다');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleEditPrayer = () => {
    router.push(`/main/prayers/${prayerId}/edit`);
  };

  const handleDeletePrayer = async () => {
    if (!confirm('정말로 이 기도 제목을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await prayerAPI.deletePrayer(prayerId);
      router.push('/main/prayers');
    } catch (error) {
      console.error('Error deleting prayer:', error);
      alert('기도 삭제 중 오류가 발생했습니다');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'answered':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'completed':
        return <CheckCircle className="text-blue-600" size={20} />;
      default:
        return <Heart className="text-red-600" size={20} />;
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
        return <EyeOff className="text-gray-500" size={16} />;
      case 'members':
        return <Users className="text-blue-500" size={16} />;
      default:
        return <Eye className="text-green-500" size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-pulse">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !prayer) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">기도 상세</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">오류 발생</h2>
            <p className="text-gray-600 mb-6">{error || '기도를 찾을 수 없습니다'}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">기도 상세</h1>
              <p className="text-gray-600 mt-1">함께 기도해주세요</p>
            </div>
          </div>
          
          {/* TODO: 권한 체크 후 본인 기도일 때만 표시 */}
          {prayer.created_by === 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEditPrayer}
                className="px-4 py-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors inline-flex items-center space-x-2"
              >
                <Edit size={16} />
                <span>수정</span>
              </button>
              <button
                onClick={handleDeletePrayer}
                className="px-4 py-2 text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors inline-flex items-center space-x-2"
              >
                <Trash2 size={16} />
                <span>삭제</span>
              </button>
            </div>
          )}
        </div>

        {/* 기도 내용 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          {/* 헤더 정보 */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                {getStatusIcon(prayer.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(prayer.status)}`}>
                  {getStatusText(prayer.status)}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                  {prayer.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {prayer.title}
              </h2>
            </div>
            <div className="flex items-center space-x-2 ml-6">
              {getVisibilityIcon(prayer.visibility)}
              {prayer.is_anonymous && (
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">익명</span>
              )}
            </div>
          </div>

          {/* 기도 내용 */}
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {prayer.content}
            </p>
          </div>

          {/* 기간 표시 */}
          {(prayer.prayer_period_start || prayer.prayer_period_end) && (
            <div className="flex items-center space-x-2 mb-6 p-4 bg-blue-50 rounded-lg">
              <Calendar className="text-blue-600" size={20} />
              <div>
                <p className="text-sm font-medium text-blue-800">기도 기간</p>
                <p className="text-sm text-blue-600">
                  {prayer.prayer_period_start && formatDate(prayer.prayer_period_start)}
                  {prayer.prayer_period_start && prayer.prayer_period_end && ' ~ '}
                  {prayer.prayer_period_end && formatDate(prayer.prayer_period_end)}
                </p>
              </div>
            </div>
          )}

          {/* 응답 내용 */}
          {prayer.answer_content && (
            <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="text-green-600" size={20} />
                <h3 className="text-lg font-medium text-green-800">기도 응답</h3>
                {prayer.answer_date && (
                  <span className="text-sm text-green-600">
                    {formatDate(prayer.answer_date)}
                  </span>
                )}
              </div>
              <p className="text-green-700 leading-relaxed whitespace-pre-wrap">
                {prayer.answer_content}
              </p>
            </div>
          )}

          {/* 태그 */}
          {prayer.tags && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {prayer.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 메타 정보 */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Users size={16} />
                <span>{participants.length}명 참여</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle size={16} />
                <span>{comments.length}개 댓글</span>
              </div>
              <span>
                {formatDate(prayer.created_at)}에 등록
              </span>
            </div>

            {prayer.status === 'active' && (
              <button
                onClick={handleParticipate}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isParticipating
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isParticipating ? (
                  <div className="flex items-center space-x-2">
                    <Heart size={16} fill="currentColor" />
                    <span>참여중</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Heart size={16} />
                    <span>함께 기도하기</span>
                  </div>
                )}
              </button>
            )}
          </div>
        </div>

        {/* 참여자 목록 */}
        {participants.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Users size={20} />
              <span>함께 기도하는 분들 ({participants.length}명)</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {participant.username?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {participant.username || '익명'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(participant.participated_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <MessageCircle size={20} />
            <span>기도 댓글 ({comments.length}개)</span>
          </h3>

          {/* 댓글 작성 폼 */}
          <form onSubmit={handleSubmitComment} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="기도와 격려의 말씀을 나눠주세요..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            />
            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isAnonymousComment}
                  onChange={(e) => setIsAnonymousComment(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">익명으로 작성</span>
              </label>
              <button
                type="submit"
                disabled={!newComment.trim() || submittingComment}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                <span>{submittingComment ? '작성 중...' : '댓글 작성'}</span>
              </button>
            </div>
          </form>

          {/* 댓글 목록 */}
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">아직 댓글이 없습니다</p>
              <p className="text-gray-400 text-sm">첫 번째 댓글을 작성해보세요</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-gray-600">
                        {comment.is_anonymous ? '?' : (comment.username?.charAt(0) || '?')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {comment.is_anonymous ? '익명' : (comment.username || '익명')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrayerDetailPage; 