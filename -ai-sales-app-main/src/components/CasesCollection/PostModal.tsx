import React, { useState } from 'react';
import { X, Tag, Calendar, Users } from 'lucide-react';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PostFormData) => void;
}

export interface PostFormData {
  title: string;
  category: 'event' | 'other';
  situation: string;
  approach: string;
  result: string;
  notes: string;
  tags: string[];
  eventId?: string;
}

export default function PostModal({ isOpen, onClose, onSubmit }: PostModalProps) {
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    category: 'event',
    situation: '',
    approach: '',
    result: '',
    notes: '',
    tags: [],
    eventId: ''
  });

  const [currentTag, setCurrentTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    // フォームをリセット
    setFormData({
      title: '',
      category: 'event',
      situation: '',
      approach: '',
      result: '',
      notes: '',
      tags: [],
      eventId: ''
    });
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()]
      });
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">事例を投稿</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* カテゴリー選択 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カテゴリー
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, category: 'event' })}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  formData.category === 'event'
                    ? 'border-vivid-red bg-red-50 text-vivid-red'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Calendar className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">好きイベ事例</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, category: 'other' })}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  formData.category === 'other'
                    ? 'border-vivid-red bg-red-50 text-vivid-red'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Users className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">その他事例</span>
              </button>
            </div>
          </div>

          {/* タイトル */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              タイトル <span className="text-vivid-red">*</span>
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
              placeholder="例：呪術廻戦イベントでの接客成功事例"
            />
          </div>

          {/* イベント選択（イベント事例の場合のみ） */}
          {formData.category === 'event' && (
            <div>
              <label htmlFor="eventId" className="block text-sm font-medium text-gray-700 mb-2">
                関連イベント
              </label>
              <select
                id="eventId"
                value={formData.eventId}
                onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
              >
                <option value="">選択してください</option>
                <option value="1">呪術廻戦フェア</option>
                <option value="2">MGAフェス2024</option>
                <option value="3">バレンタインフェア</option>
                <option value="4">チェンソーマンコラボ</option>
                <option value="5">スプリングセール2024</option>
              </select>
            </div>
          )}

          {/* 状況 */}
          <div>
            <label htmlFor="situation" className="block text-sm font-medium text-gray-700 mb-2">
              状況
            </label>
            <textarea
              id="situation"
              value={formData.situation}
              onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
              placeholder="どんな状況でしたか？"
            />
          </div>

          {/* アプローチ・工夫 */}
          <div>
            <label htmlFor="approach" className="block text-sm font-medium text-gray-700 mb-2">
              アプローチ・工夫
            </label>
            <textarea
              id="approach"
              value={formData.approach}
              onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
              placeholder="どのように工夫しましたか？"
            />
          </div>

          {/* 結果 */}
          <div>
            <label htmlFor="result" className="block text-sm font-medium text-gray-700 mb-2">
              結果
            </label>
            <textarea
              id="result"
              value={formData.result}
              onChange={(e) => setFormData({ ...formData, result: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
              placeholder="どんな結果になりましたか？"
            />
          </div>

          {/* 補足 */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              補足
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
              placeholder="その他補足事項があれば自由に記入してください"
            />
          </div>

          {/* タグ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タグ
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                placeholder="タグを入力してEnter"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Tag className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-sky-blue text-white rounded-full text-sm"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:bg-blue-600 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* フッター */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-vivid-red text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              投稿する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
