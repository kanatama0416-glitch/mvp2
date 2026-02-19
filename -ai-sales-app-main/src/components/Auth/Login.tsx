import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onNavigateToSignup?: () => void;
}

interface LoginForm {
  email: string;
  password: string;
}

const mockUsers = [
  {
    id: '1',
    email: 'tanaka@marui.co.jp',
    password: 'password123',
    name: '田中 太郎',
    department: 'カード口コミ部',
    role: 'learner',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '2',
    email: 'sato@marui.co.jp',
    password: 'password123',
    name: '佐藤 花子',
    department: 'アニメイト渋谷店',
    role: 'learner',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '3',
    email: 'admin@marui.co.jp',
    password: 'admin123',
    name: '管理者',
    department: '本部',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
];

export default function Login({ onLogin, onNavigateToSignup }: LoginProps) {
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 空欄ログインを許可する一時対応
    if ((formData.email && !formData.password) || (!formData.email && formData.password)) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Supabaseから認証（現在はメールのみでチェック、パスワードは将来実装）
      const success = await onLogin(formData.email, formData.password);

      if (!success) {
        setError('メールアドレスが見つかりません。デモアカウントをお試しください。');
      }
    } catch (error) {
      setError('ログインに失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (userType: 'staff' | 'admin') => {
    setIsLoading(true);
    setError('');

    try {
      const demoUser = userType === 'admin' ? mockUsers[2] : mockUsers[0];
      const success = await onLogin(demoUser.email, demoUser.password);

      if (!success) {
        setError('ログインに失敗しました。データベースにユーザーが登録されていない可能性があります。');
      }
    } catch (error) {
      console.error('Demo login error:', error);
      setError('ログインに失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-gray to-sky-blue/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ロゴ・タイトル */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-vivid-red rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">まなびー</h1>
          <p className="text-gray-600">社員ログイン</p>
        </div>

        {/* ログインフォーム */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* メールアドレス */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                メールアドレス
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your-email@marui.co.jp"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* パスワード */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                パスワード
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="パスワードを入力"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* エラーメッセージ */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-vivid-red" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {/* ログインボタン */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 bg-vivid-red text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ログイン中...
                </>
              ) : (
                'ログイン'
              )}
            </button>
          </form>

          {/* デモログイン */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4">デモアカウント</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin('staff')}
                disabled={isLoading}
                className="px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors text-sm font-medium"
              >
                スタッフ
              </button>
              <button
                onClick={() => handleDemoLogin('admin')}
                disabled={isLoading}
                className="px-4 py-2 bg-success-green text-white rounded-lg hover:bg-emerald-green disabled:opacity-50 transition-colors text-sm font-medium"
              >
                管理者
              </button>
            </div>
          </div>

          {/* 認証情報表示 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-sky-blue mb-2">テスト用認証情報</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <div>スタッフ: tanaka@marui.co.jp / password123</div>
              <div>管理者: admin@marui.co.jp / admin123</div>
            </div>
          </div>

          {/* 新規登録リンク */}
          {onNavigateToSignup && (
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-3">アカウントをお持ちでない方</p>
              <button
                onClick={onNavigateToSignup}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-white text-sky-blue border-2 border-sky-blue rounded-lg hover:bg-sky-blue hover:text-white disabled:opacity-50 transition-colors text-sm font-medium"
              >
                新規アカウント作成
              </button>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 丸井グループ まなびー
          </p>
        </div>
      </div>
    </div>
  );
}
