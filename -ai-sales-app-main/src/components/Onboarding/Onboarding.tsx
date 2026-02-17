import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, MessageCircle, Target, TrendingUp, Award, ThumbsUp } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'ようこそ！',
      subtitle: 'AI口コミ先生へ',
      description: 'あなたの接客スキルを"楽しく"磨けるアプリです',
      bgColor: 'bg-gradient-to-br from-light-gray to-sky-blue/20',
      accentColor: 'sky-blue'
    },
    {
      id: 2,
      title: '丸井の"口コミの力"を',
      subtitle: 'だれでも、どこでも、身につけられる！',
      description: '属人的だったスキルをデジタルで学び、あなたの"強み"に変えます。',
      bgColor: 'bg-gradient-to-br from-red-50 to-orange-50',
      accentColor: 'vivid-red'
    },
    {
      id: 3,
      title: '何ができるか',
      subtitle: '',
      description: '',
      bgColor: 'bg-gradient-to-br from-light-gray to-blue-50',
      accentColor: 'sky-blue',
      features: [
        {
          icon: MessageCircle,
          title: 'AIとの対話で接客スキルを体験',
          color: 'sky-blue'
        },
        {
          icon: Target,
          title: 'あなたに合ったトレーニングプランを提案',
          color: 'orange-500'
        },
        {
          icon: TrendingUp,
          title: 'どこでも、何度でも、スキルを磨ける',
          color: 'sunshine-yellow'
        }
      ]
    },
    {
      id: 4,
      title: '成長が見える！',
      subtitle: 'トレーニングを重ねるごとに、あなたのスキルがどんどんレベルアップ！',
      description: '成長がグラフやバッジで"見える化"されます。',
      bgColor: 'bg-gradient-to-br from-light-gray to-orange-50',
      accentColor: 'orange-500'
    },
    {
      id: 5,
      title: 'まずはあなたのスキルを評価しましょう！',
      subtitle: 'AIとの簡単な会話で、あなたの"得意"を診断します。',
      description: '',
      bgColor: 'bg-gradient-to-br from-sky-blue/20 to-blue-100',
      accentColor: 'sky-blue',
      isLast: true
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleStartEvaluation = () => {
    onComplete();
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden ${currentSlideData.bgColor}`}>
        <div className="relative min-h-[600px] flex flex-col">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/30">
            <div 
              className="h-full bg-vivid-red transition-all duration-500"
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            />
          </div>

          {/* Slide Content */}
          <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center">
            {currentSlide === 0 && (
              <div className="text-center">
                <div className="w-24 h-24 bg-vivid-red rounded-full flex items-center justify-center mx-auto mb-8">
                  <MessageCircle className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                  {currentSlideData.title}
                </h1>
                <h2 className="text-2xl sm:text-3xl font-semibold text-sky-blue mb-6">
                  {currentSlideData.subtitle}
                </h2>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                  {currentSlideData.description}
                </p>
              </div>
            )}

            {currentSlide === 1 && (
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-vivid-red to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8">
                  <ThumbsUp className="w-16 h-16 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-vivid-red mb-4">
                  {currentSlideData.title}
                </h1>
                <h2 className="text-xl sm:text-2xl font-semibold text-orange-600 mb-6">
                  {currentSlideData.subtitle}
                </h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  {currentSlideData.description}
                </p>
              </div>
            )}

            {currentSlide === 2 && (
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
                  {currentSlideData.title}
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {currentSlideData.features?.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center">
                        <div className={`w-16 h-16 bg-${feature.color}/10 rounded-full flex items-center justify-center mx-auto mb-4`}>
                          <Icon className={`w-8 h-8 text-${feature.color}`} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                          {feature.title}
                        </h3>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {currentSlide === 3 && (
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-40 h-32 bg-white rounded-xl shadow-lg mx-auto p-4 border-4 border-orange-200">
                    <div className="space-y-2">
                      <div className="h-2 bg-orange-500 rounded-full w-full"></div>
                      <div className="h-2 bg-orange-400 rounded-full w-4/5"></div>
                      <div className="h-2 bg-orange-300 rounded-full w-3/5"></div>
                      <div className="h-2 bg-orange-200 rounded-full w-2/5"></div>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 flex space-x-1">
                    <div className="w-8 h-8 bg-sky-blue rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-8 h-8 bg-sunshine-yellow rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  {currentSlideData.title}
                </h1>
                <h2 className="text-xl sm:text-2xl font-semibold text-orange-600 mb-6">
                  {currentSlideData.subtitle}
                </h2>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                  {currentSlideData.description}
                </p>
              </div>
            )}

            {currentSlide === 4 && (
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-sky-blue to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                  <ThumbsUp className="w-16 h-16 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-sunshine-yellow rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">GO!</span>
                  </div>
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  {currentSlideData.title}
                </h1>
                <h2 className="text-xl sm:text-2xl font-semibold text-sky-blue mb-8">
                  {currentSlideData.subtitle}
                </h2>
                
                <button
                  onClick={handleStartEvaluation}
                  className="px-8 py-4 bg-vivid-red text-white text-xl font-bold rounded-xl hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  スキル評価をはじめる
                </button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="p-6 sm:p-8 flex items-center justify-between">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentSlide === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>戻る</span>
            </button>

            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-vivid-red scale-125'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>

            {currentSlide < slides.length - 1 ? (
              <button
                onClick={nextSlide}
                className="flex items-center space-x-2 px-6 py-3 bg-vivid-red text-white rounded-lg hover:bg-red-600 transition-all duration-300 font-semibold"
              >
                <span>次へ</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-20"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}