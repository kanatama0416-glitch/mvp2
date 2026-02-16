import React, { useState } from 'react';
import { Plus, Calendar, Users } from 'lucide-react';
import Events from '../Events/Events';
import FavoriteEventTop3 from '../Events/FavoriteEventTop3';
import Community from '../Community/Community';
import PostModal, { PostFormData } from './PostModal';
import { useAuth } from '../../hooks/useAuth';
import { createOtherCasePost } from '../../services/casePostService';

type TabType = 'events' | 'other';

export default function CasesCollection() {
  const [activeTab, setActiveTab] = useState<TabType>('events');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const { user } = useAuth();

  const handleSubmitPost = async (data: PostFormData) => {
    try {
      if (data.category === 'other') {
        if (!user) {
          alert('ログインが必要です。');
          return;
        }
        const ok = await createOtherCasePost({
          authorId: user.id,
          title: data.title,
          situation: data.situation,
          approach: data.approach,
          result: data.result,
          notes: data.notes,
          tags: data.tags,
        });
        if (ok) {
          setActiveTab('other');
          // Community側の再読込トリガー
          setReloadKey((k) => k + 1);
        } else {
          alert('投稿の保存に失敗しました');
        }
      } else {
        // 好きイベ事例の保存は別画面/実装に委ねる
        setActiveTab('events');
      }
    } catch (e) {
      console.error(e);
      alert('投稿処理でエラーが発生しました');
    }
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">事例集</h1>
        <p className="text-gray-600 mt-1">好きイベ事例とその他の成功事例を確認できます</p>
      </div>

      {/* 投稿ボタン - 中央配置・大きめ */}
      <div className="flex justify-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-3 px-8 py-4 bg-vivid-red text-white rounded-xl hover:bg-red-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-lg"
        >
          <Plus className="w-6 h-6" />
          <span>投稿</span>
        </button>
      </div>

      {/* タブ */}
      <div className="bg-white rounded-xl border border-gray-200 p-1">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'events'
                ? 'bg-vivid-red text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>好きイベ事例</span>
            </div>
            <p className="text-xs mt-1 opacity-90">イベント関連の成功事例</p>
          </button>
          <button
            onClick={() => setActiveTab('other')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'other'
                ? 'bg-vivid-red text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Users className="w-5 h-5" />
              <span>その他事例</span>
            </div>
            <p className="text-xs mt-1 opacity-90">日常接客の成功事例</p>
          </button>
        </div>
      </div>

      {/* タブコンテンツ */}
      <div>
        {activeTab === 'events' ? (
          <>
            <FavoriteEventTop3 />
            <Events />
          </>
        ) : (
          <Community reloadKey={reloadKey} />
        )}
      </div>

      {/* 投稿モーダル */}
      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitPost}
      />
    </div>
  );
}
