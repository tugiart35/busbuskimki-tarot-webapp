'use client';

import { useState, useEffect } from 'react';
import { FaEye, FaHeart, FaComments } from 'react-icons/fa';

interface CardStatsWidgetProps {
  slug?: string;
  locale: 'tr' | 'en' | 'sr';
}

interface Stats {
  view_count: number;
  reaction_count: number;
  comment_count: number;
}

export default function CardStatsWidget({
  slug,
  locale,
}: CardStatsWidgetProps) {
  const [stats, setStats] = useState<Stats>({
    view_count: 0,
    reaction_count: 0,
    comment_count: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const loadStats = async () => {
      try {
        const response = await fetch(`/api/engagement/cards/${slug}/stats`);
        const result = await response.json();

        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();

    // Increment view count
    const incrementView = async () => {
      try {
        await fetch(`/api/engagement/cards/${slug}/stats`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'increment_view' }),
        });
      } catch (error) {
        console.error('Error incrementing view:', error);
      }
    };

    incrementView();
  }, [slug]);

  const getTitle = () => {
    if (locale === 'tr') {
      return 'İstatistikler';
    }
    if (locale === 'en') {
      return 'Statistics';
    }
    return 'Statistike';
  };

  const getViewsLabel = () => {
    if (locale === 'tr') {
      return 'Görüntülenme';
    }
    if (locale === 'en') {
      return 'Views';
    }
    return 'Pregledi';
  };

  const getReactionsLabel = () => {
    if (locale === 'tr') {
      return 'Reaksiyon';
    }
    if (locale === 'en') {
      return 'Reactions';
    }
    return 'Reakcije';
  };

  const getCommentsLabel = () => {
    if (locale === 'tr') {
      return 'Yorum';
    }
    if (locale === 'en') {
      return 'Comments';
    }
    return 'Komentari';
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className='bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200 animate-pulse'>
        <div className='h-6 bg-gray-200 rounded w-32 mb-4'></div>
        <div className='grid grid-cols-3 gap-4'>
          <div className='h-20 bg-gray-200 rounded'></div>
          <div className='h-20 bg-gray-200 rounded'></div>
          <div className='h-20 bg-gray-200 rounded'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200'>
      {/* Header */}
      <h3 className='text-lg font-bold text-gray-900 mb-4'>📊 {getTitle()}</h3>

      {/* Stats Grid */}
      <div className='grid grid-cols-3 gap-4'>
        {/* Views */}
        <div className='bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow duration-200'>
          <div className='flex justify-center mb-2'>
            <FaEye className='text-2xl text-blue-600' />
          </div>
          <div className='text-2xl font-bold text-gray-900 mb-1'>
            {formatNumber(stats.view_count)}
          </div>
          <div className='text-xs text-gray-600'>{getViewsLabel()}</div>
        </div>

        {/* Reactions */}
        <div className='bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow duration-200'>
          <div className='flex justify-center mb-2'>
            <FaHeart className='text-2xl text-red-500' />
          </div>
          <div className='text-2xl font-bold text-gray-900 mb-1'>
            {formatNumber(stats.reaction_count)}
          </div>
          <div className='text-xs text-gray-600'>{getReactionsLabel()}</div>
        </div>

        {/* Comments */}
        <div className='bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow duration-200'>
          <div className='flex justify-center mb-2'>
            <FaComments className='text-2xl text-green-600' />
          </div>
          <div className='text-2xl font-bold text-gray-900 mb-1'>
            {formatNumber(stats.comment_count)}
          </div>
          <div className='text-xs text-gray-600'>{getCommentsLabel()}</div>
        </div>
      </div>

      {/* Info Text */}
      <p className='text-xs text-center text-gray-500 mt-4'>
        {locale === 'tr'
          ? 'Bu kart şimdiye kadar bu kadar ilgi gördü'
          : locale === 'en'
            ? 'This card has received this much attention so far'
            : 'Ova karta je do sada dobila ovoliko pažnje'}
      </p>
    </div>
  );
}
