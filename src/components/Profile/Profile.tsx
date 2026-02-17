import React, { useState } from 'react';
import { 
  User, 
  Edit3, 
  Camera, 
  Trophy, 
  TrendingUp, 
  MessageCircle, 
  Target, 
  Calendar,
  Award,
  Star,
  BarChart3,
  BookOpen,
  Users,
  Heart,
  ThumbsUp,
  Lightbulb,
  ChevronRight,
  ChevronDown,
  Settings,
  Save,
  X
} from 'lucide-react';
import { mockAchievements, mockGrowthRecords, mockCommunityPosts } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';

interface LearningGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: Date;
}

interface ProfileStats {
  totalSessions: number;
  totalLearningHours: number;
  averageScore: number;
  communityPosts: number;
  aiAdoptedPosts: number;
  totalReactions: number;
  comments: number;
  badges: number;
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || '',
    introduction: '丸井でカード口コミを担当しています。お客様に喜んでいただける提案を心がけています。',
    learningGoals: '今月は断り対応スキルを重点的に向上させたいと思います。'
  });

  const profileStats: ProfileStats = {
    totalSessions: 47,
    totalLearningHours: 23.5,
    averageScore: 78.5,
    communityPosts: 3,
    aiAdoptedPosts: 2,
    totalReactions: 74,
    comments: 12,
    badges: 8
  };

  const learningGoals: LearningGoal[] = [
    {
      id: '1',
      title: '今月の学習回数',
      target: 20,
      current: 14,
      deadline: new Date('2024-01-31')
    },
    {
      id: '2',
      title: 'コミュニケーションスコア',
      target: 85,
      current: 78,
      deadline: new Date('2024-01-31')
    },
    {
      id: '3',
      title: 'コミュニティ投稿',
      target: 5,
      current: 3,
      deadline: new Date('2024-01-31')
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'simulation',
      title: 'アニメイベント口コミ実践',
      score: 85,
      date: new Date('2024-01-20'),
      icon: MessageCircle,
      color: 'text-sky-blue'
    },
    {
      id: '2',
      type: 'community',
      title: 'アニメファン接客事例を投稿',
      reactions: 24,
      date: new Date('2024-01-18'),
      icon: Users,
      color: 'text-success-green'
    },
    {
      id: '3',
      type: 'achievement',
      title: '口コミ初心者卒業バッジ獲得',
      date: new Date('2024-01-15'),
      icon: Trophy,
      color: 'text-sunshine-yellow'
    },
    {
      id: '4',
      type: 'consultation',
      title: 'AI相談：断り対応について',
      date: new Date('2024-01-12'),
      icon: Lightbulb,
      color: 'text-purple-600'
    }
  ];

  const skillCategories = [
    { name: 'ヒアリング力', score: 78, change: +5, color: 'bg-sky-blue' },
    { name: '親しみやすさ', score: 85, change: +3, color: 'bg-success-green' },
    { name: '柔軟対応力', score: 72, change: +8, color: 'bg-sunshine-yellow' },
    { name: '口コミ力', score: 82, change: +2, color: 'bg-vivid-red' },
    { name: '会話スピード', score: 75, change: +6, color: 'bg-purple-600' }
  ];

  const unlockedAchievements = mockAchievements.filter(a => a.unlockedAt);
  const totalReactions = mockCommunityPosts.reduce((sum, post) => 
    sum + post.reactions.like + post.reactions.empathy + post.reactions.helpful, 0
  );

  const handleSaveProfile = () => {
    // プロフィール保存処理
    if (user) {
      updateUser({ name: editedProfile.name });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedProfile({
      name: user?.name || '',
      introduction: '丸井でカード口コミを担当しています。お客様に喜んでいただける提案を心がけています。',
      learningGoals: '今月は断り対応スキルを重点的に向上させたいと思います。'
    });
    setIsEditing(false);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-gray-500">ユーザー情報を読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">プロフィール</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center space-x-2 px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          <span>{isEditing ? 'キャンセル' : '編集'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 基本情報 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <img
                  src={user.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-sky-blue text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-4 text-xl font-bold text-center w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              ) : (
                <h2 className="text-xl font-bold text-gray-900 mt-4">{user.name}</h2>
              )}
              
              <p className="text-gray-600">{user.department}</p>
              <p className="text-sm text-gray-500">社員ID: EMP001</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">自己紹介</h3>
                {isEditing ? (
                  <textarea
                    value={editedProfile.introduction}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, introduction: e.target.value }))}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-700">{editedProfile.introduction}</p>
                )}
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">学習目標</h3>
                {isEditing ? (
                  <textarea
                    value={editedProfile.learningGoals}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, learningGoals: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-700">{editedProfile.learningGoals}</p>
                )}
              </div>

              {isEditing && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-success-green text-white rounded-lg hover:bg-emerald-green transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>保存</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>キャンセル</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 統計情報 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">活動統計</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-sky-blue">{profileStats.totalSessions}</div>
                <div className="text-xs text-gray-600">学習回数</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-success-green">{profileStats.averageScore}</div>
                <div className="text-xs text-gray-600">平均スコア</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-xl font-bold text-sunshine-yellow">{profileStats.communityPosts}</div>
                <div className="text-xs text-gray-600">投稿数</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-xl font-bold text-vivid-red">{profileStats.badges}</div>
                <div className="text-xs text-gray-600">バッジ数</div>
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="lg:col-span-2 space-y-6">
          {/* 学習目標進捗 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Target className="w-5 h-5 text-vivid-red" />
              <span>今月の学習目標</span>
            </h3>
            <div className="space-y-4">
              {learningGoals.map((goal) => {
                const progress = (goal.current / goal.target) * 100;
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{goal.title}</span>
                      <span className="text-sm text-gray-600">
                        {goal.current} / {goal.target}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-sky-blue to-success-green transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      期限: {goal.deadline.toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* スキル評価 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-sky-blue" />
              <span>スキル評価</span>
            </h3>
            <div className="space-y-4">
              {skillCategories.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{skill.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900">{skill.score}</span>
                      <span className={`text-sm font-medium ${
                        skill.change > 0 ? 'text-success-green' : 'text-gray-500'
                      }`}>
                        {skill.change > 0 ? `+${skill.change}` : skill.change}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${skill.color} transition-all duration-500`}
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 最近の活動 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-success-green" />
              <span>最近の活動</span>
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100`}>
                      <IconComponent className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span>{activity.date.toLocaleDateString('ja-JP')}</span>
                        {activity.score && <span>スコア: {activity.score}点</span>}
                        {activity.reactions && <span>{activity.reactions}リアクション</span>}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 獲得バッジ */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-sunshine-yellow" />
              <span>獲得バッジ</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {unlockedAchievements.map((achievement) => (
                <div key={achievement.id} className="text-center p-4 bg-gradient-to-br from-yellow-50 to-red-50 rounded-lg border border-yellow-200">
                  <div className="w-12 h-12 bg-sunshine-yellow rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm">{achievement.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {achievement.unlockedAt?.toLocaleDateString('ja-JP')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* コミュニティ貢献 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span>コミュニティ貢献</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <ThumbsUp className="w-5 h-5 text-sky-blue" />
                  <Heart className="w-5 h-5 text-vivid-red" />
                  <Lightbulb className="w-5 h-5 text-sunshine-yellow" />
                </div>
                <div className="text-xl font-bold text-gray-900">{totalReactions}</div>
                <div className="text-sm text-gray-600">総リアクション</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <MessageCircle className="w-8 h-8 text-success-green mx-auto mb-2" />
                <div className="text-xl font-bold text-gray-900">{profileStats.comments}</div>
                <div className="text-sm text-gray-600">コメント数</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Star className="w-8 h-8 text-sunshine-yellow mx-auto mb-2" />
                <div className="text-xl font-bold text-gray-900">{profileStats.aiAdoptedPosts}</div>
                <div className="text-sm text-gray-600">AI学習採用</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}