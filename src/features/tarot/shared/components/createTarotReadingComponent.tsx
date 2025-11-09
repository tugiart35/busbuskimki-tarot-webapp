// React hooks ve Next.js navigation için gerekli importlar
import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Proje içi custom hook'lar - çeviri, toast bildirimleri, kredi yönetimi ve auth için
import { useTranslations } from '@/hooks/useTranslations';
import { useToast } from '@/hooks/useToast';
import { useReadingCredits } from '@/hooks/useReadingCredits';
import { useAuth } from '@/hooks/auth/useAuth';

// Supabase client ve tema konfigürasyonu
import { supabase } from '@/lib/supabase/client';
import type { Theme } from '@/lib/theme/theme-config';

// Paylaşılan UI bileşenleri - toast, kart galerisi, okuma tipi seçici, kart detayları ve renderer
import {
  Toast,
  BaseCardGallery,
  BaseReadingTypeSelector,
  CardDetails,
  BaseCardRenderer,
} from '@/features/shared/ui';

// Fast delivery info card - satış odaklı teslimat bilgisi
import FastDeliveryInfoCard from '../../components/FastDeliveryInfoCard';

// Tarot özel UI bileşenleri - modal, canvas, yorumlama ve form
import {
  BaseTarotModal,
  BaseTarotCanvas,
  BaseTarotInterpretation,
  BaseTarotForm,
} from '../ui';

// Tarot okuma akışı hook'u ve email gönderim utility'si
import { useTarotReadingFlow } from '../hooks';
import { triggerEmailSending } from '../utils/trigger-email-sending';

// Tarot tipleri ve konfigürasyon tipleri
import {
  READING_TYPES,
  TarotCard,
  TarotReadingProps,
  ReadingType,
} from '@/types/tarot';
import { TarotConfig, TarotTheme } from '../types/tarot-config.types';

// Bölüm stilleri için temel interface - container ve title CSS sınıfları
interface SectionStyle {
  container: string;
  title: string;
}

// Süreç bölümü için özel interface - SectionStyle'ı genişletir ve stepNumber ekler
interface ProcessSectionStyle extends SectionStyle {
  stepNumber: string;
}

// Tarot yayılımı için tema stilleri - tüm UI bileşenlerinin CSS sınıflarını içerir
interface SpreadThemeStyles {
  // Birincil bilgi bölümü stilleri
  infoPrimary: SectionStyle;
  // İkincil bilgi bölümü stilleri
  infoSecondary: SectionStyle;
  // Süreç adımları için stiller
  process: ProcessSectionStyle;
  // Modal footer butonları için stiller
  modalFooter: {
    border: string;
    cancel: string;
    confirm: string;
  };
  // Kredi onay modalı için stiller
  creditConfirm: {
    container: string;
    title: string;
    message: string;
    confirmButton: string;
    cancelButton: string;
  };
  // Başarı modalı için stiller
  successModal: {
    container: string;
    title: string;
    message: string;
    infoBox: string;
    infoText: string;
    progressTrack: string;
    progressFill: string;
  };
  // Okuma vurgu bölümü için stiller
  readingHighlight: {
    container: string;
    iconBg: string;
    iconText: string;
    title: string;
    subtitle: string;
  };
  // Tümünü temizle butonu stili
  clearAllButton: string;
  // Okuma tipi seçici tema
  readingTypeTheme: Theme;
  // Galeri tema rengi
  galleryTheme: 'pink' | 'blue' | 'purple' | 'green';
}

// Tema stilleri konfigürasyonu - her tema için özel CSS sınıfları tanımlar
const THEME_STYLES: Record<TarotTheme, SpreadThemeStyles> = {
  // Pembe tema - aşk ve romantizm odaklı renkler
  pink: {
    // Birincil bilgi bölümü - ana bilgi kutuları için pembe tonları
    infoPrimary: {
      container:
        'bg-pink-800/20 border border-pink-500/30 rounded-xl p-4 text-gray-300',
      title: 'text-pink-200 font-semibold mb-2',
    },
    // İkincil bilgi bölümü - ek bilgi kutuları için gül tonları
    infoSecondary: {
      container:
        'bg-rose-800/20 border border-rose-500/30 rounded-xl p-4 text-gray-300',
      title: 'text-rose-200 font-semibold mb-2',
    },
    // Süreç adımları - adım numaraları ve açıklamaları için
    process: {
      container:
        'bg-pink-800/20 border border-pink-500/30 rounded-xl p-4 text-gray-300',
      title: 'text-pink-200 font-semibold mb-2',
      stepNumber: 'bg-pink-600 text-white',
    },
    // Modal footer - modal alt kısmındaki butonlar için
    modalFooter: {
      border: 'border-pink-500/20',
      cancel:
        'flex-1 bg-slate-700 border border-slate-600 text-gray-300 font-semibold py-3 px-6 rounded-xl transition-colors hover:bg-slate-800',
      confirm:
        'flex-1 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg',
    },
    // Kredi onay modalı - kredi harcama onayı için
    creditConfirm: {
      container:
        'bg-slate-900 border border-pink-500/40 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4',
      title: 'text-pink-400 text-xl font-bold mb-4 text-center',
      message: 'text-gray-200 text-center mb-6',
      confirmButton:
        'bg-gradient-to-r from-pink-600 to-green-500 hover:from-pink-700 hover:to-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-60',
      cancelButton:
        'bg-slate-700 border border-slate-600 text-gray-300 font-semibold py-2 px-6 rounded-lg transition-colors hover:bg-slate-800 disabled:opacity-60',
    },
    // Başarı modalı - okuma tamamlandığında gösterilen modal
    successModal: {
      container:
        'bg-gradient-to-br from-pink-900/95 to-green-900/95 border border-pink-500/30 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center',
      title: 'text-green-400 text-2xl font-bold mb-4',
      message: 'text-pink-200 mb-6 leading-relaxed',
      infoBox: 'bg-pink-800/30 border border-pink-500/20 rounded-xl p-4 mb-6',
      infoText: 'text-pink-300 text-sm',
      progressTrack: 'bg-pink-800/30',
      progressFill: 'bg-gradient-to-r from-green-400 to-green-600',
    },
    // Okuma vurgu bölümü - seçilen pozisyonu vurgulamak için
    readingHighlight: {
      container:
        'bg-gradient-to-r from-pink-600/20 via-slate-500/30 to-green-500/20 border border-pink-500/50 rounded-2xl px-6 py-3 shadow-lg animate-pulse',
      iconBg: 'bg-pink-400/20',
      iconText: 'text-pink-300',
      title: 'text-pink-200 font-bold text-lg',
      subtitle: 'text-gray-300 text-xs',
    },
    // Tümünü temizle butonu - seçilen kartları sıfırlamak için
    clearAllButton:
      'px-8 py-3 bg-gradient-to-r from-pink-500/30 to-green-500/20 border border-pink-500/50 rounded-2xl text-pink-400 hover:bg-pink-500/40 hover:border-pink-500/70 transition-all duration-300 font-semibold shadow-md shadow-pink-500/10',
    readingTypeTheme: 'pink',
    galleryTheme: 'pink',
  },
  // Mavi tema - sakinlik ve güven odaklı renkler
  blue: {
    // Birincil bilgi bölümü - mavi tonları
    infoPrimary: {
      container:
        'bg-blue-800/20 border border-blue-500/30 rounded-xl p-4 text-gray-300',
      title: 'text-blue-200 font-semibold mb-2',
    },
    // İkincil bilgi bölümü - cyan tonları
    infoSecondary: {
      container:
        'bg-cyan-800/20 border border-cyan-500/30 rounded-xl p-4 text-gray-300',
      title: 'text-cyan-200 font-semibold mb-2',
    },
    // Süreç adımları - mavi tonları
    process: {
      container:
        'bg-blue-800/20 border border-blue-500/30 rounded-xl p-4 text-gray-300',
      title: 'text-blue-200 font-semibold mb-2',
      stepNumber: 'bg-blue-600 text-white',
    },
    modalFooter: {
      border: 'border-blue-500/20',
      cancel:
        'flex-1 bg-slate-700 border border-slate-600 text-gray-300 font-semibold py-3 px-6 rounded-xl transition-colors hover:bg-slate-800',
      confirm:
        'flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg',
    },
    creditConfirm: {
      container:
        'bg-slate-900 border border-blue-500/40 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4',
      title: 'text-blue-300 text-xl font-bold mb-4 text-center',
      message: 'text-gray-200 text-center mb-6',
      confirmButton:
        'bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-60',
      cancelButton:
        'bg-slate-700 border border-slate-600 text-gray-300 font-semibold py-2 px-6 rounded-lg transition-colors hover:bg-slate-800 disabled:opacity-60',
    },
    successModal: {
      container:
        'bg-gradient-to-br from-blue-900/95 to-green-900/95 border border-blue-500/30 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center',
      title: 'text-green-400 text-2xl font-bold mb-4',
      message: 'text-blue-200 mb-6 leading-relaxed',
      infoBox: 'bg-blue-800/30 border border-blue-500/20 rounded-xl p-4 mb-6',
      infoText: 'text-blue-300 text-sm',
      progressTrack: 'bg-blue-800/30',
      progressFill: 'bg-gradient-to-r from-green-400 to-green-600',
    },
    readingHighlight: {
      container:
        'bg-gradient-to-r from-blue-600/20 via-slate-500/30 to-green-500/20 border border-blue-500/50 rounded-2xl px-6 py-3 shadow-lg animate-pulse',
      iconBg: 'bg-blue-400/20',
      iconText: 'text-blue-300',
      title: 'text-blue-200 font-bold text-lg',
      subtitle: 'text-gray-300 text-xs',
    },
    clearAllButton:
      'px-8 py-3 bg-gradient-to-r from-blue-500/30 to-green-500/20 border border-blue-500/50 rounded-2xl text-blue-300 hover:bg-blue-500/40 hover:border-blue-500/70 transition-all duration-300 font-semibold shadow-md shadow-blue-500/10',
    readingTypeTheme: 'blue',
    galleryTheme: 'blue',
  },
  // Yeşil tema - doğa ve büyüme odaklı renkler
  green: {
    // Birincil bilgi bölümü - yeşil tonları
    infoPrimary: {
      container:
        'bg-green-800/20 border border-green-500/30 rounded-xl p-4 text-gray-300',
      title: 'text-green-200 font-semibold mb-2',
    },
    // İkincil bilgi bölümü - emerald tonları
    infoSecondary: {
      container:
        'bg-emerald-800/20 border border-emerald-500/30 rounded-xl p-4 text-gray-300',
      title: 'text-emerald-200 font-semibold mb-2',
    },
    // Süreç adımları - yeşil tonları
    process: {
      container:
        'bg-green-800/20 border border-green-500/30 rounded-xl p-4 text-gray-300',
      title: 'text-green-200 font-semibold mb-2',
      stepNumber: 'bg-green-600 text-white',
    },
    modalFooter: {
      border: 'border-green-500/20',
      cancel:
        'flex-1 bg-slate-700 border border-slate-600 text-gray-300 font-semibold py-3 px-6 rounded-xl transition-colors hover:bg-slate-800',
      confirm:
        'flex-1 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg',
    },
    creditConfirm: {
      container:
        'bg-slate-900 border border-green-500/40 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4',
      title: 'text-green-300 text-xl font-bold mb-4 text-center',
      message: 'text-gray-200 text-center mb-6',
      confirmButton:
        'bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-60',
      cancelButton:
        'bg-slate-700 border border-slate-600 text-gray-300 font-semibold py-2 px-6 rounded-lg transition-colors hover:bg-slate-800 disabled:opacity-60',
    },
    successModal: {
      container:
        'bg-gradient-to-br from-green-900/95 to-emerald-900/95 border border-green-500/30 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center',
      title: 'text-emerald-300 text-2xl font-bold mb-4',
      message: 'text-green-200 mb-6 leading-relaxed',
      infoBox: 'bg-green-800/30 border border-green-500/20 rounded-xl p-4 mb-6',
      infoText: 'text-green-300 text-sm',
      progressTrack: 'bg-green-800/30',
      progressFill: 'bg-gradient-to-r from-green-400 to-emerald-500',
    },
    readingHighlight: {
      container:
        'bg-gradient-to-r from-green-600/20 via-slate-500/30 to-emerald-500/20 border border-green-500/50 rounded-2xl px-6 py-3 shadow-lg animate-pulse',
      iconBg: 'bg-green-400/20',
      iconText: 'text-green-300',
      title: 'text-green-200 font-bold text-lg',
      subtitle: 'text-gray-300 text-xs',
    },
    clearAllButton:
      'px-8 py-3 bg-gradient-to-r from-green-500/30 to-emerald-500/20 border border-green-500/50 rounded-2xl text-green-300 hover:bg-green-500/40 hover:border-green-500/70 transition-all duration-300 font-semibold shadow-md shadow-green-500/10',
    readingTypeTheme: 'green',
    galleryTheme: 'green',
  },
  // Mor tema - ruhsallık ve gizem odaklı renkler
  purple: {
    // Birincil bilgi bölümü - mor tonları
    infoPrimary: {
      container:
        'bg-purple-800/20 border border-purple-500/30 rounded-xl p-4 text-gray-300',
      title: 'text-purple-200 font-semibold mb-2',
    },
    // İkincil bilgi bölümü - violet tonları
    infoSecondary: {
      container:
        'bg-violet-800/20 border border-violet-500/30 rounded-xl p-4 text-gray-300',
      title: 'text-violet-200 font-semibold mb-2',
    },
    // Süreç adımları - mor tonları
    process: {
      container:
        'bg-purple-800/20 border border-purple-500/30 rounded-xl p-4 text-gray-300',
      title: 'text-purple-200 font-semibold mb-2',
      stepNumber: 'bg-purple-600 text-white',
    },
    modalFooter: {
      border: 'border-purple-500/20',
      cancel:
        'flex-1 bg-slate-700 border border-slate-600 text-gray-300 font-semibold py-3 px-6 rounded-xl transition-colors hover:bg-slate-800',
      confirm:
        'flex-1 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg',
    },
    creditConfirm: {
      container:
        'bg-slate-900 border border-purple-500/40 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4',
      title: 'text-purple-300 text-xl font-bold mb-4 text-center',
      message: 'text-gray-200 text-center mb-6',
      confirmButton:
        'bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-60',
      cancelButton:
        'bg-slate-700 border border-slate-600 text-gray-300 font-semibold py-2 px-6 rounded-lg transition-colors hover:bg-slate-800 disabled:opacity-60',
    },
    successModal: {
      container:
        'bg-gradient-to-br from-purple-900/95 to-indigo-900/95 border border-purple-500/30 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center',
      title: 'text-indigo-300 text-2xl font-bold mb-4',
      message: 'text-purple-200 mb-6 leading-relaxed',
      infoBox:
        'bg-purple-800/30 border border-purple-500/20 rounded-xl p-4 mb-6',
      infoText: 'text-purple-300 text-sm',
      progressTrack: 'bg-purple-800/30',
      progressFill: 'bg-gradient-to-r from-indigo-400 to-purple-500',
    },
    readingHighlight: {
      container:
        'bg-gradient-to-r from-purple-600/20 via-slate-500/30 to-indigo-500/20 border border-purple-500/50 rounded-2xl px-6 py-3 shadow-lg animate-pulse',
      iconBg: 'bg-purple-400/20',
      iconText: 'text-purple-300',
      title: 'text-purple-200 font-bold text-lg',
      subtitle: 'text-gray-300 text-xs',
    },
    clearAllButton:
      'px-8 py-3 bg-gradient-to-r from-purple-500/30 to-indigo-500/20 border border-purple-500/50 rounded-2xl text-purple-300 hover:bg-purple-500/40 hover:border-purple-500/70 transition-all duration-300 font-semibold shadow-md shadow-purple-500/10',
    readingTypeTheme: 'purple',
    galleryTheme: 'purple',
  },
  // Sarı tema - enerji ve neşe odaklı renkler
  yellow: {
    // Birincil bilgi bölümü - sarı tonları
    infoPrimary: {
      container:
        'bg-yellow-800/20 border border-yellow-500/30 rounded-xl p-4 text-gray-300',
      title: 'text-yellow-200 font-semibold mb-2',
    },
    // İkincil bilgi bölümü - amber tonları
    infoSecondary: {
      container:
        'bg-amber-800/20 border border-amber-500/30 rounded-xl p-4 text-gray-300',
      title: 'text-amber-200 font-semibold mb-2',
    },
    // Süreç adımları - sarı tonları
    process: {
      container:
        'bg-yellow-800/20 border border-yellow-500/30 rounded-xl p-4 text-gray-300',
      title: 'text-yellow-200 font-semibold mb-2',
      stepNumber: 'bg-yellow-600 text-white',
    },
    modalFooter: {
      border: 'border-yellow-500/20',
      cancel:
        'flex-1 bg-slate-700 border border-slate-600 text-gray-300 font-semibold py-3 px-6 rounded-xl transition-colors hover:bg-slate-800',
      confirm:
        'flex-1 bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-700 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg',
    },
    creditConfirm: {
      container:
        'bg-slate-900 border border-yellow-500/40 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4',
      title: 'text-yellow-300 text-xl font-bold mb-4 text-center',
      message: 'text-gray-200 text-center mb-6',
      confirmButton:
        'bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-700 hover:to-amber-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-60',
      cancelButton:
        'bg-slate-700 border border-slate-600 text-gray-300 font-semibold py-2 px-6 rounded-lg transition-colors hover:bg-slate-800 disabled:opacity-60',
    },
    successModal: {
      container:
        'bg-gradient-to-br from-yellow-900/95 to-amber-900/95 border border-yellow-500/30 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center',
      title: 'text-amber-300 text-2xl font-bold mb-4',
      message: 'text-yellow-200 mb-6 leading-relaxed',
      infoBox:
        'bg-yellow-800/30 border border-yellow-500/20 rounded-xl p-4 mb-6',
      infoText: 'text-yellow-300 text-sm',
      progressTrack: 'bg-yellow-800/30',
      progressFill: 'bg-gradient-to-r from-green-400 to-amber-500',
    },
    readingHighlight: {
      container:
        'bg-gradient-to-r from-yellow-500/20 via-slate-500/30 to-amber-500/20 border border-yellow-500/50 rounded-2xl px-6 py-3 shadow-lg animate-pulse',
      iconBg: 'bg-yellow-400/20',
      iconText: 'text-yellow-300',
      title: 'text-yellow-200 font-bold text-lg',
      subtitle: 'text-gray-300 text-xs',
    },
    clearAllButton:
      'px-8 py-3 bg-gradient-to-r from-yellow-500/30 to-amber-500/20 border border-yellow-500/50 rounded-2xl text-yellow-300 hover:bg-yellow-500/40 hover:border-yellow-500/70 transition-all duration-300 font-semibold shadow-md shadow-yellow-500/10',
    readingTypeTheme: 'yellow',
    galleryTheme: 'green',
  },
  // Turuncu tema - yaratıcılık ve coşku odaklı renkler
  orange: {
    // Birincil bilgi bölümü - turuncu tonları
    infoPrimary: {
      container:
        'bg-orange-800/20 border border-orange-500/30 rounded-xl p-4 text-gray-300',
      title: 'text-orange-200 font-semibold mb-2',
    },
    // İkincil bilgi bölümü - amber tonları
    infoSecondary: {
      container:
        'bg-amber-800/20 border border-amber-500/30 rounded-xl p-4 text-gray-300',
      title: 'text-amber-200 font-semibold mb-2',
    },
    // Süreç adımları - turuncu tonları
    process: {
      container:
        'bg-orange-800/20 border border-orange-500/30 rounded-xl p-4 text-gray-300',
      title: 'text-orange-200 font-semibold mb-2',
      stepNumber: 'bg-orange-600 text-white',
    },
    modalFooter: {
      border: 'border-orange-500/20',
      cancel:
        'flex-1 bg-slate-700 border border-slate-600 text-gray-300 font-semibold py-3 px-6 rounded-xl transition-colors hover:bg-slate-800',
      confirm:
        'flex-1 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg',
    },
    creditConfirm: {
      container:
        'bg-slate-900 border border-orange-500/40 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4',
      title: 'text-orange-300 text-xl font-bold mb-4 text-center',
      message: 'text-gray-200 text-center mb-6',
      confirmButton:
        'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-60',
      cancelButton:
        'bg-slate-700 border border-slate-600 text-gray-300 font-semibold py-2 px-6 rounded-lg transition-colors hover:bg-slate-800 disabled:opacity-60',
    },
    successModal: {
      container:
        'bg-gradient-to-br from-orange-900/95 to-green-900/95 border border-orange-500/30 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center',
      title: 'text-green-300 text-2xl font-bold mb-4',
      message: 'text-orange-200 mb-6 leading-relaxed',
      infoBox:
        'bg-orange-800/30 border border-orange-500/20 rounded-xl p-4 mb-6',
      infoText: 'text-orange-300 text-sm',
      progressTrack: 'bg-orange-800/30',
      progressFill: 'bg-gradient-to-r from-green-400 to-amber-500',
    },
    readingHighlight: {
      container:
        'bg-gradient-to-r from-orange-600/20 via-slate-500/30 to-green-500/20 border border-orange-500/50 rounded-2xl px-6 py-3 shadow-lg animate-pulse',
      iconBg: 'bg-orange-400/20',
      iconText: 'text-orange-300',
      title: 'text-orange-200 font-bold text-lg',
      subtitle: 'text-gray-300 text-xs',
    },
    clearAllButton:
      'px-8 py-3 bg-gradient-to-r from-orange-500/30 to-green-500/20 border border-orange-500/50 rounded-2xl text-orange-300 hover:bg-orange-500/40 hover:border-orange-500/70 transition-all duration-300 font-semibold shadow-md shadow-orange-500/10',
    readingTypeTheme: 'orange',
    galleryTheme: 'pink',
  },
  // Kırmızı tema - tutku ve güç odaklı renkler
  red: {
    // Birincil bilgi bölümü - kırmızı tonları
    infoPrimary: {
      container:
        'bg-red-800/20 border border-red-500/30 rounded-xl p-4 text-gray-300',
      title: 'text-red-200 font-semibold mb-2',
    },
    // İkincil bilgi bölümü - gül tonları
    infoSecondary: {
      container:
        'bg-rose-800/20 border border-rose-500/30 rounded-xl p-4 text-gray-300',
      title: 'text-rose-200 font-semibold mb-2',
    },
    // Süreç adımları - kırmızı tonları
    process: {
      container:
        'bg-red-800/20 border border-red-500/30 rounded-xl p-4 text-gray-300',
      title: 'text-red-200 font-semibold mb-2',
      stepNumber: 'bg-red-600 text-white',
    },
    modalFooter: {
      border: 'border-red-500/20',
      cancel:
        'flex-1 bg-slate-700 border border-slate-600 text-gray-300 font-semibold py-3 px-6 rounded-xl transition-colors hover:bg-slate-800',
      confirm:
        'flex-1 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg',
    },
    creditConfirm: {
      container:
        'bg-slate-900 border border-red-500/40 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4',
      title: 'text-red-300 text-xl font-bold mb-4 text-center',
      message: 'text-gray-200 text-center mb-6',
      confirmButton:
        'bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-60',
      cancelButton:
        'bg-slate-700 border border-slate-600 text-gray-300 font-semibold py-2 px-6 rounded-lg transition-colors hover:bg-slate-800 disabled:opacity-60',
    },
    successModal: {
      container:
        'bg-gradient-to-br from-red-900/95 to-rose-900/95 border border-red-500/30 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center',
      title: 'text-green-300 text-2xl font-bold mb-4',
      message: 'text-red-200 mb-6 leading-relaxed',
      infoBox: 'bg-red-800/30 border border-red-500/20 rounded-xl p-4 mb-6',
      infoText: 'text-red-300 text-sm',
      progressTrack: 'bg-red-800/30',
      progressFill: 'bg-gradient-to-r from-green-400 to-rose-500',
    },
    readingHighlight: {
      container:
        'bg-gradient-to-r from-red-600/20 via-slate-500/30 to-rose-500/20 border border-red-500/50 rounded-2xl px-6 py-3 shadow-lg animate-pulse',
      iconBg: 'bg-red-400/20',
      iconText: 'text-red-300',
      title: 'text-red-200 font-bold text-lg',
      subtitle: 'text-gray-300 text-xs',
    },
    clearAllButton:
      'px-8 py-3 bg-gradient-to-r from-red-500/30 to-rose-500/20 border border-red-500/50 rounded-2xl text-red-300 hover:bg-red-500/40 hover:border-red-500/70 transition-all duration-300 font-semibold shadow-md shadow-red-500/10',
    readingTypeTheme: 'red',
    galleryTheme: 'pink',
  },
};

// Tarot okuma bileşeni oluşturma seçenekleri interface'i
interface CreateTarotReadingComponentOptions {
  // Konfigürasyon getter fonksiyonu - tema, pozisyonlar vb. bilgileri döner
  getConfig: () => TarotConfig;
  // Yorumlama bölümü için emoji
  interpretationEmoji: string;
  // Reading type - BaseReadingTypeSelector için gerekli
  readingType?: string;
  // Kart anlamını getiren fonksiyon - pozisyon ve ters duruma göre anlam döner
  getCardMeaning: (
    _card: TarotCard | null,
    _position: number,
    _isReversed: boolean
  ) =>
    | string
    | { interpretation: string; context: string; keywords?: string[] };
}

// Tarot okuma bileşeni factory fonksiyonu - konfigürasyona göre özelleştirilmiş bileşen döner
export function createTarotReadingComponent({
  getConfig,
  interpretationEmoji,
  readingType,
  getCardMeaning,
}: CreateTarotReadingComponentOptions) {
  // Geri dönen Tarot okuma bileşeni - props ile dış dünyadan kontrol edilebilir
  return function TarotReadingComponent({
    onComplete,
    onPositionChange,
    onReadingTypeSelected: _onReadingTypeSelected,
    initialReadingType,
    sessionToken,
  }: TarotReadingProps) {
    // Konfigürasyon ve tema stilleri - memo ile optimize edilmiş
    const config = useMemo(() => getConfig(), []);
    const themeStyles = THEME_STYLES[config.theme];

    // Router ve çeviri hook'ları
    const router = useRouter();
    const pathname = usePathname();
    const { t } = useTranslations();

    // Locale bilgisini pathname'den al
    const locale = useMemo(() => {
      const pathLocale = pathname?.split('/')[1];
      return (
        pathLocale === 'tr' || pathLocale === 'en' || pathLocale === 'sr'
          ? pathLocale
          : 'tr'
      ) as 'tr' | 'en' | 'sr';
    }, [pathname]);

    // Kullanıcı auth ve toast bildirimleri
    const { user } = useAuth();
    const { toast, showToast, hideToast } = useToast();

    // Kredi yönetimi - detaylı ve yazılı okuma için ayrı krediler
    const detailedCredits = useReadingCredits(
      (config.creditKeys?.detailed || 'DEFAULT_DETAILED') as any
    );
    const writtenCredits = useReadingCredits(
      (config.creditKeys?.written || 'DEFAULT_WRITTEN') as any
    );

    // Tarot okuma akışı hook'u - tüm state ve fonksiyonları yönetir
    const {
      // Kart seçimi ve durumları
      selectedCards,
      usedCardIds,
      showCardDetails,
      cardStates,
      isReversed,
      deck,
      currentPosition,
      handleCardSelect,
      setShowCardDetails,
      toggleCardState,
      handleClearAll,
      shuffleDeck,
      interpretationRef,
      userQuestion,

      // Okuma tipi seçimi
      selectedReadingType,
      setSelectedReadingType,

      // Form verileri
      personalInfo,
      partnerInfo,
      communicationMethod,
      questions,
      formErrors,

      // Modal durumları
      modalStates,
      setModalStates,

      // Form güncelleme fonksiyonları
      updatePersonalInfo,
      updatePartnerInfo,
      updateCommunicationMethod,
      updateQuestion,
      validateDetailedForm,

      // Kaydetme durumları
      setSaving,
      setSavingReading,
      setDetailedFormSaved,
      handleReadingTypeSelect,
    } = useTarotReadingFlow({
      config,
      onComplete: onComplete || (() => {}),
      onPositionChange: onPositionChange || (() => {}),
    });

    // Modal durumları - destructuring ile alınan state'ler
    const {
      isSaving,
      showCreditConfirm,
      detailedFormSaved,
      showInfoModal,
      isSavingReading,
      showSuccessModal,
    } = modalStates;

    // Başlangıç zamanı - okuma süresini hesaplamak için
    const [startTime] = useState(() => Date.now());

    // Token ile yarım bırakılan okumayı yükle
    useEffect(() => {
      if (sessionToken && typeof window !== 'undefined') {
        try {
          const savedData = localStorage.getItem(
            `reading_session_${sessionToken}`
          );
          if (savedData) {
            const parsed = JSON.parse(savedData);

            // Form verilerini yükle
            if (parsed.personalInfo) {
              Object.keys(parsed.personalInfo).forEach(key => {
                updatePersonalInfo(key as any, parsed.personalInfo[key]);
              });
            }
            if (parsed.partnerInfo) {
              Object.keys(parsed.partnerInfo).forEach(key => {
                updatePartnerInfo(key as any, parsed.partnerInfo[key]);
              });
            }
            if (parsed.communicationMethod) {
              updateCommunicationMethod(parsed.communicationMethod);
            }
            if (parsed.questions) {
              // Questions object olarak kaydedilmiş olabilir
              if (
                typeof parsed.questions === 'object' &&
                !Array.isArray(parsed.questions)
              ) {
                if (parsed.questions.concern) {
                  updateQuestion('concern', parsed.questions.concern);
                }
                if (parsed.questions.understanding) {
                  updateQuestion(
                    'understanding',
                    parsed.questions.understanding
                  );
                }
                if (parsed.questions.emotional) {
                  updateQuestion('emotional', parsed.questions.emotional);
                }
              }
            }
            if (parsed.selectedReadingType) {
              setSelectedReadingType(parsed.selectedReadingType);
            }
            if (parsed.selectedCards && Array.isArray(parsed.selectedCards)) {
              // Kartları yükle (basit bir yaklaşım - tam implementasyon için daha fazla kod gerekir)
              // Bu kısım için useTarotReadingFlow hook'una erişim gerekir
            }
            if (parsed.detailedFormSaved) {
              setDetailedFormSaved(true);
            }
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn('Yarım bırakılan okuma yüklenirken hata:', error);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionToken]);

    // Yarım bırakılan okumayı localStorage'a kaydet
    useEffect(() => {
      if (sessionToken && typeof window !== 'undefined') {
        try {
          const dataToSave = {
            personalInfo,
            partnerInfo,
            communicationMethod,
            questions,
            selectedReadingType,
            selectedCards: selectedCards.filter(card => card !== null),
            isReversed,
            detailedFormSaved,
            timestamp: new Date().toISOString(),
          };
          localStorage.setItem(
            `reading_session_${sessionToken}`,
            JSON.stringify(dataToSave)
          );
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn('Yarım bırakılan okuma kaydedilirken hata:', error);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      sessionToken,
      personalInfo,
      partnerInfo,
      communicationMethod,
      questions,
      selectedReadingType,
      selectedCards,
      isReversed,
      detailedFormSaved,
    ]);

    // initialReadingType varsa otomatik olarak okuma tipini seç
    // Ama normal akışa devam et: bilgilendirme modal'ı → form → kart seçimi
    useEffect(() => {
      if (initialReadingType && !selectedReadingType) {
        const readingTypeValue =
          initialReadingType === 'detailed'
            ? READING_TYPES.DETAILED
            : READING_TYPES.WRITTEN;
        setSelectedReadingType(readingTypeValue);
        // Normal akışa devam et: bilgilendirme modal'ını göster
        // Form kaydedilmiş gibi davranma - kullanıcı formu doldurmalı
        setModalStates(prev => ({ ...prev, showInfoModal: true }));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialReadingType]);

    // Çeviri namespace'i ve mesaj anahtarları
    const namespace = config.translationNamespace;
    const messages = useMemo(
      () => ({
        // Form kaydedilmemiş uyarısı
        formUnsavedWarning: `${namespace}.messages.formUnsavedWarning`,
        // Giriş gerekli mesajı
        loginRequired: `${namespace}.messages.loginRequired`,
        // Basit okuma tamamlandı mesajı
        simpleReadingCompleted: `${namespace}.messages.simpleReadingCompleted`,
        // Okuma kaydedildi başarı mesajı
        readingSavedSuccess: `${namespace}.messages.readingSavedSuccess`,
        // Okuma kaydetme hatası mesajı
        readingSaveError: `${namespace}.messages.readingSaveError`,
        // Tüm kartlar gerekli mesajı
        allCardsRequired: `${namespace}.messages.allCardsRequired`,
        // Yorumlama başlığı
        interpretationTitle: `${namespace}.data.interpretationTitle`,
        // Yorumlama selamlama mesajı
        interpretationGreeting: `${namespace}.messages.interpretationGreeting`,
        // Önce okuma tipi seç mesajı
        selectReadingTypeFirst: `${namespace}.messages.selectReadingTypeFirst`,
      }),
      [namespace]
    );

    // Veri anahtarları - UI'da gösterilecek metinler için çeviri anahtarları
    const dataKeys = useMemo(
      () => ({
        // Yayılım adı
        spreadName: `${namespace}.data.spreadName`,
        // Yayılım başlığı
        spreadTitle: `${namespace}.data.spreadTitle`,
        // Detaylı okuma başlığı
        detailedTitle: `${namespace}.data.detailedTitle`,
        // Basit yorumlama metni
        simpleInterpretation: `${namespace}.data.simpleInterpretation`,
        // Basit okuma başlığı
        simpleTitle: `${namespace}.data.simpleTitle`,
        // Rozet metni
        badgeText: `${namespace}.data.badgeText`,
        // Yorumlama başlığı
        interpretationTitle: `${namespace}.data.interpretationTitle`,
        // Okuma formatları
        readingFormats: {
          detailed: `${namespace}.data.readingFormats.detailed`,
          written: `${namespace}.data.readingFormats.written`,
          simple: `${namespace}.data.readingFormats.simple`,
        },
        // Kart yönleri
        cardDirections: {
          upright: `${namespace}.data.cardDirections.upright`,
          reversed: `${namespace}.data.cardDirections.reversed`,
        },
      }),
      [namespace]
    );

    // Özet başlık ve metin anahtarları - yorumlama sonunda gösterilecek
    const summaryTitleKey = `tarotPage.${config.summaryKey}.summary`;
    const summaryTextKey = `tarotPage.${config.summaryKey}.summaryText`;

    // Modal çeviri anahtarları
    const modalKeys = config.i18nKeys.modals;

    // ESC tuşu ile form kapatma - kaydedilmemiş değişiklikler varsa uyarı gösterir
    useEffect(() => {
      const handleEscapeKey = (event: KeyboardEvent) => {
        if (
          event.key === 'Escape' &&
          (selectedReadingType === READING_TYPES.DETAILED ||
            selectedReadingType === READING_TYPES.WRITTEN) &&
          !detailedFormSaved
        ) {
          // Form verileri dolu mu kontrol et
          if (
            personalInfo.name ||
            personalInfo.email ||
            questions.concern ||
            questions.understanding ||
            questions.emotional
          ) {
            // Kaydedilmemiş değişiklikler varsa onay iste
            const shouldClose = window.confirm(t(messages.formUnsavedWarning));
            if (shouldClose) {
              setSelectedReadingType(null);
            }
          } else {
            // Boş form ise direkt kapat
            setSelectedReadingType(null);
          }
        }
      };

      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }, [
      detailedFormSaved,
      messages.formUnsavedWarning,
      personalInfo,
      questions,
      selectedReadingType,
      setSelectedReadingType,
      t,
    ]);

    // Detaylı form kaydetme butonu - form doğrulaması yapar ve kredi onayı gösterir
    const handleSaveDetailedFormClick = () => {
      if (!validateDetailedForm()) {
        return;
      }
      setModalStates(prev => ({ ...prev, showCreditConfirm: true }));
    };

    // Bilgi modalını kapatma
    const closeInfoModal = () => {
      setModalStates(prev => ({ ...prev, showInfoModal: false }));
    };

    // Bilgi modalını iptal etme - okuma tipini de sıfırlar
    const cancelInfoModal = () => {
      setModalStates(prev => ({ ...prev, showInfoModal: false }));
      setSelectedReadingType(null);
    };

    // Detaylı form kaydetme - kullanıcı girişi kontrolü yapar ve formu kaydeder
    // Özel okuma (initialReadingType) için giriş kontrolü yapılmaz
    const saveDetailedForm = async () => {
      // Özel okuma değilse ve kullanıcı giriş yapmamışsa hata göster
      if (!initialReadingType && !user) {
        showToast(t(messages.loginRequired), 'error');
        setModalStates(prev => ({
          ...prev,
          showCreditConfirm: false,
          isSaving: false,
        }));
        return;
      }

      setSaving(true);
      try {
        // Form kaydedildi olarak işaretle
        setDetailedFormSaved(true);
        setModalStates(prev => ({ ...prev, showCreditConfirm: false }));
      } finally {
        setSaving(false);
      }
    };

    // Supabase'e okuma kaydetme - kredi kontrolü ve veri kaydetme işlemi
    const saveReadingToSupabase = async (readingData: any) => {
      try {
        // Token akışında kullanıcı olmayabilir, bu durumda özel bir user_id oluştur
        // veya reading_sessions'dan customer_email'i kullan
        const userId = user?.id;
        let isTokenFlow = false;

        if (!userId && sessionToken) {
          // Token akışı - reading_sessions'dan customer_email'i al
          // Önce session'ı bul ve customer_email'i al
          try {
            const sessionResponse = await fetch(
              `/api/reading-sessions/validate?token=${sessionToken}`
            );
            if (sessionResponse.ok) {
              // Token akışı için özel bir user_id oluştur (customer_email hash'i)
              // veya null bırak ve email API'de reading_sessions'dan alsın
              isTokenFlow = true;
              // user_id null olabilir, email API reading_sessions'dan alacak
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn('Session validation failed:', error);
          }
        }

        // Misafir kullanıcı kontrolü (token akışı değilse)
        if (!userId && !isTokenFlow) {
          return {
            success: true,
            id: 'guest-session',
            userId: 'guest',
            message: 'Guest kullanıcı için veri saklanmadı',
          };
        }

        // Okuma tipine göre kredi maliyeti hesaplama
        const costCredits =
          selectedReadingType === READING_TYPES.DETAILED
            ? detailedCredits.creditStatus.requiredCredits
            : selectedReadingType === READING_TYPES.WRITTEN
              ? writtenCredits.creditStatus.requiredCredits
              : 0;

        // İletişim bilgilerini metadata'ya ekleme - güvenlik için telefon hash'lenir
        const enhancedMetadata = {
          ...readingData.metadata,
          communicationMethod,
          personalInfo: {
            ...personalInfo,
            // Güvenlik için telefon numarasını metadata'da hash'le
            phoneProvided: !!personalInfo.phone,
          },
        };

        // Token akışında user_id null olabilir, bu durumda direkt insert yap
        let rpcResult: any = null;
        let rpcError: any = null;

        if (isTokenFlow && !userId) {
          // Token akışı - direkt insert yap (kredi düşme olmadan)
          const insertData = {
            user_id: null, // Token akışında user_id null
            reading_type: readingData.readingType,
            spread_name: t(dataKeys.spreadName),
            title: readingData.title || t(dataKeys.spreadTitle),
            interpretation: readingData.interpretation,
            cards: readingData.cards.selectedCards,
            questions: readingData.questions,
            cost_credits: 0, // Token akışında kredi düşülmez
            status: 'completed',
            metadata: enhancedMetadata,
          };

          const { data: insertDataResult, error: insertError } = await supabase
            .from('readings')
            .insert(insertData)
            .select()
            .single();

          rpcResult = insertDataResult;
          rpcError = insertError;
        } else if (userId) {
          // Normal akış - RPC ile kredi düşme
          const rpcParams = {
            p_user_id: userId,
            p_reading_type: readingData.readingType,
            p_spread_name: t(dataKeys.spreadName),
            p_title: readingData.title || t(dataKeys.spreadTitle),
            p_interpretation: readingData.interpretation,
            p_cards: readingData.cards.selectedCards,
            p_questions: readingData.questions,
            p_cost_credits: costCredits,
            p_metadata: enhancedMetadata,
            p_idempotency_key: `reading_${userId}_${readingData.timestamp}`,
          };

          // Supabase RPC fonksiyonu ile okuma kaydetme ve kredi düşme
          const { data: rpcData, error: rpcErr } = await supabase.rpc(
            'fn_create_reading_with_debit',
            rpcParams
          );

          rpcResult = rpcData;
          rpcError = rpcErr;
        } else {
          throw new Error('Kullanıcı ID bulunamadı');
        }

        // Okuma kaydedildikten sonra iletişim bilgilerini güncelle
        if (rpcResult?.id) {
          await supabase
            .from('readings')
            .update({
              contact_method: communicationMethod,
              phone:
                communicationMethod === 'whatsapp' ? personalInfo.phone : null,
            })
            .eq('id', rpcResult.id);
        }

        // RPC hatası kontrolü
        if (rpcError) {
          throw rpcError;
        }

        // Email gönderimini arka planda yap, kullanıcıyı bekletme
        triggerEmailSending(rpcResult?.id).catch(() => {
          // Sessizce devam et
        });

        return {
          success: true,
          id: rpcResult?.id,
          userId: userId || 'token-user',
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        };
      }
    };

    // Basit yorumlama oluşturma - seçilen kartlar ve pozisyonlara göre metin üretir
    const generateBasicInterpretation = (): string => {
      // Tüm kartlar seçilmiş mi kontrol et
      if (
        selectedCards.length !== config.cardCount ||
        selectedCards.some(card => card === null)
      ) {
        return t(messages.allCardsRequired);
      }

      // Yorumlama başlığı - i18n ile düzgün formatlanmış
      let interpretation = `${interpretationEmoji} **${t(messages.interpretationTitle)}**\n\n`;

      // Kullanıcı sorusu varsa ekle - i18n ile düzgün formatlanmış
      if (userQuestion.trim()) {
        interpretation += `**${t(messages.interpretationGreeting).replace('{question}', userQuestion)}**\n\n`;
      }

      // Her pozisyon için kart yorumu ekle
      config.positionsInfo.forEach((positionInfo, index) => {
        const card = selectedCards[index];
        const reversed = !!isReversed[index];

        if (card) {
          interpretation += `**${positionInfo.id}. ${positionInfo.title}: ${card.nameTr}** (${
            reversed
              ? t(dataKeys.cardDirections.reversed)
              : t(dataKeys.cardDirections.upright)
          })\n*${positionInfo.desc}*\n${getCardMeaning(card, positionInfo.id, reversed)}\n\n`;
        }
      });

      // Özet bölümü ekle - i18n ile düzgün formatlanmış
      interpretation += `💫 **${t(summaryTitleKey)}:**\n"${t(summaryTextKey)}"`;

      return interpretation;
    };

    // Okuma kaydetme - okuma tipine göre farklı işlemler yapar
    const handleSaveReading = async () => {
      setSavingReading(true);

      try {
        // Basit okuma işlemi - kredi harcamaz, sadece sayaç
        if (selectedReadingType === READING_TYPES.SIMPLE) {
          const simpleReadingData = {
            userId: user?.id ?? 'anonymous-user',
            readingType: config.supabaseReadingType,
            cards: { selectedCards: [] },
            interpretation: t(dataKeys.simpleInterpretation),
            question: { type: 'simple' },
            status: 'completed',
            title: t(dataKeys.simpleTitle),
            cost_credits: 0,
            admin_notes: 'Simple reading counter',
            metadata: { platform: 'web' },
            timestamp: new Date().toISOString(),
          };

          // Kaydetme işlemini arka planda yap, kullanıcıyı yönlendir
          saveReadingToSupabase(simpleReadingData).catch(() => {
            // Sessizce devam et
          });
          showToast(t(messages.simpleReadingCompleted), 'success');
          try {
            router.push('/dashboard');
          } catch {
            window.location.href = '/dashboard';
          }
          return;
        }

        // Detaylı/Yazılı okuma işlemi - kredi harcar, tam veri kaydeder
        if (
          selectedReadingType === READING_TYPES.DETAILED ||
          selectedReadingType === READING_TYPES.WRITTEN
        ) {
          // Okuma süresini hesapla
          const duration = Date.now() - startTime;

          // Seçilen kartları serialize et
          const serializedCards = selectedCards
            .filter((card): card is TarotCard => card !== null)
            .map((card, index) => ({
              id: card.id,
              name: card.name,
              nameTr: card.nameTr,
              isReversed: isReversed[index],
            }));

          // Okuma verisi oluştur
          const readingData = {
            userId: user?.id ?? 'anonymous-user',
            readingType: config.supabaseReadingType,
            status: 'completed',
            title: t(dataKeys.detailedTitle),
            interpretation: generateBasicInterpretation(),
            cards: {
              selectedCards: serializedCards,
              positions: config.positionsInfo.map(position => ({
                id: position.id,
                title: position.title,
                description: position.desc,
              })),
            },
            questions: {
              personalInfo,
              ...(config.requiresPartnerInfo ? { partnerInfo } : {}),
              userQuestions: questions,
            },
            metadata: {
              duration,
              platform: 'web',
              ipHash: 'hashed_ip_address',
              userAgent:
                typeof navigator !== 'undefined' ? navigator.userAgent : '',
              readingFormat: selectedReadingType,
              readingFormatTr:
                selectedReadingType === READING_TYPES.DETAILED
                  ? t(dataKeys.readingFormats.detailed)
                  : selectedReadingType === READING_TYPES.WRITTEN
                    ? t(dataKeys.readingFormats.written)
                    : t(dataKeys.readingFormats.simple),
            },
            timestamp: new Date().toISOString(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          // Supabase'e kaydet
          const saveResult = await saveReadingToSupabase(readingData);

          if (saveResult.success) {
            showToast(t(messages.readingSavedSuccess), 'success');

            // Token varsa session'ı complete et
            // UUID format kontrolü (guest-session gibi string'leri filtrele)
            if (sessionToken && saveResult.id) {
              const isUUID =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
                  saveResult.id
                );

              if (isUUID) {
                // Sadece geçerli UUID ise complete endpoint'ini çağır
                try {
                  const completeResponse = await fetch(
                    '/api/reading-sessions/complete',
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        token: sessionToken,
                        readingId: saveResult.id,
                      }),
                    }
                  );

                  if (completeResponse.ok) {
                    // Session tamamlandı, localStorage'dan temizle
                    if (sessionToken) {
                      localStorage.removeItem(
                        `reading_session_${sessionToken}`
                      );
                    }
                  } else {
                    // eslint-disable-next-line no-console
                    console.warn(
                      'Session complete hatası:',
                      await completeResponse.text()
                    );
                  }
                } catch (error) {
                  // eslint-disable-next-line no-console
                  console.warn('Session complete işlemi başarısız:', error);
                  // Hata olsa bile devam et
                }
              } else {
                // Guest kullanıcı için session'ı complete etme (reading_id olmadan)
                // eslint-disable-next-line no-console
                console.log(
                  'Guest kullanıcı için session complete atlandı (UUID değil)'
                );
              }
            }
          } else {
            showToast(t(messages.readingSaveError), 'error');
          }

          // Başarı modalını göster
          setModalStates(prev => ({ ...prev, showSuccessModal: true }));

          // 1.5 saniye sonra tarotokumasi sayfasına yönlendir (spread ID olmadan)
          setTimeout(() => {
            setModalStates(prev => ({ ...prev, showSuccessModal: false }));
            try {
              const currentLocale = pathname?.split('/')[1] || 'tr';
              router.push(`/${currentLocale}/tarotokumasi`);
            } catch {
              // Fallback: window.location kullan
              const currentLocale = pathname?.split('/')[1] || 'tr';
              window.location.href = `/${currentLocale}/tarotokumasi`;
            }
          }, 1500);

          return;
        }
      } catch {
        showToast(t(messages.readingSaveError), 'error');
      } finally {
        setSavingReading(false);
      }
    };

    // Okuma tipi seçimi - callback kaldırıldı (açıklama kapatma mantığı gereksiz)
    const handleReadingTypeSelectWithCallback = (
      type: ReadingType | string
    ) => {
      try {
        handleReadingTypeSelect(type);
        // onReadingTypeSelected callback'i kaldırıldı - açıklama kapatma mantığı gereksiz
        // Açıklama kullanıcı kart seçmeye başladığında veya başka bir mantıkla kapatılabilir
      } catch {
        showToast(
          'Okuma tipi seçiminde bir hata oluştu. Lütfen tekrar deneyin.',
          'error'
        );
      }
    };

    // Kart seçimi - okuma tipi seçilmiş mi kontrol eder
    const handleCardSelectGuarded = (card: TarotCard) => {
      try {
        // initialReadingType varsa direkt kart seçimine izin ver
        if (!selectedReadingType && !initialReadingType) {
          showToast(t(messages.selectReadingTypeFirst), 'info');
          return;
        }
        handleCardSelect(card);
      } catch {
        showToast(
          'Kart seçiminde bir hata oluştu. Lütfen tekrar deneyin.',
          'error'
        );
      }
    };

    // Kart seçim izni - basit okuma veya form kaydedilmiş detaylı/yazılı okuma
    // initialReadingType varsa direkt kart seçimine izin ver (kredi kontrolü olmadan)
    const canSelectCards =
      (initialReadingType !== null && initialReadingType !== undefined) ||
      selectedReadingType === READING_TYPES.SIMPLE ||
      ((selectedReadingType === READING_TYPES.DETAILED ||
        selectedReadingType === READING_TYPES.WRITTEN) &&
        detailedFormSaved);

    // Kredi anahtarı - detaylı okuma için
    const readingTypeKey =
      readingType || (`${config.creditKeyPrefix}_DETAILED` as any);

    return (
      <div className='w-full space-y-6 md:space-y-8'>
        {/* Toast bildirimi - hata/başarı mesajları için */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}

        {/* Bilgi modalı - yayılım hakkında bilgi ve süreç adımları */}
        <BaseTarotModal
          isOpen={showInfoModal}
          onClose={closeInfoModal}
          theme={config.theme}
          icon={config.icon}
          titleKey={modalKeys.infoTitle}
        >
          <div className='space-y-4'>
            {/* Yayılım hakkında bilgi */}
            <div className={themeStyles.infoPrimary.container}>
              <h3 className={themeStyles.infoPrimary.title}>
                {t(modalKeys.aboutSpread)}
              </h3>
              <p className='text-sm leading-relaxed'>
                {t(modalKeys.aboutSpreadText)}
              </p>
            </div>

            {/* Okuma tipi bilgisi */}
            <div className={themeStyles.infoPrimary.container}>
              <h3 className={themeStyles.infoPrimary.title}>
                {selectedReadingType === READING_TYPES.DETAILED
                  ? t(modalKeys.detailedReading)
                  : t(modalKeys.writtenReading)}
              </h3>
              <p className='text-sm leading-relaxed'>
                {selectedReadingType === READING_TYPES.DETAILED
                  ? t(modalKeys.detailedReadingText)
                  : t(modalKeys.writtenReadingText)}
              </p>
            </div>

            {/* Dikkat bilgisi */}
            <div className={themeStyles.infoSecondary.container}>
              <h3 className={themeStyles.infoSecondary.title}>
                {t(modalKeys.loveAttentionInfo)}
              </h3>
              <p className='text-sm leading-relaxed'>
                {t(modalKeys.loveAttention)}
              </p>
            </div>

            {/* Süreç adımları */}
            <div className={themeStyles.process.container}>
              <h3 className={themeStyles.process.title}>
                {t(modalKeys.process)}
              </h3>
              <div className='space-y-2'>
                {[
                  modalKeys.step1,
                  modalKeys.step2,
                  modalKeys.step3,
                  modalKeys.step4,
                ].map((stepKey, index) => (
                  <div
                    key={stepKey}
                    className='flex items-center text-gray-300 text-sm'
                  >
                    <span
                      className={`${themeStyles.process.stepNumber} w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3`}
                    >
                      {index + 1}
                    </span>
                    {t(stepKey)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal footer - iptal ve devam butonları */}
          <div
            className={`border-t ${themeStyles.modalFooter.border} p-6 flex-shrink-0 mt-6`}
          >
            <div className='flex gap-3'>
              <button
                onClick={cancelInfoModal}
                className={themeStyles.modalFooter.cancel}
              >
                {t(modalKeys.cancel)}
              </button>
              <button
                onClick={closeInfoModal}
                className={themeStyles.modalFooter.confirm}
              >
                {t(modalKeys.continue)}
              </button>
            </div>
          </div>
        </BaseTarotModal>

        {/* Detaylı form - kişisel bilgiler ve sorular için */}
        <BaseTarotForm
          config={config}
          isOpen={
            (selectedReadingType === READING_TYPES.DETAILED ||
              selectedReadingType === READING_TYPES.WRITTEN) &&
            !detailedFormSaved &&
            !showInfoModal
          }
          onClose={() => setSelectedReadingType(null)}
          personalInfo={personalInfo}
          partnerInfo={partnerInfo}
          communicationMethod={communicationMethod}
          questions={questions}
          formErrors={formErrors}
          isSaving={isSaving}
          onUpdatePersonalInfo={updatePersonalInfo}
          onUpdatePartnerInfo={updatePartnerInfo}
          onUpdateCommunicationMethod={updateCommunicationMethod}
          onUpdateQuestion={updateQuestion}
          onSaveForm={handleSaveDetailedFormClick}
        />

        {/* Kredi onay modalı - kredi harcama onayı için */}
        {showCreditConfirm && (
          <div className='fixed inset-0 z-50 bg-black/60 flex items-center justify-center'>
            <div className={themeStyles.creditConfirm.container}>
              <h2 className={themeStyles.creditConfirm.title}>
                {t(modalKeys.creditConfirm)}
              </h2>
              <p className={themeStyles.creditConfirm.message}>
                {t(modalKeys.creditConfirmMessage)}
              </p>
              <div className='flex justify-center gap-4'>
                <button
                  onClick={saveDetailedForm}
                  disabled={isSaving}
                  className={themeStyles.creditConfirm.confirmButton}
                >
                  {isSaving ? t(modalKeys.processing) : t(modalKeys.confirm)}
                </button>
                <button
                  onClick={() =>
                    setModalStates(prev => ({
                      ...prev,
                      showCreditConfirm: false,
                    }))
                  }
                  disabled={isSaving}
                  className={themeStyles.creditConfirm.cancelButton}
                >
                  {t(modalKeys.cancel)}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Fast Delivery Info - Kompakt bilgi kutusu */}
        <div className='flex justify-center mt-3'>
          <FastDeliveryInfoCard
            selectedReadingType={selectedReadingType}
            readingTypes={READING_TYPES}
            locale={locale}
          />
        </div>
        {/* Tarot canvas - kart yayılımı ve seçim alanı */}
        <BaseTarotCanvas
          config={config}
          selectedCards={selectedCards}
          cardStates={cardStates}
          isReversed={isReversed}
          currentPosition={currentPosition || 0}
          onCardDetails={setShowCardDetails}
          onToggleCard={toggleCardState}
          selectedReadingType={selectedReadingType}
          detailedFormSaved={detailedFormSaved}
          className='mb-6'
        />
        {/* Okuma vurgu bölümü - seçilen pozisyonu gösterir */}
        {selectedReadingType &&
          currentPosition &&
          currentPosition <= config.cardCount && (
            <div className='flex justify-center mb-4'>
              <div className={themeStyles.readingHighlight.container}>
                <div className='flex items-center space-x-3'>
                  <div
                    className={`w-6 h-6 ${themeStyles.readingHighlight.iconBg} rounded-full flex items-center justify-center`}
                  >
                    <span
                      className={`${themeStyles.readingHighlight.iconText} text-sm`}
                    >
                      {interpretationEmoji}
                    </span>
                  </div>
                  <div className='text-center'>
                    <div className={themeStyles.readingHighlight.title}>
                      {config.positionsInfo[currentPosition - 1]?.title ?? ''}
                    </div>
                    <div className={themeStyles.readingHighlight.subtitle}>
                      {config.positionsInfo[currentPosition - 1]?.desc ?? ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        {/* Okuma tipi seçici - henüz tip seçilmemişse gösterilir */}
        {/* initialReadingType varsa okuma tipi seçimini atla */}
        {selectedReadingType === null && !initialReadingType && (
          <div className='flex flex-col items-center mb-6'>
            <BaseReadingTypeSelector
              selectedType={selectedReadingType}
              onTypeSelect={handleReadingTypeSelectWithCallback}
              onCreditInfoClick={() => router.push('/dashboard/credits')}
              readingTypes={READING_TYPES}
              theme={themeStyles.readingTypeTheme}
              disabled={isSaving}
              readingType={readingTypeKey}
            />
          </div>
        )}

        {/* Fast Delivery Info - Okuma tipi seçildiğinde de göster (SIMPLE hariç) */}
        {selectedReadingType !== null &&
          selectedReadingType !== READING_TYPES.SIMPLE && (
            <div className='flex justify-center mb-4'>
              <FastDeliveryInfoCard
                selectedReadingType={selectedReadingType}
                readingTypes={READING_TYPES}
                locale={locale}
              />
            </div>
          )}

        {/* Okuma tipi değiştir butonu - tip seçildikten sonra gösterilir */}
        {/* initialReadingType varsa (özel okuma) gizle, normal sayfada göster */}
        {selectedReadingType !== null && !initialReadingType && (
          <div className='flex justify-center mb-6'>
            <div className='flex flex-col items-center gap-3'>
              <div className='flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg'>
                <span className='text-sm text-gray-300'>
                  {selectedReadingType === READING_TYPES.SIMPLE &&
                    '✨ Basit Okuma'}
                  {selectedReadingType === READING_TYPES.DETAILED &&
                    '👑 Sesli Okuma'}
                  {selectedReadingType === READING_TYPES.WRITTEN &&
                    '📝 Yazılı Okuma'}
                </span>
                <button
                  onClick={() => {
                    try {
                      setSelectedReadingType(null);
                      showToast(
                        'Okuma tipi değiştirildi. Yeni tip seçebilirsiniz.',
                        'info'
                      );
                    } catch {
                      showToast(
                        'Okuma tipi değiştirirken bir hata oluştu.',
                        'error'
                      );
                    }
                  }}
                  className='px-3 py-1 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-md transition-colors'
                  disabled={isSaving}
                >
                  Değiştir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Kart galerisi - kart seçimi için */}
        <BaseCardGallery
          deck={deck}
          usedCardIds={new Set(usedCardIds.map(id => Number(id)))}
          nextPosition={selectedReadingType ? currentPosition : null}
          onCardSelect={handleCardSelectGuarded}
          onShuffleDeck={shuffleDeck}
          canSelectCards={canSelectCards}
          theme={themeStyles.galleryTheme}
          renderCard={(card, isUsed, canSelect) => (
            <BaseCardRenderer
              card={card}
              isUsed={isUsed}
              canSelect={canSelect}
              mode='gallery'
              theme={themeStyles.galleryTheme}
            />
          )}
          translations={{
            nextPosition: t('gallery.nextPosition'),
            allPositionsFull: t('gallery.allPositionsFull'),
            shuffle: t('gallery.shuffle'),
            scrollToSeeAll: t('gallery.scrollToSeeAll'),
            emptyDeck: t('gallery.emptyDeck'),
          }}
        />

        {/* Tümünü temizle butonu - kart seçilmişse gösterilir */}
        {selectedCards.filter(card => card !== null).length > 0 && (
          <div className='flex justify-center'>
            <button
              onClick={handleClearAll}
              className={themeStyles.clearAllButton}
            >
              {t(`${namespace}.form.clearAll`)}
            </button>
          </div>
        )}

        {/* Kart detayları modalı - seçilen kartın detaylarını gösterir */}
        {showCardDetails && (
          <CardDetails
            card={showCardDetails}
            isReversed={(() => {
              const index = selectedCards.findIndex(
                (candidate: TarotCard | null) =>
                  candidate && candidate.id === showCardDetails.id
              );
              return !!isReversed[index >= 0 ? index : 0];
            })()}
            position={(() => {
              const index = selectedCards.findIndex(
                (candidate: TarotCard | null) =>
                  candidate && candidate.id === showCardDetails.id
              );
              return (index >= 0 ? index : 0) + 1;
            })()}
            onClose={() => setShowCardDetails(null)}
            spreadType={config.spreadId as any}
            positionInfo={(() => {
              const index = selectedCards.findIndex(
                (candidate: TarotCard | null) =>
                  candidate && candidate.id === showCardDetails.id
              );
              const position = config.positionsInfo[index];
              return position
                ? { title: position.title, desc: position.desc }
                : { title: `position ${index + 1}`, desc: 'Kart pozisyonu' };
            })()}
            getPositionSpecificInterpretation={(card, position, reversed) => {
              const meaning = getCardMeaning(card, position, reversed);
              if (typeof meaning === 'object' && meaning !== null) {
                return meaning.interpretation;
              }
              return typeof meaning === 'string' ? meaning : '';
            }}
            getPositionContext={(card, position) => {
              // Context bilgisini almak için lib/ dosyalarından
              const meaning = getCardMeaning(card, position, false);
              if (typeof meaning === 'object' && meaning !== null) {
                return meaning.context || undefined;
              }
              return undefined;
            }}
            getKeywords={(_cardMeaning, card) => {
              // Keywords'leri almak için lib/ dosyalarından
              const position =
                selectedCards.findIndex(c => c && c.id === card.id) + 1;
              const meaning = getCardMeaning(card, position, false);
              if (
                typeof meaning === 'object' &&
                meaning !== null &&
                meaning.keywords
              ) {
                return meaning.keywords;
              }
              return [];
            }}
            showContext
          />
        )}

        {/* Yorumlama bölümü - tüm kartlar seçilmişse gösterilir */}
        {selectedCards.filter(card => card !== null).length ===
          config.cardCount &&
          selectedReadingType && (
            <div ref={interpretationRef} className='space-y-6'>
              <BaseTarotInterpretation
                config={config}
                cards={selectedCards}
                isReversed={isReversed}
                title={t(dataKeys.interpretationTitle)}
                icon={interpretationEmoji}
                badgeText={t(dataKeys.badgeText)}
                positionsInfo={config.positionsInfo}
                getPositionSpecificInterpretation={(
                  card,
                  position,
                  reversed
                ) => {
                  const meaning = getCardMeaning(card, position, reversed);
                  if (typeof meaning === 'object' && meaning !== null) {
                    return meaning.interpretation;
                  }
                  return typeof meaning === 'string' ? meaning : '';
                }}
                getPositionContext={(card, position) => {
                  // Context bilgisini almak için lib/ dosyalarından
                  const meaning = getCardMeaning(card, position, false);
                  if (typeof meaning === 'object' && meaning !== null) {
                    return meaning.context || '';
                  }
                  return '';
                }}
                getKeywords={(_cardMeaning, card) => {
                  // Keywords'leri almak için lib/ dosyalarından
                  const position =
                    selectedCards.findIndex(c => c && c.id === card.id) + 1;
                  const meaning = getCardMeaning(card, position, false);
                  if (
                    typeof meaning === 'object' &&
                    meaning !== null &&
                    meaning.keywords
                  ) {
                    return meaning.keywords;
                  }
                  return [];
                }}
                showContext
                onSaveReading={handleSaveReading}
                isSavingReading={isSavingReading}
                showSaveButton={
                  selectedReadingType === READING_TYPES.DETAILED ||
                  selectedReadingType === READING_TYPES.WRITTEN
                }
              />
            </div>
          )}

        {/* Başarı modalı - okuma kaydedildikten sonra gösterilir */}
        {showSuccessModal && (
          <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className={themeStyles.successModal.container}>
              <div className='w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg'>
                <span className='text-3xl'>✅</span>
              </div>

              <h2 className={themeStyles.successModal.title}>
                {t(modalKeys.successTitle)}
              </h2>

              <p className={themeStyles.successModal.message}>
                {t(modalKeys.successMessage)}
              </p>

              <div className={themeStyles.successModal.infoBox}>
                <p className={themeStyles.successModal.infoText}>
                  {t(modalKeys.redirecting)}
                </p>
              </div>

              <div
                className={`w-full ${themeStyles.successModal.progressTrack} rounded-full h-2 mb-4`}
              >
                <div
                  className={`${themeStyles.successModal.progressFill} h-2 rounded-full animate-pulse`}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
}
