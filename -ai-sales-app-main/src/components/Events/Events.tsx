import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Star,
  Users,
  TrendingUp,
  MessageCircle,
  Search,
  ChevronRight,
  Sparkles,
  Award,
  Eye,
  ThumbsUp,
  X,
  Check,
  ExternalLink
} from 'lucide-react';
import { mockCommunityPosts } from '../../data/mockData';
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

const mockEvents: Event[] = [
  {
    id: '1',
    name: '呪術廻戦フェア',
    description: '人気アニメ「呪術廻戦」とのコラボレーションイベント。限定グッズ販売とカード口コミ強化キャンペーン',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-15'),
    status: 'active',
    tags: ['#呪術廻戦', '#アニメコラボ', '#限定グッズ', '#カード口コミ'],
    totalPosts: 12,
    totalViews: 456,
    totalReactions: 89,
    stores: ['渋谷店', '新宿店', '池袋店', '有楽町店'],
    bestPractices: mockCommunityPosts.slice(0, 2),
    successPatterns: [
      'キャラクター愛を共感ポイントにした自然な声かけ',
      'イベント限定特典を活用したカード提案',
      'ファン心理を理解した丁寧な接客'
    ],
    keyPhrases: [
      '「このキャラクター、人気ですよね！」',
      '「イベント期間中だけの特典があるんです」',
      '「次回のコラボでもお得に使えます」'
    ],
    aiSummary: 'アニメファンの心理を理解し、共感を示すことで自然なカード口コミにつなげる成功パターンが多数報告されています。特に限定感を演出する声かけが効果的です。',
    essentialKnowledge: {
      overview: '「呪術廻戦」は呪霊と呪術師の戦いを描く人気アニメ作品。現代日本を舞台に、高校生の主人公が呪術師として成長していく物語。',
      mainCharacters: [
        '虎杖悠仁：明るく正義感の強い主人公',
        '五条悟：最強の呪術師で人気No.1キャラクター',
        '伏黒恵：クールで冷静な同級生'
      ],
      fanBase: [
        '学生・若年層（10代〜20代）が中心',
        'SNSで拡散力が強い',
        '女性ファンが多数を占める',
        'キャラクターグッズへの購買意欲が高い'
      ],
      precautions: [
        '人気グッズは即完売するため、限定感を強調',
        'ファン心理を尊重し、作品への理解を示す',
        '初手でカード勧誘せず、会話から自然に導入',
        'キャラクター名や設定を間違えないよう注意'
      ],
      servicePoints: [
        'キャラ愛に共感してから会話に入る',
        '限定特典をカード提案のきっかけに',
        '熱量を尊重し、過度に営業的にならない',
        '「次回のコラボでもお得」というメリットを提示'
      ],
      officialSiteUrl: 'https://jujutsukaisen.jp/'
    }
  },
  {
    id: '2',
    name: 'MGAフェス2024',
    description: 'マルイグループ年次イベント。全店舗参加の大型キャンペーン',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-29'),
    status: 'completed',
    tags: ['#MGAフェス', '#全店舗', '#年次イベント', '#キャンペーン'],
    totalPosts: 28,
    totalViews: 1234,
    totalReactions: 267,
    stores: ['全店舗'],
    bestPractices: mockCommunityPosts.slice(1, 3),
    successPatterns: [
      'イベント特典を活用した積極的な声かけ',
      'お客様の購買意欲が高い時期を狙った提案',
      'チーム一丸となった接客体制'
    ],
    keyPhrases: [
      '「フェス期間中の特別特典です」',
      '「今だけのお得なキャンペーンがあります」',
      '「年に一度の大チャンスです」'
    ],
    aiSummary: '全店舗参加の大型イベントでは、統一された声かけパターンと特典活用が成功の鍵となっています。お客様の購買意欲が高まる時期を活用した積極的なアプローチが効果的です。'
  },
  {
    id: '3',
    name: 'バレンタインフェア',
    description: 'バレンタインシーズンの特別企画。ギフト需要を狙ったカード口コミ強化',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-14'),
    status: 'active',
    tags: ['#バレンタイン', '#ギフト', '#季節イベント', '#カップル'],
    totalPosts: 8,
    totalViews: 234,
    totalReactions: 45,
    stores: ['渋谷店', '新宿店', '池袋店'],
    bestPractices: [],
    successPatterns: [
      'ギフト需要を意識したペア提案',
      '特別感を演出するカード特典の紹介',
      'カップルや家族連れへの温かい接客'
    ],
    keyPhrases: [
      '「プレゼントにぴったりの特典があります」',
      '「カードがあれば次回もお得にご利用いただけます」',
      '「バレンタイン限定のポイント還元キャンペーン中です」'
    ],
    aiSummary: 'ギフト需要が高まるバレンタインシーズンは、カップルやファミリー層へのアプローチが効果的です。特別感を演出する声かけとペア提案が成功のポイントです。'
  },
  {
    id: '4',
    name: 'チェンソーマンコラボ',
    description: '大人気アニメ「チェンソーマン」とのコラボイベント。限定グッズと特典満載',
    startDate: new Date('2024-01-20'),
    endDate: new Date('2024-03-31'),
    status: 'active',
    tags: ['#チェンソーマン', '#アニメコラボ', '#限定グッズ', '#若年層'],
    totalPosts: 15,
    totalViews: 567,
    totalReactions: 102,
    stores: ['アニメイト渋谷店', 'アニメイト新宿店', 'アニメイト池袋店'],
    bestPractices: mockCommunityPosts.slice(0, 1),
    successPatterns: [
      'ファン心理を理解した共感的アプローチ',
      'コラボ限定特典を活用した提案',
      '作品への愛を尊重した丁寧な接客'
    ],
    keyPhrases: [
      '「チェンソーマンファンですか？限定特典があるんです」',
      '「次のコラボイベントでもお得に使えますよ」',
      '「カード会員様だけの先行販売もあります」'
    ],
    aiSummary: 'アニメファンへのアプローチでは、作品への理解と共感が鍵となります。限定感と特別感を演出することで自然なカード提案につながっています。'
  },
  {
    id: '5',
    name: 'スプリングセール2024',
    description: '春の大型セールイベント。新生活応援キャンペーン',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-31'),
    status: 'active',
    tags: ['#スプリングセール', '#新生活', '#大型セール', '#全店舗'],
    totalPosts: 22,
    totalViews: 892,
    totalReactions: 156,
    stores: ['全店舗'],
    bestPractices: mockCommunityPosts.slice(1, 3),
    successPatterns: [
      '新生活需要を捉えた積極的な提案',
      'セール特典とカード特典の組み合わせ訴求',
      '購買意欲の高いお客様への効果的なアプローチ'
    ],
    keyPhrases: [
      '「新生活の準備にカードがあると便利ですよ」',
      '「セール価格からさらにポイント還元があります」',
      '「今後のお買い物でずっとお得になります」'
    ],
    aiSummary: '新生活シーズンは購買意欲が高まる時期です。セール特典とカード特典を組み合わせた提案が効果的で、長期的なメリットを伝えることが成功のポイントです。'
  },
  {
    id: '6',
    name: '推しの子コラボフェア',
    description: '話題沸騰中「推しの子」とのコラボレーションイベント',
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-04-15'),
    status: 'active',
    tags: ['#推しの子', '#アニメコラボ', '#若年層', '#SNS映え'],
    totalPosts: 18,
    totalViews: 678,
    totalReactions: 134,
    stores: ['アニメイト渋谷店', 'アニメイト新宿店', 'アニメイト池袋店', 'アニメイト秋葉原店'],
    bestPractices: [],
    successPatterns: [
      'SNS世代を意識したデジタル特典の訴求',
      'キャラクター人気を活用した声かけ',
      '写真撮影スポットでの自然な接客'
    ],
    keyPhrases: [
      '「推しの子ファンの方に大人気の特典です」',
      '「カード限定のデジタル特典もありますよ」',
      '「SNSでシェアすると特典があります」'
    ],
    aiSummary: 'SNS世代が多い若年層イベントでは、デジタル特典や限定感が重要です。写真撮影などの体験と組み合わせた自然なアプローチが効果的です。'
  },
  {
    id: '7',
    name: 'ファミリーフェスタ',
    description: '家族連れ向けの大型イベント。親子で楽しめる企画満載',
    startDate: new Date('2024-03-10'),
    endDate: new Date('2024-03-24'),
    status: 'active',
    tags: ['#ファミリー', '#親子', '#キッズ', '#体験型'],
    totalPosts: 10,
    totalViews: 345,
    totalReactions: 67,
    stores: ['マルイ渋谷店', 'マルイ新宿店', 'マルイ有楽町店'],
    bestPractices: [],
    successPatterns: [
      '家族全体のメリットを訴求する提案',
      '子育て世代向けの特典説明',
      '安心感を与える丁寧な説明'
    ],
    keyPhrases: [
      '「お子様向けの特典もご用意しています」',
      '「家族カードもお得に作れます」',
      '「次回のご来店時にもポイントが使えます」'
    ],
    aiSummary: 'ファミリー層には、家族全体のメリットと安心感の訴求が重要です。子育て世代向けの特典を丁寧に説明することで信頼を得られます。'
  },
  // 2023年のイベント
  {
    id: '8',
    name: '鬼滅の刃フェア2023',
    description: '社会現象となったアニメ「鬼滅の刃」とのコラボイベント',
    startDate: new Date('2023-10-01'),
    endDate: new Date('2023-11-30'),
    status: 'completed',
    tags: ['#鬼滅の刃', '#アニメコラボ', '#限定グッズ'],
    totalPosts: 45,
    totalViews: 2100,
    totalReactions: 410,
    stores: ['札幌店', '仙台店', '東京店', '名古屋店', '大阪店', '福岡店'],
    bestPractices: [],
    successPatterns: ['キャラクター人気を活用した声かけ', '限定感の演出', 'ファン心理の理解'],
    keyPhrases: ['「推しキャラのグッズ残りわずかです」', '「次回入荷は未定です」'],
    aiSummary: '鬼滅の刃ブームを活用した成功事例が多数。限定感の訴求が効果的でした。'
  },
  {
    id: '9',
    name: '原神×大阪コラボフェスタ2023',
    description: '世界的人気ゲーム「原神」とのコラボレーションイベント',
    startDate: new Date('2023-07-01'),
    endDate: new Date('2023-08-31'),
    status: 'completed',
    tags: ['#原神', '#ゲームコラボ', '#大阪限定', '#限定グッズ'],
    totalPosts: 32,
    totalViews: 890,
    totalReactions: 145,
    stores: ['大阪梅田店', '大阪難波店', '大阪天王寺店'],
    bestPractices: [],
    successPatterns: ['ゲームファンへの共感アプローチ', 'キャラクターグッズの限定感演出'],
    keyPhrases: ['「推しキャラのグッズ入荷しました」', '「原神ファンの方に大人気です」'],
    aiSummary: 'ゲームファン層への理解を示した提案が効果的でした。'
  },
  {
    id: '10',
    name: 'ホロライブVtuberハロウィンフェスタ2023',
    description: '人気Vtuberグループ「ホロライブ」とのハロウィンコラボ',
    startDate: new Date('2023-10-01'),
    endDate: new Date('2023-10-31'),
    status: 'completed',
    tags: ['#ホロライブ', '#Vtuber', '#ハロウィン', '#限定グッズ'],
    totalPosts: 28,
    totalViews: 756,
    totalReactions: 132,
    stores: ['全店舗'],
    bestPractices: [],
    successPatterns: ['Vtuberファンへの丁寧な対応', 'コラボ限定特典の訴求'],
    keyPhrases: ['「推しの限定グッズありますよ」', '「ハロウィン限定デザインです」'],
    aiSummary: 'Vtuberファン層への理解を示した接客が成功のポイント。'
  },
  {
    id: '11',
    name: '初音ミク×雪ミクフェア2023',
    description: '北海道限定「雪ミク」とのコラボレーションイベント',
    startDate: new Date('2023-12-01'),
    endDate: new Date('2024-02-28'),
    status: 'completed',
    tags: ['#初音ミク', '#雪ミク', '#Vocaloid', '#北海道限定'],
    totalPosts: 19,
    totalViews: 521,
    totalReactions: 98,
    stores: ['札幌店', '札幌ステラプレイス店'],
    bestPractices: [],
    successPatterns: ['地域限定キャラクターの活用', 'ボカロファンへの共感'],
    keyPhrases: ['「雪ミク限定グッズです」', '「北海道でしか買えません」'],
    aiSummary: '地域限定キャラクターの特別感を活かした提案が成功しています。'
  },
  {
    id: '12',
    name: 'にじさんじ×名古屋コラボフェア2023',
    description: '大人気Vtuberグループ「にじさんじ」とのコラボイベント',
    startDate: new Date('2023-09-01'),
    endDate: new Date('2023-09-30'),
    status: 'completed',
    tags: ['#にじさんじ', '#Vtuber', '#名古屋限定', '#限定グッズ'],
    totalPosts: 24,
    totalViews: 612,
    totalReactions: 118,
    stores: ['名古屋店', '名古屋栄店'],
    bestPractices: [],
    successPatterns: ['Vtuberファンコミュニティへの理解', '限定感の演出'],
    keyPhrases: ['「推しライバーのグッズあります」', '「名古屋限定デザインです」'],
    aiSummary: 'Vtuberファンの熱量を理解した提案が効果的でした。'
  },
  // 2022年のイベント
  {
    id: '13',
    name: '東京リベンジャーズ×春フェア2022',
    description: '人気アニメ「東京卍リベンジャーズ」とのコラボイベント',
    startDate: new Date('2022-03-01'),
    endDate: new Date('2022-04-30'),
    status: 'completed',
    tags: ['#東京リベンジャーズ', '#アニメコラボ', '#春', '#限定グッズ'],
    totalPosts: 38,
    totalViews: 1245,
    totalReactions: 256,
    stores: ['渋谷店', '新宿店', '池袋店', '有楽町店'],
    bestPractices: [],
    successPatterns: ['アニメファンへの共感的アプローチ', 'キャラクター人気の活用'],
    keyPhrases: ['「マイキーのグッズ入荷しました」', '「限定デザインです」'],
    aiSummary: '若年層に人気のアニメを活用した提案が成功しています。'
  },
  {
    id: '14',
    name: 'モンスターハンター×福岡コラボ2022',
    description: '大人気ゲーム「モンスターハンター」とのコラボイベント',
    startDate: new Date('2022-05-01'),
    endDate: new Date('2022-05-31'),
    status: 'completed',
    tags: ['#モンハン', '#ゲームコラボ', '#福岡限定', '#限定グッズ'],
    totalPosts: 22,
    totalViews: 689,
    totalReactions: 134,
    stores: ['福岡天神店', '福岡博多店'],
    bestPractices: [],
    successPatterns: ['ゲームファンへの理解を示す', 'ハンターへの共感'],
    keyPhrases: ['「モンハン好きの方に人気です」', '「限定武器グッズあります」'],
    aiSummary: 'ゲームファン層への理解を示した接客が効果的でした。'
  },
  {
    id: '15',
    name: 'ラブライブ!サンシャイン!!×神奈川2022',
    description: '人気アニメ「ラブライブ!サンシャイン!!」とのコラボ',
    startDate: new Date('2022-07-15'),
    endDate: new Date('2022-08-31'),
    status: 'completed',
    tags: ['#ラブライブ', '#アニメコラボ', '#神奈川', '#夏'],
    totalPosts: 27,
    totalViews: 743,
    totalReactions: 156,
    stores: ['横浜店', '川崎店'],
    bestPractices: [],
    successPatterns: ['アニメ聖地巡礼客への対応', 'キャラクター愛の尊重'],
    keyPhrases: ['「推しメンのグッズあります」', '「限定缶バッジ入荷しました」'],
    aiSummary: 'アニメファンの聖地巡礼需要を捉えた提案が成功。'
  },
  {
    id: '16',
    name: 'ポケモン×千葉オータムフェア2022',
    description: '大人気キャラクター「ポケモン」とのコラボイベント',
    startDate: new Date('2022-10-01'),
    endDate: new Date('2022-11-30'),
    status: 'completed',
    tags: ['#ポケモン', '#キャラクターコラボ', '#千葉', '#秋'],
    totalPosts: 18,
    totalViews: 456,
    totalReactions: 89,
    stores: ['千葉店', '船橋店'],
    bestPractices: [],
    successPatterns: ['幅広い年齢層へのアプローチ', 'ファミリー層への提案'],
    keyPhrases: ['「ピカチュウグッズ大人気です」', '「お子様にも喜ばれます」'],
    aiSummary: '全年齢層に人気のキャラクターを活用した提案が効果的でした。'
  },
  {
    id: '17',
    name: 'SPY×FAMILYコラボ2022',
    description: '大人気アニメ「SPY×FAMILY」とのコラボイベント',
    startDate: new Date('2022-06-01'),
    endDate: new Date('2022-07-31'),
    status: 'completed',
    tags: ['#SPY×FAMILY', '#アニメコラボ', '#限定グッズ'],
    totalPosts: 52,
    totalViews: 2340,
    totalReactions: 489,
    stores: ['全店舗'],
    bestPractices: [],
    successPatterns: ['家族層への訴求', 'キャラクターグッズの限定感演出'],
    keyPhrases: ['「アーニャのグッズ大人気です」'],
    aiSummary: '家族で楽しめるアニメという特性を活かした提案が成功。'
  },
  // 2024年追加イベント（様々な都道府県）
  {
    id: '18',
    name: 'ウマ娘×埼玉スプリングフェア2024',
    description: '大人気ゲーム「ウマ娘」とのコラボイベント',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-04-30'),
    status: 'upcoming',
    tags: ['#ウマ娘', '#ゲームコラボ', '#埼玉', '#春'],
    totalPosts: 0,
    totalViews: 0,
    totalReactions: 0,
    stores: ['大宮店', '川越店', '浦和店'],
    bestPractices: [],
    successPatterns: [],
    keyPhrases: [],
    aiSummary: ''
  },
  {
    id: '19',
    name: 'Fate×京都桜フェスティバル2024',
    description: 'アニメ・ゲーム「Fate」シリーズとのコラボ',
    startDate: new Date('2024-03-20'),
    endDate: new Date('2024-04-10'),
    status: 'upcoming',
    tags: ['#Fate', '#アニメコラボ', '#京都', '#春'],
    totalPosts: 0,
    totalViews: 0,
    totalReactions: 0,
    stores: ['京都店', '京都河原町店'],
    bestPractices: [],
    successPatterns: [],
    keyPhrases: [],
    aiSummary: ''
  },
  {
    id: '20',
    name: 'ガンダム×広島サマーフェア2023',
    description: '人気アニメ「機動戦士ガンダム」とのコラボイベント',
    startDate: new Date('2023-08-01'),
    endDate: new Date('2023-08-15'),
    status: 'completed',
    tags: ['#ガンダム', '#アニメコラボ', '#広島', '#夏'],
    totalPosts: 16,
    totalViews: 432,
    totalReactions: 87,
    stores: ['広島店', '広島八丁堀店'],
    bestPractices: [],
    successPatterns: ['幅広い世代のガンダムファンへの対応'],
    keyPhrases: ['「ガンプラ好きの方に人気です」', '「限定デザインです」'],
    aiSummary: '幅広い世代に人気のアニメを活用した提案が成功しました。'
  },
  {
    id: '21',
    name: 'ブルーアーカイブ×仙台コラボ2023',
    description: '人気スマホゲーム「ブルーアーカイブ」とのコラボイベント',
    startDate: new Date('2023-08-06'),
    endDate: new Date('2023-08-08'),
    status: 'completed',
    tags: ['#ブルアカ', '#ゲームコラボ', '#仙台', '#夏'],
    totalPosts: 21,
    totalViews: 578,
    totalReactions: 112,
    stores: ['仙台店', '仙台泉店'],
    bestPractices: [],
    successPatterns: ['スマホゲームファンへの理解', '推しキャラへの共感'],
    keyPhrases: ['「先生、限定グッズあります」', '「推し生徒のグッズ入荷しました」'],
    aiSummary: 'ゲームコミュニティへの理解を示した提案が好評でした。'
  },
  {
    id: '22',
    name: 'ワンピース×沖縄サマーフェア2023',
    description: '大人気アニメ「ONE PIECE」とのコラボイベント',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-08-31'),
    status: 'completed',
    tags: ['#ワンピース', '#アニメコラボ', '#沖縄', '#夏'],
    totalPosts: 25,
    totalViews: 692,
    totalReactions: 141,
    stores: ['那覇店'],
    bestPractices: [],
    successPatterns: ['幅広い世代への対応', 'キャラクター人気の活用'],
    keyPhrases: ['「麦わらの一味グッズあります」', '「限定デザインです」'],
    aiSummary: '国民的アニメを活用した提案が成功しています。'
  },
  {
    id: '23',
    name: 'アイドルマスター×神戸フェア2022',
    description: '人気ゲーム「アイドルマスター」シリーズとのコラボ',
    startDate: new Date('2022-10-15'),
    endDate: new Date('2022-10-31'),
    status: 'completed',
    tags: ['#アイマス', '#ゲームコラボ', '#神戸', '#秋'],
    totalPosts: 29,
    totalViews: 812,
    totalReactions: 167,
    stores: ['神戸店', '神戸三宮店'],
    bestPractices: [],
    successPatterns: ['プロデューサーへの共感', '推しアイドルへの理解'],
    keyPhrases: ['「担当アイドルのグッズありますよ」', '「限定デザインです」'],
    aiSummary: 'アイドルゲームファンへの理解を示した提案が成功しています。'
  },
  {
    id: '24',
    name: '艦これ×横浜コラボフェス2023',
    description: '人気ゲーム「艦隊これくしょん」とのコラボイベント',
    startDate: new Date('2023-02-01'),
    endDate: new Date('2023-02-28'),
    status: 'completed',
    tags: ['#艦これ', '#ゲームコラボ', '#横浜', '#冬'],
    totalPosts: 33,
    totalViews: 945,
    totalReactions: 189,
    stores: ['横浜店'],
    bestPractices: [],
    successPatterns: ['提督への丁寧な対応', '艦娘人気の活用'],
    keyPhrases: ['「提督、嫁艦のグッズあります」', '「限定グッズです」'],
    aiSummary: 'ゲームファンへの理解を示した接客が効果的でした。'
  },
  {
    id: '25',
    name: 'ちいかわ×静岡コラボ2023',
    description: '大人気キャラクター「ちいかわ」とのコラボイベント',
    startDate: new Date('2023-07-01'),
    endDate: new Date('2023-08-31'),
    status: 'completed',
    tags: ['#ちいかわ', '#キャラクターコラボ', '#静岡', '#夏'],
    totalPosts: 17,
    totalViews: 467,
    totalReactions: 91,
    stores: ['静岡店'],
    bestPractices: [],
    successPatterns: ['癒し系キャラの人気活用', '幅広い層へのアプローチ'],
    keyPhrases: ['「ちいかわグッズ入荷しました」', '「限定デザインです」'],
    aiSummary: '癒し系キャラクターの人気を活用した提案が成功。'
  },
  {
    id: '26',
    name: 'プロジェクトセカイ×長野ウィンターフェア2023',
    description: '人気リズムゲーム「プロジェクトセカイ」とのコラボ',
    startDate: new Date('2023-12-01'),
    endDate: new Date('2024-03-31'),
    status: 'completed',
    tags: ['#プロセカ', '#ゲームコラボ', '#長野', '#冬'],
    totalPosts: 22,
    totalViews: 634,
    totalReactions: 128,
    stores: ['長野店'],
    bestPractices: [],
    successPatterns: ['若年層への理解', 'キャラクター人気の活用'],
    keyPhrases: ['「推しキャラのグッズあります」', '「プロセカファンに人気です」'],
    aiSummary: '音楽ゲームファンへの提案が成功しています。'
  },
  {
    id: '27',
    name: '崩壊スターレイル×金沢コラボ2022',
    description: '人気RPGゲーム「崩壊:スターレイル」とのコラボイベント',
    startDate: new Date('2022-11-01'),
    endDate: new Date('2022-11-30'),
    status: 'completed',
    tags: ['#スターレイル', '#ゲームコラボ', '#金沢', '#秋'],
    totalPosts: 14,
    totalViews: 389,
    totalReactions: 76,
    stores: ['金沢店'],
    bestPractices: [],
    successPatterns: ['中国発ゲームファンへの対応', 'キャラクター人気の活用'],
    keyPhrases: ['「推しキャラのグッズあります」', '「限定デザインです」'],
    aiSummary: 'グローバルゲームファンへの提案が成功。'
  },
  {
    id: '28',
    name: 'あんさんぶるスターズ×新潟フェア2023',
    description: '人気アイドルゲーム「あんさんぶるスターズ!」とのコラボ',
    startDate: new Date('2023-10-01'),
    endDate: new Date('2023-11-30'),
    status: 'completed',
    tags: ['#あんスタ', '#ゲームコラボ', '#新潟', '#秋'],
    totalPosts: 19,
    totalViews: 512,
    totalReactions: 103,
    stores: ['新潟店'],
    bestPractices: [],
    successPatterns: ['アイドルゲームファンへの理解', '推しユニットへの共感'],
    keyPhrases: ['「推しユニットのグッズあります」', '「担当のグッズ入荷しました」'],
    aiSummary: '女性向けアイドルゲームファンへの提案が効果的でした。'
  },
  {
    id: '29',
    name: 'すとぷり×岡山コラボフェスティバル2023',
    description: '人気歌い手グループ「すとぷり」とのコラボイベント',
    startDate: new Date('2023-08-01'),
    endDate: new Date('2023-08-31'),
    status: 'completed',
    tags: ['#すとぷり', '#音楽', '#岡山', '#夏'],
    totalPosts: 16,
    totalViews: 445,
    totalReactions: 88,
    stores: ['岡山店'],
    bestPractices: [],
    successPatterns: ['歌い手ファンへの理解', '若年層への対応'],
    keyPhrases: ['「すとぷりグッズ入荷しました」', '「推しカラーのグッズあります」'],
    aiSummary: '音楽グループファンへの提案が好評でした。'
  },
  {
    id: '30',
    name: 'ツイステッドワンダーランド×熊本2022',
    description: '人気ゲーム「ツイステッドワンダーランド」とのコラボ',
    startDate: new Date('2022-09-01'),
    endDate: new Date('2022-09-30'),
    status: 'completed',
    tags: ['#ツイステ', '#ゲームコラボ', '#熊本', '#秋'],
    totalPosts: 31,
    totalViews: 867,
    totalReactions: 178,
    stores: ['熊本店'],
    bestPractices: [],
    successPatterns: ['女性向けゲームファンへの対応', '寮別グッズの提案'],
    keyPhrases: ['「推し寮のグッズあります」', '「限定デザインです」'],
    aiSummary: 'ディズニー系ゲームファンへの提案が成功。'
  },
  {
    id: '31',
    name: 'バーチャルYouTuber×群馬ウィンターフェア2023',
    description: '人気VTuber事務所とのコラボレーションイベント',
    startDate: new Date('2023-11-01'),
    endDate: new Date('2024-01-31'),
    status: 'completed',
    tags: ['#VTuber', '#配信者', '#群馬', '#冬'],
    totalPosts: 13,
    totalViews: 376,
    totalReactions: 74,
    stores: ['高崎店'],
    bestPractices: [],
    successPatterns: ['VTuberファンへの理解', '配信文化への共感'],
    keyPhrases: ['「推しの限定グッズあります」', '「配信で紹介されたグッズです」'],
    aiSummary: 'VTuber文化への理解を示した提案が成功しています。'
  },
  {
    id: '32',
    name: 'スプラトゥーン3×栃木フェア2024',
    description: '人気ゲーム「スプラトゥーン3」とのコラボイベント',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-02-29'),
    status: 'active',
    tags: ['#スプラトゥーン', '#任天堂', '#栃木', '#冬春'],
    totalPosts: 11,
    totalViews: 298,
    totalReactions: 59,
    stores: ['宇都宮店'],
    bestPractices: [],
    successPatterns: ['任天堂ファンへの対応', 'ファミリー層への提案'],
    keyPhrases: ['「イカグッズ入荷しました」', '「お子様に大人気です」'],
    aiSummary: '任天堂ゲームファンへの提案が効果的。'
  },
  {
    id: '33',
    name: 'アークナイツ×茨城ウィンターフェア2023',
    description: '人気タワーディフェンスゲーム「アークナイツ」とのコラボ',
    startDate: new Date('2023-12-01'),
    endDate: new Date('2023-12-31'),
    status: 'completed',
    tags: ['#アークナイツ', '#ゲームコラボ', '#茨城', '#年末'],
    totalPosts: 26,
    totalViews: 723,
    totalReactions: 149,
    stores: ['つくば店'],
    bestPractices: [],
    successPatterns: ['戦略ゲームファンへの対応', 'オペレーター人気の活用'],
    keyPhrases: ['「推しオペレーターのグッズあります」', '「限定デザインです」'],
    aiSummary: 'タワーディフェンスゲームファンへの提案が成功しています。'
  },
  {
    id: '34',
    name: 'エヴァンゲリオン×山梨コラボ2023',
    description: '人気アニメ「新世紀エヴァンゲリオン」とのコラボイベント',
    startDate: new Date('2023-07-15'),
    endDate: new Date('2023-08-31'),
    status: 'completed',
    tags: ['#エヴァンゲリオン', '#アニメコラボ', '#山梨', '#夏'],
    totalPosts: 20,
    totalViews: 567,
    totalReactions: 115,
    stores: ['甲府店'],
    bestPractices: [],
    successPatterns: ['幅広い世代のファンへの対応', 'レトロアニメファンへの共感'],
    keyPhrases: ['「エヴァグッズ入荷しました」', '「初号機カラーの限定デザインです」'],
    aiSummary: '世代を超えて愛されるアニメの活用が効果的でした。'
  },
  {
    id: '35',
    name: 'ラブライブ!スーパースター!!×愛媛2023',
    description: '人気アイドルアニメ「ラブライブ!スーパースター!!」とのコラボ',
    startDate: new Date('2023-11-01'),
    endDate: new Date('2023-12-31'),
    status: 'completed',
    tags: ['#ラブライブ', '#アニメコラボ', '#愛媛', '#冬'],
    totalPosts: 15,
    totalViews: 423,
    totalReactions: 85,
    stores: ['松山店'],
    bestPractices: [],
    successPatterns: ['アイドルアニメファンへの理解', '推しメンへの共感'],
    keyPhrases: ['「推しメンのグッズあります」', '「限定缶バッジ入荷しました」'],
    aiSummary: 'アイドルアニメファンへの提案が成功。'
  },
  {
    id: '36',
    name: 'バンドリ!×香川コラボフェア2022',
    description: '人気音楽ゲーム「BanG Dream!」とのコラボイベント',
    startDate: new Date('2022-10-01'),
    endDate: new Date('2022-10-31'),
    status: 'completed',
    tags: ['#バンドリ', '#ゲームコラボ', '#香川', '#秋'],
    totalPosts: 18,
    totalViews: 498,
    totalReactions: 97,
    stores: ['高松店'],
    bestPractices: [],
    successPatterns: ['音楽ゲームファンへの理解', 'バンド別グッズの提案'],
    keyPhrases: ['「推しバンドのグッズあります」', '「ライブ会場限定デザインです」'],
    aiSummary: '音楽ゲームファンへの提案が好評でした。'
  },
  {
    id: '37',
    name: 'うたの☆プリンスさまっ♪×徳島2023',
    description: '人気女性向けゲーム「うたプリ」とのコラボイベント',
    startDate: new Date('2023-08-12'),
    endDate: new Date('2023-08-15'),
    status: 'completed',
    tags: ['#うたプリ', '#ゲームコラボ', '#徳島', '#夏'],
    totalPosts: 17,
    totalViews: 487,
    totalReactions: 94,
    stores: ['徳島店'],
    bestPractices: [],
    successPatterns: ['女性向けゲームファンへの対応', 'アイドル別グッズの提案'],
    keyPhrases: ['「推しアイドルのグッズあります」', '「限定デザインです」'],
    aiSummary: '女性向けアイドルゲームファンへの提案が成功。'
  },
  {
    id: '38',
    name: 'FGO×高知サマーフェア2023',
    description: '人気ゲーム「Fate/Grand Order」とのコラボイベント',
    startDate: new Date('2023-08-09'),
    endDate: new Date('2023-08-12'),
    status: 'completed',
    tags: ['#FGO', '#ゲームコラボ', '#高知', '#夏'],
    totalPosts: 16,
    totalViews: 454,
    totalReactions: 89,
    stores: ['高知店'],
    bestPractices: [],
    successPatterns: ['マスターへの丁寧な対応', 'サーヴァント人気の活用'],
    keyPhrases: ['「推しサーヴァントのグッズあります」', '「マスターに人気です」'],
    aiSummary: 'RPGゲームファンへの提案が効果的でした。'
  },
  {
    id: '39',
    name: 'ヒプノシスマイク×佐賀コラボ2023',
    description: '人気音楽プロジェクト「ヒプノシスマイク」とのコラボ',
    startDate: new Date('2023-11-01'),
    endDate: new Date('2023-11-05'),
    status: 'completed',
    tags: ['#ヒプマイ', '#音楽コンテンツ', '#佐賀', '#秋'],
    totalPosts: 14,
    totalViews: 398,
    totalReactions: 78,
    stores: ['佐賀店'],
    bestPractices: [],
    successPatterns: ['女性向けコンテンツファンへの理解', 'ディビジョン別の提案'],
    keyPhrases: ['「推しディビジョンのグッズあります」', '「限定デザインです」'],
    aiSummary: '音楽プロジェクトファンへの提案が成功しました。'
  },
  {
    id: '40',
    name: '刀剣乱舞×長崎ウィンターフェア2023',
    description: '人気ゲーム「刀剣乱舞」とのコラボイベント',
    startDate: new Date('2023-01-22'),
    endDate: new Date('2023-02-05'),
    status: 'completed',
    tags: ['#刀剣乱舞', '#ゲームコラボ', '#長崎', '#冬'],
    totalPosts: 23,
    totalViews: 645,
    totalReactions: 132,
    stores: ['長崎店'],
    bestPractices: [],
    successPatterns: ['女性向けゲームファンへの対応', '推し刀剣への理解'],
    keyPhrases: ['「推し刀のグッズあります」', '「審神者に人気です」'],
    aiSummary: '歴史系ゲームファンへの提案が成功。'
  },
  {
    id: '41',
    name: 'グランブルーファンタジー×大分2023',
    description: '人気RPGゲーム「グランブルーファンタジー」とのコラボ',
    startDate: new Date('2023-10-01'),
    endDate: new Date('2023-12-31'),
    status: 'completed',
    tags: ['#グラブル', '#ゲームコラボ', '#大分', '#秋冬'],
    totalPosts: 19,
    totalViews: 534,
    totalReactions: 107,
    stores: ['大分店'],
    bestPractices: [],
    successPatterns: ['RPGゲームファンへの理解', 'キャラクター人気の活用'],
    keyPhrases: ['「推しキャラのグッズあります」', '「騎空士に人気です」'],
    aiSummary: 'ソーシャルゲームファンへの提案が効果的でした。'
  },
  {
    id: '42',
    name: 'とあるシリーズ×宮崎サマーフェア2023',
    description: '人気ライトノベル「とある」シリーズとのコラボ',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-08-31'),
    status: 'completed',
    tags: ['#とあるシリーズ', '#ライトノベル', '#宮崎', '#夏'],
    totalPosts: 17,
    totalViews: 478,
    totalReactions: 95,
    stores: ['宮崎店'],
    bestPractices: [],
    successPatterns: ['ラノベファンへの理解', 'キャラクター人気の活用'],
    keyPhrases: ['「御坂美琴グッズ入荷しました」', '「限定デザインです」'],
    aiSummary: 'ライトノベルファンへの提案が成功しました。'
  },
  {
    id: '43',
    name: 'アイカツ!×鹿児島コラボフェア2022',
    description: '人気アイドルゲーム「アイカツ!」とのコラボイベント',
    startDate: new Date('2022-11-01'),
    endDate: new Date('2022-11-30'),
    status: 'completed',
    tags: ['#アイカツ', '#ゲームコラボ', '#鹿児島', '#秋'],
    totalPosts: 15,
    totalViews: 421,
    totalReactions: 83,
    stores: ['鹿児島店'],
    bestPractices: [],
    successPatterns: ['子供向けコンテンツの家族提案', 'ファミリー層への対応'],
    keyPhrases: ['「お子様に大人気です」', '「アイドル活動グッズあります」'],
    aiSummary: 'キッズ向けゲームの家族提案が成功。'
  },
  {
    id: '44',
    name: 'ヴァイオレット・エヴァーガーデン×青森2023',
    description: '感動アニメ「ヴァイオレット・エヴァーガーデン」とのコラボ',
    startDate: new Date('2023-08-02'),
    endDate: new Date('2023-08-07'),
    status: 'completed',
    tags: ['#ヴァイオレット', '#アニメコラボ', '#青森', '#夏'],
    totalPosts: 21,
    totalViews: 589,
    totalReactions: 118,
    stores: ['青森店'],
    bestPractices: [],
    successPatterns: ['感動系アニメファンへの丁寧な対応', '作品の世界観への理解'],
    keyPhrases: ['「ヴァイオレットグッズ入荷しました」', '「美しいデザインです」'],
    aiSummary: '感動系アニメファンへの提案が好評でした。'
  },
  {
    id: '45',
    name: 'バーチャルさんはみている×岩手2023',
    description: 'VTuber番組「バーチャルさんはみている」とのコラボ',
    startDate: new Date('2023-09-01'),
    endDate: new Date('2023-10-31'),
    status: 'completed',
    tags: ['#VTuber', '#バーチャル', '#岩手', '#秋'],
    totalPosts: 13,
    totalViews: 367,
    totalReactions: 72,
    stores: ['盛岡店'],
    bestPractices: [],
    successPatterns: ['VTuberファンへの理解', 'バーチャル文化への共感'],
    keyPhrases: ['「推しVTuberのグッズあります」', '「限定デザインです」'],
    aiSummary: 'VTuberコンテンツファンへの提案が成功。'
  },
  {
    id: '46',
    name: 'Re:ゼロから始める異世界生活×秋田2023',
    description: '人気アニメ「Re:ゼロ」とのコラボイベント',
    startDate: new Date('2023-08-03'),
    endDate: new Date('2023-08-06'),
    status: 'completed',
    tags: ['#リゼロ', '#アニメコラボ', '#秋田', '#夏'],
    totalPosts: 16,
    totalViews: 445,
    totalReactions: 88,
    stores: ['秋田店'],
    bestPractices: [],
    successPatterns: ['異世界系アニメファンへの理解', 'キャラクター人気の活用'],
    keyPhrases: ['「レムのグッズ入荷しました」', '「エミリアグッズも人気です」'],
    aiSummary: '異世界アニメファンへの提案が効果的でした。'
  },
  {
    id: '47',
    name: 'アズールレーン×山形コラボ2023',
    description: '人気ゲーム「アズールレーン」とのコラボイベント',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-07-31'),
    status: 'completed',
    tags: ['#アズレン', '#ゲームコラボ', '#山形', '#夏'],
    totalPosts: 18,
    totalViews: 501,
    totalReactions: 101,
    stores: ['山形店'],
    bestPractices: [],
    successPatterns: ['ミリタリーゲームファンへの対応', '艦船擬人化人気の活用'],
    keyPhrases: ['「推しKAN-SENのグッズあります」', '「指揮官に人気です」'],
    aiSummary: 'ミリタリー系ゲームファンへの提案が成功しました。'
  },
  {
    id: '48',
    name: 'プリキュアシリーズ×福島フェア2023',
    description: '人気アニメ「プリキュア」シリーズとのコラボ',
    startDate: new Date('2023-07-01'),
    endDate: new Date('2023-08-31'),
    status: 'completed',
    tags: ['#プリキュア', '#アニメコラボ', '#福島', '#夏'],
    totalPosts: 17,
    totalViews: 473,
    totalReactions: 94,
    stores: ['福島店', '郡山店'],
    bestPractices: [],
    successPatterns: ['ファミリー層への提案', '子供向けコンテンツの家族対応'],
    keyPhrases: ['「お子様に大人気のプリキュアグッズです」', '「親子で楽しめます」'],
    aiSummary: 'キッズ向けアニメの家族提案が効果的でした。'
  },
  {
    id: '49',
    name: 'ドラゴンクエスト×三重コラボ2023',
    description: '国民的RPG「ドラゴンクエスト」とのコラボイベント',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-03-31'),
    status: 'completed',
    tags: ['#ドラクエ', '#ゲームコラボ', '#三重', '#新春'],
    totalPosts: 24,
    totalViews: 678,
    totalReactions: 136,
    stores: ['四日市店', '津店'],
    bestPractices: [],
    successPatterns: ['幅広い世代への対応', '国民的ゲームの活用'],
    keyPhrases: ['「スライムグッズ入荷しました」', '「ドラクエファンに大人気です」'],
    aiSummary: '国民的RPGを活用した提案が成功しました。'
  },
  {
    id: '50',
    name: 'けいおん!×滋賀サマーフェスティバル2023',
    description: '人気アニメ「けいおん!」の聖地滋賀でのコラボイベント',
    startDate: new Date('2023-07-15'),
    endDate: new Date('2023-08-31'),
    status: 'completed',
    tags: ['#けいおん', '#アニメコラボ', '#滋賀', '#夏'],
    totalPosts: 16,
    totalViews: 448,
    totalReactions: 89,
    stores: ['大津店', '草津店'],
    bestPractices: [],
    successPatterns: ['聖地巡礼客への対応', 'アニメファンへの理解'],
    keyPhrases: ['「聖地巡礼の思い出にグッズをどうぞ」', '「放課後ティータイムグッズあります」'],
    aiSummary: '聖地巡礼需要を活用した提案が効果的でした。'
  }
];

type ViewMode = 'list' | 'detail';
type ViewModeWithCreate = 'list' | 'detail' | 'create';
type FilterStatus = 'all' | 'active' | 'completed' | 'upcoming' | 'my-events';

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
  const [showAllEventsModal, setShowAllEventsModal] = useState(false);
  const [allEventsFilterArea, setAllEventsFilterArea] = useState<string>('all');
  const [allEventsFilterYear, setAllEventsFilterYear] = useState<string>('all');

  // ユーザーの参加イベントを初期化
  useEffect(() => {
    const loadParticipatingEvents = async () => {
      if (user?.id) {
        const events = await getUserParticipatingEvents(user.id);
        setSelectedParticipatingEvents(events);
      }
    };
    loadParticipatingEvents();
  }, [user?.id]);

  const filteredEvents = mockEvents.filter(event => {
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
      default: return '不明';
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
    // イベント投稿処理
    console.log('イベント投稿:', postData);
    // 実際の実装では、ここでAPIを呼び出してデータを保存
    setViewMode('list');
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
      console.error('ユーザーIDがありません');
      return;
    }

    setIsLoading(true);
    try {
      console.log('💾 保存処理開始 - ユーザーID:', user.id, 'イベントID:', selectedParticipatingEvents);

      // データベースに保存
      const success = await saveUserParticipatingEvents(user.id, selectedParticipatingEvents);

      if (success) {
        console.log('✅ 保存成功 - データベースから再読み込み中...');

        // データベースから最新の参加イベントを再読み込み
        const updatedEvents = await getUserParticipatingEvents(user.id);
        console.log('📥 再読み込み完了:', updatedEvents);
        setSelectedParticipatingEvents(updatedEvents);

        setShowEventSelectionModal(false);
        alert('参加イベントを保存しました');
      } else {
        console.error('❌ 参加イベントの保存に失敗しました');
        alert('保存に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      console.error('❌ 参加イベント保存エラー:', error);
      alert('保存中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 2024年に開催されたイベントを「開催中イベント」として定義
  const activeEvents = mockEvents.filter(e => {
    const year2024Match = e.startDate.getFullYear() === 2024 || e.endDate.getFullYear() === 2024;
    if (selectedArea === 'all') return year2024Match;

    // 地方別エリアフィルタリング
    const regionalKeywords: { [key: string]: string[] } = {
      '北海道': ['北海道', '札幌'],
      '東北': ['青森', '岩手', '宮城', '秋田', '山形', '福島', '仙台'],
      '関東': ['東京', '神奈川', '埼玉', '千葉', '茨城', '栃木', '群馬', '渋谷', '新宿', '池袋', '有楽町', '秋葉原', '横浜', '大宮'],
      '中部': ['新潟', '富山', '石川', '福井', '山梨', '長野', '岐阜', '静岡', '愛知', '名古屋'],
      '近畿': ['三重', '滋賀', '京都', '大阪', '兵庫', '奈良', '和歌山', '梅田', '神戸'],
      '中国': ['鳥取', '島根', '岡山', '広島', '山口'],
      '四国': ['徳島', '香川', '愛媛', '高知'],
      '九州': ['福岡', '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島', '沖縄', '博多', '天神']
    };

    const keywords = regionalKeywords[selectedArea] || [];
    const matchesArea = e.stores.some(store =>
      keywords.some(keyword => store.includes(keyword))
    ) || e.stores.includes('全店舗');

    return year2024Match && matchesArea;
  });

  if (viewMode === 'create') {
    return (
      <EventPostForm 
        onSubmit={handleCreatePost}
        onCancel={handleBackToList}
        events={mockEvents.map(e => ({ id: e.id, name: e.name, status: e.status }))}
      />
    );
  }

  if (viewMode === 'detail' && selectedEvent) {
    return (
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToList}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{selectedEvent.name}</h1>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedEvent.status)}`}>
                {getStatusLabel(selectedEvent.status)}
              </span>
            </div>
            <p className="text-gray-600">{selectedEvent.description}</p>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="bg-white rounded-xl border border-gray-200 p-1">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setActiveDetailTab('knowledge')}
              className={`px-4 py-3 rounded-lg font-medium transition-colors text-sm ${
                activeDetailTab === 'knowledge'
                  ? 'bg-vivid-red text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              💫 ファンの楽しみを理解するための基礎情報
            </button>
            <button
              onClick={() => setActiveDetailTab('overview')}
              className={`px-4 py-3 rounded-lg font-medium transition-colors text-sm ${
                activeDetailTab === 'overview'
                  ? 'bg-vivid-red text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📊 概要
            </button>
            <button
              onClick={() => setActiveDetailTab('patterns')}
              className={`px-4 py-3 rounded-lg font-medium transition-colors text-sm ${
                activeDetailTab === 'patterns'
                  ? 'bg-vivid-red text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✨ 成功パターン
            </button>
            <button
              onClick={() => setActiveDetailTab('phrases')}
              className={`px-4 py-3 rounded-lg font-medium transition-colors text-sm ${
                activeDetailTab === 'phrases'
                  ? 'bg-vivid-red text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              💬 フレーズ集
            </button>
          </div>
        </div>

        {/* 必須知識タブ */}
        {activeDetailTab === 'knowledge' && selectedEvent.essentialKnowledge && (
          <div className="space-y-4">
            {/* 作品概要 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <span className="text-2xl">📖</span>
                <span>作品概要</span>
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">{selectedEvent.essentialKnowledge.overview}</p>

              {/* 公式サイトリンク */}
              {selectedEvent.essentialKnowledge.officialSiteUrl && (
                <a
                  href={selectedEvent.essentialKnowledge.officialSiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="font-medium">公式サイトを見る</span>
                </a>
              )}
            </div>

            {/* 主要キャラクター */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-2xl">👥</span>
                <span>主要キャラクターTOP3</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedEvent.essentialKnowledge.mainCharacters.map((character, index) => (
                  <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-800 font-medium">{character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ファン層の特徴 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-2xl">🎯</span>
                <span>ファン層の特徴</span>
              </h3>
              <ul className="space-y-3">
                {selectedEvent.essentialKnowledge.fanBase.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-sky-blue mt-1">●</span>
                    <span className="text-gray-700 flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 会話のヒント */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-2xl">💬</span>
                <span>ファンと楽しく話すためのヒント</span>
              </h3>
              <ul className="space-y-3">
                {selectedEvent.essentialKnowledge.precautions.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-pink-500 mt-1">💡</span>
                    <span className="text-gray-800 flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 会話のきっかけポイント */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-2xl">🌟</span>
                <span>会話のきっかけポイント</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedEvent.essentialKnowledge.servicePoints.map((point, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-blue-200 shadow-sm">
                    <span className="text-blue-500 text-xl">💬</span>
                    <span className="text-gray-800 flex-1">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 概要タブ */}
        {activeDetailTab === 'overview' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <MessageCircle className="w-8 h-8 text-sky-blue mx-auto mb-2" />
                <div className="text-xl font-bold text-gray-900">{selectedEvent.totalPosts}</div>
                <div className="text-sm text-gray-600">投稿事例</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Eye className="w-8 h-8 text-success-green mx-auto mb-2" />
                <div className="text-xl font-bold text-gray-900">{selectedEvent.totalViews}</div>
                <div className="text-sm text-gray-600">総閲覧数</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <ThumbsUp className="w-8 h-8 text-sunshine-yellow mx-auto mb-2" />
                <div className="text-xl font-bold text-gray-900">{selectedEvent.totalReactions}</div>
                <div className="text-sm text-gray-600">総リアクション</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-gray-900">{selectedEvent.stores.length}</div>
                <div className="text-sm text-gray-600">参加店舗</div>
              </div>
            </div>

            {/* AI要約 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-sky-blue mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sky-blue mb-2">AI分析サマリー</h3>
                  <p className="text-blue-700">{selectedEvent.aiSummary}</p>
                </div>
              </div>
            </div>

            {/* 参加店舗 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>参加店舗</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedEvent.stores.map((store, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                    {store}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 成功パターンタブ */}
        {activeDetailTab === 'patterns' && selectedEvent.successPatterns.length > 0 && (
          <div className="space-y-6">
            {/* 成功パターンTOP3 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="w-5 h-5 text-sunshine-yellow" />
                <h3 className="text-lg font-semibold text-gray-900">成功パターンTOP3</h3>
              </div>
              <div className="space-y-3">
                {selectedEvent.successPatterns.map((pattern, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="w-8 h-8 bg-sunshine-yellow text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-800 flex-1 text-base">{pattern}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 実際の事例投稿 */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <MessageCircle className="w-5 h-5 text-sky-blue" />
                <h3 className="text-lg font-semibold text-gray-900">みんなの投稿事例</h3>
              </div>
              {/* 今週の人気事例TOP3（イベント内） */}
              <div className="bg-gradient-to-r from-yellow-50 to-red-50 rounded-xl p-6 border border-yellow-200 mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Award className="w-5 h-5 text-sunshine-yellow" />
                  <h3 className="text-lg font-semibold text-gray-900">今週の人気事例TOP3</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockCommunityPosts
                    .filter(post => post.eventId === selectedEvent.id)
                    .sort((a, b) => {
                      const aScore = a.reactions.like + a.reactions.empathy + a.reactions.helpful;
                      const bScore = b.reactions.like + b.reactions.empathy + b.reactions.helpful;
                      return bScore - aScore;
                    })
                    .slice(0, 3)
                    .map((post, index) => (
                      <div key={post.id} className="bg-white rounded-lg p-4 border border-yellow-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            index === 0 ? 'bg-sunshine-yellow' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{post.author.department}</span>
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">{post.title}</h4>
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <span>{post.reactions.like + post.reactions.empathy + post.reactions.helpful} リアクション</span>
                          <span>{post.views} 閲覧</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-4">
                {mockCommunityPosts.filter(post => post.eventId === selectedEvent.id).map((post) => (
                  <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4 mb-4">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{post.title}</h4>
                            <p className="text-sm text-gray-600">{post.author.name} · {post.author.department}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {post.createdAt.toLocaleDateString('ja-JP')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <span className="text-xs font-semibold text-purple-600 uppercase">状況</span>
                        <p className="text-gray-700 mt-1">{post.situation}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-blue-600 uppercase">工夫したこと</span>
                        <p className="text-gray-700 mt-1">{post.innovation}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-green-600 uppercase">結果</span>
                        <p className="text-gray-700 mt-1">{post.result}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{post.reactions.like}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* フレーズ集タブ */}
        {activeDetailTab === 'phrases' && selectedEvent.keyPhrases.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <MessageCircle className="w-5 h-5 text-success-green" />
              <h3 className="text-lg font-semibold text-gray-900">効果的な声かけフレーズ</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedEvent.keyPhrases.map((phrase, index) => (
                <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-gray-800 font-medium text-base">{phrase}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setShowEventSelectionModal(true)}
          className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-purple-600 hover:shadow-md transition-all"
        >
          <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-900">
            {selectedParticipatingEvents.length}
          </div>
          <div className="text-sm text-gray-600">参加中イベント</div>
          <div className="text-xs text-purple-600 mt-1">クリックして選択</div>
        </button>
        <button
          onClick={() => setShowAllEventsModal(true)}
          className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-sky-blue hover:shadow-md transition-all"
        >
          <Calendar className="w-8 h-8 text-sky-blue mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-900">{mockEvents.length}</div>
          <div className="text-sm text-gray-600">総イベント数</div>
          <div className="text-xs text-sky-blue mt-1">クリックして過去イベントを確認</div>
        </button>
      </div>

      {/* 検索・フィルター */}
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
            <option value="my-events">参加中のイベント</option>
            <option value="active">開催中</option>
            <option value="upcoming">開催予定</option>
            <option value="completed">終了</option>
          </select>
        </div>
      </div>

      {/* イベント一覧 */}
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
                      <span>参加中</span>
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
                <div className="text-xs text-gray-600">投稿事例</div>
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
                  +{event.tags.length - 3}個
                </span>
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
            {filterStatus === 'my-events' ? '参加中のイベントがありません' : '該当するイベントが見つかりません'}
          </h3>
          <p className="text-gray-600">
            {filterStatus === 'my-events' 
              ? 'イベントに参加して事例を共有しましょう' 
              : '検索条件を変更してお試しください'
            }
          </p>
        </div>
      )}

      {/* ヒント */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-sky-blue mb-2">💡 イベントページの活用方法</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h4 className="font-medium mb-1">事前準備</h4>
            <ul className="space-y-1">
              <li>• 過去の類似イベント事例を確認</li>
              <li>• 成功パターンを事前学習</li>
              <li>• 効果的なフレーズを準備</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-1">イベント中</h4>
            <ul className="space-y-1">
              <li>• ベストプラクティスを実践</li>
              <li>• 新しい成功事例をコミュニティに投稿</li>
              <li>• 他店舗の最新事例をチェック</li>
            </ul>
          </div>
        </div>
      </div>

      {/* イベント選択モーダル */}
      {showEventSelectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* モーダルヘッダー */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">参加イベントを選択</h2>
                  <p className="text-gray-600 mt-1">開催中のイベントから参加するものを選んでください</p>
                </div>
                <button
                  onClick={() => setShowEventSelectionModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* エリアフィルタ */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">エリア:</span>
                {['all', '北海道', '東北', '関東', '中部', '近畿', '中国', '四国', '九州'].map((area) => (
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

            {/* 開催中イベント一覧 */}
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
                            <span>{event.stores.length}店舗参加</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{event.totalPosts}件の事例</span>
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
                  <p className="text-gray-600">現在開催中のイベントはありません</p>
                </div>
              )}
            </div>

            {/* モーダルフッター */}
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
                  {isLoading ? '保存中...' : '保存'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 過去イベント一覧モーダル */}
      {showAllEventsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* モーダルヘッダー */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">過去のイベント一覧</h2>
                  <p className="text-gray-600 mt-1">過去に開催されたイベントを確認できます</p>
                </div>
                <button
                  onClick={() => setShowAllEventsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* フィルター */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">エリア</label>
                  <select
                    value={allEventsFilterArea}
                    onChange={(e) => setAllEventsFilterArea(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                  >
                    <option value="all">すべてのエリア</option>
                    <option value="全国">全国</option>
                    <option value="北海道">北海道</option>
                    <option value="東北">東北</option>
                    <option value="関東">関東</option>
                    <option value="中部">中部</option>
                    <option value="近畿">近畿</option>
                    <option value="中国">中国</option>
                    <option value="四国">四国</option>
                    <option value="九州・沖縄">九州・沖縄</option>
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

            {/* イベント一覧 */}
            <div className="p-6 space-y-4">
              {mockEvents
                .filter(event => {
                  // エリアマッピング関数
                  const getAreaFromStore = (storeName: string): string => {
                    if (storeName.includes('全店舗')) return '全国';
                    if (storeName.includes('札幌')) return '北海道';
                    if (storeName.includes('仙台')) return '東北';
                    if (storeName.includes('東京') || storeName.includes('渋谷') || storeName.includes('新宿') ||
                        storeName.includes('池袋') || storeName.includes('有楽町') || storeName.includes('秋葉原')) return '関東';
                    if (storeName.includes('横浜') || storeName.includes('川崎')) return '関東';
                    if (storeName.includes('埼玉') || storeName.includes('千葉')) return '関東';
                    if (storeName.includes('名古屋')) return '中部';
                    if (storeName.includes('大阪') || storeName.includes('梅田') || storeName.includes('難波') || storeName.includes('天王寺')) return '近畿';
                    if (storeName.includes('福岡') || storeName.includes('天神') || storeName.includes('博多')) return '九州・沖縄';
                    return '全国';
                  };

                  const areaMatch = allEventsFilterArea === 'all' ||
                    event.stores.some(store => {
                      const storeArea = getAreaFromStore(store);
                      return storeArea === allEventsFilterArea;
                    }) ||
                    (allEventsFilterArea === '全国' && event.stores.includes('全店舗'));

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
                            <span>{event.stores.length}店舗参加</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{event.totalPosts}件の事例</span>
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
