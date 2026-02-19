import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  MessageCircle,
  Search,
  ChevronRight,
  ThumbsUp,
  X,
  Check,
  ExternalLink
} from 'lucide-react';
import { CommunityPost } from '../../types';
import EventPostForm from './EventPostForm';
import { useAuth } from '../../hooks/useAuth';
import { saveUserParticipatingEvents, getUserParticipatingEvents } from '../../services/eventService';

interface Event {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed';
  tags: string[];
  totalPosts: number;
  totalViews: number;
  totalReactions: number;
  stores: string[];
  bestPractices: CommunityPost[];
  successPatterns: string[];
  keyPhrases: string[];
  aiSummary: string;
  essentialKnowledge?: {
    overview: string;
    mainCharacters: string[];
    fanBase: string[];
    precautions: string[];
    servicePoints: string[];
    officialSiteUrl?: string;
  };
}

type ViewMode = 'list' | 'detail';
type ViewModeWithCreate = 'list' | 'detail' | 'create';
const animeEvents: Event[] = [
  {
    id: 'deco27',
    name: 'DECO*27フェア（実証実験で使用）',
    description: 'ボカロP「DECO*27」とのコラボ企画。限定グッズ販売と抽選企画を実施。',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-28'),
    status: 'active',
    tags: ['#DECO27', '#ボカロ', '#限定グッズ', '#抽選企画'],
    totalPosts: 10,
    totalViews: 420,
    totalReactions: 95,
    stores: ['渋谷店', '池袋店'],
    bestPractices: [],
    successPatterns: ['楽曲やMVの話題から自然に会話を開始', '限定性を伝えて来店動機を強化'],
    keyPhrases: ['「新曲、聴きました？」', '「会場限定グッズがあります」'],
    aiSummary: 'ファンの熱量が高いので、作品理解と限定感の演出が効果的でした。',
    essentialKnowledge: {
      overview: 'DECO*27はボーカロイド楽曲で人気のプロデューサー。',
      mainCharacters: ['代表曲の世界観', 'ファンコミュニティ'],
      fanBase: ['10代〜30代中心', 'SNS拡散力が高い'],
      precautions: ['作品理解を示す', '限定情報は正確に伝える'],
      servicePoints: ['楽曲への共感', '限定企画の案内'],
      officialSiteUrl: 'https://www.deco27.com/'
    }
  },
  {
    id: 'jujutsu',
    name: '呪術廻戦フェア（ダミー）',
    description: '人気アニメ「呪術廻戦」とのコラボイベント。限定グッズ販売とカード口コミ強化キャンペーン。',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-15'),
    status: 'active',
    tags: ['#呪術廻戦', '#アニメコラボ', '#限定グッズ', '#カード口コミ'],
    totalPosts: 12,
    totalViews: 456,
    totalReactions: 89,
    stores: ['渋谷店', '新宿店', '池袋店', '有楽町店'],
    bestPractices: [],
    successPatterns: ['キャラクター愛に共感した声かけ', '限定特典を使った提案'],
    keyPhrases: ['「このキャラクター人気ですよね」', '「イベント期間限定の特典です」'],
    aiSummary: '共感と限定感を組み合わせた提案が効果的でした。',
    essentialKnowledge: {
      overview: '「呪術廻戦」は呪霊と呪術師の戦いを描く人気作品。',
      mainCharacters: ['虎杖悠仁', '五条悟', '伏黒恵'],
      fanBase: ['10代〜20代中心', '女性ファンも多い'],
      precautions: ['作品理解を示す', 'キャラ名の誤りに注意'],
      servicePoints: ['共感から会話開始', '限定特典の訴求'],
      officialSiteUrl: 'https://jujutsukaisen.jp/'
    }
  },
  {
    id: 'kimetsu',
    name: '鬼滅の刃 竈門炭治郎立志編（ダミー）',
    description: '「鬼滅の刃」コラボイベント。限定グッズとコラボカフェが登場。',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-03-01'),
    status: 'active',
    tags: ['#鬼滅の刃', '#アニメコラボ', '#限定グッズ', '#コラボカフェ'],
    totalPosts: 15,
    totalViews: 521,
    totalReactions: 102,
    stores: ['新宿店', '池袋店', '横浜店'],
    bestPractices: [],
    successPatterns: ['家族連れへの配慮', '限定グッズの希少性訴求'],
    keyPhrases: ['「期間限定グッズです」', '「ご家族でも楽しめます」'],
    aiSummary: 'ファミリー層にも刺さる案内が有効でした。',
    essentialKnowledge: {
      overview: '大正時代を舞台にした人気アニメ。',
      mainCharacters: ['竈門炭治郎', '竈門禰豆子', '我妻善逸'],
      fanBase: ['幅広い年齢層', 'ファミリー層が多い'],
      precautions: ['家族連れへの配慮', '作品理解を示す'],
      servicePoints: ['限定性の訴求', '丁寧な案内'],
      officialSiteUrl: 'https://kimetsu.com/anime'
    }
  },
  {
    id: 'spyfamily',
    name: 'SPY×FAMILY アーニャと一緒に（ダミー）',
    description: '体験型イベント。フォトスポットと限定グッズが登場。',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-04-01'),
    status: 'active',
    tags: ['#SPYFAMILY', '#体験型', '#フォトスポット', '#限定グッズ'],
    totalPosts: 8,
    totalViews: 389,
    totalReactions: 67,
    stores: ['渋谷店', '池袋店'],
    bestPractices: [],
    successPatterns: ['写真映えの案内', 'SNS投稿の促進'],
    keyPhrases: ['「写真映えスポットあります」', '「SNS投稿で特典」'],
    aiSummary: '体験型の魅力を伝える案内が効果的でした。',
    essentialKnowledge: {
      overview: 'スパイ一家のコメディ作品。',
      mainCharacters: ['ロイド', 'アーニャ', 'ヨル'],
      fanBase: ['若年層中心', 'SNS利用が多い'],
      precautions: ['撮影ルールの案内', '家族連れへの配慮'],
      servicePoints: ['体験の魅力訴求', 'SNS連動'],
      officialSiteUrl: 'https://spy-family.net/'
    }
  },
  {
    id: 'onepiece',
    name: 'ONE PIECE FILM RED（ダミー）',
    description: '映画公開記念イベント。限定グッズと特別展示。',
    startDate: new Date('2024-02-10'),
    endDate: new Date('2024-03-10'),
    status: 'active',
    tags: ['#ONEPIECE', '#映画', '#限定グッズ'],
    totalPosts: 18,
    totalViews: 723,
    totalReactions: 128,
    stores: ['渋谷店', '新宿店', '池袋店', '横浜店'],
    bestPractices: [],
    successPatterns: ['映画話題の共有', '限定グッズの案内'],
    keyPhrases: ['「映画ご覧になりました？」', '「今だけの展示です」'],
    aiSummary: '話題性を活かした声かけが効果的でした。',
    essentialKnowledge: {
      overview: '海賊王を目指す冒険作品。',
      mainCharacters: ['ルフィ', 'ゾロ', 'ナミ'],
      fanBase: ['全年齢層に人気', 'ファミリー層も多い'],
      precautions: ['作品理解を示す', '家族連れへの配慮'],
      servicePoints: ['話題性の共有', '限定感の訴求'],
      officialSiteUrl: 'https://one-piece.com/'
    }
  },
  {
    id: 'oshi',
    name: '【推しの子】POPUP STORE（ダミー）',
    description: 'ポップアップストア。限定グッズとフォトスポット。',
    startDate: new Date('2024-03-05'),
    endDate: new Date('2024-04-05'),
    status: 'active',
    tags: ['#推しの子', '#ポップアップ', '#限定グッズ'],
    totalPosts: 9,
    totalViews: 445,
    totalReactions: 76,
    stores: ['渋谷店', '新宿店'],
    bestPractices: [],
    successPatterns: ['アイドル要素への共感', 'SNS映えの案内'],
    keyPhrases: ['「推し活グッズあります」', '「写真スポットもあります」'],
    aiSummary: '推し活目線の案内が好評でした。',
    essentialKnowledge: {
      overview: '芸能界を舞台にした話題作。',
      mainCharacters: ['星野アイ', 'アクア', 'ルビー'],
      fanBase: ['若年層中心', 'SNS利用が多い'],
      precautions: ['作品理解を示す', '撮影ルールの案内'],
      servicePoints: ['推し活の共感', '限定感の訴求'],
      officialSiteUrl: 'https://ichigoproduction.com/'
    }
  },
  {
    id: 'tokyo-revengers',
    name: '東京リベンジャーズ 聖夜決戦編（ダミー）',
    description: '限定グッズと特別展示のイベント。',
    startDate: new Date('2024-02-20'),
    endDate: new Date('2024-03-20'),
    status: 'completed',
    tags: ['#東京リベンジャーズ', '#限定グッズ'],
    totalPosts: 7,
    totalViews: 334,
    totalReactions: 58,
    stores: ['池袋店', '新宿店'],
    bestPractices: [],
    successPatterns: ['若年層への共感', '限定感の強調'],
    keyPhrases: ['「今だけの展示です」', '「限定グッズあります」'],
    aiSummary: '限定感を軸にした提案が効果的でした。',
    essentialKnowledge: {
      overview: 'タイムリープを描く人気作。',
      mainCharacters: ['花垣武道', '佐野万次郎', '龍宮寺堅'],
      fanBase: ['若年層中心', '男性ファンが多い'],
      precautions: ['作品理解を示す', '過度な煽りは避ける'],
      servicePoints: ['共感の声かけ', '限定性の訴求'],
      officialSiteUrl: 'https://tokyo-revengers-anime.com/'
    }
  },
  {
    id: 'chainsaw',
    name: 'チェンソーマン POPUP STORE（ダミー）',
    description: '限定グッズと特別展示のポップアップ。',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-04-15'),
    status: 'active',
    tags: ['#チェンソーマン', '#ポップアップ', '#限定グッズ'],
    totalPosts: 6,
    totalViews: 289,
    totalReactions: 45,
    stores: ['渋谷店', '池袋店'],
    bestPractices: [],
    successPatterns: ['作品の魅力共有', '限定感の強調'],
    keyPhrases: ['「今だけの展示です」', '「限定グッズ人気です」'],
    aiSummary: '作品の魅力共有が効果的でした。',
    essentialKnowledge: {
      overview: '悪魔と戦う少年のダークファンタジー。',
      mainCharacters: ['デンジ', 'パワー', 'マキマ'],
      fanBase: ['若年層中心', '男性ファンが多い'],
      precautions: ['表現の配慮', '作品理解を示す'],
      servicePoints: ['共感の声かけ', '限定感の訴求'],
      officialSiteUrl: 'https://chainsawman.dog/'
    }
  },
  {
    id: 'bocchi',
    name: 'ぼっち・ざ・ろっく！（ダミー）',
    description: 'ライブ映像上映と限定グッズのイベント。',
    startDate: new Date('2024-04-15'),
    endDate: new Date('2024-05-15'),
    status: 'upcoming',
    tags: ['#ぼっちざろっく', '#音楽', '#ライブ'],
    totalPosts: 5,
    totalViews: 201,
    totalReactions: 29,
    stores: ['渋谷店', '新宿店'],
    bestPractices: [],
    successPatterns: ['音楽好きへの共感', 'ライブ体験の案内'],
    keyPhrases: ['「ライブ映像あります」', '「限定グッズもあります」'],
    aiSummary: '音楽体験の魅力を伝える案内が効果的です。',
    essentialKnowledge: {
      overview: '音楽をテーマにした青春アニメ。',
      mainCharacters: ['後藤ひとり', '伊地知虹夏', '山田リョウ'],
      fanBase: ['若年層中心', '音楽ファンが多い'],
      precautions: ['作品理解を示す', '落ち着いた案内'],
      servicePoints: ['共感の声かけ', '体験の案内'],
      officialSiteUrl: 'https://bocchi.rocks/'
    }
  },
  {
    id: 'blue-lock',
    name: 'ブルーロック エゴイスト覚醒（ダミー）',
    description: '体験コーナーと限定グッズのイベント。',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-05-01'),
    status: 'upcoming',
    tags: ['#ブルーロック', '#サッカー', '#体験型'],
    totalPosts: 4,
    totalViews: 178,
    totalReactions: 23,
    stores: ['新宿店', '渋谷店'],
    bestPractices: [],
    successPatterns: ['スポーツファンへの共感', '体験型の案内'],
    keyPhrases: ['「体験コーナーあります」', '「限定グッズあります」'],
    aiSummary: '体験型の魅力訴求が効果的です。',
    essentialKnowledge: {
      overview: 'サッカーをテーマにした人気作。',
      mainCharacters: ['潔世一', '蜂楽廻', '千切豹馬'],
      fanBase: ['若年層中心', 'スポーツファンが多い'],
      precautions: ['スポーツ理解を示す', '体験ルールの案内'],
      servicePoints: ['共感の声かけ', '体験の案内'],
      officialSiteUrl: 'https://bluelock-pr.com/'
    }
  }
];

type FilterStatus = 'all' | 'active' | 'completed' | 'upcoming' | 'my-events';

const HOOK_HELP_HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>口コミの構造</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background: #f6f7fb; color: #1f2937; font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Noto Sans JP", sans-serif; }
    .card { background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; box-shadow: 0 6px 18px rgba(15,23,42,0.06); }
    .pill { background: #eef2ff; color: #4338ca; border: 1px solid #e0e7ff; }
  </style>
</head>
<body class="p-4">
  <div class="max-w-md mx-auto space-y-4">
    <div class="card p-4">
      <p class="text-[11px] font-bold text-gray-400 tracking-widest">説明ページ</p>
      <h1 class="text-2xl font-extrabold mt-1">口コミの構造</h1>
      <p class="text-sm text-gray-500 mt-1">話す順番を整えると伝わりやすくなります</p>
      <div class="mt-3 p-3 rounded-xl pill text-sm font-semibold">フック → 引き込み → カード説明</div>
    </div>

    <div class="card p-4">
      <div class="text-sm font-bold mb-2">カードご案内の流れ</div>
      <div class="space-y-3 text-sm">
        <div><span class="font-semibold">1. フック</span>：話を聞く理由を作る</div>
        <div><span class="font-semibold">2. 引き込み</span>：魅力やメリットを伝える</div>
        <div><span class="font-semibold">3. カード説明</span>：安心材料で背中を押す</div>
      </div>
    </div>

    <div class="card p-4">
      <div class="text-sm font-bold mb-2">例（イベント案内）</div>
      <div class="text-sm text-gray-700 space-y-2">
        <div>フック：｢このイベント、今日だけの特典があるんですが…｣</div>
        <div>引き込み：｢入会いただくとその場で割引になります｣</div>
        <div>カード説明：｢入会金・年会費は無料です｣</div>
      </div>
    </div>

    <div class="card p-4">
      <div class="text-sm font-bold mb-2">ポイント</div>
      <ul class="text-sm text-gray-700 list-disc pl-5 space-y-1">
        <li>順番を守ると会話がスムーズ</li>
        <li>相手の反応を見て無理に進めない</li>
        <li>最後は安心材料で締める</li>
      </ul>
    </div>
  </div>
</body>
</html>`;

export default function Events() {
  const { user, updateUser } = useAuth();
  const [viewMode, setViewMode] = useState<ViewModeWithCreate>('list');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [showEventSelectionModal, setShowEventSelectionModal] = useState(false);
  const [selectedParticipatingEvents, setSelectedParticipatingEvents] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'knowledge' | 'patterns' | 'phrases'>('knowledge');
  const [showHookHelp, setShowHookHelp] = useState(false);
  const [showAllEventsModal, setShowAllEventsModal] = useState(false);
  const [allEventsFilterArea, setAllEventsFilterArea] = useState<string>('all');
  const [allEventsFilterYear, setAllEventsFilterYear] = useState<string>('all');
  const eventsSource = animeEvents;

  // ユーザーの参加イベントを取得
  useEffect(() => {
    const loadParticipatingEvents = async () => {
      if (user?.id) {
        const events = await getUserParticipatingEvents(user.id);
        setSelectedParticipatingEvents(events);
      }
    };
    loadParticipatingEvents();
  }, [user?.id]);

  const filteredEvents = eventsSource.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterStatus === 'all' ||
                         event.status === filterStatus ||
                         (filterStatus === 'my-events' && selectedParticipatingEvents.includes(event.id));
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-success-green';
      case 'completed': return 'bg-gray-100 text-gray-600';
      case 'upcoming': return 'bg-blue-100 text-sky-blue';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
      switch (status) {
        case 'active': return '開催中';
        case 'completed': return '終了';
        case 'upcoming': return '開催予定';
        default: return '未設定';
      }
    };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedEvent(null);
    setViewMode('list');
  };

  const handleCreatePost = (postData: any) => {
  };

  const handleToggleEventParticipation = (eventId: string) => {
    setSelectedParticipatingEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSaveParticipatingEvents = async () => {
    if (!user?.id) {
      console.error('ユーザーIDが取得できません');
      return;
    }

    setIsLoading(true);
    try {
      const success = await saveUserParticipatingEvents(user.id, selectedParticipatingEvents);

      if (success) {
        const updatedEvents = await getUserParticipatingEvents(user.id);
        setSelectedParticipatingEvents(updatedEvents);
        setShowEventSelectionModal(false);
        alert('参加イベントを保存しました');
      } else {
        console.error('参加イベントの保存に失敗しました');
        alert('保存に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      console.error('参加イベントの保存でエラーが発生しました:', error);
      alert('保存中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const activeEvents = eventsSource.filter(e => {
    const year2024Match = e.startDate.getFullYear() === 2024 || e.endDate.getFullYear() === 2024;
    if (selectedArea === 'all') return year2024Match;

    const regionalKeywords: { [key: string]: string[] } = {
      '北海道': ['札幌', '函館'],
      '東北': ['仙台', '盛岡', '青森', '秋田', '山形', '福島'],
      '関東': ['東京', '新宿', '渋谷', '池袋', '横浜', '大宮', '柏', '千葉', '川崎', '吉祥寺', '有楽町'],
      '中部': ['名古屋', '静岡', '新潟', '金沢', '長野', '岐阜', '富山'],
      '関西': ['大阪', '梅田', '京都', '神戸', '奈良', '滋賀'],
      '中国': ['広島', '岡山', '山口', '鳥取', '島根'],
      '四国': ['高松', '松山', '徳島', '高知'],
      '九州': ['福岡', '博多', '熊本', '鹿児島', '長崎', '大分', '宮崎', '佐賀']
    };

    const keywords = regionalKeywords[selectedArea] || [];
    const matchesArea = e.stores.some(store =>
      keywords.some(keyword => store.includes(keyword))
    ) || e.stores.includes('全国');

    return year2024Match && matchesArea;
  });

  if (viewMode === 'create') {
    return (
      <EventPostForm 
        onSubmit={handleCreatePost}
        onCancel={handleBackToList}
        events={eventsSource.map(e => ({ id: e.id, name: e.name, status: e.status }))}
      />
    );
  }

  if (viewMode === 'detail' && selectedEvent) {
    const decoPost = {
      id: 0,
      staffName: '櫻井さん',
      eventName: 'DECO*27',
      storeName: '有楽町',
      tags: ['男女比6:4', '高校生〜20代中心', '40代・親子連れもいる'],
      hookWords: [
        '今日3000円超えている方が多いので、抽選会に参加できますがエポスカードお持ちですか？',
        'エポスカードをお持ち前提で話す'
      ],
      pitchWords: [
        '高校卒業・18歳以上を確認する',
        'スマホ入会で3000円割引',
        '抽選会B賞ブロマイド8枚コンプセット'
      ],
      cardWords: [
        'マルイは年間300タイトル以上イベント開催',
        '次回以降も特典メリットあり',
        '所要約20分'
      ],
      hookContent: `【フック】\n・3000円以上買う方が多いので\n「DECO*27のイベントは今回で2回目なんですが、今日お会計3000円超えるので会場限定の非売品が当たる抽選会がこの後出来る権利があるんですが、エポスカード今日持って来ましたか？」と、持っている程でお話します。\n過去にもイベント開催してる事や抽選会・会場限定・非売品などの言葉を使うとお客様も話を聞いてくれる可能性が高くなります。`,
      pitchContent: `【引き込み】\nはじめの聞き方でお客様が持っていないと分かったら18歳以上高校卒業されている事を確認してから\n「今回このイベントに合わせてキャンペーンをやっていて、スマホから無料で入会して頂くと入場料分をこちらのお会計から3000円割引きさせて頂くのと、抽選会のB賞のブロマイド8枚コンプリートセットを会場で作って頂いた方に抽選会前にプレゼントしてるので作ってからお会計しませんか？」とさらに関心を高めます。`,
      cardContent: `【カード説明】\n「VISAの付いたマルイグループが発行しているクレジットカードで入会金・年会費や更新費など一切かからないので安心してお申し込み出来ます」「アーティストやアニメのイベントをマルイは年間で300タイトル以上やっているのでカード持っているとまた次回のイベントの時にご提示して現金払いでも抽選出来たり特典多くもらったり出来るので今日作ったカード払いでこの場で3000円引きで○○○円でお得にお買い物していきませんか？」\n※ここで作りますとなったらお時間20分くらい大丈夫ですか？や免許やマイナンバーなどお名前入ってる物お持ちですか？や今日カードが作れたらそのカードでお支払いして下さいね。など確認してご案内します。\n※ここまでお話しして断ったり、お時間ない方には無理おすすめせず「じゃ、またの機会にお願いしますね」とさっさと精算します。`,
      memoContent: `【補足メモ】\n▪️客層\n男女比6:4  高校生〜20代中心で\n40代や親子連れもいる。\nエポスのデザイン券面で「ピノキオピー」という同じボーカロイドのプロデューサーの券面が親和性があり、カードのおすすめの際に見せるとその券面でお申し込みする方が多い。前回もその券面が人気でした。`,
      likes: 100,
      helpful: 0
    };

    const detailPosts: Array<typeof decoPost> = [];

    const sortedPosts = [decoPost, ...detailPosts].sort((a, b) => (b.likes || 0) - (a.likes || 0));

    return (
      <div className="space-y-6 pb-10">
        <div>
          <button
            onClick={handleBackToList}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            一覧に戻る
          </button>
        </div>

        <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 tracking-widest">Current Event</span>
          <div className="flex justify-between items-end gap-3">
            <h2 className="text-2xl font-extrabold tracking-tight">{selectedEvent.name}</h2>
            <div className="text-right">
              <p className="text-[12px] font-bold text-blue-600">閲覧ページ</p>
              <p className="text-[10px] text-gray-400">単語チップでトークをマスターする</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3">
          {selectedEvent.essentialKnowledge?.officialSiteUrl ? (
            <a
              href={selectedEvent.essentialKnowledge.officialSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Event Info</span>
                <p className="text-sm font-bold text-gray-900">今回のイベント詳細</p>
                <span className="mt-2 inline-flex items-center gap-2 text-[11px] font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                  公式ページへ <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </a>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Event Info</span>
                <p className="text-sm font-bold text-gray-900">今回のイベント詳細</p>
                <p className="text-[11px] text-gray-500 mt-1">公式情報は準備中です</p>
              </div>
            </div>
          )}

          <a
            href="https://www.eposcard.co.jp/gecard/ec00013/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
              <ExternalLink className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Related Card</span>
              <p className="text-sm font-bold text-gray-900">関連カード</p>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{selectedEvent.aiSummary}</p>
              <span className="mt-2 inline-flex items-center gap-2 text-[11px] font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                カード詳細 <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </a>
        </section>

        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl font-bold tracking-tight">達人の投稿</h3>
          <button
            onClick={() => setShowHookHelp(true)}
            className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100"
          >
            口コミの構造
          </button>
        </div>

        <div className="space-y-6">
          {sortedPosts.map((post, idx) => {
            const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '📄';
            return (
              <div key={post.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="flex justify-between items-start mb-5 gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {post.eventName}
                    </span>
                    <h4 className="text-lg font-bold mt-1 truncate">
                      {medal} {post.staffName}{' '}
                      <span className="text-xs text-gray-400 font-normal">@{post.storeName}</span>
                    </h4>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700">
                    <ThumbsUp className="w-4 h-4" />
                    役に立った({post.helpful})
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">🪝 フック</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {post.hookWords.map((w, i) => (
                        <span key={`${post.id}-hook-${i}`} className="px-2 py-1 text-[11px] font-semibold rounded-md bg-orange-50 text-orange-600 border border-orange-100">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">📢 引き込み</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {post.pitchWords.map((w, i) => (
                        <span key={`${post.id}-pitch-${i}`} className="px-2 py-1 text-[11px] font-semibold rounded-md bg-green-50 text-green-700 border border-green-100">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">🧾 カード説明</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {post.cardWords.map((w, i) => (
                        <span key={`${post.id}-card-${i}`} className="px-2 py-1 text-[11px] font-semibold rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">🏷 属性</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {post.tags.map((t, i) => (
                        <span key={`${post.id}-tag-${i}`} className="px-2 py-1 text-[11px] font-semibold rounded-md bg-gray-50 text-gray-600 border border-gray-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <details className="mt-6 pt-4 border-t border-gray-100">
                  <summary className="flex justify-center items-center text-xs font-bold text-gray-600 cursor-pointer">
                    全文を見る <ChevronRight className="w-3 h-3 ml-1" />
                  </summary>
                  <div className="mt-4 space-y-4">
                    <div className="bg-orange-50/50 p-4 rounded-xl text-sm leading-relaxed border border-orange-100/60">
                      <p className="font-bold text-orange-500 text-[10px] uppercase mb-2">フック全文</p>
                      <div className="whitespace-pre-wrap text-gray-700">{post.hookContent}</div>
                    </div>
                    <div className="bg-green-50/50 p-4 rounded-xl text-sm leading-relaxed border border-green-100/60">
                      <p className="font-bold text-green-600 text-[10px] uppercase mb-2">引き込み全文</p>
                      <div className="whitespace-pre-wrap text-gray-700">{post.pitchContent}</div>
                    </div>
                    <div className="bg-blue-50/50 p-4 rounded-xl text-sm leading-relaxed border border-blue-100/60">
                      <p className="font-bold text-blue-600 text-[10px] uppercase mb-2">説明全文</p>
                      <div className="whitespace-pre-wrap text-gray-700">{post.cardContent}</div>
                    </div>
                    <div className="bg-gray-100/50 p-4 rounded-xl text-sm leading-relaxed border border-gray-200/60">
                      <p className="font-bold text-gray-500 text-[10px] uppercase mb-2">補足メモ</p>
                      <div className="whitespace-pre-wrap text-gray-700">{post.memoContent}</div>
                    </div>
                  </div>
                </details>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a
            href="https://docs.google.com/forms/d/1ZVv_aefg2sSfXiKEzNXprRJEb0C0tQiUAH50M_l-RAs/edit?usp=forms_home&ouid=117951192700997366273&ths=true"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white rounded-xl py-4 font-semibold shadow-lg shadow-blue-200 text-center"
          >
            投稿
          </a>
          <a
            href="https://docs.google.com/forms/d/1P8QJ34C5Mt6PQq82GSrHhbm3K8mQK-gSNp33HA9at9k/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-200 rounded-xl py-4 font-bold text-gray-700 text-center"
          >
            アンケート
          </a>
        </div>

        <div className="mt-3 px-1 space-y-1">
          <p className="text-[11px] text-gray-500">※運営中にお気づきの点があれば、「投稿」からぜひ共有してください（いつでもOK）</p>
          <p className="text-[11px] text-gray-500">※ご利用後に「アンケート」へのご回答にご協力をお願いいたします</p>
        </div>

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

  return (
    <div className="space-y-6">

      {/* 邨ｱ險域ュ蝣ｱ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setShowEventSelectionModal(true)}
          className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-purple-600 hover:shadow-md transition-all"
        >
          <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-900">
            {selectedParticipatingEvents.length}
          </div>
          <div className="text-sm text-gray-600">参加イベント数</div>
          <div className="text-xs text-purple-600 mt-1">クリックして確認</div>
        </button>
        <button
          onClick={() => setShowAllEventsModal(true)}
          className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-sky-blue hover:shadow-md transition-all"
        >
          <Calendar className="w-8 h-8 text-sky-blue mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-900">{eventsSource.length}</div>
          <div className="text-sm text-gray-600">総イベント数</div>
          <div className="text-xs text-sky-blue mt-1">クリックして過去イベントを確認</div>
        </button>
      </div>

      
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="イベント名やタグで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
          >
            <option value="all">すべて</option>
            <option value="my-events">参加イベント</option>
            <option value="active">開催中</option>
            <option value="upcoming">開催予定</option>
            <option value="completed">終了</option>
          </select>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            onClick={() => handleEventClick(event)}
            className={`bg-white rounded-xl border p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group ${
              selectedParticipatingEvents.includes(event.id)
                ? 'border-purple-200 bg-purple-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {selectedParticipatingEvents.includes(event.id) && (
                    <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                      <Users className="w-3 h-3" />
                      <span>参加イベント</span>
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-sky-blue transition-colors">
                    {event.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                    {getStatusLabel(event.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{event.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-sky-blue transition-colors" />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-sky-blue">{event.totalPosts}</div>
                <div className="text-xs text-gray-600">投稿数</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-success-green">{event.totalReactions}</div>
                <div className="text-xs text-gray-600">リアクション</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-sunshine-yellow">{event.bestPractices.length}</div>
                <div className="text-xs text-gray-600">ベスト事例</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                  {tag}
                </span>
              ))}
              {event.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                  +{event.tags.length - 3}件                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {event.startDate.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })} - 
                  {event.endDate.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{event.stores.length}店舗</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filterStatus === 'my-events' ? '参加イベントがありません' : '該当するイベントが見つかりません'}
            </h3>
            <p className="text-gray-600">
              {filterStatus === 'my-events'
                ? '参加するイベントを選択するとここに表示されます。'
                : '検索条件を変更してお試しください。'
              }
            </p>
        </div>
      )}

      
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-sky-blue mb-2">イベントページの使い方</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h4 className="font-medium mb-1">学びのポイント</h4>
            <ul className="space-y-1">
              <li>・最新イベントの情報を確認</li>
              <li>・ベスト事例を参考にする</li>
              <li>・使えるフレーズを覚える</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-1">イベント投稿</h4>
            <ul className="space-y-1">
              <li>・ベスト事例を確認</li>
              <li>・学びをコメントで共有</li>
              <li>・最新の投稿をチェック</li>
            </ul>
          </div>
        </div>
      </div>

      
      {showEventSelectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">参加イベントを選択</h2>
                  <p className="text-gray-600 mt-1">参加するイベントを選択してください</p>
                </div>
                <button
                  onClick={() => setShowEventSelectionModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">エリア:</span>
                {['all','北海道','東北','関東','中部','関西','中国','四国','九州'].map((area) => (
                  <button
                    key={area}
                    onClick={() => setSelectedArea(area)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedArea === area
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {area === 'all' ? 'すべて' : area}
                  </button>
                ))}
              </div>
            </div>

            
            <div className="p-6 space-y-4">
              {activeEvents.length > 0 ? (
                activeEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleToggleEventParticipation(event.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedParticipatingEvents.includes(event.id)
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-success-green">
                            開催中
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {event.startDate.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })} -
                              {event.endDate.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{event.stores.length}店舗蜿ょ刈</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{event.totalPosts}件の投稿</span>
                          </div>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 ${
                        selectedParticipatingEvents.includes(event.id)
                          ? 'border-purple-600 bg-purple-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedParticipatingEvents.includes(event.id) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">該当するイベントがありません</p>
                </div>
              )}
            </div>

            
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {selectedParticipatingEvents.length}件のイベントを選択中
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowEventSelectionModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSaveParticipatingEvents}
                  disabled={isLoading}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? '保存中...' : '保存する'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {showAllEventsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">全イベント一覧</h2>
                  <p className="text-gray-600 mt-1">すべてのイベントを確認できます</p>
                </div>
                <button
                  onClick={() => setShowAllEventsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">エリア</label>
                  <select
                    value={allEventsFilterArea}
                    onChange={(e) => setAllEventsFilterArea(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                  >
                    <option value="all">すべてのエリア</option>
                    <option value="北海道">北海道</option>
                    <option value="東北">東北</option>
                    <option value="関東">関東</option>
                    <option value="中部">中部</option>
                    <option value="関西">関西</option>
                    <option value="中国">中国</option>
                    <option value="四国">四国</option>
                    <option value="九州">九州</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">年度</label>
                  <select
                    value={allEventsFilterYear}
                    onChange={(e) => setAllEventsFilterYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                  >
                    <option value="all">すべての年度</option>
                    <option value="2024">2024年</option>
                    <option value="2023">2023年</option>
                    <option value="2022">2022年</option>
                    <option value="2021">2021年</option>
                  </select>
                </div>
              </div>
            </div>

            
            <div className="p-6 space-y-4">
              {eventsSource
                .filter(event => {
                  const getAreaFromStore = (storeName: string): string => {
                    const keywordToArea: { [key: string]: string } = {
                      札幌: '北海道',
                      函館: '北海道',
                      仙台: '東北',
                      盛岡: '東北',
                      青森: '東北',
                      秋田: '東北',
                      山形: '東北',
                      福島: '東北',
                      東京: '関東',
                      新宿: '関東',
                      渋谷: '関東',
                      池袋: '関東',
                      横浜: '関東',
                      大宮: '関東',
                      柏: '関東',
                      千葉: '関東',
                      川崎: '関東',
                      吉祥寺: '関東',
                      有楽町: '関東',
                      名古屋: '中部',
                      静岡: '中部',
                      新潟: '中部',
                      金沢: '中部',
                      長野: '中部',
                      岐阜: '中部',
                      富山: '中部',
                      大阪: '関西',
                      梅田: '関西',
                      京都: '関西',
                      神戸: '関西',
                      奈良: '関西',
                      滋賀: '関西',
                      広島: '中国',
                      岡山: '中国',
                      山口: '中国',
                      鳥取: '中国',
                      島根: '中国',
                      高松: '四国',
                      松山: '四国',
                      徳島: '四国',
                      高知: '四国',
                      福岡: '九州',
                      博多: '九州',
                      熊本: '九州',
                      鹿児島: '九州',
                      長崎: '九州',
                      大分: '九州',
                      宮崎: '九州',
                      佐賀: '九州'
                    };

                    const key = Object.keys(keywordToArea).find(k => storeName.includes(k));
                    return key ? keywordToArea[key] : 'その他';
                  };

                  const areaMatch = allEventsFilterArea === 'all' ||
                    event.stores.some(store => {
                      const storeArea = getAreaFromStore(store);
                      return storeArea === allEventsFilterArea;
                    }) ||
                    (allEventsFilterArea === '蜈ｨ蝗ｽ' && event.stores.includes('全国'));

                  const yearMatch = allEventsFilterYear === 'all' ||
                    event.startDate.getFullYear().toString() === allEventsFilterYear;

                  return areaMatch && yearMatch;
                })
                .map((event) => (
                  <div
                    key={event.id}
                    onClick={() => {
                      setShowAllEventsModal(false);
                      handleEventClick(event);
                    }}
                    className="p-4 rounded-xl border-2 border-gray-200 hover:border-sky-blue hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                            {getStatusLabel(event.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {event.startDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })} -
                              {event.endDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{event.stores.length}店舗蜿ょ刈</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{event.totalPosts}件の投稿</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-3" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
























