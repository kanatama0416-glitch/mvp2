import React, { useState } from 'react';
import { 
  MessageCircle, 
  Users, 
  MessageSquare, 
  BookOpen, 
  HelpCircle,
  Send,
  ArrowLeft,
  Clock,
  Star,
  ChevronRight,
  Lightbulb,
  Target,
  Heart,
  Zap
} from 'lucide-react';

interface ConsultationCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  subcategories: string[];
}

interface ConsultationHistory {
  id: string;
  category: string;
  question: string;
  answer: string;
  timestamp: Date;
  rating?: number;
}

const consultationCategories: ConsultationCategory[] = [
  {
    id: 'customer-service',
    title: '接客スキル相談',
    description: '声かけ、リピート促進、断られたときの対応など',
    icon: Users,
    color: 'text-sky-blue',
    bgColor: 'bg-blue-50 border-blue-200',
    subcategories: ['声かけのタイミング', 'リピート促進', '断り対応', '初回接客']
  },
  {
    id: 'product-situation',
    title: '商品・シチュエーション別相談',
    description: 'フィンテック商品、シニア層、時間がない客など',
    icon: Target,
    color: 'text-success-green',
    bgColor: 'bg-green-50 border-green-200',
    subcategories: ['フィンテック商品', 'シニア層対応', '時間制約', 'ファミリー層']
  },
  {
    id: 'expression',
    title: '言い回し・表現相談',
    description: '言葉づかい、失礼チェック、フレーズ提案',
    icon: MessageSquare,
    color: 'text-sunshine-yellow',
    bgColor: 'bg-yellow-50 border-yellow-200',
    subcategories: ['敬語チェック', 'フレーズ提案', '失礼回避', '自然な表現']
  },
  {
    id: 'roleplay',
    title: 'ロールプレイ相談',
    description: 'AIが顧客役になって対話練習',
    icon: Zap,
    color: 'text-vivid-red',
    bgColor: 'bg-red-50 border-red-200',
    subcategories: ['対話練習', 'シナリオ練習', '実践トレーニング', 'フィードバック']
  },
  {
    id: 'learning-support',
    title: '学習支援相談',
    description: 'おすすめ練習シナリオ、事例紹介、個別アドバイス',
    icon: BookOpen,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200',
    subcategories: ['学習プラン', '事例紹介', '個別アドバイス', 'スキル診断']
  }
];

const mockHistory: ConsultationHistory[] = [
  {
    id: '1',
    category: '接客スキル相談',
    question: 'アニメイベントでお客様に自然に声をかける方法を教えてください',
    answer: 'アニメイベントでの声かけは、お客様の興味に寄り添うことが重要です。\n\n【おすすめアプローチ】\n1. 商品への関心を確認：「このフィギュア、とても人気ですよね！」\n2. 共感を示す：「私もこのシリーズ好きなんです」\n3. 自然な提案：「実は、アニメグッズのお買い物でお得になるカードがあるんです」\n\n【具体的なフレーズ例】\n「イベント限定品、素敵な選択ですね！実は、次回のイベントでもお得に使えるカードがあるんですが、ご興味ありますか？」',
    timestamp: new Date('2024-01-20T14:30:00'),
    rating: 5
  },
  {
    id: '2',
    category: '言い回し・表現相談',
    question: '「カードを作りませんか」という言い方が直接的すぎる気がします',
    answer: 'より自然で柔らかい表現をご提案します。\n\n【改善案】\n❌ 「カードを作りませんか？」\n✅ 「お得な会員サービスがあるんですが、ご案内させていただいてもよろしいですか？」\n\n【その他の自然な表現】\n• 「ポイントが貯まるサービスをご利用いただけますが...」\n• 「次回からもっとお得にお買い物いただける方法があります」\n• 「会員様限定の特典をご紹介できるのですが...」\n\n相手の立場に立った「提案」として伝えることで、押し付けがましさを避けられます。',
    timestamp: new Date('2024-01-18T11:15:00'),
    rating: 4
  }
];

export default function Consultation() {
  const [selectedCategory, setSelectedCategory] = useState<ConsultationCategory | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [consultationHistory, setConsultationHistory] = useState<ConsultationHistory[]>(mockHistory);

  const handleCategorySelect = (category: ConsultationCategory) => {
    setSelectedCategory(category);
    setSelectedSubcategory('');
    setQuestion('');
    setAnswer('');
  };

  const handleSubmitQuestion = async () => {
    if (!question.trim() || !selectedCategory) return;

    setIsLoading(true);
    
    // AIに相談内容を送信（模擬実装）
    setTimeout(() => {
      const mockAnswer = generateMockAnswer(selectedCategory.id, question);
      setAnswer(mockAnswer);
      
      // 履歴に追加
      const newConsultation: ConsultationHistory = {
        id: Date.now().toString(),
        category: selectedCategory.title,
        question: question,
        answer: mockAnswer,
        timestamp: new Date()
      };
      
      setConsultationHistory([newConsultation, ...consultationHistory]);
      setIsLoading(false);
    }, 2000);
  };

  const generateMockAnswer = (categoryId: string, question: string): string => {
    const answers = {
      'customer-service': `接客スキルについてお答えします。

【基本アプローチ】
1. お客様の状況を観察し、適切なタイミングを見計らう
2. 共感を示しながら自然な会話を始める
3. お客様のメリットを具体的に説明する

【具体的なフレーズ例】
「お忙しい中恐れ入ります。実は、今日のお買い物がもっとお得になる方法があるんです」

【関連する練習シナリオ】
• 基本的な声かけ練習
• タイミング判断トレーニング`,

      'product-situation': `商品・シチュエーション別のアドバイスをお伝えします。

【状況分析】
お客様の属性や購買状況に応じたアプローチが重要です。

【おすすめ手法】
1. 相手の立場に立った提案
2. 具体的なメリットの提示
3. 次回来店時の価値創造

【実践例】
「${question}」のような場面では、お客様の時間を尊重しつつ、簡潔で魅力的な提案を心がけましょう。`,

      'expression': `言い回し・表現についてアドバイスします。

【改善のポイント】
• より自然で親しみやすい表現を使用
• 相手の立場を考慮した言葉選び
• 押し付けがましくない提案方法

【推奨フレーズ】
「もしよろしければ、お得な情報をご案内させていただけますか？」
「次回からもっと便利にお買い物いただける方法があります」

【避けるべき表現】
直接的すぎる勧誘や、断りにくい表現は控えましょう。`,

      'roleplay': `ロールプレイ練習を開始します。

【練習シナリオ】
私がお客様役を演じますので、実際の接客のように対応してください。

【お客様設定】
20代女性、アニメグッズ購入、初回来店

【シーン開始】
「お会計お願いします。このキーホルダー、可愛いですね！」

あなたの対応をお聞かせください。適切なタイミングでカードのご案内をしてみましょう。`,

      'learning-support': `学習支援についてお答えします。

【おすすめ学習プラン】
1. 基礎スキル診断で現在のレベルを確認
2. 弱点分野の集中練習
3. 実践シミュレーションで応用力向上

【関連事例】
コミュニティで同様の相談事例を確認できます。

【次のステップ】
• AIシミュレーションでの実践練習
• スキル評価での定期的な成長確認
• コミュニティでの事例共有`
    };

    return answers[categoryId as keyof typeof answers] || '申し訳ございません。適切な回答を生成できませんでした。もう一度お試しください。';
  };

  const resetConsultation = () => {
    setSelectedCategory(null);
    setSelectedSubcategory('');
    setQuestion('');
    setAnswer('');
  };

  if (showHistory) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowHistory(false)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">相談履歴</h1>
            <p className="text-gray-600 mt-1">過去の相談内容と回答を確認できます</p>
          </div>
        </div>

        <div className="space-y-4">
          {consultationHistory.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-sky-blue text-sm font-medium rounded-full mb-2">
                    {item.category}
                  </span>
                  <h3 className="font-semibold text-gray-900">{item.question}</h3>
                </div>
                <div className="text-sm text-gray-500">
                  {item.timestamp.toLocaleDateString('ja-JP')}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">AI回答</h4>
                <p className="text-gray-700 whitespace-pre-line">{item.answer}</p>
              </div>
              
              {item.rating && (
                <div className="flex items-center space-x-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < item.rating! ? 'text-sunshine-yellow fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">評価済み</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (answer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={resetConsultation}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI回答</h1>
            <p className="text-gray-600 mt-1">{selectedCategory?.title}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">あなたの相談</h3>
            <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{question}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-sunshine-yellow" />
              <span>AI回答</span>
            </h3>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-gray-700 whitespace-pre-line">{answer}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-medium text-success-green mb-2">関連シミュレーション</h4>
              <p className="text-sm text-gray-700 mb-3">この相談内容に関連する練習シナリオ</p>
              <button className="text-success-green hover:text-emerald-green font-medium text-sm flex items-center space-x-1">
                <span>練習を開始</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h4 className="font-medium text-sunshine-yellow mb-2">関連事例</h4>
              <p className="text-sm text-gray-700 mb-3">コミュニティの類似事例を確認</p>
              <button className="text-sunshine-yellow hover:text-yellow-600 font-medium text-sm flex items-center space-x-1">
                <span>事例を見る</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-2">この回答は役に立ちましたか？</p>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    className="w-8 h-8 text-gray-300 hover:text-sunshine-yellow transition-colors"
                  >
                    <Star className="w-full h-full" />
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={resetConsultation}
              className="px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              新しい相談をする
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedCategory.title}</h1>
            <p className="text-gray-600 mt-1">{selectedCategory.description}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              詳細カテゴリ（任意）
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {selectedCategory.subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`p-3 text-sm rounded-lg border transition-colors ${
                    selectedSubcategory === sub
                      ? `${selectedCategory.bgColor} ${selectedCategory.color} border-current`
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              相談内容 <span className="text-vivid-red">*</span>
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="具体的な状況や悩みを詳しく教えてください。例：「アニメイベントでお客様に自然に声をかける方法を知りたいです」"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent resize-none"
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">
                具体的な状況を教えていただくと、より適切な回答ができます
              </p>
              <span className="text-sm text-gray-400">{question.length}/1000</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              戻る
            </button>
            <button
              onClick={handleSubmitQuestion}
              disabled={!question.trim() || isLoading}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-sky-blue text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>AI回答生成中...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>相談する</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">相談コーナー</h1>
          <p className="text-gray-600 mt-1">口コミに関する悩みや疑問をAIに相談できます</p>
        </div>
        
        <button
          onClick={() => setShowHistory(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Clock className="w-4 h-4" />
          <span>相談履歴</span>
        </button>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-sky-blue rounded-lg flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">AIがあなたの相談にお答えします</h3>
            <p className="text-gray-700 text-sm">
              カテゴリを選択して具体的な相談内容を入力すると、AIが実践的なアドバイスや
              フレーズ例、関連する練習シナリオを提案します。
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">相談カテゴリを選択</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultationCategories.map((category) => {
            const IconComponent = category.icon;
            const iconBg = ({
              'text-sky-blue': 'bg-sky-blue',
              'text-success-green': 'bg-success-green',
              'text-sunshine-yellow': 'bg-sunshine-yellow',
              'text-vivid-red': 'bg-vivid-red',
              'text-purple-600': 'bg-purple-600',
            } as Record<string, string>)[category.color] || 'bg-gray-400';
            return (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category)}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg group ${category.bgColor}`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBg}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <ChevronRight className={`w-5 h-5 ${category.color} group-hover:translate-x-1 transition-transform`} />
                </div>
                
                <h3 className={`text-lg font-semibold mb-2 ${category.color}`}>
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {category.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {category.subcategories.slice(0, 3).map((sub, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white bg-opacity-70 text-gray-600 text-xs rounded-md"
                    >
                      {sub}
                    </span>
                  ))}
                  {category.subcategories.length > 3 && (
                    <span className="px-2 py-1 bg-white bg-opacity-70 text-gray-500 text-xs rounded-md">
                      +{category.subcategories.length - 3}個
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">よくある相談例</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">「断られた後の対応方法」</h4>
            <p className="text-sm text-gray-600">お客様に断られた時の自然なフォローアップ方法</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">「忙しそうなお客様への声かけ」</h4>
            <p className="text-sm text-gray-600">時間がなさそうなお客様への適切なアプローチ</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">「シニア層への説明方法」</h4>
            <p className="text-sm text-gray-600">年配のお客様にも分かりやすい説明テクニック</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">「自然な言い回しの提案」</h4>
            <p className="text-sm text-gray-600">押し付けがましくない自然な表現方法</p>
          </div>
        </div>
      </div>
    </div>
  );
}
