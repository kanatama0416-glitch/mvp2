import React, { useState } from 'react';
import { Plus, Calendar, BookOpen } from 'lucide-react';
import Events from '../Events/Events';
import FavoriteEventTop3 from '../Events/FavoriteEventTop3';
import PostModal, { PostFormData } from './PostModal';

type TabType = 'events';

const HOOK_HELP_HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>フック・引き込みとは？｜カードご案内の流れ</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <style>
    :root {
      --accent-purple: #7c3aed;
      --accent-purple-50: #f5f3ff;
      --accent-purple-100: #ede9fe;
      --accent-purple-200: #ddd6fe;
      --accent-purple-700: #6d28d9;
      --accent-blue: #3b82f6;
      --accent-blue-50: #eff6ff;
      --ink-900: #0f172a;
      --ink-700: #334155;
      --ink-500: #64748b;
      --surface: #f6f7fb;
      --card: #ffffff;
      --border: #e5e7eb;
    }
    body {
      background:
        radial-gradient(900px 520px at 10% -10%, #f1e9ff 0%, rgba(241,233,255,0) 60%),
        radial-gradient(900px 520px at 100% 0%, #eef2ff 0%, rgba(238,242,255,0) 55%),
        var(--surface);
      color: var(--ink-900);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", "Yu Gothic", "Meiryo", sans-serif;
      letter-spacing: 0.005em;
      line-height: 1.7;
    }
    .card-shadow { box-shadow: 0 8px 26px rgba(15, 23, 42, 0.08); }
    .accent-purple { background-color: var(--accent-purple-50); border: 1px solid var(--accent-purple-100); }
    .pill { border: 1px solid var(--accent-purple-200); background: #faf9ff; }
    .section-title { font-weight: 700; letter-spacing: 0.01em; }
    @keyframes popIn { 0% { transform: scale(0.98); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
    .pop { animation: popIn 0.25s ease-out; }
    .back-btn{
      position: fixed;
      left: 16px;
      bottom: 16px;
      z-index: 9999;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.92);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      box-shadow: 0 10px 24px rgba(15,23,42,0.14);
      font-weight: 800;
      font-size: 14px;
      color: var(--ink-900);
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
    .back-btn:active{ transform: translateY(1px); }
  </style>
</head>
<body class="p-4 pb-12">
  <div class="max-w-md mx-auto">
    <div class="sticky top-0 z-30 bg-[#f6f8fb]/90 backdrop-blur-sm pt-2 pb-4">
      <div class="bg-white rounded-2xl card-shadow border border-gray-100 p-6 pop">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-[11px] font-bold text-gray-400 tracking-widest">説明ページ</p>
            <h1 class="text-2xl font-bold text-gray-900 leading-tight section-title">フック・引き込みとは？</h1>
            <p class="text-sm text-gray-500 mt-1">カードをご案内するときの“話す順番”</p>
          </div>
          <div class="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center">
            <i class="fa-solid fa-route text-purple-600"></i>
          </div>
        </div>
        <div class="mt-4 p-4 rounded-2xl accent-purple">
          <p class="text-sm font-semibold text-gray-800">
            <span class="text-purple-600">この順番</span>で話すことが、とっても大事
          </p>
          <p class="text-xs text-gray-600 mt-1">
            「興味を持つ → 気になる → 納得する」の流れを作れます。
          </p>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <div class="bg-white p-6 rounded-2xl card-shadow border border-gray-100 pop">
        <div class="flex items-center gap-2 font-semibold text-gray-900">
          <i class="fa-solid fa-list-ol text-purple-600"></i>
          <h2 class="text-base section-title">カードご案内のながれ</h2>
        </div>

        <div class="mt-4 space-y-3">
          <div class="flex items-start gap-3">
            <div class="shrink-0 w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center shadow">
              <span class="text-sm font-extrabold text-white">1</span>
            </div>
            <div class="flex-1">
              <p class="font-semibold text-gray-800 flex items-center gap-2">
                <span>フック</span>
                <span class="text-[10px] pill text-purple-700 px-2 py-0.5 rounded-full font-semibold">関心を持つきっかけ</span>
              </p>
              <p class="text-sm text-gray-600 mt-1">まずは「話を聞く理由」を作る一言。</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="shrink-0 w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center shadow">
              <span class="text-sm font-extrabold text-white">2</span>
            </div>
            <div class="flex-1">
              <p class="font-semibold text-gray-800 flex items-center gap-2">
                <span>引き込み</span>
                <span class="text-[10px] pill text-purple-700 px-2 py-0.5 rounded-full font-semibold">気になる理由を出す</span>
              </p>
              <p class="text-sm text-gray-600 mt-1">お客様の関心に合わせた魅力を伝える。</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="shrink-0 w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center shadow">
              <span class="text-sm font-extrabold text-white">3</span>
            </div>
            <div class="flex-1">
              <p class="font-semibold text-gray-800 flex items-center gap-2">
                <span>エポスカード説明</span>
                <span class="text-[10px] pill text-purple-700 px-2 py-0.5 rounded-full font-semibold">最後に基本</span>
              </p>
              <p class="text-sm text-gray-600 mt-1">安心できる情報を伝えて、申込につなげる。</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl card-shadow border border-gray-100 overflow-hidden pop">
        <div class="p-6 border-b border-dashed border-gray-200">
          <div class="flex items-center gap-2 font-semibold text-gray-900">
            <i class="fa-solid fa-lightbulb text-purple-600"></i>
            <h2 class="text-base section-title">例えば（MGAの場合）</h2>
          </div>
          <p class="text-xs text-gray-500 mt-1">“フック → 引き込み → 説明”の順に話す例</p>
        </div>

        <div class="p-6 space-y-3">
          <div class="p-4 bg-purple-50 rounded-2xl border border-purple-100">
            <p class="text-[11px] font-semibold text-purple-700 mb-2">🪝 フック</p>
            <p class="text-sm text-gray-800 font-semibold">「MGAのファンクラブ入っています？」</p>
            <p class="text-xs text-gray-600 mt-2">（関心をもつきっかけ）</p>
          </div>

          <div class="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <p class="text-[11px] font-semibold text-indigo-700 mb-2">📢 引き込み</p>
            <p class="text-sm text-gray-800 font-semibold">「MGAのエポスカードがあるんですが、本日入会いただくと、ファンクラブ年会費が500円オフになるんですよ」</p>
            <p class="text-sm text-gray-800 font-semibold mt-2">「さらに今日入会いただくと今のお会計から2000円オフになりますよ」</p>
          </div>

          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <p class="text-[11px] font-semibold text-slate-700 mb-2">🧾 エポスカード説明</p>
            <p class="text-sm text-gray-800 font-semibold">「入会費・年会費ずっと無料です」</p>
            <p class="text-sm text-gray-800 font-semibold mt-2">「よかったら今日お作りしませんか？」</p>
          </div>
        </div>
      </div>

      <div class="accent-purple p-6 rounded-3xl card-shadow pop">
        <div class="flex items-center gap-2 font-semibold text-gray-900 text-sm">
          <i class="fa-solid fa-star text-purple-600"></i>
          <span class="section-title">ポイント</span>
        </div>
        <ul class="mt-3 space-y-2 text-sm text-gray-700">
          <li class="flex gap-2"><span class="text-purple-600 font-semibold">・</span>フック→引き込み→カード説明の順番通りにやってみる</li>
          <li class="flex gap-2"><span class="text-purple-600 font-semibold">・</span>ポイントになる単語を覚えて言いやすい言い方に変えてみる</li>
          <li class="flex gap-2"><span class="text-purple-600 font-semibold">・</span>基本説明は最後（安心で背中を押す）</li>
        </ul>
      </div>
    </div>
  </div>

</body>
</html>`;

export default function CasesCollection() {
  const [activeTab, setActiveTab] = useState<TabType>('events');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHookHelp, setShowHookHelp] = useState(false);

  const handleSubmitPost = async (_data: PostFormData) => {
    try {
      setActiveTab('events');
    } catch (e) {
      console.error(e);
      alert('投稿送信中にエラーが発生しました。');
    }
  };

  const handleOpenHookHelp = () => {
    setShowHookHelp(true);
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">ノウハウ集</h1>
        <p className="text-gray-600 mt-1">イベント事例の好事例をまとめています</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handleOpenHookHelp}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-sky-200 bg-white text-sky-blue font-semibold shadow-sm hover:bg-sky-50 transition-colors"
        >
          <BookOpen className="w-5 h-5" />
          口コミの構造
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-vivid-red text-white font-bold shadow-lg hover:bg-red-600 transition-all"
        >
          <Plus className="w-5 h-5" />
          投稿
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-1 overflow-hidden">
        <div className="flex space-x-2 w-full">
          <button
            onClick={() => setActiveTab('events')}
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-colors bg-vivid-red text-white"
          >
            <div className="flex items-center justify-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>好きイベ事例</span>
            </div>
            <p className="text-xs mt-1 opacity-90">イベント開催の好事例</p>
          </button>
        </div>
      </div>

      <div>
        <FavoriteEventTop3 />
        <Events />
      </div>

      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitPost}
      />

      {showHookHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 py-6">
          <div className="relative w-full max-w-3xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <button
              onClick={() => setShowHookHelp(false)}
              className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-full bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800"
            >
              閉じる
            </button>
            <iframe
              title="口コミの構造"
              srcDoc={HOOK_HELP_HTML}
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
}
