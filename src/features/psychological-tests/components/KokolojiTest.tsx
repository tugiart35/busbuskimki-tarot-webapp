/*
  Psikolojik Test Ana Bileşeni - Genişletilmiş Versiyon
  ----------------------------------------------------------------------
  Bu dosya ne işe yarar?
  - 10 farklı psikolojik testi yönetir ve kullanıcıya sunar
  - Test sonuçlarını analiz eder ve detaylı yorumlar verir
  - Mobil uyumlu tasarım ile kullanıcı deneyimi sağlar
  - MBTI, Aşk Dili, Stres, Yaratıcılık ve Kariyer testlerini kapsar
*/

'use client';

import { useState, useMemo } from 'react';
import {
  getPsychologicalTests,
  getTestResult,
  calculateNameTarotResult,
  getEnneagramTypes,
  getFriendEnergyRoles,
} from '../lib/kokolojiData';
import { useTranslations } from '@/hooks/useTranslations';

interface TestResult {
  testId: string;
  answers: string[];
  interpretation: string;
  result: any;
}

export default function KokolojiTest() {
  const { t } = useTranslations();
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [userName, setUserName] = useState<string>('');

  // i18n destekli test listesi - memoized for performance
  const psychologicalTests = useMemo(() => getPsychologicalTests(t), [t]);

  const selectedTest = psychologicalTests.find(test => test.id === currentTest);

  const startTest = (testId: string) => {
    setCurrentTest(testId);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < (selectedTest?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Test tamamlandı
      const result = getTestResult(selectedTest!.id, newAnswers);
      const interpretation = generateInterpretation(
        selectedTest!,
        newAnswers,
        result
      );

      const testResult: TestResult = {
        testId: selectedTest!.id,
        answers: newAnswers,
        interpretation,
        result,
      };

      setResults([...results, testResult]);
      setShowResults(true);
    }
  };

  const generateInterpretation = (
    test: any,
    userAnswers: string[],
    result: any
  ): string => {
    if (test.resultType === 'kokoloji') {
      let interpretation = '';
      userAnswers.forEach((answer, index) => {
        const question = test.questions[index];
        const answerData = question.answers.find(
          (a: any) => a.value === answer
        );
        if (answerData) {
          interpretation += `${question.text}: ${answerData.meaning}\n\n`;
        }
      });
      return interpretation;
    } else {
      // Diğer test türleri için özel yorumlar
      return `${result.description}\n\n${result.tips || result.careers || ''}`;
    }
  };

  const resetTest = () => {
    setCurrentTest(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setUserName('');
  };

  // İsim Enerjisi testi için özel handler
  const handleNameSubmit = () => {
    if (!userName.trim() || !selectedTest) {
      return;
    }

    const nameResult = calculateNameTarotResult(userName.trim(), t);

    const newResult: TestResult = {
      testId: selectedTest.id,
      answers: [userName.trim()],
      interpretation: `${nameResult.tarotCard.cardTurkish}: ${nameResult.tarotCard.message}`,
      result: nameResult,
    };

    setResults([...results, newResult]);
    setShowResults(true);
  };

  // Sosyal paylaşım fonksiyonu - Viral potansiyel için
  const shareResult = (platform: 'twitter' | 'whatsapp' | 'copy') => {
    if (!selectedTest) {
      return;
    }

    const lastResult = results[results.length - 1];
    if (!lastResult) {
      return;
    }

    let shareText = '';
    const url = window.location.href;

    // Test tipine göre paylaşım metni
    if (selectedTest.resultType === 'friend-energy') {
      shareText = `${lastResult.result.shareText}\n\n${t('psychTests.common.shareFriendEnergy')}`;
    } else if (selectedTest.id === 'storm-personality') {
      shareText = `${t('psychTests.tests.stormPersonality.shareText')} `;
    } else {
      shareText = `${selectedTest.title} ${t('psychTests.common.shareGeneric')}`;
    }

    const fullText = `${shareText}${url}`;

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}`,
          '_blank'
        );
        break;
      case 'whatsapp':
        window.open(
          `https://wa.me/?text=${encodeURIComponent(fullText)}`,
          '_blank'
        );
        break;
      case 'copy':
        navigator.clipboard.writeText(fullText);
        alert(t('psychTests.common.copySuccess'));
        break;
    }
  };

  if (!currentTest) {
    return (
      <div className='space-y-6'>
        <div className='text-center mb-8'>
          <h2 className='text-2xl font-bold text-white mb-2'>
            🧠 {t('psychTests.page.title')}
          </h2>
          <p className='text-gray-300'>{t('psychTests.page.subtitle')}</p>
        </div>

        <div className='grid grid-cols-1 gap-4'>
          {psychologicalTests.map(test => (
            <button
              key={test.id}
              onClick={() => startTest(test.id)}
              className='group relative overflow-hidden rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-white/20 text-left'
            >
              <div className='flex items-center gap-4'>
                <div className='flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center'>
                  <span className='text-2xl'>{test.icon}</span>
                </div>
                <div className='flex-1'>
                  <h3 className='text-lg font-semibold text-white mb-1'>
                    {test.title}
                  </h3>
                  <p className='text-gray-300 text-sm'>{test.description}</p>
                  <p className='text-purple-300 text-xs mt-1'>
                    {test.totalQuestions} {t('psychTests.common.questions')}
                  </p>
                </div>
                <div className='text-2xl opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all'>
                  →
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (showResults && selectedTest) {
    const lastResult = results[results.length - 1];

    if (!lastResult) {
      return null;
    }

    return (
      <div className='space-y-6'>
        <div className='text-center mb-6'>
          <h3 className='text-xl font-bold text-white mb-2'>
            {selectedTest.title} {t('psychTests.ui.results.title')}
          </h3>
          <p className='text-gray-300'>{t('psychTests.ui.results.detailedAnalysis')}</p>
        </div>

        <div className='backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-6'>
          {selectedTest.resultType === 'numerology-tarot' && (
            <div className='space-y-6'>
              {/* Mistik Tarot Kartı Sonuç */}
              <div className='relative text-center bg-gradient-to-br from-purple-900/60 via-indigo-900/40 to-purple-800/60 rounded-3xl p-8 border-2 border-purple-500/50 overflow-hidden'>
                {/* Mistik arka plan efektleri */}
                <div className='absolute top-0 left-0 w-full h-full opacity-10'>
                  <div className='absolute top-10 left-10 text-6xl'>✨</div>
                  <div className='absolute bottom-10 right-10 text-6xl'>🌙</div>
                  <div className='absolute top-1/2 left-1/4 text-4xl'>⭐</div>
                </div>

                <div className='relative z-10'>
                  <div className='text-8xl mb-4 animate-pulse'>
                    {lastResult.result.tarotCard.emoji}
                  </div>
                  <h4 className='text-3xl font-bold text-white mb-2'>
                    {lastResult.result.tarotCard.cardTurkish}
                  </h4>
                  <p className='text-sm text-purple-300 mb-1'>
                    {lastResult.result.tarotCard.card}
                  </p>
                  <p className='text-lg text-purple-200 mb-4 italic font-serif'>
                    &quot;{lastResult.result.tarotCard.message}&quot;
                  </p>

                  {/* Numeroloji Bilgisi */}
                  <div className='flex gap-3 justify-center mb-4'>
                    <div className='bg-purple-500/30 rounded-full px-5 py-2 border border-purple-500/50'>
                      <span className='text-sm text-purple-100'>
                        📊 İsim Değeri: {lastResult.result.total}
                      </span>
                    </div>
                    <div className='bg-pink-500/30 rounded-full px-5 py-2 border border-pink-500/50'>
                      <span className='text-sm text-pink-100'>
                        🔢 Nihai Sayı: {lastResult.result.finalNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kart Teması */}
              <div className='bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/30'>
                <h5 className='text-lg font-bold text-white mb-3'>
                  🎭 {lastResult.result.tarotCard.theme}
                </h5>
                <p className='text-gray-200 leading-relaxed'>
                  {lastResult.result.tarotCard.description}
                </p>
              </div>

              {/* Anahtar Kelimeler */}
              <div className='bg-white/5 rounded-xl p-6 border border-white/10'>
                <h5 className='text-lg font-bold text-white mb-4'>
                  🔑 {t('psychTests.tests.nameTarot.keywordsTitle')}
                </h5>
                <div className='flex flex-wrap gap-2'>
                  {lastResult.result.tarotCard.keyWords.map(
                    (keyword: string, index: number) => (
                      <span
                        key={index}
                        className='px-4 py-2 bg-purple-500/20 rounded-full text-sm text-purple-200 border border-purple-500/30'
                      >
                        {keyword}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Tavsiye */}
              <div className='bg-green-500/10 rounded-xl p-6 border border-green-500/30'>
                <h5 className='text-lg font-bold text-white mb-3'>
                  💡 {t('psychTests.tests.nameTarot.adviceTitle')}
                </h5>
                <p className='text-gray-200 leading-relaxed'>
                  {lastResult.result.tarotCard.advice}
                </p>
              </div>

              {/* Astrolojik & Element Bilgisi */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/30'>
                  <h6 className='text-sm font-bold text-white mb-2'>
                    🪐 {t('psychTests.tests.nameTarot.astrologyTitle')}
                  </h6>
                  <p className='text-sm text-yellow-200'>
                    {lastResult.result.tarotCard.astrology}
                  </p>
                </div>
                <div className='bg-blue-500/10 rounded-xl p-4 border border-blue-500/30'>
                  <h6 className='text-sm font-bold text-white mb-2'>
                    🌊 {t('psychTests.tests.nameTarot.elementTitle')}
                  </h6>
                  <p className='text-sm text-blue-200'>
                    {lastResult.result.tarotCard.element}
                  </p>
                </div>
              </div>

              {/* Numeroloji Hesaplama Detayı */}
              <div className='bg-indigo-500/10 rounded-xl p-6 border border-indigo-500/30'>
                <h5 className='text-lg font-bold text-white mb-3'>
                  🧮 {t('psychTests.tests.nameTarot.numerologyTitle')}
                </h5>
                <p className='text-sm text-indigo-200 mb-3'>
                  <strong>İsmin:</strong> {lastResult.result.name}
                </p>
                <p className='text-sm text-indigo-200 mb-3'>
                  <strong>Hesaplama:</strong>{' '}
                  {lastResult.result.reductionSteps.join(' → ')}
                </p>
                <p className='text-xs text-indigo-300 mt-4'>
                  <strong>Pythagoras Numerolojisi:</strong> Her harf belirli bir
                  sayısal titreşim taşır. İsminin harflerinin toplamı, senin
                  numerolojik enerjini oluşturur.
                </p>
              </div>
            </div>
          )}

          {selectedTest.resultType === 'mbti' && (
            <div className='text-center mb-6'>
              <div className='text-4xl mb-2'>🧠</div>
              <h4 className='text-2xl font-bold text-white mb-2'>
                {lastResult.result.type}
              </h4>
              <h5 className='text-lg font-semibold text-purple-300 mb-2'>
                {lastResult.result.title}
              </h5>
              <p className='text-gray-300 mb-4'>
                {lastResult.result.description}
              </p>
              <div className='bg-white/5 rounded-lg p-4'>
                <p className='text-sm text-gray-300'>
                  <strong>Özellikler:</strong> {lastResult.result.traits}
                </p>
                <p className='text-sm text-gray-300 mt-2'>
                  <strong>Uygun Kariyerler:</strong> {lastResult.result.career}
                </p>
              </div>
            </div>
          )}

          {selectedTest.resultType === 'big-five' && (
            <div className='space-y-6'>
              <div className='text-center mb-6'>
                <div className='text-4xl mb-2'>🌊</div>
                <h4 className='text-2xl font-bold text-white mb-2'>
                  Big Five Kişilik Profili
                </h4>
                <p className='text-gray-300 mb-4'>
                  5 temel kişilik boyutunuzun analizi
                </p>
              </div>

              {/* Her boyut için kart */}
              {Object.entries(lastResult.result).map(
                ([key, value]: [string, any]) => {
                  const dimensionNames: Record<string, string> = {
                    openness: 'Açıklık',
                    conscientiousness: 'Sorumluluk',
                    extraversion: 'Dışa Dönüklük',
                    agreeableness: 'Uyumluluk',
                    neuroticism: 'Duygusal Denge',
                  };

                  return (
                    <div
                      key={key}
                      className='bg-white/5 rounded-lg p-6 border border-white/10'
                    >
                      <div className='flex items-center justify-between mb-4'>
                        <div>
                          <div className='text-xs text-purple-300 mb-1'>
                            {dimensionNames[key]}
                          </div>
                          <h5 className='text-lg font-bold text-white'>
                            {value.title}
                          </h5>
                        </div>
                        <div className='text-2xl font-bold text-purple-300'>
                          {value.score}/25
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className='w-full bg-white/10 rounded-full h-3 mb-4'>
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            value.level === 'high'
                              ? 'bg-green-500'
                              : value.level === 'medium'
                                ? 'bg-yellow-500'
                                : 'bg-blue-500'
                          }`}
                          style={{ width: `${(value.score / 25) * 100}%` }}
                        />
                      </div>

                      <p className='text-gray-300 mb-2'>{value.description}</p>
                      <p className='text-sm text-purple-200'>
                        <strong>Özellikler:</strong> {value.traits}
                      </p>
                      {value.tips && (
                        <p className='text-sm text-yellow-200 mt-2'>
                          <strong>💡 İpucu:</strong> {value.tips}
                        </p>
                      )}
                    </div>
                  );
                }
              )}

              {/* Kişiselleştirilmiş İpuçları */}
              {lastResult.result.personalizedTips && (
                <div className='mt-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-purple-500/30'>
                  <h5 className='text-lg font-bold text-white mb-3 flex items-center gap-2'>
                    💡 Kişiselleştirilmiş İpuçları
                  </h5>
                  <p className='text-gray-200 leading-relaxed whitespace-pre-line'>
                    {lastResult.result.personalizedTips}
                  </p>
                </div>
              )}
            </div>
          )}

          {selectedTest.resultType === 'enneagram' && (
            <div className='space-y-6'>
              <div className='text-center mb-6'>
                <div className='text-4xl mb-2'>⭐</div>
                <h4 className='text-3xl font-bold text-white mb-2'>
                  {lastResult.result.name}
                </h4>
                <p className='text-lg text-purple-300 mb-4'>
                  {lastResult.result.subtitle}
                </p>
                <p className='text-gray-300 leading-relaxed'>
                  {lastResult.result.description}
                </p>
              </div>

              {/* Motivasyon ve Korkular */}
              <div className='grid md:grid-cols-2 gap-4'>
                <div className='bg-green-500/10 rounded-lg p-4 border border-green-500/30'>
                  <h5 className='text-sm font-bold text-green-300 mb-2'>
                    🎯 Temel Motivasyon
                  </h5>
                  <p className='text-gray-200 text-sm'>
                    {lastResult.result.coreMotivation}
                  </p>
                </div>
                <div className='bg-red-500/10 rounded-lg p-4 border border-red-500/30'>
                  <h5 className='text-sm font-bold text-red-300 mb-2'>
                    ⚠️ Temel Korku
                  </h5>
                  <p className='text-gray-200 text-sm'>
                    {lastResult.result.coreFear}
                  </p>
                </div>
              </div>

              {/* Işık Yönleri */}
              <div className='bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/30'>
                <h5 className='text-xl font-bold text-white mb-3 flex items-center gap-2'>
                  ☀️ {lastResult.result.lightSide.title}
                </h5>
                <p className='text-gray-200 mb-3 leading-relaxed'>
                  {lastResult.result.lightSide.description}
                </p>
                <div className='bg-white/5 rounded-lg p-4'>
                  <p className='text-sm text-yellow-200'>
                    <strong>Özellikler:</strong>{' '}
                    {lastResult.result.lightSide.traits}
                  </p>
                </div>
              </div>

              {/* Gölge Yönleri */}
              <div className='bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/30'>
                <h5 className='text-xl font-bold text-white mb-3 flex items-center gap-2'>
                  🌑 {lastResult.result.shadowSide.title}
                </h5>
                <p className='text-gray-200 mb-3 leading-relaxed'>
                  {lastResult.result.shadowSide.description}
                </p>
                <div className='bg-white/5 rounded-lg p-4'>
                  <p className='text-sm text-indigo-200'>
                    <strong>Gelişim Alanları:</strong>{' '}
                    {lastResult.result.shadowSide.traits}
                  </p>
                </div>
              </div>

              {/* Wing bilgisi varsa göster */}
              {lastResult.result.wingType && (() => {
                const enneagramTypes = getEnneagramTypes(t);
                return (
                  <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
                    <p className='text-sm text-purple-300'>
                      <strong>💫 {t('psychTests.results.enneagram.wing')}:</strong>{' '}
                      {enneagramTypes[
                        lastResult.result.wingType as keyof typeof enneagramTypes
                      ]?.title || t('psychTests.common.unknown')}
                    </p>
                  </div>
                );
              })()}

              {/* E-E-A-T: Kaynak ve Güvenilirlik */}
              <div className='bg-blue-500/10 rounded-lg p-4 border border-blue-500/30'>
                <p className='text-xs text-blue-200'>
                  <strong>📚 {t('psychTests.results.enneagram.scientificSource')}:</strong> {t('psychTests.results.enneagram.scientificNote')}
                </p>
              </div>
            </div>
          )}

          {selectedTest.resultType === 'friend-energy' && (
            <div className='space-y-6'>
              {/* Viral-Friendly Result Card */}
              <div className='text-center mb-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border-2 border-purple-500/50'>
                <div className='text-6xl mb-4'>{lastResult.result.emoji}</div>
                <h4 className='text-3xl font-bold text-white mb-2'>
                  {lastResult.result.name}
                </h4>
                <p className='text-xl text-purple-300 mb-4 italic'>
                  &quot;{lastResult.result.tagline}&quot;
                </p>
                <p className='text-gray-200 leading-relaxed mb-4'>
                  {lastResult.result.description}
                </p>
                <div className='inline-block bg-white/10 rounded-full px-6 py-2 border border-white/20'>
                  <span className='text-sm text-purple-200'>
                    🎭 {lastResult.result.socialRole}
                  </span>
                </div>
              </div>

              {/* Güçlü Yönler */}
              <div className='bg-white/5 rounded-xl p-6 border border-white/10'>
                <h5 className='text-lg font-bold text-white mb-4 flex items-center gap-2'>
                  ✨ Süper Güçlerin
                </h5>
                <div className='grid grid-cols-2 gap-3'>
                  {lastResult.result.strengths.map(
                    (strength: string, index: number) => (
                      <div
                        key={index}
                        className='bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-3 border border-green-500/30'
                      >
                        <span className='text-sm text-green-200'>
                          ✓ {strength}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Fun Facts - Viral Element */}
              <div className='bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/30'>
                <h5 className='text-lg font-bold text-white mb-4 flex items-center gap-2'>
                  🎉 Eğlenceli Gerçekler
                </h5>
                <div className='space-y-3'>
                  {lastResult.result.funFacts.map(
                    (fact: string, index: number) => (
                      <div key={index} className='flex items-start gap-3'>
                        <span className='text-lg'>{fact.split(' ')[0]}</span>
                        <p className='text-gray-200 text-sm flex-1'>
                          {fact.substring(fact.indexOf(' ') + 1)}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* İkincil Enerji */}
              {lastResult.result.secondaryRole && (() => {
                const friendEnergyRoles = getFriendEnergyRoles(t);
                const secondaryRole = friendEnergyRoles[
                  lastResult.result.secondaryRole as keyof typeof friendEnergyRoles
                ];
                return secondaryRole ? (
                  <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
                    <p className='text-sm text-purple-300'>
                      <strong>💫 {t('psychTests.ui.results.friendEnergy.secondaryEnergy')}:</strong>{' '}
                      {secondaryRole.title} {secondaryRole.emoji}
                    </p>
                  </div>
                ) : null;
              })()}

              {/* Sosyal Paylaşım Butonları - Viral Element */}
              <div className='bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-6 border border-pink-500/30'>
                <h5 className='text-lg font-bold text-white mb-4 text-center'>
                  📱 {t('psychTests.ui.results.friendEnergy.shareTitle')}
                </h5>
                <div className='flex flex-wrap gap-3 justify-center'>
                  <button
                    onClick={() => shareResult('twitter')}
                    className='flex items-center gap-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-6 py-3 rounded-full font-medium transition-all hover:scale-105'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' />
                    </svg>
                    Twitter
                  </button>
                  <button
                    onClick={() => shareResult('whatsapp')}
                    className='flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3 rounded-full font-medium transition-all hover:scale-105'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' />
                    </svg>
                    WhatsApp
                  </button>
                  <button
                    onClick={() => shareResult('copy')}
                    className='flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium transition-all hover:scale-105'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                      />
                    </svg>
                    Kopyala
                  </button>
                </div>
                <p className='text-xs text-center text-white/50 mt-4'>
                  Arkadaşların da keşfetsin! 🎊
                </p>
              </div>
            </div>
          )}

          {selectedTest.resultType === 'love-vibration' && (
            <div className='space-y-6'>
              {/* Mistik Result Card - Astroloji Temalı */}
              <div className='relative text-center mb-6 bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-indigo-900/40 rounded-3xl p-8 border-2 border-purple-500/50 overflow-hidden'>
                {/* Yıldız efektleri */}
                <div className='absolute top-4 left-4 text-yellow-300 opacity-50 animate-pulse'>
                  ✨
                </div>
                <div className='absolute top-8 right-8 text-purple-300 opacity-50 animate-pulse'>
                  ⭐
                </div>
                <div className='absolute bottom-6 left-12 text-pink-300 opacity-50 animate-pulse'>
                  💫
                </div>

                <div className='relative z-10'>
                  <div className='text-7xl mb-4'>{lastResult.result.emoji}</div>
                  <h4 className='text-3xl font-bold text-white mb-2'>
                    {lastResult.result.name}
                  </h4>
                  <p className='text-xl text-purple-300 mb-4 italic font-serif'>
                    &quot;{lastResult.result.tagline}&quot;
                  </p>
                  <p className='text-gray-200 leading-relaxed mb-6 max-w-xl mx-auto'>
                    {lastResult.result.description}
                  </p>

                  {/* Gezegen ve Element Bilgisi */}
                  <div className='flex gap-3 justify-center flex-wrap mb-4'>
                    <div className='bg-purple-500/20 rounded-full px-5 py-2 border border-purple-500/40'>
                      <span className='text-sm text-purple-200'>
                        🪐 {lastResult.result.planet}
                      </span>
                    </div>
                    <div className='bg-pink-500/20 rounded-full px-5 py-2 border border-pink-500/40'>
                      <span className='text-sm text-pink-200'>
                        🔮 {lastResult.result.element}
                      </span>
                    </div>
                  </div>

                  {/* Tarot Kartı */}
                  <div className='bg-white/5 rounded-lg px-4 py-2 inline-block'>
                    <span className='text-sm text-yellow-200'>
                      🃏 Tarot: {lastResult.result.tarotCard}
                    </span>
                  </div>
                </div>
              </div>

              {/* Aşk Stili */}
              <div className='bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl p-6 border border-pink-500/30'>
                <h5 className='text-lg font-bold text-white mb-3 flex items-center gap-2'>
                  💕 Aşk Stilin
                </h5>
                <p className='text-gray-200'>{lastResult.result.loveStyle}</p>
              </div>

              {/* Güçlü Yönler */}
              <div className='bg-white/5 rounded-xl p-6 border border-white/10'>
                <h5 className='text-lg font-bold text-white mb-4 flex items-center gap-2'>
                  ✨ Aşk Süper Güçlerin
                </h5>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {lastResult.result.strengths.map(
                    (strength: string, index: number) => (
                      <div
                        key={index}
                        className='bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-3 border border-purple-500/20'
                      >
                        <span className='text-sm text-purple-200'>
                          {strength}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Gezegen Enerjileri Grafiği */}
              <div className='bg-white/5 rounded-xl p-6 border border-white/10'>
                <h5 className='text-lg font-bold text-white mb-4'>
                  🌌 Gezegen Enerjilerin
                </h5>
                <div className='space-y-3'>
                  {Object.entries(lastResult.result.counts).map(
                    ([planet, _count]: [string, any]) => {
                      const planetNames: Record<string, string> = {
                        venus: 'Venüs (Romantizm)',
                        mars: 'Mars (Tutku)',
                        mercury: 'Merkür (İletişim)',
                        moon: 'Ay (Sezgi)',
                      };
                      const planetEmojis: Record<string, string> = {
                        venus: '💕',
                        mars: '🔥',
                        mercury: '💬',
                        moon: '🌙',
                      };

                      return (
                        <div key={planet}>
                          <div className='flex items-center justify-between mb-2'>
                            <span className='text-sm text-gray-300'>
                              {planetEmojis[planet]} {planetNames[planet]}
                            </span>
                            <span className='text-sm font-bold text-purple-300'>
                              {lastResult.result.percentages[planet]}%
                            </span>
                          </div>
                          <div className='w-full bg-white/10 rounded-full h-2'>
                            <div
                              className='bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500'
                              style={{
                                width: `${lastResult.result.percentages[planet]}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Uyumluluk */}
              <div className='bg-green-500/10 rounded-xl p-6 border border-green-500/30'>
                <h5 className='text-lg font-bold text-white mb-3'>
                  💚 Uyumluluk
                </h5>
                <p className='text-gray-200 text-sm'>
                  {lastResult.result.compatibility}
                </p>
              </div>

              {/* Astrolojik İçgörü - E-E-A-T */}
              <div className='bg-indigo-500/10 rounded-xl p-6 border border-indigo-500/30'>
                <h5 className='text-lg font-bold text-white mb-3 flex items-center gap-2'>
                  🔮 Astrolojik İçgörü
                </h5>
                <p className='text-gray-200 text-sm leading-relaxed'>
                  {lastResult.result.astrologicalInsight}
                </p>
                <p className='text-xs text-indigo-300 mt-4'>
                  <strong>📚 Kaynak:</strong> Klasik astroloji ve tarot
                  literatürü. Gezegen enerjileri, geleneksel astrolojideki
                  anlamlarına dayanmaktadır.
                </p>
              </div>
            </div>
          )}

          {selectedTest.resultType === 'stress' && (
            <div className='space-y-6'>
              {/* Stres Seviyesi Result Card */}
              <div
                className={`relative text-center mb-6 rounded-3xl p-8 border-2 overflow-hidden ${
                  lastResult.result.totalScore >= 46
                    ? 'bg-gradient-to-br from-red-900/50 via-orange-900/40 to-red-800/50 border-red-500/50'
                    : lastResult.result.totalScore >= 31
                      ? 'bg-gradient-to-br from-orange-900/40 via-yellow-900/30 to-orange-800/40 border-orange-500/50'
                      : lastResult.result.totalScore >= 16
                        ? 'bg-gradient-to-br from-yellow-900/30 via-amber-900/20 to-yellow-800/30 border-yellow-500/50'
                        : 'bg-gradient-to-br from-green-900/30 via-emerald-900/20 to-green-800/30 border-green-500/50'
                }`}
              >
                <div className='relative z-10'>
                  <div className='text-7xl mb-4'>{lastResult.result.emoji}</div>
                  <h4 className='text-3xl font-bold text-white mb-2'>
                    {lastResult.result.level}
                  </h4>
                  <p className='text-lg text-gray-200 mb-2'>
                    Puan: {lastResult.result.totalScore} /{' '}
                    {lastResult.result.maxScore} ({lastResult.result.percentage}
                    %)
                  </p>
                  <p className='text-sm text-gray-300 mb-4'>
                    Skor Aralığı: {lastResult.result.scoreRange}
                  </p>
                  <p className='text-gray-100 leading-relaxed mb-4 max-w-xl mx-auto'>
                    {lastResult.result.description}
                  </p>
                  <p className='text-lg font-semibold text-white italic'>
                    {lastResult.result.message}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className='bg-white/5 rounded-xl p-6 border border-white/10'>
                <h5 className='text-lg font-bold text-white mb-4'>
                  📊 Stres Seviyesi Görselleştirme
                </h5>
                <div className='w-full bg-white/10 rounded-full h-6 mb-2 relative overflow-hidden'>
                  <div
                    className={`h-6 rounded-full transition-all duration-500 ${
                      lastResult.result.totalScore >= 46
                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                        : lastResult.result.totalScore >= 31
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                          : lastResult.result.totalScore >= 16
                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                            : 'bg-gradient-to-r from-green-500 to-green-600'
                    }`}
                    style={{
                      width: `${lastResult.result.percentage}%`,
                    }}
                  />
                </div>
                <div className='flex justify-between text-xs text-gray-400 mt-2'>
                  <span>Düşük (0-15)</span>
                  <span>Orta (16-30)</span>
                  <span>Yüksek (31-45)</span>
                  <span>Çok Yüksek (46-60)</span>
                </div>
              </div>

              {/* Meditasyon Önerileri */}
              <div className='bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl p-6 border border-purple-500/30'>
                <h5 className='text-lg font-bold text-white mb-4 flex items-center gap-2'>
                  🧘‍♀️ Kişiselleştirilmiş Meditasyon Önerileri
                </h5>
                <div className='space-y-3'>
                  {lastResult.result.meditationTips.map(
                    (tip: string, index: number) => (
                      <div
                        key={index}
                        className='bg-white/5 rounded-lg p-4 border border-white/10'
                      >
                        <p className='text-gray-200 text-sm leading-relaxed'>
                          {tip}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Wellness Önerileri */}
              <div className='bg-green-500/10 rounded-xl p-6 border border-green-500/30'>
                <h5 className='text-lg font-bold text-white mb-3'>
                  💚 Genel Sağlık Önerileri
                </h5>
                <p className='text-gray-200 text-sm leading-relaxed'>
                  {lastResult.result.wellnessAdvice}
                </p>
              </div>

              {/* Acil Durum Uyarısı (Yüksek stres için) */}
              {lastResult.result.urgentNote && (
                <div className='bg-red-500/20 rounded-xl p-6 border-2 border-red-500/50'>
                  <p className='text-red-200 text-sm leading-relaxed font-semibold'>
                    {lastResult.result.urgentNote}
                  </p>
                </div>
              )}

              {/* E-E-A-T Bilgi Notu */}
              <div className='bg-blue-500/10 rounded-xl p-6 border border-blue-500/30'>
                <h5 className='text-lg font-bold text-white mb-3 flex items-center gap-2'>
                  📚 {t('psychTests.ui.results.stress.scientificInfo')}
                </h5>
                <p className='text-gray-200 text-sm leading-relaxed mb-3'>
                  {t('psychTests.ui.results.stress.scientificNote')}
                </p>
                <p className='text-xs text-blue-300'>
                  {t('psychTests.ui.results.stress.source')}
                </p>
                <p className='text-xs text-gray-400 mt-3'>
                  {t('psychTests.ui.results.stress.disclaimer')}
                </p>
              </div>
            </div>
          )}

          {selectedTest.resultType === 'kokoloji' && (
            <div className='space-y-6'>
              {/* Kokoloji Hikaye Başlığı */}
              {selectedTest.id === 'storm-personality' && (
                <div className='text-center mb-6 bg-gradient-to-br from-blue-900/40 via-cyan-900/30 to-blue-800/40 rounded-3xl p-8 border-2 border-blue-500/50'>
                  <div className='text-6xl mb-4 animate-pulse'>🌊</div>
                  <h4 className='text-2xl font-bold text-white mb-3'>
                    {t('psychTests.tests.stormPersonality.resultTitle')}
                  </h4>
                  <p className='text-cyan-200 italic font-serif'>
                    &quot;{t('psychTests.tests.stormPersonality.quote')}&quot;
                  </p>
                </div>
              )}

              {/* Kokoloji Sonuçları */}
              <div className='bg-white/5 rounded-xl p-6 border border-white/10'>
                <div className='whitespace-pre-line text-gray-200 leading-relaxed'>
                  {lastResult.interpretation}
                </div>
              </div>

              {/* Deniz Fırtınası için özel yansıma bölümü */}
              {selectedTest.id === 'storm-personality' && (
                <>
                  <div className='bg-indigo-500/10 rounded-xl p-6 border border-indigo-500/30'>
                    <h5 className='text-lg font-bold text-white mb-3'>
                      🧭{' '}
                      {t('psychTests.tests.stormPersonality.reflectionTitle')}
                    </h5>
                    <p className='text-gray-200 text-sm leading-relaxed mb-4'>
                      {t('psychTests.tests.stormPersonality.reflection')}
                    </p>
                    <p className='text-indigo-200 text-xs'>
                      💡 {t('psychTests.tests.stormPersonality.archetypeNote')}
                    </p>
                  </div>

                  {/* Sosyal Paylaşım - Viral Hint */}
                  <div className='bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/30'>
                    <h5 className='text-lg font-bold text-white mb-3 flex items-center gap-2'>
                      🌊 {t('psychTests.tests.stormPersonality.shareTitle')}
                    </h5>
                    <p className='text-sm text-cyan-200 mb-4'>
                      {t('psychTests.tests.stormPersonality.shareDescription')}
                    </p>
                    <div className='flex gap-3 flex-wrap'>
                      <button
                        onClick={() => shareResult('twitter')}
                        className='flex-1 min-w-[120px] bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 py-2 px-4 rounded-lg border border-sky-500/30 transition-all'
                      >
                        🐦 Twitter
                      </button>
                      <button
                        onClick={() => shareResult('whatsapp')}
                        className='flex-1 min-w-[120px] bg-green-500/20 hover:bg-green-500/30 text-green-200 py-2 px-4 rounded-lg border border-green-500/30 transition-all'
                      >
                        💬 WhatsApp
                      </button>
                      <button
                        onClick={() => shareResult('copy')}
                        className='flex-1 min-w-[120px] bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 py-2 px-4 rounded-lg border border-purple-500/30 transition-all'
                      >
                        📋 Kopyala
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Genel kokoloji testleri için paylaşım */}
              {selectedTest.id !== 'storm-personality' && (
                <div className='bg-purple-500/10 rounded-xl p-4 border border-purple-500/30 text-center'>
                  <p className='text-sm text-purple-200'>
                    💡 {t('psychTests.tests.stormPersonality.shareHint')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className='flex gap-3'>
          <button
            onClick={resetTest}
            className='flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium transition-all hover:scale-105'
          >
            {t('psychTests.common.newTest')}
          </button>
          <button
            onClick={() => setShowResults(false)}
            className='flex-1 bg-white/10 text-white py-3 px-6 rounded-xl font-medium border border-white/20 transition-all hover:bg-white/20'
          >
            {t('psychTests.common.testHistory')}
          </button>
        </div>
      </div>
    );
  }

  // İsim Enerjisi Testi - Özel İsim Input Ekranı
  if (selectedTest && selectedTest.id === 'name-tarot' && !showResults) {
    return (
      <div className='space-y-6'>
        {/* Mistik Header */}
        <div className='text-center mb-8'>
          <div className='text-6xl mb-4 animate-pulse'>🔮</div>
          <h3 className='text-3xl font-bold text-white mb-3'>
            {selectedTest.title}
          </h3>
          <p className='text-gray-300 max-w-2xl mx-auto'>
            {selectedTest.description}
          </p>
        </div>

        {/* İsim Input Card */}
        <div className='backdrop-blur-xl bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-purple-800/40 border-2 border-purple-500/50 rounded-3xl p-8 max-w-xl mx-auto'>
          <div className='text-center mb-6'>
            <h4 className='text-2xl font-bold text-white mb-2'>
              {t('psychTests.tests.nameTarot.inputTitle')}
            </h4>
            <p className='text-purple-200 text-sm'>
              {t('psychTests.tests.nameTarot.inputSubtitle')}
            </p>
          </div>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-purple-200 mb-2'>
                {t('psychTests.tests.nameTarot.inputLabel')}
              </label>
              <input
                type='text'
                value={userName}
                onChange={e => setUserName(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleNameSubmit()}
                placeholder={t('psychTests.tests.nameTarot.inputPlaceholder')}
                className='w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                autoFocus
              />
            </div>

            <button
              onClick={handleNameSubmit}
              disabled={!userName.trim()}
              className='w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed'
            >
              {t('psychTests.tests.nameTarot.inputButton')}
            </button>
          </div>

          <div className='mt-6 p-4 bg-indigo-500/20 rounded-lg border border-indigo-500/30'>
            <p
              className='text-xs text-indigo-200 text-center'
              dangerouslySetInnerHTML={{
                __html: t('psychTests.tests.nameTarot.inputHint'),
              }}
            />
          </div>
        </div>

        {/* Geri Butonu */}
        <div className='text-center'>
          <button
            onClick={resetTest}
            className='text-gray-400 hover:text-white transition-colors'
          >
            {t('psychTests.ui.buttons.backToTests')}
          </button>
        </div>
      </div>
    );
  }

  if (selectedTest && currentQuestion < selectedTest.questions.length) {
    const question = selectedTest.questions[currentQuestion];

    if (!question) {
      return null;
    }

    return (
      <div className='space-y-6'>
        <div className='text-center mb-6'>
          <h3 className='text-xl font-bold text-white mb-2'>
            {selectedTest.title}
          </h3>
          <div className='w-full bg-white/10 rounded-full h-2'>
            <div
              className='bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300'
              style={{
                width: `${((currentQuestion + 1) / selectedTest.questions.length) * 100}%`,
              }}
            />
          </div>
          <p className='text-gray-300 text-sm mt-2'>
            {t('psychTests.common.questionProgress')} {currentQuestion + 1} / {selectedTest.questions.length}
          </p>
        </div>

        <div className='backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-6'>
          <h4 className='text-lg font-semibold text-white mb-6'>
            {question.text}
          </h4>

          <div className='space-y-3'>
            {question.answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(answer.value)}
                className='w-full text-left p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/15 transition-all duration-200 group'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium'>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className='text-gray-200 group-hover:text-white transition-colors'>
                    {answer.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={resetTest}
          className='w-full bg-white/10 text-white py-3 px-6 rounded-xl font-medium border border-white/20 transition-all hover:bg-white/20'
        >
          {t('psychTests.common.cancelTest')}
        </button>
      </div>
    );
  }

  return null;
}
