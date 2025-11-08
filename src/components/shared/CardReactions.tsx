'use client';

import { useState, useEffect } from 'react';
import { getFingerprint } from '@/lib/fingerprint';

interface CardReactionsProps {
  cardId: string; // This is actually the slug
  locale?: 'tr' | 'en' | 'sr';
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
    emoji: '💖',
    label: { tr: 'Sevdim', en: 'Love it', sr: 'Volim' },
    count: 0,
  },
  {
    emoji: '🤔',
    label: { tr: 'Düşündürücü', en: 'Thoughtful', sr: 'Zamišljen' },
    count: 0,
  },
  {
    emoji: '😢',
    label: { tr: 'Dokunaklı', en: 'Touching', sr: 'Dirljivo' },
    count: 0,
  },
  {
    emoji: '⭐',
    label: { tr: 'Faydalı', en: 'Helpful', sr: 'Korisno' },
    count: 0,
  },
];

export function CardReactions({ cardId, locale = 'tr' }: CardReactionsProps) {
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
          `/api/engagement/cards/${cardId}/reactions?fingerprint=${fingerprint}`
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
        console.error('Error loading reactions:', error);
      }
    };

    loadReactions();
  }, [cardId, fingerprint]);

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
        `/api/engagement/cards/${cardId}/reactions`,
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
        console.error('Failed to update reaction:', result.error);
      }
    } catch (error) {
      // Revert on error
      setReactions(previousReactions);
      setUserReaction(previousUserReaction);
      console.error('Error updating reaction:', error);
    }
  };

  const getTitle = () => {
    if (locale === 'tr') {
      return 'Bu içeriği nasıl buldunuz?';
    }
    if (locale === 'en') {
      return 'How did you find this content?';
    }
    return 'Kako ste pronašli ovaj sadržaj?';
  };

  const getThanksMessage = () => {
    if (locale === 'tr') {
      return 'Tepkiniz için teşekkürler!';
    }
    if (locale === 'en') {
      return 'Thanks for your feedback!';
    }
    return 'Hvala na povratnim informacijama!';
  };

  return (
    <div className='bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200'>
      {/* Header */}
      <div className='text-center mb-6'>
        <h3 className='text-xl font-bold text-gray-900 mb-2'>{getTitle()}</h3>
        {userReaction && (
          <p className='text-sm text-purple-600 font-medium animate-fade-in'>
            ✨ {getThanksMessage()}
          </p>
        )}
      </div>

      {/* Reactions */}
      <div className='flex flex-wrap justify-center gap-3'>
        {reactions.map(reaction => {
          const isSelected = userReaction === reaction.emoji;
          const isAnimating = animatingEmoji === reaction.emoji;

          return (
            <button
              key={reaction.emoji}
              onClick={() => handleReaction(reaction.emoji)}
              className={`group relative flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-purple-100 hover:scale-105 shadow-md hover:shadow-lg'
              } ${isAnimating ? 'animate-bounce' : ''}`}
              aria-label={`${reaction.label[locale]} reaction`}
              title={reaction.label[locale]}
            >
              {/* Emoji */}
              <span
                className={`text-3xl transition-transform duration-200 ${
                  isSelected ? 'scale-125' : 'group-hover:scale-110'
                }`}
              >
                {reaction.emoji}
              </span>

              {/* Label */}
              <span className='text-xs font-medium whitespace-nowrap'>
                {reaction.label[locale]}
              </span>

              {/* Count Badge */}
              {reaction.count > 0 && (
                <span
                  className={`absolute -top-2 -right-2 min-w-[24px] h-6 flex items-center justify-center px-2 rounded-full text-xs font-bold shadow-md ${
                    isSelected
                      ? 'bg-yellow-400 text-gray-900'
                      : 'bg-purple-600 text-white'
                  }`}
                >
                  {reaction.count}
                </span>
              )}

              {/* Hover Effect */}
              {!isSelected && (
                <div className='absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300'></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Info Text */}
      <p className='text-xs text-center text-gray-500 mt-4'>
        {locale === 'tr'
          ? 'Tepkinizi değiştirmek için aynı simgeye tekrar tıklayın'
          : locale === 'en'
            ? 'Click the same icon again to change your reaction'
            : 'Kliknite na istu ikonicu ponovo da promenite svoju reakciju'}
      </p>
    </div>
  );
}
