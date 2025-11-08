'use client';

import { useState, useEffect } from 'react';
import { getFingerprint } from '@/lib/fingerprint';

interface PageReactionsProps {
  pageId: string;
  locale: 'tr' | 'en' | 'sr';
  title?: string;
}

interface Reaction {
  emoji: string;
  label: { tr: string; en: string; sr: string };
  count: number;
}

const REACTIONS: Reaction[] = [
  {
    emoji: '😍',
    label: { tr: 'Harika', en: 'Amazing', sr: 'Neverovatno' },
    count: 0,
  },
  {
    emoji: '👍',
    label: { tr: 'Faydalı', en: 'Helpful', sr: 'Korisno' },
    count: 0,
  },
  {
    emoji: '🤔',
    label: { tr: 'İlginç', en: 'Interesting', sr: 'Zanimljivo' },
    count: 0,
  },
  {
    emoji: '⭐',
    label: { tr: 'Mükemmel', en: 'Perfect', sr: 'Savršeno' },
    count: 0,
  },
  {
    emoji: '🎯',
    label: {
      tr: 'Tam İstediğim',
      en: 'Exactly What I Needed',
      sr: 'Tačno Ono Što Mi Treba',
    },
    count: 0,
  },
];

export function PageReactions({ pageId, locale, title }: PageReactionsProps) {
  const [reactions, setReactions] = useState<Reaction[]>(REACTIONS);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [animatingEmoji, setAnimatingEmoji] = useState<string | null>(null);
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  // Get fingerprint on mount
  useEffect(() => {
    getFingerprint().then(fp => {
      setFingerprint(fp);
    });
  }, []);

  // Load reactions from API
  useEffect(() => {
    if (!fingerprint) {
      return;
    }

    const loadReactions = async () => {
      try {
        const response = await fetch(
          `/api/engagement/pages/${pageId}/reactions?fingerprint=${fingerprint}`
        );
        const result = await response.json();

        if (result.success) {
          // Update reactions with counts from API
          const updatedReactions = REACTIONS.map(r => {
            const apiReaction = result.data.reactions.find(
              (ar: any) => ar.emoji === r.emoji
            );
            return { ...r, count: apiReaction?.count || 0 };
          });
          setReactions(updatedReactions);
          setUserReaction(result.data.userReaction);
        }
      } catch (error) {
        console.error('Error loading page reactions:', error);
      }
    };

    loadReactions();
  }, [pageId, fingerprint]);

  const handleReaction = async (emoji: string) => {
    if (!fingerprint) {
      return;
    }

    // Optimistic update
    const isRemoving = userReaction === emoji;
    const previousReactions = [...reactions];
    const previousUserReaction = userReaction;

    // Update UI immediately
    if (isRemoving) {
      const updatedReactions = reactions.map(r =>
        r.emoji === emoji ? { ...r, count: Math.max(0, r.count - 1) } : r
      );
      setReactions(updatedReactions);
      setUserReaction(null);
    } else {
      let updatedReactions = reactions;
      if (userReaction) {
        updatedReactions = reactions.map(r =>
          r.emoji === userReaction
            ? { ...r, count: Math.max(0, r.count - 1) }
            : r
        );
      }
      updatedReactions = updatedReactions.map(r =>
        r.emoji === emoji ? { ...r, count: r.count + 1 } : r
      );
      setReactions(updatedReactions);
      setUserReaction(emoji);
    }

    // Animate
    setAnimatingEmoji(emoji);
    setTimeout(() => setAnimatingEmoji(null), 600);

    // Send to API
    try {
      const response = await fetch(
        `/api/engagement/pages/${pageId}/reactions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emoji, fingerprint }),
        }
      );

      const result = await response.json();

      if (!result.success) {
        // Revert on error
        setReactions(previousReactions);
        setUserReaction(previousUserReaction);
        console.error('Failed to update page reaction:', result.error);
      }
    } catch (error) {
      // Revert on error
      setReactions(previousReactions);
      setUserReaction(previousUserReaction);
      console.error('Error updating page reaction:', error);
    }

    // Track event
    console.log(`📊 [Page Reaction] ${pageId} - ${emoji}`);
  };

  const getDefaultTitle = () => {
    if (locale === 'tr') {
      return 'Bu sayfayı nasıl buldunuz?';
    }
    if (locale === 'en') {
      return 'How did you find this page?';
    }
    return 'Kako ste pronašli ovu stranicu?';
  };

  const getThanksMessage = () => {
    if (locale === 'tr') {
      return 'Geri bildiriminiz için teşekkürler!';
    }
    if (locale === 'en') {
      return 'Thanks for your feedback!';
    }
    return 'Hvala na povratnim informacijama!';
  };

  const displayTitle = title || getDefaultTitle();

  return (
    <div className='bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-purple-200'>
      {/* Header */}
      <div className='text-center mb-8'>
        <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4'>
          <span className='text-3xl'>💭</span>
        </div>
        <h3 className='text-2xl font-bold text-gray-900 mb-2'>
          {displayTitle}
        </h3>
        {userReaction && (
          <p className='text-sm text-purple-600 font-medium animate-fade-in flex items-center justify-center gap-2'>
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
            {getThanksMessage()}
          </p>
        )}
      </div>

      {/* Reactions */}
      <div className='flex flex-wrap justify-center gap-4'>
        {reactions.map(reaction => {
          const isSelected = userReaction === reaction.emoji;
          const isAnimating = animatingEmoji === reaction.emoji;

          return (
            <button
              key={reaction.emoji}
              onClick={() => handleReaction(reaction.emoji)}
              className={`group relative flex flex-col items-center gap-2 px-6 py-4 rounded-xl transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-xl scale-110'
                  : 'bg-white text-gray-700 hover:bg-gradient-to-br hover:from-purple-100 hover:to-pink-100 hover:scale-105 shadow-md hover:shadow-xl'
              } ${isAnimating ? 'animate-bounce' : ''}`}
              aria-label={`${reaction.label[locale]} reaction`}
              title={reaction.label[locale]}
            >
              {/* Emoji */}
              <span
                className={`text-4xl transition-transform duration-200 ${
                  isSelected ? 'scale-125' : 'group-hover:scale-110'
                }`}
              >
                {reaction.emoji}
              </span>

              {/* Label */}
              <span
                className={`text-xs font-semibold whitespace-nowrap ${isSelected ? 'text-white' : 'text-gray-700'}`}
              >
                {reaction.label[locale]}
              </span>

              {/* Count Badge */}
              {reaction.count > 0 && (
                <span
                  className={`absolute -top-2 -right-2 min-w-[28px] h-7 flex items-center justify-center px-2 rounded-full text-xs font-bold shadow-lg ${
                    isSelected
                      ? 'bg-yellow-400 text-gray-900'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  }`}
                >
                  {reaction.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Info Text */}
      <p className='text-xs text-center text-gray-500 mt-6'>
        {locale === 'tr'
          ? '👆 Tepkinizi değiştirmek için aynı simgeye tekrar tıklayın'
          : locale === 'en'
            ? '👆 Click the same icon again to change your reaction'
            : '👆 Kliknite na istu ikonicu ponovo da promenite svoju reakciju'}
      </p>
    </div>
  );
}

// Default export for dynamic import
export default PageReactions;
