'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Settings,
  Save,
  RefreshCw,
  Globe,
  Lock,
  Mail,
  Database,
  Palette,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  Eye,
  EyeOff
} from 'lucide-react';

interface SystemSetting {
  id: number;
  setting_key: string;
  setting_value: string;
  setting_type: 'string' | 'number' | 'boolean' | 'json';
  category: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

interface SettingCategory {
  key: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
  settings: SystemSetting[];
}

const SystemSettingsPage: React.FC = () => {
  const router = useRouter();
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState('general');
  const [showPasswords, setShowPasswords] = useState(false);
  const [changes, setChanges] = useState<Record<string, string>>({});
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      // TODO: 실제 API 호출로 변경
      // const response = await fetch('/api/v1/system/settings');
      // const data = await response.json();
      
      // 임시 데이터 (실제 API 구현 후 변경)
      const mockSettings: SystemSetting[] = [
        {
          id: 1,
          setting_key: 'site_title',
          setting_value: 'ITTLC 교회 관리 시스템',
          setting_type: 'string',
          category: 'general',
          description: '사이트 제목',
          is_public: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          setting_key: 'site_description',
          setting_value: '교회 성도 관리 및 기도 요청 시스템',
          setting_type: 'string',
          category: 'general',
          description: '사이트 설명',
          is_public: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 3,
          setting_key: 'max_login_attempts',
          setting_value: '5',
          setting_type: 'number',
          category: 'security',
          description: '최대 로그인 시도 횟수',
          is_public: false,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 4,
          setting_key: 'session_timeout',
          setting_value: '3600',
          setting_type: 'number',
          category: 'security',
          description: '세션 만료 시간 (초)',
          is_public: false,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 5,
          setting_key: 'smtp_host',
          setting_value: 'smtp.gmail.com',
          setting_type: 'string',
          category: 'email',
          description: 'SMTP 서버 주소',
          is_public: false,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 6,
          setting_key: 'smtp_port',
          setting_value: '587',
          setting_type: 'number',
          category: 'email',
          description: 'SMTP 포트',
          is_public: false,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 7,
          setting_key: 'smtp_username',
          setting_value: 'system@church.com',
          setting_type: 'string',
          category: 'email',
          description: 'SMTP 사용자명',
          is_public: false,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 8,
          setting_key: 'smtp_password',
          setting_value: '••••••••',
          setting_type: 'string',
          category: 'email',
          description: 'SMTP 비밀번호',
          is_public: false,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 9,
          setting_key: 'backup_frequency',
          setting_value: '24',
          setting_type: 'number',
          category: 'database',
          description: '백업 주기 (시간)',
          is_public: false,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 10,
          setting_key: 'backup_retention',
          setting_value: '30',
          setting_type: 'number',
          category: 'database',
          description: '백업 보존 기간 (일)',
          is_public: false,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 11,
          setting_key: 'theme_primary_color',
          setting_value: '#3B82F6',
          setting_type: 'string',
          category: 'appearance',
          description: '메인 테마 색상',
          is_public: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 12,
          setting_key: 'enable_dark_mode',
          setting_value: 'false',
          setting_type: 'boolean',
          category: 'appearance',
          description: '다크 모드 활성화',
          is_public: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];
      
      setSettings(mockSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      
      // TODO: 실제 API 호출로 변경
      // for (const [key, value] of Object.entries(changes)) {
      //   await fetch(`/api/v1/system/settings/${key}`, {
      //     method: 'PUT',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ setting_value: value })
      //   });
      // }
      
      // 임시로 성공 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 설정 업데이트
      setSettings(prev => prev.map(setting => {
        if (changes[setting.setting_key]) {
          return { ...setting, setting_value: changes[setting.setting_key] };
        }
        return setting;
      }));
      
      setChanges({});
      setUnsavedChanges(false);
      alert('설정이 성공적으로 저장되었습니다');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('설정 저장 중 오류가 발생했습니다');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setChanges(prev => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };

  const handleResetChanges = () => {
    setChanges({});
    setUnsavedChanges(false);
  };

  const getDisplayValue = (setting: SystemSetting) => {
    const changedValue = changes[setting.setting_key];
    const currentValue = changedValue !== undefined ? changedValue : setting.setting_value;
    
    // 비밀번호 필드 처리
    if (setting.setting_key.includes('password') && !showPasswords) {
      return '••••••••';
    }
    
    return currentValue;
  };

  const categories: SettingCategory[] = [
    {
      key: 'general',
      name: '일반',
      description: '사이트 기본 설정',
      icon: Globe,
      settings: settings.filter(s => s.category === 'general')
    },
    {
      key: 'security',
      name: '보안',
      description: '보안 및 인증 설정',
      icon: Lock,
      settings: settings.filter(s => s.category === 'security')
    },
    {
      key: 'email',
      name: '이메일',
      description: '이메일 발송 설정',
      icon: Mail,
      settings: settings.filter(s => s.category === 'email')
    },
    {
      key: 'database',
      name: '데이터베이스',
      description: '데이터베이스 및 백업 설정',
      icon: Database,
      settings: settings.filter(s => s.category === 'database')
    },
    {
      key: 'appearance',
      name: '외관',
      description: '테마 및 UI 설정',
      icon: Palette,
      settings: settings.filter(s => s.category === 'appearance')
    }
  ];

  const activeSettings = categories.find(cat => cat.key === activeCategory)?.settings || [];

  const renderSettingInput = (setting: SystemSetting) => {
    const value = getDisplayValue(setting);
    const isPassword = setting.setting_key.includes('password');
    
    switch (setting.setting_type) {
      case 'boolean':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value === 'true'}
              onChange={(e) => handleSettingChange(setting.setting_key, e.target.checked ? 'true' : 'false')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              활성화
            </label>
          </div>
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleSettingChange(setting.setting_key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );
      default:
        return (
          <div className="relative">
            <input
              type={isPassword && !showPasswords ? 'password' : 'text'}
              value={value}
              onChange={(e) => handleSettingChange(setting.setting_key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={setting.description}
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/main/admin')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">시스템 설정</h1>
                <p className="text-gray-600 mt-1">시스템 환경 설정을 관리합니다</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {unsavedChanges && (
                <div className="flex items-center space-x-2 text-amber-600">
                  <AlertCircle size={16} />
                  <span className="text-sm">저장되지 않은 변경사항이 있습니다</span>
                </div>
              )}
              <button
                onClick={handleResetChanges}
                disabled={!unsavedChanges}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={16} className="mr-2 inline" />
                초기화
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={!unsavedChanges || saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <RefreshCw size={16} className="mr-2 inline animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2 inline" />
                    저장
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 카테고리 사이드바 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">설정 카테고리</h2>
              <nav className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.key}
                      onClick={() => setActiveCategory(category.key)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeCategory === category.key
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon size={20} />
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-gray-500">{category.settings.length}개 설정</div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* 설정 내용 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  {React.createElement(categories.find(cat => cat.key === activeCategory)?.icon || Settings, { size: 24 })}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {categories.find(cat => cat.key === activeCategory)?.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {categories.find(cat => cat.key === activeCategory)?.description}
                    </p>
                  </div>
                </div>
              </div>
              
              {loading ? (
                <div className="p-6">
                  <div className="animate-pulse space-y-6">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {activeSettings.map((setting) => (
                    <div key={setting.id} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {setting.description || setting.setting_key}
                        </label>
                        {!setting.is_public && (
                          <Lock size={12} className="text-gray-400" />
                        )}
                        {changes[setting.setting_key] !== undefined && (
                          <div className="flex items-center space-x-1 text-amber-600">
                            <Clock size={12} />
                            <span className="text-xs">수정됨</span>
                          </div>
                        )}
                      </div>
                      
                      {renderSettingInput(setting)}
                      
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Info size={12} />
                        <span>키: {setting.setting_key}</span>
                        <span>•</span>
                        <span>타입: {setting.setting_type}</span>
                        <span>•</span>
                        <span>공개: {setting.is_public ? '예' : '아니오'}</span>
                      </div>
                    </div>
                  ))}
                  
                  {activeSettings.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Settings size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>이 카테고리에 설정이 없습니다.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage; 