import React, { useEffect, useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import Events from '../Events/Events';
import PostModal, { PostFormData } from './PostModal';
import { HOOK_HELP_HTML } from '../shared/hookHelpHtml';
import { useAuth } from '../../hooks/useAuth';
import { createOtherCasePost } from '../../services/casePostService';

interface CasesCollectionProps {
  initialShowHookHelp?: boolean;
  onInitialHookHelpHandled?: () => void;
}

export default function CasesCollection({
  initialShowHookHelp = false,
  onInitialHookHelpHandled,
}: CasesCollectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHookHelp, setShowHookHelp] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!initialShowHookHelp) return;
    const timer = setTimeout(() => {
      setShowHookHelp(true);
      onInitialHookHelpHandled?.();
    }, 2000);
    return () => clearTimeout(timer);
  }, [initialShowHookHelp, onInitialHookHelpHandled]);

  const handleSubmitPost = async (data: PostFormData) => {
    try {
      if (!user || user.id === 'guest') {
        alert('投稿するにはログインしてください。');
        return;
      }

      const success = await createOtherCasePost({
        authorId: user.id,
        title: data.eventName,
        eventName: data.eventName,
        hook: data.hook,
        pitch: data.pitch,
        card: data.card,
        memo: data.memo,
        tags: data.tags,
      });

      if (success) {
        setRefreshKey((k) => k + 1);
        alert('投稿を保存しました。');
      } else {
        alert('投稿の保存に失敗しました。もう一度お試しください。');
      }
    } catch (e) {
      console.error(e);
      alert('投稿中にエラーが発生しました。');
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">ノウハウ集</h1>
        <p className="text-gray-600 mt-1">イベントの成功事例をまとめています</p>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowHookHelp(true)}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          口コミの構造
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          投稿（本来は達人にのみ表示されます）
        </button>
      </div>

      <Events refreshKey={refreshKey} />

      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitPost}
      />

      {showHookHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 py-6">
          <div className="relative w-full max-w-3xl">
            <div className="h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
              <iframe
                title="口コミの構造"
                srcDoc={HOOK_HELP_HTML}
                className="w-full h-full border-0"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowHookHelp(false)}
              aria-label="閉じる"
              className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-10 w-9 h-9 rounded-full bg-gray-900 text-white text-xl leading-none flex items-center justify-center shadow-md hover:bg-gray-800"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
