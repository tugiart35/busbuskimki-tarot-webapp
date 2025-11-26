/*
info:
Bağlantılı dosyalar:
- lib/supabase/client.ts: Supabase bağlantısı (gerekli)
- components/admin/ReadingDetailModal.tsx: Okuma detay modalı (gerekli)
- hooks/useToast.ts: Toast notification sistemi (gerekli)
- components/shared/ui/LoadingSpinner.tsx: Loading skeleton'ları (gerekli)

Dosyanın amacı:
- Admin paneli okuma yönetimi sayfası
- Kullanıcıların yaptığı tarot okumalarını görüntüleme ve yönetme
- Okuma detaylarını inceleme
- Okuma istatistikleri

Supabase değişkenleri ve tabloları:
- readings: Tarot okumaları
- profiles: Kullanıcı bilgileri (join edilmiş)

Geliştirme önerileri:
- Okuma filtreleme seçenekleri
- Export özelliği
- Real-time güncellemeler
- Okuma kategorileri

Tespit edilen hatalar:
- ✅ Veritabanı şemasına uygun sorgular
- ✅ Kullanıcı bilgileri entegrasyonu
- ✅ Hata yönetimi

Kullanım durumu:
- ✅ Gerekli: Admin okuma yönetimi
- ✅ Production-ready: Tam fonksiyonel
*/

'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { logError, logSupabaseError, logDebug } from '@/lib/logger';
import { useToast } from '@/hooks/useToast';
import Toast from '@/features/shared/ui/Toast';
import {
  useReadingCards,
  type NormalizedTarotReadingType,
} from '@/hooks/useReadingCards';
import { useTarotDeck } from '@/features/tarot/lib/full-tarot-deck';
import type { TarotCard } from '@/types/tarot';
import type { Reading as DashboardReading } from '@/types/dashboard.types';
import { tarotSpreads } from '@/lib/constants/tarotSpreads';
import { useTranslations } from '@/hooks/useTranslations';
import {
  CardSkeleton,
  TableSkeleton,
} from '@/components/shared/ui/LoadingSpinner';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Star,
  BookOpen,
  Sparkles,
  Heart,
  Briefcase,
  Target,
  Mic,
  FileText,
  User,
  Calendar,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  X,
  Copy,
  ExternalLink,
} from 'lucide-react';

interface Reading {
  id: string;
  user_id: string;
  reading_type: string;
  spread_name: string;
  title: string;
  interpretation: string;
  cards?: any;
  questions?: any;
  cost_credits: number;
  status: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  user_display_name?: string;
  user_email?: string;
  session?: {
    id: string;
    status: string;
    customer_email?: string;
    customer_name?: string;
    token_preview?: string;
    created_at: string;
    completed_at?: string;
    expires_at?: string;
  } | null;
}

interface TokenReading {
  id: string;
  session_id: string;
  customer_email?: string;
  customer_first_name?: string;
  customer_last_name?: string;
  customer_name?: string;
  spread_key?: string;
  spread_name?: string;
  reading_type?: 'detailed' | 'written';
  status: string;
  token_preview?: string;
  created_at: string;
  completed_at?: string;
  expires_at?: string;
  reading_id?: string;
  reading?: Reading | null;
  formResponse?: any; // Form response verileri (reading_form_responses tablosundan)
  reading_link?: string; // Gönderilen okuma linki
}

// Kart detayları için bileşen
interface CardInsightProps {
  card: TarotCard;
  displayName: string;
  positionTitle: string;
  positionNumber: number;
  isReversed: boolean;
  meaning: string;
  keywords: string[];
  context: string;
  group: string;
}

function CardInsight({
  displayName,
  positionTitle,
  positionNumber,
  isReversed,
  meaning = '',
  keywords = [],
  context = '',
  group = '',
}: CardInsightProps) {
  return (
    <div className='group relative admin-glass rounded-2xl p-6 border border-slate-700/30 hover:border-purple-500/50 transition-all duration-300'>
      {/* Kart Başlığı */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg'>
            {positionNumber}
          </div>
          <div>
            <h5 className='text-white font-bold text-lg'>{displayName}</h5>
            <p className='text-sm text-slate-400'>{positionTitle}</p>
          </div>
        </div>
        <div className='flex flex-col items-end space-y-2'>
          {isReversed && (
            <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30'>
              Ters
            </span>
          )}
          {group && (
            <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30'>
              {group}
            </span>
          )}
        </div>
      </div>

      {/* Kart Anlamı */}
      {meaning && (
        <div className='mb-4'>
          <div className='flex items-center space-x-2 mb-2'>
            <div className='w-2 h-2 bg-purple-400 rounded-full'></div>
            <p className='text-slate-400 text-sm font-medium'>ANLAM</p>
          </div>
          <p className='text-white leading-relaxed'>{meaning}</p>
        </div>
      )}

      {/* Context */}
      {context && (
        <div className='mb-4'>
          <div className='flex items-center space-x-2 mb-2'>
            <div className='w-2 h-2 bg-green-400 rounded-full'></div>
            <p className='text-slate-400 text-sm font-medium'>BAĞLAM</p>
          </div>
          <p className='text-slate-300 text-sm leading-relaxed'>{context}</p>
        </div>
      )}

      {/* Keywords */}
      {keywords && keywords.length > 0 && (
        <div className='mb-4'>
          <div className='flex items-center space-x-2 mb-3'>
            <div className='w-2 h-2 bg-yellow-400 rounded-full'></div>
            <p className='text-slate-400 text-sm font-medium'>
              ANAHTAR KELİMELER
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            {keywords.map((keyword, keywordIndex) => (
              <span
                key={keywordIndex}
                className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Hover Effect */}
      <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
    </div>
  );
}

export default function ReadingsPage() {
  const { t } = useTranslations();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [tokenReadings, setTokenReadings] = useState<TokenReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'normal' | 'token'>('normal');
  const { toast, showToast, hideToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [tokenTotalCount, setTokenTotalCount] = useState(0);
  const [selectedReading, setSelectedReading] = useState<Reading | null>(null);
  const [showReadingModal, setShowReadingModal] = useState(false);
  const [showCreateReadingModal, setShowCreateReadingModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tokenStatusFilter, setTokenStatusFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    totalCredits: 0,
  });
  const [tokenStats, setTokenStats] = useState({
    total: 0,
    completed: 0,
    invited: 0,
    expired: 0,
    cancelled: 0,
  });

  // Ref to track active fetch ID to prevent race conditions
  const activeFetchIdRef = useRef<number>(0);

  const readingsPerPage = 12;

  // Tarot destesi - şimdilik kullanılmıyor ama gelecekte kullanılabilir
  useTarotDeck();

  // Seçilen okuma türünü normalize et
  const normalizedType = useMemo<NormalizedTarotReadingType | null>(() => {
    if (!selectedReading?.reading_type) {
      return null;
    }

    const readingType = selectedReading.reading_type.toLowerCase();

    // Tam eşleşme kontrolü önce
    if (readingType === 'love' || readingType === 'aşk') {
      return 'love';
    } else if (readingType === 'career' || readingType === 'kariyer') {
      return 'career';
    } else if (readingType === 'money' || readingType === 'para') {
      return 'money';
    } else if (readingType === 'problem-solving' || readingType === 'problem') {
      return 'problemSolving';
    } else if (
      readingType === 'situation-analysis' ||
      readingType === 'durum'
    ) {
      return 'situationAnalysis';
    } else if (
      readingType === 'relationship-analysis' ||
      readingType === 'ilişki analizi'
    ) {
      return 'relationshipAnalysis';
    } else if (
      readingType === 'relationship-problems' ||
      readingType === 'ilişki problemleri'
    ) {
      return 'relationshipProblems';
    } else if (readingType === 'new-lover' || readingType === 'yeni aşk') {
      return 'newLover';
    } else if (readingType === 'marriage' || readingType === 'evlilik') {
      return 'marriage';
    }

    // Kısmi eşleşme kontrolü
    if (readingType.includes('love') || readingType.includes('aşk')) {
      return 'love';
    } else if (
      readingType.includes('career') ||
      readingType.includes('kariyer')
    ) {
      return 'career';
    } else if (readingType.includes('money') || readingType.includes('para')) {
      return 'money';
    } else if (
      readingType.includes('problem-solving') ||
      readingType.includes('problem')
    ) {
      return 'problemSolving';
    } else if (
      readingType.includes('situation-analysis') ||
      readingType.includes('durum')
    ) {
      return 'situationAnalysis';
    } else if (
      readingType.includes('relationship-analysis') ||
      readingType.includes('ilişki analizi')
    ) {
      return 'relationshipAnalysis';
    } else if (
      readingType.includes('relationship-problems') ||
      readingType.includes('ilişki problemleri')
    ) {
      return 'relationshipProblems';
    } else if (
      readingType.includes('new-lover') ||
      readingType.includes('yeni aşk')
    ) {
      return 'newLover';
    } else if (
      readingType.includes('marriage') ||
      readingType.includes('evlilik')
    ) {
      return 'marriage';
    }

    return null;
  }, [selectedReading?.reading_type]);

  // useReadingCards hook'unu kullanarak kart detaylarını al
  const cardDetails = useReadingCards(
    selectedReading as unknown as DashboardReading,
    null,
    normalizedType
  );

  const fetchStats = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('readings')
        .select('reading_type, status, cost_credits');

      if (error) {
        logSupabaseError('readings stats fetch', error);
        return;
      }

      const readingsData = data || [];
      const completed = readingsData.filter(
        (r: any) => r.status === 'completed'
      ).length;
      const pending = readingsData.filter(
        (r: any) => r.status === 'pending'
      ).length;
      const failed = readingsData.filter(
        (r: any) => r.status === 'failed'
      ).length;
      const totalCredits = readingsData.reduce(
        (sum: number, r: any) => sum + (r.cost_credits || 0),
        0
      );

      setStats({
        total: readingsData.length,
        completed,
        pending,
        failed,
        totalCredits,
      });
    } catch (error) {
      logError('Error fetching reading stats', error);
    }
  }, []);

  const fetchReadings = useCallback(async () => {
    // Generate unique fetch ID to prevent race conditions
    const fetchId = ++activeFetchIdRef.current;
    setLoading(true);

    const timeoutId = setTimeout(() => {
      // Only clear loading if this is still the active fetch
      if (fetchId === activeFetchIdRef.current) {
        logError(
          'fetchReadings timeout - forcing loading to false',
          undefined,
          {
            action: 'fetchReadingsTimeout',
            metadata: { fetchId },
          }
        );
        setLoading(false);
      }
    }, 30000); // 30 saniye timeout

    try {
      // Toplam okuma sayısını al
      let countQuery = supabase
        .from('readings')
        .select('*', { count: 'exact' });

      // Tip filtresi
      if (typeFilter !== 'all') {
        countQuery = countQuery.eq('reading_type', typeFilter);
      }

      // Durum filtresi
      if (statusFilter !== 'all') {
        countQuery = countQuery.eq('status', statusFilter);
      }

      // Arama terimi
      if (searchTerm) {
        countQuery = countQuery.or(
          `title.ilike.%${searchTerm}%,spread_name.ilike.%${searchTerm}%,interpretation.ilike.%${searchTerm}%`
        );
      }

      const { count } = await countQuery;
      setTotalCount(count || 0);

      // Readings query - önce sadece readings'i çek
      let query = supabase
        .from('readings')
        .select('*')
        .range(
          (currentPage - 1) * readingsPerPage,
          currentPage * readingsPerPage - 1
        )
        .order('created_at', { ascending: false });

      // Tip filtresi
      if (typeFilter !== 'all') {
        query = query.eq('reading_type', typeFilter);
      }

      // Durum filtresi
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Arama terimi
      if (searchTerm) {
        query = query.or(
          `title.ilike.%${searchTerm}%,spread_name.ilike.%${searchTerm}%,interpretation.ilike.%${searchTerm}%`
        );
      }

      const { data: readingsData, error } = await query;

      if (error) {
        clearTimeout(timeoutId);
        logSupabaseError('readings fetch', error);
        setReadings([]);
        // Only clear loading if this is still the active fetch
        if (fetchId === activeFetchIdRef.current) {
          setLoading(false);
        }
        return;
      }

      // Kullanıcı bilgilerini ayrı ayrı çek
      const userIds = [
        ...new Set(
          (readingsData || []).map((r: any) => r.user_id).filter(Boolean)
        ),
      ];

      const profilesMap = new Map();

      // Only fetch profiles if there are user IDs
      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, display_name')
          .in('id', userIds);

        if (profilesError) {
          logSupabaseError('profiles fetch', profilesError, {
            resource: 'profiles',
            metadata: {
              userIdsCount: userIds.length,
              sampleUserIds: userIds.slice(0, 5), // Log first 5 IDs for debugging
            },
          });
        }

        // Profiles'ı user_id'ye göre map'le
        (profilesData || []).forEach((profile: any) => {
          profilesMap.set(profile.id, profile);
        });
      }

      // Format readings safely with user data
      const formattedReadings = (readingsData || []).map((reading: any) => {
        const profile = profilesMap.get(reading.user_id);
        // spread_name bir translation key olabilir, çevirmeyi dene
        let spreadName = reading.spread_name || 'Bilinmeyen Yayılım';
        if (reading.spread_name && reading.spread_name.includes('.')) {
          const translated = t(reading.spread_name);
          if (translated && translated !== reading.spread_name) {
            spreadName = translated;
          }
        }
        return {
          id: reading.id || 'unknown',
          user_id: reading.user_id || 'unknown',
          reading_type: reading.reading_type || 'unknown',
          spread_name: spreadName,
          title: reading.title || 'Okuma',
          interpretation: reading.interpretation || 'Açıklama yok',
          cards: reading.cards || null,
          questions: reading.questions || null,
          cost_credits: reading.cost_credits || 0,
          status: reading.status || 'pending',
          metadata: reading.metadata || null,
          created_at: reading.created_at || new Date().toISOString(),
          updated_at: reading.updated_at || new Date().toISOString(),
          // Kullanıcı bilgileri
          user_email: profile?.email || 'Bilinmeyen',
          user_display_name: profile?.display_name || 'Bilinmeyen Kullanıcı',
        };
      });

      setReadings(formattedReadings);
    } catch (error) {
      logError('Error fetching readings', error);
      showToast('Okumalar yüklenirken hata oluştu', 'error');
      setReadings([]);
    } finally {
      clearTimeout(timeoutId);
      // Only clear loading if this is still the active fetch
      if (fetchId === activeFetchIdRef.current) {
        setLoading(false);
      }
    }
  }, [currentPage, searchTerm, typeFilter, statusFilter, showToast, t]);

  // Token okumaları için fetch fonksiyonu
  const fetchTokenReadings = useCallback(async () => {
    // Generate unique fetch ID to prevent race conditions
    const fetchId = ++activeFetchIdRef.current;
    setLoading(true);

    const timeoutId = setTimeout(() => {
      // Only clear loading if this is still the active fetch
      if (fetchId === activeFetchIdRef.current) {
        logError(
          'fetchTokenReadings timeout - forcing loading to false',
          undefined,
          {
            action: 'fetchTokenReadingsTimeout',
            metadata: { fetchId },
          }
        );
        setLoading(false);
      }
    }, 30000); // 30 saniye timeout

    try {
      // Toplam token okuma sayısını al
      let countQuery = supabase
        .from('reading_sessions')
        .select('*', { count: 'exact' });

      // Durum filtresi
      if (tokenStatusFilter !== 'all') {
        countQuery = countQuery.eq('status', tokenStatusFilter);
      }

      // Arama terimi
      if (searchTerm) {
        countQuery = countQuery.or(
          `customer_email.ilike.%${searchTerm}%,customer_first_name.ilike.%${searchTerm}%,customer_last_name.ilike.%${searchTerm}%,spread_key.ilike.%${searchTerm}%`
        );
      }

      const { count } = await countQuery;
      setTokenTotalCount(count || 0);

      // Token readings query
      let query = supabase
        .from('reading_sessions')
        .select('*')
        .range(
          (currentPage - 1) * readingsPerPage,
          currentPage * readingsPerPage - 1
        )
        .order('created_at', { ascending: false });

      // Durum filtresi
      if (tokenStatusFilter !== 'all') {
        query = query.eq('status', tokenStatusFilter);
      }

      // Arama terimi
      if (searchTerm) {
        query = query.or(
          `customer_email.ilike.%${searchTerm}%,customer_first_name.ilike.%${searchTerm}%,customer_last_name.ilike.%${searchTerm}%,spread_key.ilike.%${searchTerm}%`
        );
      }

      const { data: sessionsData, error } = await query;

      if (error) {
        clearTimeout(timeoutId);
        logSupabaseError('token readings fetch', error);
        setTokenReadings([]);
        // Only clear loading if this is still the active fetch
        if (fetchId === activeFetchIdRef.current) {
          setLoading(false);
        }
        return;
      }

      // Reading ID'leri topla
      const readingIds = (sessionsData || [])
        .map((s: any) => s.reading_id)
        .filter((id: string) => id !== null);

      // İlgili reading'leri çek
      const readingsMap = new Map();
      if (readingIds.length > 0) {
        const { data: readingsData } = await supabase
          .from('readings')
          .select('*')
          .in('id', readingIds);

        (readingsData || []).forEach((reading: any) => {
          readingsMap.set(reading.id, reading);
        });
      }

      // Session ID'leri topla
      const sessionIds = (sessionsData || []).map((s: any) => s.id);

      // Form response'ları çek (token okumaları için)
      const formResponsesMap = new Map();
      if (sessionIds.length > 0) {
        const { data: formResponsesData } = await supabase
          .from('reading_form_responses')
          .select('session_id, payload')
          .in('session_id', sessionIds);

        (formResponsesData || []).forEach((formResponse: any) => {
          formResponsesMap.set(formResponse.session_id, formResponse.payload);
        });
      }

      // Reading events'ten link'leri çek (token okumaları için)
      const readingLinksMap = new Map();
      if (sessionIds.length > 0) {
        const { data: eventsData } = await supabase
          .from('reading_events')
          .select('session_id, metadata')
          .eq('event_type', 'session_created')
          .in('session_id', sessionIds);

        (eventsData || []).forEach((event: any) => {
          if (event.metadata?.reading_link) {
            readingLinksMap.set(event.session_id, event.metadata.reading_link);
          }
        });
      }

      // Spread bilgilerini al ve çevir
      const spreadKeys: string[] = Array.from(
        new Set(
          (sessionsData || [])
            .map((s: any) => s.spread_key)
            .filter(Boolean) as string[]
        )
      );
      const spreadMap = new Map();
      spreadKeys.forEach((key: string) => {
        const spread = tarotSpreads.find(s => s.id === key);
        if (spread) {
          // spread.name bir translation key olduğu için çevir
          const translatedName = t(spread.name);
          spreadMap.set(key, translatedName || spread.name);
        }
      });

      // Format token readings
      const formattedTokenReadings: TokenReading[] = (sessionsData || []).map(
        (session: any) => {
          const reading = readingsMap.get(session.reading_id);
          const formResponse = formResponsesMap.get(session.id);
          const readingLink = readingLinksMap.get(session.id);
          const customerName =
            session.customer_first_name || session.customer_last_name
              ? `${session.customer_first_name || ''} ${session.customer_last_name || ''}`.trim()
              : null;

          // Eğer reading varsa ve form response varsa, form verilerini reading'e ekle
          let readingWithFormData = reading;
          if (reading && formResponse) {
            // reading.questions'ı parse et (eğer string ise)
            let parsedQuestions = reading.questions;
            if (typeof reading.questions === 'string') {
              try {
                parsedQuestions = JSON.parse(reading.questions);
              } catch {
                parsedQuestions = reading.questions;
              }
            }

            // Form response'u öncelikli yap (token okumalarında form verileri daha önemli)
            // Form response ile reading.questions'ı birleştir
            // Form response içinde personalInfo, partnerInfo, questions gibi alanlar var
            const mergedQuestions = parsedQuestions
              ? {
                  ...formResponse, // Form response öncelikli (personalInfo, partnerInfo, questions)
                  ...parsedQuestions, // Reading'deki diğer veriler
                }
              : formResponse;

            readingWithFormData = {
              ...reading,
              questions: mergedQuestions,
            };
          } else if (reading && !reading.questions && formResponse) {
            // Reading'de questions yoksa, form response'u ekle
            readingWithFormData = {
              ...reading,
              questions: formResponse,
            };
          }

          // Token okumalarında reading objesi eksik alanlar içerebilir, bu yüzden session bilgilerini ekle
          if (readingWithFormData) {
            // reading_type Supabase'den gelen reading objesinde spread adı olarak gelir (love, career, vb.)
            // Eğer yoksa spread_key'den türet
            const readingType =
              readingWithFormData.reading_type ||
              session.spread_key ||
              'general';

            readingWithFormData = {
              ...readingWithFormData,
              reading_type: readingType,
              // Token reading'lerde user bilgilerini personalInfo'dan veya customer_email'den al
              user_display_name:
                readingWithFormData.questions?.personalInfo?.name ||
                customerName ||
                session.customer_email ||
                'Bilinmeyen Kullanıcı',
              user_email:
                readingWithFormData.questions?.personalInfo?.email ||
                session.customer_email ||
                'Bilinmeyen',
              // Session bilgilerini ekle
              session: {
                id: session.id,
                status: session.status,
                customer_email: session.customer_email,
                customer_name: customerName,
                token_preview: session.token_preview,
                created_at: session.created_at,
                completed_at: session.completed_at,
                expires_at: session.expires_at,
              },
              // Metadata'ya reading format bilgisini ekle (detailed/written)
              metadata: {
                ...readingWithFormData.metadata,
                readingFormat:
                  session.reading_type ||
                  readingWithFormData.metadata?.readingFormat,
              },
            };
          }

          return {
            id: session.id,
            session_id: session.id,
            customer_email: session.customer_email,
            customer_first_name: session.customer_first_name,
            customer_last_name: session.customer_last_name,
            customer_name: customerName,
            spread_key: session.spread_key,
            spread_name:
              spreadMap.get(session.spread_key) ||
              session.spread_key ||
              'Bilinmeyen',
            reading_type: session.reading_type,
            status: session.status,
            token_preview: session.token_preview,
            created_at: session.created_at,
            completed_at: session.completed_at,
            expires_at: session.expires_at,
            reading_id: session.reading_id,
            reading: readingWithFormData || null,
            formResponse: formResponse || null, // Form response'u ayrıca sakla
            reading_link: readingLink || null, // Gönderilen okuma linki
          };
        }
      );

      setTokenReadings(formattedTokenReadings);
    } catch (error) {
      logError('Error fetching token readings', error);
      showToast('Token okumaları yüklenirken hata oluştu', 'error');
      setTokenReadings([]);
    } finally {
      clearTimeout(timeoutId);
      // Only clear loading if this is still the active fetch
      if (fetchId === activeFetchIdRef.current) {
        setLoading(false);
      }
    }
  }, [currentPage, searchTerm, tokenStatusFilter, showToast, t]);

  // Token stats fetch
  const fetchTokenStats = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('reading_sessions')
        .select('status');

      if (error) {
        logSupabaseError('token readings stats fetch', error);
        return;
      }

      const sessionsData = data || [];
      const completed = sessionsData.filter(
        (s: any) => s.status === 'completed'
      ).length;
      const invited = sessionsData.filter(
        (s: any) => s.status === 'invited'
      ).length;
      const expired = sessionsData.filter(
        (s: any) => s.status === 'expired'
      ).length;
      const cancelled = sessionsData.filter(
        (s: any) => s.status === 'cancelled'
      ).length;

      setTokenStats({
        total: sessionsData.length,
        completed,
        invited,
        expired,
        cancelled,
      });
    } catch (error) {
      logError('Error fetching token stats', error);
    }
  }, []);

  // Veri çekme - tab ve filtre değişikliklerinde
  useEffect(() => {
    // İlk yükleme veya filtre/tab değişikliğinde veri çek
    if (activeTab === 'normal') {
      fetchReadings();
      fetchStats();
    } else {
      fetchTokenReadings();
      fetchTokenStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeTab,
    currentPage,
    searchTerm,
    typeFilter,
    statusFilter,
    tokenStatusFilter,
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'love':
        return <Heart className='h-4 w-4' />;
      case 'career':
        return <Briefcase className='h-4 w-4' />;
      case 'general':
        return <Target className='h-4 w-4' />;
      case 'tarot':
        return <Sparkles className='h-4 w-4' />;
      case 'numerology':
        return <Star className='h-4 w-4' />;
      default:
        return <BookOpen className='h-4 w-4' />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'love':
        return 'text-pink-400 bg-pink-500/20 border-pink-500/30';
      case 'career':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'general':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'tarot':
        return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'numerology':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'situation-analysis':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'problem-solving':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      default:
        return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'love':
        return 'Aşk';
      case 'career':
        return 'Kariyer';
      case 'general':
        return 'Genel';
      case 'tarot':
        return 'Tarot';
      case 'numerology':
        return 'Numeroloji';
      case 'situation-analysis':
        return 'Enerji Haritası';
      case 'problem-solving':
        return 'Kelt ';
      case 'money-spread':
        return 'Para Yayılımı';
      case 'relationship-problems':
        return 'İlişki Problemleri';
      case 'relationship-analysis':
        return 'İlişki Analizi';
      case 'new-lover-spread':
        return 'Yeni Aşk';
      case 'marriage':
        return 'Evlilik';
      case 'situation-analysis':
        return 'Enerji Haritası';
      case 'problem-solving':
        return 'Kelt ';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'failed':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'reviewed':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default:
        return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className='h-4 w-4' />;
      case 'pending':
        return <Clock className='h-4 w-4' />;
      case 'failed':
        return <XCircle className='h-4 w-4' />;
      case 'reviewed':
        return <AlertCircle className='h-4 w-4' />;
      default:
        return <AlertCircle className='h-4 w-4' />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'pending':
        return 'Beklemede';
      case 'failed':
        return 'Başarısız';
      case 'reviewed':
        return 'İncelendi';
      default:
        return status;
    }
  };

  const getMediaType = (metadata: any) => {
    if (!metadata) {
      return 'text';
    }

    // Metadata'dan sesli/yazılı bilgisini çıkar
    // readingFormat alanından kontrol et: 'detailed' = sesli, 'written' = yazılı
    if (metadata.readingFormat === 'detailed') {
      return 'voice';
    }
    if (metadata.readingFormat === 'written') {
      return 'text';
    }

    // Eski format uyumluluğu için platform kontrolü
    if (metadata.platform === 'voice' || metadata.audioEnabled) {
      return 'voice';
    }
    if (metadata.platform === 'web' || metadata.textEnabled) {
      return 'text';
    }

    // Varsayılan olarak yazılı
    return 'text';
  };

  const getMediaTypeIcon = (metadata: any) => {
    const mediaType = getMediaType(metadata);
    return mediaType === 'voice' ? (
      <Mic className='h-4 w-4' />
    ) : (
      <FileText className='h-4 w-4' />
    );
  };

  const getMediaTypeColor = (metadata: any) => {
    const mediaType = getMediaType(metadata);
    return mediaType === 'voice'
      ? 'text-purple-400 bg-purple-500/20 border-purple-500/30'
      : 'text-blue-400 bg-blue-500/20 border-blue-500/30';
  };

  const getMediaTypeText = (metadata: any) => {
    const mediaType = getMediaType(metadata);
    return mediaType === 'voice' ? 'Sesli' : 'Yazılı';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Session status helper functions
  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/20 border border-green-500/30';
      case 'invited':
        return 'text-blue-400 bg-blue-500/20 border border-blue-500/30';
      case 'form_started':
        return 'text-yellow-400 bg-yellow-500/20 border border-yellow-500/30';
      case 'form_done':
        return 'text-purple-400 bg-purple-500/20 border border-purple-500/30';
      case 'cards_selected':
        return 'text-indigo-400 bg-indigo-500/20 border border-indigo-500/30';
      case 'ready_for_reader':
        return 'text-pink-400 bg-pink-500/20 border border-pink-500/30';
      case 'cancelled':
        return 'text-red-400 bg-red-500/20 border border-red-500/30';
      case 'expired':
        return 'text-gray-400 bg-gray-500/20 border border-gray-500/30';
      default:
        return 'text-slate-400 bg-slate-500/20 border border-slate-500/30';
    }
  };

  const getSessionStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className='h-3 w-3' />;
      case 'invited':
        return <Mail className='h-3 w-3' />;
      case 'form_started':
        return <Clock className='h-3 w-3' />;
      case 'form_done':
        return <FileText className='h-3 w-3' />;
      case 'cards_selected':
        return <Sparkles className='h-3 w-3' />;
      case 'ready_for_reader':
        return <Star className='h-3 w-3' />;
      case 'cancelled':
        return <XCircle className='h-3 w-3' />;
      case 'expired':
        return <AlertCircle className='h-3 w-3' />;
      default:
        return <Clock className='h-3 w-3' />;
    }
  };

  const getSessionStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'invited':
        return 'Davet Edildi';
      case 'form_started':
        return 'Form Başladı';
      case 'form_done':
        return 'Form Tamamlandı';
      case 'cards_selected':
        return 'Kartlar Seçildi';
      case 'ready_for_reader':
        return 'Okumaya Hazır';
      case 'cancelled':
        return 'İptal Edildi';
      case 'expired':
        return 'Süresi Doldu';
      default:
        return status;
    }
  };

  // Tab değiştiğinde sayfayı sıfırla
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Loading state debug - production'da kaldırılabilir
  useEffect(() => {
    if (loading) {
      const loadingTimeout = setTimeout(() => {
        logError('Loading state stuck for more than 10 seconds!', undefined, {
          action: 'readingsLoadingWatchdog',
          metadata: {
            activeTab,
            currentPage,
            searchTerm,
            typeFilter,
            statusFilter,
            tokenStatusFilter,
          },
        });
      }, 10000);
      return () => clearTimeout(loadingTimeout);
    }
    return undefined;
  }, [
    loading,
    activeTab,
    currentPage,
    searchTerm,
    typeFilter,
    statusFilter,
    tokenStatusFilter,
  ]);

  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='admin-card rounded-2xl p-6'>
          <div className='animate-pulse'>
            <div className='h-6 bg-slate-700 rounded w-1/3 mb-4'></div>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
        <TableSkeleton rows={5} columns={6} />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='admin-card rounded-2xl mobile-compact admin-hover-lift'>
        <div className='flex flex-col space-y-4 mb-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3 min-w-0 flex-1'>
              <div className='admin-gradient-primary p-3 rounded-xl flex-shrink-0'>
                <BookOpen className='h-5 w-5 md:h-6 md:w-6 text-white' />
              </div>
              <div className='min-w-0 flex-1'>
                <h1 className='text-xl md:text-2xl font-bold text-white truncate'>
                  Okuma Yönetimi
                </h1>
                <p className='text-slate-400 text-sm md:text-base hidden sm:block'>
                  Kullanıcıların tarot okumalarını görüntüle ve yönet
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2 flex-shrink-0'>
              <button
                onClick={() => setShowCreateReadingModal(true)}
                className='admin-btn-primary p-3 md:px-4 md:py-2 rounded-lg flex items-center space-x-2 touch-target hover:bg-indigo-600 transition-colors bg-gradient-to-r from-purple-600 to-pink-600'
              >
                <Plus className='h-4 w-4' />
                <span className='hidden sm:inline'>Okuma Yarat</span>
              </button>
              <button
                onClick={() => fetchReadings()}
                className='admin-btn-primary p-3 md:px-4 md:py-2 rounded-lg flex items-center space-x-2 touch-target flex-shrink-0 hover:bg-indigo-600 transition-colors'
              >
                <RefreshCw className='h-4 w-4' />
                <span className='hidden sm:inline'>Yenile</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
            <div className='inline-flex rounded-xl bg-slate-900/60 p-1 border border-slate-700/60 w-full sm:w-auto'>
              <button
                onClick={() => setActiveTab('normal')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'normal'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className='flex items-center justify-center gap-2'>
                  <BookOpen className='h-4 w-4' />
                  Normal Okumalar
                  {activeTab === 'normal' && (
                    <span className='bg-white/20 px-2 py-0.5 rounded-full text-xs'>
                      {stats.total}
                    </span>
                  )}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('token')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'token'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className='flex items-center justify-center gap-2'>
                  <Sparkles className='h-4 w-4' />
                  Token Okumaları
                  {activeTab === 'token' && (
                    <span className='bg-white/20 px-2 py-0.5 rounded-full text-xs'>
                      {tokenStats.total}
                    </span>
                  )}
                </span>
              </button>
            </div>
            <div className='flex items-center gap-3'>
              <button
                onClick={() => {
                  if (activeTab === 'normal') {
                    fetchReadings();
                    fetchStats();
                  } else {
                    fetchTokenReadings();
                    fetchTokenStats();
                  }
                }}
                className='admin-btn-primary p-3 md:px-4 md:py-2 rounded-lg flex items-center space-x-2 touch-target flex-shrink-0 hover:bg-indigo-600 transition-colors'
              >
                <RefreshCw className='h-4 w-4' />
                <span className='hidden sm:inline'>Yenile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {activeTab === 'normal' ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6'>
            <div className='admin-glass rounded-lg p-4 text-center'>
              <div className='flex items-center justify-center mb-2'>
                <BookOpen className='h-5 w-5 text-indigo-400 mr-2' />
                <span className='text-sm text-slate-400'>Toplam</span>
              </div>
              <div className='text-xl font-bold text-white'>{stats.total}</div>
            </div>

            <div className='admin-glass rounded-lg p-4 text-center'>
              <div className='flex items-center justify-center mb-2'>
                <CheckCircle className='h-5 w-5 text-green-400 mr-2' />
                <span className='text-sm text-slate-400'>Tamamlanan</span>
              </div>
              <div className='text-xl font-bold text-green-400'>
                {stats.completed}
              </div>
            </div>

            <div className='admin-glass rounded-lg p-4 text-center'>
              <div className='flex items-center justify-center mb-2'>
                <Clock className='h-5 w-5 text-yellow-400 mr-2' />
                <span className='text-sm text-slate-400'>Beklemede</span>
              </div>
              <div className='text-xl font-bold text-yellow-400'>
                {stats.pending}
              </div>
            </div>

            <div className='admin-glass rounded-lg p-4 text-center'>
              <div className='flex items-center justify-center mb-2'>
                <XCircle className='h-5 w-5 text-red-400 mr-2' />
                <span className='text-sm text-slate-400'>Başarısız</span>
              </div>
              <div className='text-xl font-bold text-red-400'>
                {stats.failed}
              </div>
            </div>

            <div className='admin-glass rounded-lg p-4 text-center'>
              <div className='flex items-center justify-center mb-2'>
                <Star className='h-5 w-5 text-purple-400 mr-2' />
                <span className='text-sm text-slate-400'>Toplam Kredi</span>
              </div>
              <div className='text-lg font-bold text-purple-400'>
                {stats.totalCredits}
              </div>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 mb-6'>
            <div className='admin-glass rounded-lg p-4 text-center'>
              <div className='flex items-center justify-center mb-2'>
                <Sparkles className='h-5 w-5 text-indigo-400 mr-2' />
                <span className='text-sm text-slate-400'>Toplam</span>
              </div>
              <div className='text-xl font-bold text-white'>
                {tokenStats.total}
              </div>
            </div>

            <div className='admin-glass rounded-lg p-4 text-center'>
              <div className='flex items-center justify-center mb-2'>
                <CheckCircle className='h-5 w-5 text-green-400 mr-2' />
                <span className='text-sm text-slate-400'>Tamamlanan</span>
              </div>
              <div className='text-xl font-bold text-green-400'>
                {tokenStats.completed}
              </div>
            </div>

            <div className='admin-glass rounded-lg p-4 text-center'>
              <div className='flex items-center justify-center mb-2'>
                <Mail className='h-5 w-5 text-blue-400 mr-2' />
                <span className='text-sm text-slate-400'>Davet Edildi</span>
              </div>
              <div className='text-xl font-bold text-blue-400'>
                {tokenStats.invited}
              </div>
            </div>

            <div className='admin-glass rounded-lg p-4 text-center'>
              <div className='flex items-center justify-center mb-2'>
                <AlertCircle className='h-5 w-5 text-gray-400 mr-2' />
                <span className='text-sm text-slate-400'>Süresi Doldu</span>
              </div>
              <div className='text-xl font-bold text-gray-400'>
                {tokenStats.expired}
              </div>
            </div>

            <div className='admin-glass rounded-lg p-4 text-center'>
              <div className='flex items-center justify-center mb-2'>
                <XCircle className='h-5 w-5 text-red-400 mr-2' />
                <span className='text-sm text-slate-400'>İptal Edildi</span>
              </div>
              <div className='text-xl font-bold text-red-400'>
                {tokenStats.cancelled}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        {activeTab === 'normal' ? (
          <div className='space-y-3 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-4'>
            {/* Search */}
            <div className='lg:col-span-2'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400' />
                <input
                  type='text'
                  placeholder='Başlık, yayılım veya açıklama ile ara...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-3 admin-glass rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm'
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className='w-full px-4 py-3 admin-glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm'
              >
                <option value='all'>🔮 Tüm Tipler</option>
                <option value='love'>❤️ Aşk</option>
                <option value='career'>💼 Kariyer</option>
                <option value='general'>🎯 Genel</option>
                <option value='tarot'>✨ Tarot</option>
                <option value='numerology'>⭐ Numeroloji</option>
                <option value='situation-analysis'>📊 Enerji Haritası</option>
                <option value='problem-solving'>🔍 Kelt </option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className='w-full px-4 py-3 admin-glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm'
              >
                <option value='all'>📊 Tüm Durumlar</option>
                <option value='completed'>✅ Tamamlanan</option>
                <option value='pending'>⏳ Beklemede</option>
                <option value='failed'>❌ Başarısız</option>
                <option value='reviewed'>👀 İncelenen</option>
              </select>
            </div>
          </div>
        ) : (
          <div className='space-y-3 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4'>
            {/* Search */}
            <div className='lg:col-span-2'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400' />
                <input
                  type='text'
                  placeholder='Müşteri adı, e-posta veya açılım ile ara...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-3 admin-glass rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm'
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={tokenStatusFilter}
                onChange={e => setTokenStatusFilter(e.target.value)}
                className='w-full px-4 py-3 admin-glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm'
              >
                <option value='all'>📊 Tüm Durumlar</option>
                <option value='completed'>✅ Tamamlanan</option>
                <option value='invited'>📧 Davet Edildi</option>
                <option value='form_started'>📝 Form Başladı</option>
                <option value='form_done'>✅ Form Tamamlandı</option>
                <option value='cards_selected'>🃏 Kartlar Seçildi</option>
                <option value='ready_for_reader'>👁️ Okumaya Hazır</option>
                <option value='expired'>⏰ Süresi Doldu</option>
                <option value='cancelled'>❌ İptal Edildi</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Readings Grid */}
      {activeTab === 'normal' ? (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6'>
          {readings.map((reading, index) => (
            <div
              key={reading.id}
              className='group relative overflow-hidden admin-card rounded-2xl border border-slate-700/50 admin-hover-lift transition-all duration-300 hover:border-indigo-500/50'
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Header with gradient */}
              <div className='relative p-4 md:p-6 pb-4'>
                <div className='flex flex-col sm:flex-row sm:items-start justify-between mb-4 space-y-3 sm:space-y-0'>
                  <div className='flex items-center space-x-3 flex-1 min-w-0'>
                    <div className='relative flex-shrink-0'>
                      <div className='admin-gradient-primary p-3 rounded-xl'>
                        {getTypeIcon(reading.reading_type)}
                      </div>
                      <div className='absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center'>
                        <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                      </div>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-bold text-white text-base md:text-lg truncate group-hover:text-indigo-300 transition-colors'>
                        {reading.title}
                      </h3>
                      <p className='text-xs md:text-sm text-slate-400 mt-1'>
                        {formatDate(reading.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 sm:flex-shrink-0'>
                    <div
                      className={`inline-flex items-center px-2 md:px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(reading.status)}`}
                    >
                      {getStatusIcon(reading.status)}
                      <span className='ml-1.5 hidden sm:inline'>
                        {getStatusText(reading.status)}
                      </span>
                      <span className='ml-1.5 sm:hidden'>
                        {getStatusText(reading.status).slice(0, 3)}
                      </span>
                    </div>
                    <div
                      className={`inline-flex items-center px-2 md:px-3 py-1.5 rounded-full text-xs font-semibold ${getMediaTypeColor(reading.metadata)}`}
                    >
                      {getMediaTypeIcon(reading.metadata)}
                      <span className='ml-1.5 hidden sm:inline'>
                        {getMediaTypeText(reading.metadata)}
                      </span>
                      <span className='ml-1.5 sm:hidden'>
                        {getMediaTypeText(reading.metadata).slice(0, 3)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className='flex items-center space-x-3 mb-4'>
                  <div className='w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0'>
                    {reading.user_display_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-white font-medium truncate text-sm md:text-base'>
                      {reading.user_display_name}
                    </p>
                    <p className='text-slate-400 text-xs truncate'>
                      {reading.user_email}
                    </p>
                  </div>
                </div>

                {/* Reading Type & Spread */}
                <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0'>
                  <div
                    className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${getTypeColor(reading.reading_type)} w-fit`}
                  >
                    {getTypeIcon(reading.reading_type)}
                    <span className='ml-2'>
                      {getTypeText(reading.reading_type)}
                    </span>
                  </div>
                  <div className='text-left sm:text-right'>
                    <p className='text-slate-400 text-xs'>Yayılım</p>
                    <p className='text-white text-sm font-medium truncate'>
                      {reading.spread_name}
                    </p>
                  </div>
                </div>

                {/* Interpretation Preview */}
                <div className='mb-4'>
                  <p className='text-slate-300 text-sm leading-relaxed line-clamp-2 md:line-clamp-3'>
                    {reading.interpretation}
                  </p>
                </div>

                {/* Cost & Button */}
                <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-3 sm:space-y-0'>
                  <div className='flex items-center space-x-2'>
                    <Star className='h-4 w-4 text-yellow-400' />
                    <span className='text-yellow-400 font-bold text-lg'>
                      {reading.cost_credits}
                    </span>
                    <span className='text-slate-400 text-sm'>Kredi</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedReading(reading);
                      setShowReadingModal(true);
                    }}
                    className='group/btn relative overflow-hidden admin-gradient-primary px-4 md:px-6 py-2.5 rounded-xl text-white font-medium text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 w-full sm:w-auto'
                  >
                    <span className='relative z-10 flex items-center justify-center space-x-2'>
                      <Eye className='h-4 w-4' />
                      <span>Detayları Gör</span>
                    </span>
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700'></div>
                  </button>
                </div>
              </div>

              {/* Bottom border accent */}
              <div className='h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            </div>
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6'>
          {tokenReadings.map((tokenReading, index) => (
            <div
              key={tokenReading.id}
              className='group relative overflow-hidden admin-card rounded-2xl border border-slate-700/50 admin-hover-lift transition-all duration-300 hover:border-indigo-500/50'
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Header with gradient */}
              <div className='relative p-4 md:p-6 pb-4'>
                <div className='flex flex-col sm:flex-row sm:items-start justify-between mb-4 space-y-3 sm:space-y-0'>
                  <div className='flex items-center space-x-3 flex-1 min-w-0'>
                    <div className='relative flex-shrink-0'>
                      <div className='admin-gradient-primary p-3 rounded-xl'>
                        <Sparkles className='h-4 w-4 text-white' />
                      </div>
                      <div className='absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center'>
                        <div className='w-2 h-2 bg-purple-400 rounded-full animate-pulse'></div>
                      </div>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-bold text-white text-base md:text-lg truncate group-hover:text-indigo-300 transition-colors'>
                        {tokenReading.customer_name ||
                          tokenReading.customer_email ||
                          'Token Okuma'}
                      </h3>
                      <p className='text-xs md:text-sm text-slate-400 mt-1'>
                        {formatDate(tokenReading.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 sm:flex-shrink-0'>
                    <div
                      className={`inline-flex items-center px-2 md:px-3 py-1.5 rounded-full text-xs font-semibold ${getSessionStatusColor(tokenReading.status)}`}
                    >
                      {getSessionStatusIcon(tokenReading.status)}
                      <span className='ml-1.5 hidden sm:inline'>
                        {getSessionStatusText(tokenReading.status)}
                      </span>
                      <span className='ml-1.5 sm:hidden'>
                        {getSessionStatusText(tokenReading.status).slice(0, 3)}
                      </span>
                    </div>
                    {tokenReading.reading_type && (
                      <div
                        className={`inline-flex items-center px-2 md:px-3 py-1.5 rounded-full text-xs font-semibold ${
                          tokenReading.reading_type === 'detailed'
                            ? 'text-purple-400 bg-purple-500/20 border border-purple-500/30'
                            : 'text-blue-400 bg-blue-500/20 border border-blue-500/30'
                        }`}
                      >
                        {tokenReading.reading_type === 'detailed' ? (
                          <Mic className='h-3 w-3' />
                        ) : (
                          <FileText className='h-3 w-3' />
                        )}
                        <span className='ml-1.5 hidden sm:inline'>
                          {tokenReading.reading_type === 'detailed'
                            ? 'Sesli'
                            : 'Yazılı'}
                        </span>
                        <span className='ml-1.5 sm:hidden'>
                          {tokenReading.reading_type === 'detailed' ? 'S' : 'Y'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                <div className='flex items-center space-x-3 mb-4'>
                  <div className='w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0'>
                    {tokenReading.customer_name?.charAt(0)?.toUpperCase() ||
                      tokenReading.customer_email?.charAt(0)?.toUpperCase() ||
                      'T'}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-white font-medium truncate text-sm md:text-base'>
                      {tokenReading.customer_name || 'Müşteri'}
                    </p>
                    <p className='text-slate-400 text-xs truncate'>
                      {tokenReading.customer_email || 'E-posta yok'}
                    </p>
                  </div>
                </div>

                {/* Spread Info */}
                <div className='mb-4'>
                  <p className='text-slate-400 text-xs mb-1'>Açılım</p>
                  <p className='text-white text-sm font-medium truncate'>
                    {tokenReading.spread_name}
                  </p>
                </div>

                {/* Token Preview - Aşk Uyumu'nda gösterilmez */}
                {tokenReading.token_preview &&
                  tokenReading.spread_key !== 'love' &&
                  !tokenReading.spread_name?.toLowerCase().includes('aşk') &&
                  !tokenReading.spread_name?.toLowerCase().includes('love') && (
                    <div className='mb-4 p-2 bg-slate-800/50 rounded-lg'>
                      <p className='text-slate-400 text-xs mb-1'>Token</p>
                      <p className='text-white font-mono text-xs truncate'>
                        {tokenReading.token_preview}
                      </p>
                    </div>
                  )}

                {/* Reading Link */}
                {tokenReading.reading_link && (
                  <div className='mb-4 p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20'>
                    <div className='flex items-center justify-between mb-2'>
                      <p className='text-indigo-400 text-xs font-medium flex items-center gap-1.5'>
                        <ExternalLink className='h-3 w-3' />
                        Okuma Linki
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <a
                        href={tokenReading.reading_link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-white font-mono text-xs truncate flex-1 hover:text-indigo-400 transition-colors break-all'
                        title={tokenReading.reading_link}
                      >
                        {tokenReading.reading_link}
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            tokenReading.reading_link || ''
                          );
                          showToast('Link kopyalandı', 'success');
                        }}
                        className='p-1.5 hover:bg-indigo-500/20 rounded transition-colors flex-shrink-0'
                        title='Linki kopyala'
                      >
                        <Copy className='h-3.5 w-3.5 text-indigo-400' />
                      </button>
                    </div>
                  </div>
                )}

                {/* Reading Status */}
                {tokenReading.reading && (
                  <div className='mb-4 p-2 bg-green-500/10 rounded-lg border border-green-500/20'>
                    <p className='text-green-400 text-xs font-medium'>
                      ✅ Okuma tamamlandı
                    </p>
                  </div>
                )}

                {/* Dates */}
                <div className='space-y-1 mb-4'>
                  {tokenReading.completed_at && (
                    <p className='text-slate-400 text-xs'>
                      Tamamlandı: {formatDate(tokenReading.completed_at)}
                    </p>
                  )}
                  {tokenReading.expires_at && (
                    <p className='text-slate-400 text-xs'>
                      Son geçerlilik: {formatDate(tokenReading.expires_at)}
                    </p>
                  )}
                </div>

                {/* Action Button */}
                <div className='flex justify-center'>
                  <button
                    onClick={() => {
                      if (tokenReading.reading) {
                        // Debug: reading objesini kontrol et
                        logDebug('Token reading selected for modal', {
                          readingId: tokenReading.reading.id,
                          readingType: tokenReading.reading.reading_type,
                          readingTitle: tokenReading.reading.title,
                        });
                        setSelectedReading(tokenReading.reading);
                        setShowReadingModal(true);
                      } else {
                        showToast('Bu okuma henüz tamamlanmamış', 'info');
                      }
                    }}
                    className='group/btn relative overflow-hidden admin-gradient-primary px-4 md:px-6 py-2.5 rounded-xl text-white font-medium text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 w-full sm:w-auto'
                    disabled={!tokenReading.reading}
                  >
                    <span className='relative z-10 flex items-center justify-center space-x-2'>
                      <Eye className='h-4 w-4' />
                      <span>
                        {tokenReading.reading
                          ? 'Detayları Gör'
                          : 'Henüz Tamamlanmadı'}
                      </span>
                    </span>
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700'></div>
                  </button>
                </div>
              </div>

              {/* Bottom border accent */}
              <div className='h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {((activeTab === 'normal' && readings.length === 0) ||
        (activeTab === 'token' && tokenReadings.length === 0)) &&
        !loading && (
          <div className='admin-card rounded-2xl p-12 text-center'>
            {activeTab === 'normal' ? (
              <>
                <BookOpen className='h-20 w-20 text-slate-600 mx-auto mb-4' />
                <h3 className='text-xl font-semibold text-white mb-2'>
                  Okuma Bulunamadı
                </h3>
                <p className='text-slate-400 mb-6'>
                  {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                    ? 'Arama kriterlerinize uygun okuma bulunamadı.'
                    : 'Henüz okuma bulunmuyor.'}
                </p>
                {(searchTerm ||
                  typeFilter !== 'all' ||
                  statusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setTypeFilter('all');
                      setStatusFilter('all');
                      setCurrentPage(1);
                    }}
                    className='admin-btn-primary px-6 py-2 rounded-lg'
                  >
                    Filtreleri Temizle
                  </button>
                )}
              </>
            ) : (
              <>
                <Sparkles className='h-20 w-20 text-slate-600 mx-auto mb-4' />
                <h3 className='text-xl font-semibold text-white mb-2'>
                  Token Okuma Bulunamadı
                </h3>
                <p className='text-slate-400 mb-6'>
                  {searchTerm || tokenStatusFilter !== 'all'
                    ? 'Arama kriterlerinize uygun token okuma bulunamadı.'
                    : 'Henüz token okuma bulunmuyor.'}
                </p>
                {(searchTerm || tokenStatusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setTokenStatusFilter('all');
                      setCurrentPage(1);
                    }}
                    className='admin-btn-primary px-6 py-2 rounded-lg'
                  >
                    Filtreleri Temizle
                  </button>
                )}
              </>
            )}
          </div>
        )}

      {/* Pagination */}
      {(() => {
        const currentTotalCount =
          activeTab === 'normal' ? totalCount : tokenTotalCount;
        const currentTotalPages = Math.ceil(
          currentTotalCount / readingsPerPage
        );

        if (currentTotalPages <= 1) {
          return null;
        }

        return (
          <div className='admin-card rounded-xl p-4'>
            <div className='flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0'>
              <div className='text-sm text-slate-400 text-center sm:text-left'>
                {currentTotalCount}{' '}
                {activeTab === 'normal' ? 'okumadan' : 'token okumadan'}{' '}
                {(currentPage - 1) * readingsPerPage + 1}-
                {Math.min(currentPage * readingsPerPage, currentTotalCount)}{' '}
                arası gösteriliyor
              </div>

              <div className='flex items-center space-x-2'>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className='p-2 admin-glass rounded-lg admin-hover-scale disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <ChevronLeft className='h-4 w-4' />
                </button>

                <span className='px-4 py-2 admin-gradient-accent rounded-lg text-white font-medium'>
                  {currentPage} / {currentTotalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(currentTotalPages, currentPage + 1))
                  }
                  disabled={currentPage === currentTotalPages}
                  className='p-2 admin-glass rounded-lg admin-hover-scale disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <ChevronRight className='h-4 w-4' />
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Reading Detail Modal */}
      {showReadingModal && selectedReading && selectedReading.reading_type && (
        <div className='fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-2 md:p-4'>
          <div className='relative w-full max-w-4xl xl:max-w-5xl max-h-[95vh] overflow-hidden'>
            {/* Modal Container */}
            <div className='admin-card rounded-3xl border border-slate-700/50 overflow-hidden'>
              {/* Modal Header */}
              <div className='relative bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 border-b border-slate-700/50 p-4 md:p-6'>
                <div className='flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0'>
                  <div className='flex items-center space-x-4 flex-1 min-w-0'>
                    <div className='relative flex-shrink-0'>
                      <div className='admin-gradient-primary p-3 md:p-4 rounded-2xl'>
                        {getTypeIcon(selectedReading.reading_type)}
                      </div>
                      <div className='absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center'>
                        <div className='w-3 h-3 bg-green-400 rounded-full animate-pulse'></div>
                      </div>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h3 className='text-xl md:text-2xl font-bold text-white mb-1 truncate'>
                        {selectedReading.title}
                      </h3>
                      <div className='flex flex-wrap items-center gap-2'>
                        <div
                          className={`inline-flex items-center px-2 md:px-3 py-1.5 rounded-full text-xs md:text-sm font-medium ${getStatusColor(selectedReading.status)}`}
                        >
                          {getStatusIcon(selectedReading.status)}
                          <span className='ml-2'>
                            {getStatusText(selectedReading.status)}
                          </span>
                        </div>
                        <div
                          className={`inline-flex items-center px-2 md:px-3 py-1.5 rounded-full text-xs md:text-sm font-medium ${getMediaTypeColor(selectedReading.metadata)}`}
                        >
                          {getMediaTypeIcon(selectedReading.metadata)}
                          <span className='ml-2'>
                            {getMediaTypeText(selectedReading.metadata)}
                          </span>
                        </div>
                        <div
                          className={`inline-flex items-center px-2 md:px-3 py-1.5 rounded-full text-xs md:text-sm font-medium ${getTypeColor(selectedReading.reading_type)}`}
                        >
                          {getTypeIcon(selectedReading.reading_type)}
                          <span className='ml-2'>
                            {getTypeText(selectedReading.reading_type)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReadingModal(false)}
                    className='p-3 admin-glass rounded-2xl admin-hover-scale transition-all duration-300 hover:bg-red-500/20 hover:border-red-500/30 flex-shrink-0'
                  >
                    <XCircle className='h-6 w-6 text-slate-400 hover:text-red-400 transition-colors' />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className='p-6 max-h-[calc(100vh-200px)] overflow-y-auto admin-scrollbar'>
                <div className='space-y-8'>
                  {/* User Info Card */}
                  <div className='admin-glass rounded-2xl p-6 border border-slate-700/50'>
                    <div className='flex items-center space-x-4 mb-4'>
                      <div className='w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold'>
                        {selectedReading.user_display_name
                          ?.charAt(0)
                          ?.toUpperCase() || 'U'}
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-bold text-white text-lg'>
                          {selectedReading.user_display_name}
                        </h4>
                        <p className='text-slate-400'>
                          {selectedReading.user_email}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='text-slate-400 text-sm'>Okuma Tarihi</p>
                        <p className='text-white font-medium'>
                          {formatDate(selectedReading.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reading Details */}
                  <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6'>
                    <div className='admin-glass rounded-2xl p-6 border border-slate-700/50'>
                      <div className='flex items-center space-x-3 mb-4'>
                        <div className='admin-gradient-primary p-3 rounded-xl'>
                          <BookOpen className='h-5 w-5 text-white' />
                        </div>
                        <h4 className='font-bold text-white'>
                          Okuma Detayları
                        </h4>
                      </div>
                      <div className='space-y-3'>
                        <div>
                          <p className='text-slate-400 text-sm'>Yayılım</p>
                          <p className='text-white font-medium'>
                            {selectedReading.spread_name}
                          </p>
                        </div>
                        <div>
                          <p className='text-slate-400 text-sm'>Maliyet</p>
                          <div className='flex items-center space-x-2'>
                            <Star className='h-4 w-4 text-yellow-400' />
                            <span className='text-yellow-400 font-bold text-lg'>
                              {selectedReading.cost_credits}
                            </span>
                            <span className='text-slate-400 text-sm'>
                              Kredi
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='admin-glass rounded-2xl p-6 border border-slate-700/50'>
                      <div className='flex items-center space-x-3 mb-4'>
                        <div className='admin-gradient-accent p-3 rounded-xl'>
                          <Target className='h-5 w-5 text-white' />
                        </div>
                        <h4 className='font-bold text-white'>
                          Teknik Bilgiler
                        </h4>
                      </div>
                      <div className='space-y-3'>
                        {selectedReading.metadata?.duration && (
                          <div>
                            <p className='text-slate-400 text-sm'>
                              İşlem Süresi
                            </p>
                            <p className='text-white font-medium'>
                              {selectedReading.metadata.duration}ms
                            </p>
                          </div>
                        )}
                        {selectedReading.metadata?.readingFormat && (
                          <div>
                            <p className='text-slate-400 text-sm'>
                              Okuma Formatı
                            </p>
                            <div
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getMediaTypeColor(selectedReading.metadata)}`}
                            >
                              {getMediaTypeIcon(selectedReading.metadata)}
                              <span className='ml-2'>
                                {selectedReading.metadata.readingFormatTr ||
                                  (selectedReading.metadata.readingFormat ===
                                  'detailed'
                                    ? 'Sesli'
                                    : selectedReading.metadata.readingFormat ===
                                        'written'
                                      ? 'Yazılı'
                                      : selectedReading.metadata.readingFormat)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='admin-glass rounded-2xl p-6 border border-slate-700/50'>
                      <div className='flex items-center space-x-3 mb-4'>
                        <div className='admin-gradient-success p-3 rounded-xl'>
                          <Sparkles className='h-5 w-5 text-white' />
                        </div>
                        <h4 className='font-bold text-white'>Kart Bilgileri</h4>
                      </div>
                      <div className='space-y-3'>
                        {selectedReading.cards &&
                          Array.isArray(selectedReading.cards) && (
                            <div>
                              <p className='text-slate-400 text-sm'>
                                Çekilen Kart Sayısı
                              </p>
                              <p className='text-white font-bold text-xl'>
                                {selectedReading.cards.length}
                              </p>
                            </div>
                          )}
                        <div>
                          <p className='text-slate-400 text-sm'>Okuma Durumu</p>
                          <div
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(selectedReading.status)}`}
                          >
                            {getStatusIcon(selectedReading.status)}
                            <span className='ml-2'>
                              {getStatusText(selectedReading.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Cevapları */}
                  {selectedReading.questions && (
                    <div className='admin-glass rounded-2xl p-6 border border-slate-700/50'>
                      <div className='flex items-center space-x-3 mb-6'>
                        <div className='admin-gradient-accent p-3 rounded-xl'>
                          <MessageSquare className='h-5 w-5 text-white' />
                        </div>
                        <h4 className='font-bold text-white text-lg'>
                          Form Cevapları
                        </h4>
                      </div>

                      {/* Kişisel Bilgiler */}
                      {selectedReading.questions.personalInfo && (
                        <div className='mb-8'>
                          <div className='flex items-center space-x-2 mb-4'>
                            <User className='h-5 w-5 text-blue-400' />
                            <h5 className='text-lg font-semibold text-white'>
                              Kişisel Bilgiler
                            </h5>
                          </div>
                          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            {selectedReading.questions.personalInfo.name && (
                              <div className='admin-glass rounded-xl p-4 border border-slate-700/30'>
                                <div className='flex items-center space-x-2 mb-2'>
                                  <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                                  <p className='text-slate-400 text-sm font-medium'>
                                    Ad
                                  </p>
                                </div>
                                <p className='text-white font-semibold text-lg'>
                                  {selectedReading.questions.personalInfo.name}
                                </p>
                              </div>
                            )}
                            {selectedReading.questions.personalInfo.surname && (
                              <div className='admin-glass rounded-xl p-4 border border-slate-700/30'>
                                <div className='flex items-center space-x-2 mb-2'>
                                  <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                                  <p className='text-slate-400 text-sm font-medium'>
                                    Soyad
                                  </p>
                                </div>
                                <p className='text-white font-semibold text-lg'>
                                  {
                                    selectedReading.questions.personalInfo
                                      .surname
                                  }
                                </p>
                              </div>
                            )}
                            {/* Email veya Telefon - hangisi varsa onu göster */}
                            {(selectedReading.questions.personalInfo.email ||
                              selectedReading.questions.personalInfo.phone) && (
                              <div className='admin-glass rounded-xl p-4 border border-slate-700/30'>
                                <div className='flex items-center space-x-2 mb-2'>
                                  {selectedReading.questions.personalInfo
                                    .email ? (
                                    <>
                                      <Mail className='h-4 w-4 text-blue-400' />
                                      <p className='text-slate-400 text-sm font-medium'>
                                        Email
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <Phone className='h-4 w-4 text-blue-400' />
                                      <p className='text-slate-400 text-sm font-medium'>
                                        Telefon
                                      </p>
                                    </>
                                  )}
                                </div>
                                <p className='text-white font-medium'>
                                  {selectedReading.questions.personalInfo
                                    .email ||
                                    selectedReading.questions.personalInfo
                                      .phone}
                                </p>
                              </div>
                            )}
                            {selectedReading.questions.personalInfo
                              .birthDate && (
                              <div className='admin-glass rounded-xl p-4 border border-slate-700/30'>
                                <div className='flex items-center space-x-2 mb-2'>
                                  <Calendar className='h-4 w-4 text-blue-400' />
                                  <p className='text-slate-400 text-sm font-medium'>
                                    Doğum Tarihi
                                  </p>
                                </div>
                                <p className='text-white font-medium'>
                                  {
                                    selectedReading.questions.personalInfo
                                      .birthDate
                                  }
                                </p>
                              </div>
                            )}
                            {selectedReading.questions.personalInfo
                              .relationshipStatus && (
                              <div className='admin-glass rounded-xl p-4 border border-slate-700/30'>
                                <div className='flex items-center space-x-2 mb-2'>
                                  <Heart className='h-4 w-4 text-blue-400' />
                                  <p className='text-slate-400 text-sm font-medium'>
                                    İlişki Durumu
                                  </p>
                                </div>
                                <p className='text-white font-medium'>
                                  {(() => {
                                    const relationshipStatus =
                                      selectedReading.questions.personalInfo
                                        .relationshipStatus;
                                    // İngilizce değeri Türkçe'ye çevir
                                    // Herhangi bir spread'in relationshipStatusOptions'unu kullanabiliriz (hepsi aynı)
                                    const translationKey = `spreads.love.form.relationshipStatusOptions.${relationshipStatus}`;
                                    const translated = t(translationKey);
                                    // Eğer translation bulunamazsa (key dönerse), orijinal değeri göster
                                    return translated !== translationKey
                                      ? translated
                                      : relationshipStatus;
                                  })()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Partner Bilgileri - sadece varsa göster */}
                      {selectedReading.questions?.partnerInfo && (
                        <div className='mb-8'>
                          <div className='flex items-center space-x-2 mb-4'>
                            <Heart className='h-5 w-5 text-pink-400' />
                            <h5 className='text-lg font-semibold text-white'>
                              Partner Bilgileri
                            </h5>
                          </div>
                          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            {selectedReading.questions.partnerInfo.name && (
                              <div className='admin-glass rounded-xl p-4 border border-slate-700/30'>
                                <div className='flex items-center space-x-2 mb-2'>
                                  <div className='w-2 h-2 bg-pink-400 rounded-full'></div>
                                  <p className='text-slate-400 text-sm font-medium'>
                                    Partner İsmi
                                  </p>
                                </div>
                                <p className='text-white font-semibold text-lg'>
                                  {selectedReading.questions.partnerInfo.name}
                                </p>
                              </div>
                            )}
                            {(selectedReading.questions.partnerInfo.birthDate ||
                              selectedReading.questions.partnerInfo
                                .birthDateUnknown) && (
                              <div className='admin-glass rounded-xl p-4 border border-slate-700/30'>
                                <div className='flex items-center space-x-2 mb-2'>
                                  <Calendar className='h-4 w-4 text-pink-400' />
                                  <p className='text-slate-400 text-sm font-medium'>
                                    Partner Doğum Tarihi
                                  </p>
                                </div>
                                <p className='text-white font-medium'>
                                  {selectedReading.questions.partnerInfo
                                    .birthDateUnknown
                                    ? 'Bilinmiyor'
                                    : selectedReading.questions.partnerInfo
                                        .birthDate || '-'}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Kullanıcı Soruları - Tüm olası formatları destekler */}
                      {selectedReading.questions && (
                        <div className='mb-8'>
                          <div className='flex items-center space-x-2 mb-4'>
                            <MessageSquare className='h-5 w-5 text-green-400' />
                            <h5 className='text-lg font-semibold text-white'>
                              Kullanıcı Soruları
                            </h5>
                          </div>
                          <div className='rounded-2xl border border-white/10 bg-slate-900/50 p-6 space-y-4'>
                            {/* 1. Format: userQuestions objesi */}
                            {selectedReading.questions.userQuestions &&
                              typeof selectedReading.questions.userQuestions ===
                                'object' &&
                              Object.keys(
                                selectedReading.questions.userQuestions
                              ).length > 0 && (
                                <div className='space-y-6'>
                                  <h6 className='text-md font-semibold text-indigo-300 mb-2'>
                                    Soru-Cevap Formatı
                                  </h6>
                                  {Object.entries(
                                    selectedReading.questions.userQuestions
                                  )
                                    .filter(([key]) => {
                                      // Single card okuması kontrolü
                                      const isSingleCardReading =
                                        selectedReading.metadata
                                          ?.isSingleCardReading === true ||
                                        selectedReading.metadata
                                          ?.isSingleCardReading === 'true' ||
                                        selectedReading.reading_type
                                          ?.toLowerCase()
                                          .includes('single-card') ||
                                        selectedReading.spread_name
                                          ?.toLowerCase()
                                          .includes('tek kart');

                                      // Single card okumasında sadece concern göster
                                      if (
                                        isSingleCardReading &&
                                        key !== 'concern'
                                      ) {
                                        return false; // understanding, emotional, mainQuestion'ı filtrele
                                      }

                                      return true;
                                    })
                                    .map(
                                      ([key, value]: [string, any], index) => {
                                        // Açılım türüne göre soru metinleri
                                        const getSpreadQuestionMap = (
                                          readingType: string
                                        ): Record<string, string> => {
                                          const type =
                                            readingType.toLowerCase();

                                          if (
                                            type.includes('love') ||
                                            type.includes('aşk')
                                          ) {
                                            return {
                                              concern:
                                                'Aşk hayatınızda sizi en çok endişelendiren konu nedir?',
                                              emotional:
                                                'Şu anda duygusal olarak nasıl hissediyorsunuz?',
                                              understanding:
                                                'Bu Aşk Uyumu ile neyi anlamak istiyorsunuz?',
                                              question1:
                                                'Aşk hayatınızda sizi en çok endişelendiren konu nedir?',
                                              question2:
                                                'Bu Aşk Uyumu ile neyi anlamak istiyorsunuz?',
                                              question3:
                                                'Şu anda duygusal olarak nasıl hissediyorsunuz?',
                                            };
                                          } else if (
                                            type.includes('money') ||
                                            type.includes('para')
                                          ) {
                                            return {
                                              concern:
                                                'Şu anda para konusunda sizi en çok zorlayan ya da kaygılandıran durum nedir?',
                                              emotional:
                                                'Mali durumunuzu düşündüğünüzde kendinizi nasıl hissediyorsunuz? Para şu an sizin için hangi duyguyu temsil ediyor? (güvende / huzursuz / yetersiz / özgür vb.)',
                                              understanding:
                                                'Bu para açılımının, para ve gelecek planlarınızla ilgili hangi konuda size daha fazla netlik ve yön göstermesini istiyorsunuz?',
                                              question1:
                                                'Şu anda para konusunda sizi en çok zorlayan ya da kaygılandıran durum nedir?',
                                              question2:
                                                'Bu para açılımının, para ve gelecek planlarınızla ilgili hangi konuda size daha fazla netlik ve yön göstermesini istiyorsunuz?',
                                              question3:
                                                'Mali durumunuzu düşündüğünüzde kendinizi nasıl hissediyorsunuz? Para şu an sizin için hangi duyguyu temsil ediyor? (güvende / huzursuz / yetersiz / özgür vb.)',
                                            };
                                          } else if (
                                            type.includes('career') ||
                                            type.includes('kariyer')
                                          ) {
                                            return {
                                              concern:
                                                'Kariyerinizde sizi en çok endişelendiren konu nedir?',
                                              emotional:
                                                'İş hayatınız hakkında nasıl hissediyorsunuz?',
                                              understanding:
                                                'Bu kariyer açılımı ile neyi anlamak istiyorsunuz?',
                                              question1:
                                                'Kariyerinizde sizi en çok endişelendiren konu nedir?',
                                              question2:
                                                'Bu kariyer açılımı ile neyi anlamak istiyorsunuz?',
                                              question3:
                                                'İş hayatınız hakkında nasıl hissediyorsunuz?',
                                            };
                                          } else if (
                                            type.includes('problem-solving') ||
                                            type.includes('problem')
                                          ) {
                                            return {
                                              concern:
                                                'Hangi problemi çözmek istiyorsunuz?',
                                              emotional:
                                                'Bu problem hakkında nasıl hissediyorsunuz?',
                                              understanding:
                                                'Bu Kelt  açılımı ile neyi anlamak istiyorsunuz?',
                                              question1:
                                                'Hangi problemi çözmek istiyorsunuz?',
                                              question2:
                                                'Bu Kelt  açılımı ile neyi anlamak istiyorsunuz?',
                                              question3:
                                                'Bu problem hakkında nasıl hissediyorsunuz?',
                                            };
                                          } else if (
                                            type.includes(
                                              'situation-analysis'
                                            ) ||
                                            type.includes('durum')
                                          ) {
                                            return {
                                              concern:
                                                'Mevcut durumunuzda sizi en çok endişelendiren konu nedir?',
                                              emotional:
                                                'Şu anki durumunuz hakkında nasıl hissediyorsunuz?',
                                              understanding:
                                                'Bu Enerji Haritası açılımı ile neyi anlamak istiyorsunuz?',
                                              question1:
                                                'Mevcut durumunuzda sizi en çok endişelendiren konu nedir?',
                                              question2:
                                                'Bu Enerji Haritası açılımı ile neyi anlamak istiyorsunuz?',
                                              question3:
                                                'Şu anki durumunuz hakkında nasıl hissediyorsunuz?',
                                            };
                                          } else if (
                                            type.includes('marriage') ||
                                            type.includes('evlilik')
                                          ) {
                                            return {
                                              concern:
                                                'Evlilik konusunda sizi en çok endişelendiren konu nedir?',
                                              emotional:
                                                'Evlilik hakkında nasıl hissediyorsunuz?',
                                              understanding:
                                                'Bu evlilik açılımı ile neyi anlamak istiyorsunuz?',
                                              question1:
                                                'Evlilik konusunda sizi en çok endişelendiren konu nedir?',
                                              question2:
                                                'Bu evlilik açılımı ile neyi anlamak istiyorsunuz?',
                                              question3:
                                                'Evlilik hakkında nasıl hissediyorsunuz?',
                                            };
                                          } else if (
                                            type.includes(
                                              'relationship-analysis'
                                            ) ||
                                            type.includes('ilişki analizi')
                                          ) {
                                            return {
                                              concern:
                                                'İlişkinizde sizi en çok endişelendiren konu nedir?',
                                              emotional:
                                                'İlişkiniz hakkında nasıl hissediyorsunuz?',
                                              understanding:
                                                'Bu ilişki analizi açılımı ile neyi anlamak istiyorsunuz?',
                                              question1:
                                                'İlişkinizde sizi en çok endişelendiren konu nedir?',
                                              question2:
                                                'Bu ilişki analizi açılımı ile neyi anlamak istiyorsunuz?',
                                              question3:
                                                'İlişkiniz hakkında nasıl hissediyorsunuz?',
                                            };
                                          } else if (
                                            type.includes(
                                              'relationship-problems'
                                            ) ||
                                            type.includes('ilişki problemleri')
                                          ) {
                                            return {
                                              concern:
                                                'İlişkinizdeki problemler nelerdir?',
                                              emotional:
                                                'Bu problemler hakkında nasıl hissediyorsunuz?',
                                              understanding:
                                                'Bu ilişki problemleri açılımı ile neyi anlamak istiyorsunuz?',
                                              question1:
                                                'İlişkinizdeki problemler nelerdir?',
                                              question2:
                                                'Bu ilişki problemleri açılımı ile neyi anlamak istiyorsunuz?',
                                              question3:
                                                'Bu problemler hakkında nasıl hissediyorsunuz?',
                                            };
                                          } else if (
                                            type.includes('new-lover') ||
                                            type.includes('yeni aşk')
                                          ) {
                                            return {
                                              concern:
                                                'Yeni aşk konusunda sizi en çok endişelendiren konu nedir?',
                                              emotional:
                                                'Yeni aşk hakkında nasıl hissediyorsunuz?',
                                              understanding:
                                                'Bu yeni Aşk Uyumu ile neyi anlamak istiyorsunuz?',
                                              question1:
                                                'Yeni aşk konusunda sizi en çok endişelendiren konu nedir?',
                                              question2:
                                                'Bu yeni Aşk Uyumu ile neyi anlamak istiyorsunuz?',
                                              question3:
                                                'Yeni aşk hakkında nasıl hissediyorsunuz?',
                                            };
                                          }

                                          // Varsayılan sorular
                                          return {
                                            concern:
                                              'Sizi en çok endişelendiren konu nedir?',
                                            emotional: 'Nasıl hissediyorsunuz?',
                                            understanding:
                                              'Bu açılım ile neyi anlamak istiyorsunuz?',
                                            question1:
                                              'Sizi en çok endişelendiren konu nedir?',
                                            question2:
                                              'Bu açılım ile neyi anlamak istiyorsunuz?',
                                            question3: 'Nasıl hissediyorsunuz?',
                                          };
                                        };

                                        const spreadQuestionMap =
                                          getSpreadQuestionMap(
                                            selectedReading.reading_type
                                          );

                                        // Soru metnini belirle
                                        let questionText = '';
                                        if (
                                          typeof value === 'object' &&
                                          value.question
                                        ) {
                                          questionText = value.question;
                                        } else if (spreadQuestionMap[key]) {
                                          questionText = spreadQuestionMap[key];
                                        } else {
                                          questionText = key;
                                        }

                                        return (
                                          <div
                                            key={key}
                                            className='admin-glass rounded-2xl p-6 border border-slate-700/30 hover:border-green-500/30 transition-all duration-300'
                                          >
                                            <div className='flex items-start space-x-4'>
                                              <div className='flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold'>
                                                {index + 1}
                                              </div>
                                              <div className='flex-1 space-y-4'>
                                                <div>
                                                  <div className='flex items-center space-x-2 mb-2'>
                                                    <MessageSquare className='h-4 w-4 text-green-400' />
                                                    <p className='text-slate-400 text-sm font-medium'>
                                                      SORU
                                                    </p>
                                                  </div>
                                                  <p className='text-white font-semibold text-lg leading-relaxed'>
                                                    {questionText}
                                                  </p>
                                                </div>
                                                <div className='border-t border-slate-700/50 pt-4'>
                                                  <div className='flex items-center space-x-2 mb-2'>
                                                    <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                                                    <p className='text-slate-400 text-sm font-medium'>
                                                      CEVAP
                                                    </p>
                                                  </div>
                                                  <div className='bg-slate-800/50 rounded-xl p-4 border border-slate-700/30'>
                                                    <p className='text-white text-base leading-relaxed'>
                                                      {typeof value === 'object'
                                                        ? value.answer ||
                                                          'Cevap verilmemiş'
                                                        : String(value)}
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                </div>
                              )}

                            {/* 2. Format: prompts array */}
                            {selectedReading.questions.prompts &&
                              Array.isArray(
                                selectedReading.questions.prompts
                              ) &&
                              selectedReading.questions.prompts.length > 0 && (
                                <div className='space-y-4'>
                                  <h6 className='text-md font-semibold text-indigo-300 mb-2'>
                                    Liste Formatı
                                  </h6>
                                  {selectedReading.questions.prompts.map(
                                    (
                                      entry: { label: string; value: string },
                                      index: number
                                    ) => {
                                      // Açılım türüne göre soru metinleri (yukarıdaki fonksiyonla aynı)
                                      const getSpreadQuestionMap = (
                                        readingType: string
                                      ): Record<string, string> => {
                                        const type = readingType.toLowerCase();

                                        if (
                                          type.includes('love') ||
                                          type.includes('aşk')
                                        ) {
                                          return {
                                            concern:
                                              'Aşk hayatınızda sizi en çok endişelendiren konu nedir?',
                                            emotional:
                                              'Şu anda duygusal olarak nasıl hissediyorsunuz?',
                                            understanding:
                                              'Bu Aşk Uyumu ile neyi anlamak istiyorsunuz?',
                                            question1:
                                              'Aşk hayatınızda sizi en çok endişelendiren konu nedir?',
                                            question2:
                                              'Bu Aşk Uyumu ile neyi anlamak istiyorsunuz?',
                                            question3:
                                              'Şu anda duygusal olarak nasıl hissediyorsunuz?',
                                          };
                                        } else if (
                                          type.includes('money') ||
                                          type.includes('para')
                                        ) {
                                          return {
                                            concern:
                                              'Şu anda para konusunda sizi en çok zorlayan ya da kaygılandıran durum nedir?',
                                            emotional:
                                              'Mali durumunuzu düşündüğünüzde kendinizi nasıl hissediyorsunuz? Para şu an sizin için hangi duyguyu temsil ediyor? (güvende / huzursuz / yetersiz / özgür vb.)',
                                            understanding:
                                              'Bu para açılımının, para ve gelecek planlarınızla ilgili hangi konuda size daha fazla netlik ve yön göstermesini istiyorsunuz?',
                                            question1:
                                              'Şu anda para konusunda sizi en çok zorlayan ya da kaygılandıran durum nedir?',
                                            question2:
                                              'Bu para açılımının, para ve gelecek planlarınızla ilgili hangi konuda size daha fazla netlik ve yön göstermesini istiyorsunuz?',
                                            question3:
                                              'Mali durumunuzu düşündüğünüzde kendinizi nasıl hissediyorsunuz? Para şu an sizin için hangi duyguyu temsil ediyor? (güvende / huzursuz / yetersiz / özgür vb.)',
                                          };
                                        } else if (
                                          type.includes('career') ||
                                          type.includes('kariyer')
                                        ) {
                                          return {
                                            concern:
                                              'Kariyerinizde sizi en çok endişelendiren konu nedir?',
                                            emotional:
                                              'İş hayatınız hakkında nasıl hissediyorsunuz?',
                                            understanding:
                                              'Bu kariyer açılımı ile neyi anlamak istiyorsunuz?',
                                            question1:
                                              'Kariyerinizde sizi en çok endişelendiren konu nedir?',
                                            question2:
                                              'Bu kariyer açılımı ile neyi anlamak istiyorsunuz?',
                                            question3:
                                              'İş hayatınız hakkında nasıl hissediyorsunuz?',
                                          };
                                        } else if (
                                          type.includes('problem-solving') ||
                                          type.includes('problem')
                                        ) {
                                          return {
                                            concern:
                                              'Hangi problemi çözmek istiyorsunuz?',
                                            emotional:
                                              'Bu problem hakkında nasıl hissediyorsunuz?',
                                            understanding:
                                              'Bu Kelt  açılımı ile neyi anlamak istiyorsunuz?',
                                            question1:
                                              'Hangi problemi çözmek istiyorsunuz?',
                                            question2:
                                              'Bu Kelt  açılımı ile neyi anlamak istiyorsunuz?',
                                            question3:
                                              'Bu problem hakkında nasıl hissediyorsunuz?',
                                          };
                                        } else if (
                                          type.includes('situation-analysis') ||
                                          type.includes('durum')
                                        ) {
                                          return {
                                            concern:
                                              'Mevcut durumunuzda sizi en çok endişelendiren konu nedir?',
                                            emotional:
                                              'Şu anki durumunuz hakkında nasıl hissediyorsunuz?',
                                            understanding:
                                              'Bu Enerji Haritası açılımı ile neyi anlamak istiyorsunuz?',
                                            question1:
                                              'Mevcut durumunuzda sizi en çok endişelendiren konu nedir?',
                                            question2:
                                              'Bu Enerji Haritası açılımı ile neyi anlamak istiyorsunuz?',
                                            question3:
                                              'Şu anki durumunuz hakkında nasıl hissediyorsunuz?',
                                          };
                                        } else if (
                                          type.includes('marriage') ||
                                          type.includes('evlilik')
                                        ) {
                                          return {
                                            concern:
                                              'Evlilik konusunda sizi en çok endişelendiren konu nedir?',
                                            emotional:
                                              'Evlilik hakkında nasıl hissediyorsunuz?',
                                            understanding:
                                              'Bu evlilik açılımı ile neyi anlamak istiyorsunuz?',
                                            question1:
                                              'Evlilik konusunda sizi en çok endişelendiren konu nedir?',
                                            question2:
                                              'Bu evlilik açılımı ile neyi anlamak istiyorsunuz?',
                                            question3:
                                              'Evlilik hakkında nasıl hissediyorsunuz?',
                                          };
                                        } else if (
                                          type.includes(
                                            'relationship-analysis'
                                          ) ||
                                          type.includes('ilişki analizi')
                                        ) {
                                          return {
                                            concern:
                                              'İlişkinizde sizi en çok endişelendiren konu nedir?',
                                            emotional:
                                              'İlişkiniz hakkında nasıl hissediyorsunuz?',
                                            understanding:
                                              'Bu ilişki analizi açılımı ile neyi anlamak istiyorsunuz?',
                                            question1:
                                              'İlişkinizde sizi en çok endişelendiren konu nedir?',
                                            question2:
                                              'Bu ilişki analizi açılımı ile neyi anlamak istiyorsunuz?',
                                            question3:
                                              'İlişkiniz hakkında nasıl hissediyorsunuz?',
                                          };
                                        } else if (
                                          type.includes(
                                            'relationship-problems'
                                          ) ||
                                          type.includes('ilişki problemleri')
                                        ) {
                                          return {
                                            concern:
                                              'İlişkinizdeki problemler nelerdir?',
                                            emotional:
                                              'Bu problemler hakkında nasıl hissediyorsunuz?',
                                            understanding:
                                              'Bu ilişki problemleri açılımı ile neyi anlamak istiyorsunuz?',
                                            question1:
                                              'İlişkinizdeki problemler nelerdir?',
                                            question2:
                                              'Bu ilişki problemleri açılımı ile neyi anlamak istiyorsunuz?',
                                            question3:
                                              'Bu problemler hakkında nasıl hissediyorsunuz?',
                                          };
                                        } else if (
                                          type.includes('new-lover') ||
                                          type.includes('yeni aşk')
                                        ) {
                                          return {
                                            concern:
                                              'Yeni aşk konusunda sizi en çok endişelendiren konu nedir?',
                                            emotional:
                                              'Yeni aşk hakkında nasıl hissediyorsunuz?',
                                            understanding:
                                              'Bu yeni Aşk Uyumu ile neyi anlamak istiyorsunuz?',
                                            question1:
                                              'Yeni aşk konusunda sizi en çok endişelendiren konu nedir?',
                                            question2:
                                              'Bu yeni Aşk Uyumu ile neyi anlamak istiyorsunuz?',
                                            question3:
                                              'Yeni aşk hakkında nasıl hissediyorsunuz?',
                                          };
                                        }

                                        // Varsayılan sorular
                                        return {
                                          concern:
                                            'Sizi en çok endişelendiren konu nedir?',
                                          emotional: 'Nasıl hissediyorsunuz?',
                                          understanding:
                                            'Bu açılım ile neyi anlamak istiyorsunuz?',
                                          question1:
                                            'Sizi en çok endişelendiren konu nedir?',
                                          question2:
                                            'Bu açılım ile neyi anlamak istiyorsunuz?',
                                          question3: 'Nasıl hissediyorsunuz?',
                                        };
                                      };

                                      const spreadQuestionMap =
                                        getSpreadQuestionMap(
                                          selectedReading.reading_type
                                        );
                                      const questionText =
                                        spreadQuestionMap[entry.label] ||
                                        entry.label ||
                                        `Soru ${index + 1}`;

                                      return (
                                        <div
                                          key={index}
                                          className='admin-glass rounded-xl p-4 border border-slate-700/30'
                                        >
                                          <p className='text-xs uppercase tracking-wide text-slate-400 mb-2'>
                                            {questionText}
                                          </p>
                                          <div className='bg-slate-800/50 rounded-xl p-4 border border-slate-700/30'>
                                            <p className='text-white text-base leading-relaxed'>
                                              {entry.value ||
                                                'Cevap verilmemiş'}
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              )}

                            {/* 3. Format: Düz objeler (questions veya diğer alanlar) */}
                            {selectedReading.questions &&
                              typeof selectedReading.questions === 'object' &&
                              Object.keys(selectedReading.questions).filter(
                                key =>
                                  ![
                                    'personalInfo',
                                    'userQuestions',
                                    'prompts',
                                  ].includes(key)
                              ).length > 0 && (
                                <div className='space-y-4'>
                                  <h6 className='text-md font-semibold text-indigo-300 mb-2'>
                                    Diğer Sorular
                                  </h6>
                                  {Object.entries(selectedReading.questions)
                                    .filter(([key]) => {
                                      // Single card okuması kontrolü
                                      const isSingleCardReading =
                                        selectedReading.metadata
                                          ?.isSingleCardReading === true ||
                                        selectedReading.metadata
                                          ?.isSingleCardReading === 'true' ||
                                        selectedReading.reading_type
                                          ?.toLowerCase()
                                          .includes('single-card') ||
                                        selectedReading.spread_name
                                          ?.toLowerCase()
                                          .includes('tek kart');

                                      // Single card okumasında sadece concern göster
                                      if (
                                        isSingleCardReading &&
                                        key !== 'concern'
                                      ) {
                                        return false; // understanding, emotional, mainQuestion'ı filtrele
                                      }

                                      return ![
                                        'personalInfo',
                                        'userQuestions',
                                        'prompts',
                                      ].includes(key);
                                    })
                                    .map(([key, value]: [string, any]) => {
                                      // Açılım türüne göre soru metinleri (yukarıdaki fonksiyonla aynı)
                                      const getSpreadQuestionMap = (
                                        readingType: string
                                      ): Record<string, string> => {
                                        const type = readingType.toLowerCase();

                                        if (
                                          type.includes('love') ||
                                          type.includes('aşk')
                                        ) {
                                          return {
                                            concern:
                                              'Aşk hayatınızda sizi en çok endişelendiren konu nedir?',
                                            emotional:
                                              'Şu anda duygusal olarak nasıl hissediyorsunuz?',
                                            understanding:
                                              'Bu Aşk Uyumu ile neyi anlamak istiyorsunuz?',
                                            question1:
                                              'Aşk hayatınızda sizi en çok endişelendiren konu nedir?',
                                            question2:
                                              'Bu Aşk Uyumu ile neyi anlamak istiyorsunuz?',
                                            question3:
                                              'Şu anda duygusal olarak nasıl hissediyorsunuz?',
                                          };
                                        } else if (
                                          type.includes('money') ||
                                          type.includes('para')
                                        ) {
                                          return {
                                            concern:
                                              'Şu anda para konusunda sizi en çok zorlayan ya da kaygılandıran durum nedir?',
                                            emotional:
                                              'Mali durumunuzu düşündüğünüzde kendinizi nasıl hissediyorsunuz? Para şu an sizin için hangi duyguyu temsil ediyor? (güvende / huzursuz / yetersiz / özgür vb.)',
                                            understanding:
                                              'Bu para açılımının, para ve gelecek planlarınızla ilgili hangi konuda size daha fazla netlik ve yön göstermesini istiyorsunuz?',
                                            question1:
                                              'Şu anda para konusunda sizi en çok zorlayan ya da kaygılandıran durum nedir?',
                                            question2:
                                              'Bu para açılımının, para ve gelecek planlarınızla ilgili hangi konuda size daha fazla netlik ve yön göstermesini istiyorsunuz?',
                                            question3:
                                              'Mali durumunuzu düşündüğünüzde kendinizi nasıl hissediyorsunuz? Para şu an sizin için hangi duyguyu temsil ediyor? (güvende / huzursuz / yetersiz / özgür vb.)',
                                          };
                                        } else if (
                                          type.includes('career') ||
                                          type.includes('kariyer')
                                        ) {
                                          return {
                                            concern:
                                              'Kariyerinizde sizi en çok endişelendiren konu nedir?',
                                            emotional:
                                              'İş hayatınız hakkında nasıl hissediyorsunuz?',
                                            understanding:
                                              'Bu kariyer açılımı ile neyi anlamak istiyorsunuz?',
                                            question1:
                                              'Kariyerinizde sizi en çok endişelendiren konu nedir?',
                                            question2:
                                              'Bu kariyer açılımı ile neyi anlamak istiyorsunuz?',
                                            question3:
                                              'İş hayatınız hakkında nasıl hissediyorsunuz?',
                                          };
                                        } else if (
                                          type.includes('problem-solving') ||
                                          type.includes('problem')
                                        ) {
                                          return {
                                            concern:
                                              'Hangi problemi çözmek istiyorsunuz?',
                                            emotional:
                                              'Bu problem hakkında nasıl hissediyorsunuz?',
                                            understanding:
                                              'Bu Kelt  açılımı ile neyi anlamak istiyorsunuz?',
                                            question1:
                                              'Hangi problemi çözmek istiyorsunuz?',
                                            question2:
                                              'Bu Kelt  açılımı ile neyi anlamak istiyorsunuz?',
                                            question3:
                                              'Bu problem hakkında nasıl hissediyorsunuz?',
                                          };
                                        } else if (
                                          type.includes('situation-analysis') ||
                                          type.includes('durum')
                                        ) {
                                          return {
                                            concern:
                                              'Mevcut durumunuzda sizi en çok endişelendiren konu nedir?',
                                            emotional:
                                              'Şu anki durumunuz hakkında nasıl hissediyorsunuz?',
                                            understanding:
                                              'Bu Enerji Haritası açılımı ile neyi anlamak istiyorsunuz?',
                                            question1:
                                              'Mevcut durumunuzda sizi en çok endişelendiren konu nedir?',
                                            question2:
                                              'Bu Enerji Haritası açılımı ile neyi anlamak istiyorsunuz?',
                                            question3:
                                              'Şu anki durumunuz hakkında nasıl hissediyorsunuz?',
                                          };
                                        } else if (
                                          type.includes('marriage') ||
                                          type.includes('evlilik')
                                        ) {
                                          return {
                                            concern:
                                              'Evlilik konusunda sizi en çok endişelendiren konu nedir?',
                                            emotional:
                                              'Evlilik hakkında nasıl hissediyorsunuz?',
                                            understanding:
                                              'Bu evlilik açılımı ile neyi anlamak istiyorsunuz?',
                                            question1:
                                              'Evlilik konusunda sizi en çok endişelendiren konu nedir?',
                                            question2:
                                              'Bu evlilik açılımı ile neyi anlamak istiyorsunuz?',
                                            question3:
                                              'Evlilik hakkında nasıl hissediyorsunuz?',
                                          };
                                        } else if (
                                          type.includes(
                                            'relationship-analysis'
                                          ) ||
                                          type.includes('ilişki analizi')
                                        ) {
                                          return {
                                            concern:
                                              'İlişkinizde sizi en çok endişelendiren konu nedir?',
                                            emotional:
                                              'İlişkiniz hakkında nasıl hissediyorsunuz?',
                                            understanding:
                                              'Bu ilişki analizi açılımı ile neyi anlamak istiyorsunuz?',
                                            question1:
                                              'İlişkinizde sizi en çok endişelendiren konu nedir?',
                                            question2:
                                              'Bu ilişki analizi açılımı ile neyi anlamak istiyorsunuz?',
                                            question3:
                                              'İlişkiniz hakkında nasıl hissediyorsunuz?',
                                          };
                                        } else if (
                                          type.includes(
                                            'relationship-problems'
                                          ) ||
                                          type.includes('ilişki problemleri')
                                        ) {
                                          return {
                                            concern:
                                              'İlişkinizdeki problemler nelerdir?',
                                            emotional:
                                              'Bu problemler hakkında nasıl hissediyorsunuz?',
                                            understanding:
                                              'Bu ilişki problemleri açılımı ile neyi anlamak istiyorsunuz?',
                                            question1:
                                              'İlişkinizdeki problemler nelerdir?',
                                            question2:
                                              'Bu ilişki problemleri açılımı ile neyi anlamak istiyorsunuz?',
                                            question3:
                                              'Bu problemler hakkında nasıl hissediyorsunuz?',
                                          };
                                        } else if (
                                          type.includes('new-lover') ||
                                          type.includes('yeni aşk')
                                        ) {
                                          return {
                                            concern:
                                              'Yeni aşk konusunda sizi en çok endişelendiren konu nedir?',
                                            emotional:
                                              'Yeni aşk hakkında nasıl hissediyorsunuz?',
                                            understanding:
                                              'Bu yeni Aşk Uyumu ile neyi anlamak istiyorsunuz?',
                                            question1:
                                              'Yeni aşk konusunda sizi en çok endişelendiren konu nedir?',
                                            question2:
                                              'Bu yeni Aşk Uyumu ile neyi anlamak istiyorsunuz?',
                                            question3:
                                              'Yeni aşk hakkında nasıl hissediyorsunuz?',
                                          };
                                        }

                                        // Varsayılan sorular
                                        return {
                                          concern:
                                            'Sizi en çok endişelendiren konu nedir?',
                                          emotional: 'Nasıl hissediyorsunuz?',
                                          understanding:
                                            'Bu açılım ile neyi anlamak istiyorsunuz?',
                                          question1:
                                            'Sizi en çok endişelendiren konu nedir?',
                                          question2:
                                            'Bu açılım ile neyi anlamak istiyorsunuz?',
                                          question3: 'Nasıl hissediyorsunuz?',
                                        };
                                      };

                                      const spreadQuestionMap =
                                        getSpreadQuestionMap(
                                          selectedReading.reading_type
                                        );
                                      const questionText =
                                        spreadQuestionMap[key] || key;

                                      if (
                                        typeof value === 'object' &&
                                        value !== null
                                      ) {
                                        return (
                                          <div
                                            key={key}
                                            className='admin-glass rounded-xl p-4 border border-slate-700/30'
                                          >
                                            <p className='text-xs uppercase tracking-wide text-slate-400 mb-2'>
                                              {questionText}
                                            </p>
                                            <div className='bg-slate-800/50 rounded-xl p-4 border border-slate-700/30'>
                                              <pre className='text-white text-sm whitespace-pre-wrap'>
                                                {JSON.stringify(value, null, 2)}
                                              </pre>
                                            </div>
                                          </div>
                                        );
                                      } else if (
                                        value !== null &&
                                        value !== undefined
                                      ) {
                                        return (
                                          <div
                                            key={key}
                                            className='admin-glass rounded-xl p-4 border border-slate-700/30'
                                          >
                                            <p className='text-xs uppercase tracking-wide text-slate-400 mb-2'>
                                              {questionText}
                                            </p>
                                            <div className='bg-slate-800/50 rounded-xl p-4 border border-slate-700/30'>
                                              <p className='text-white text-base leading-relaxed'>
                                                {String(value)}
                                              </p>
                                            </div>
                                          </div>
                                        );
                                      } else {
                                        return null;
                                      }
                                    })}
                                </div>
                              )}

                            {/* Hiçbir soru bulunamadığında */}
                            {(!selectedReading.questions.userQuestions ||
                              Object.keys(
                                selectedReading.questions.userQuestions
                              ).length === 0) &&
                              (!selectedReading.questions.prompts ||
                                selectedReading.questions.prompts.length ===
                                  0) &&
                              Object.keys(selectedReading.questions).filter(
                                key =>
                                  ![
                                    'personalInfo',
                                    'userQuestions',
                                    'prompts',
                                  ].includes(key)
                              ).length === 0 && (
                                <div className='text-center py-4'>
                                  <p className='text-slate-400'>
                                    Kullanıcı soruları bulunamadı.
                                  </p>
                                </div>
                              )}
                          </div>
                        </div>
                      )}

                      {/* Diğer Sorular bölümü kaldırıldı - artık tüm sorular yukarıda gösteriliyor */}
                    </div>
                  )}

                  {/* Kartlar */}
                  {selectedReading.cards && (
                    <div className='admin-glass rounded-2xl p-6 border border-slate-700/50'>
                      <div className='flex items-center space-x-3 mb-6'>
                        <div className='admin-gradient-success p-3 rounded-xl'>
                          <Sparkles className='h-5 w-5 text-white' />
                        </div>
                        <h4 className='font-bold text-white text-lg'>
                          Çekilen Kartlar
                        </h4>
                      </div>
                      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        {/* useReadingCards hook'undan gelen detayları kullan */}
                        {cardDetails.length > 0
                          ? cardDetails.map(cardItem => (
                              <CardInsight
                                key={`${cardItem.position.id}-${cardItem.card.id}`}
                                card={cardItem.card}
                                displayName={cardItem.displayName}
                                positionTitle={cardItem.position.title}
                                positionNumber={cardItem.position.id}
                                isReversed={cardItem.isReversed}
                                meaning={cardItem.meaning || ''}
                                keywords={cardItem.keywords || []}
                                context={cardItem.context || ''}
                                group={
                                  cardItem.card.suit === 'major'
                                    ? 'Majör Arkana'
                                    : cardItem.card.suit === 'cups'
                                      ? 'Kupalar'
                                      : cardItem.card.suit === 'wands'
                                        ? 'Asalar'
                                        : cardItem.card.suit === 'swords'
                                          ? 'Kılıçlar'
                                          : cardItem.card.suit === 'pentacles'
                                            ? 'Tılsımlar'
                                            : 'Bilinmeyen'
                                }
                              />
                            ))
                          : // Fallback: Eğer useReadingCards hook'u çalışmazsa, eski yöntemi kullan
                            Array.isArray(selectedReading.cards) &&
                            selectedReading.cards.map(
                              (card: any, index: number) => (
                                <CardInsight
                                  key={index}
                                  card={{
                                    id: card.id || index,
                                    name: card.name || `Card ${index + 1}`,
                                    nameTr:
                                      card.nameTr ||
                                      card.name ||
                                      `Kart ${index + 1}`,
                                    suit: 'major',
                                    meaning: { upright: '', reversed: '' },
                                    meaningTr: { upright: '', reversed: '' },
                                    keywords: [],
                                    keywordsTr: [],
                                    image: '',
                                  }}
                                  displayName={
                                    card.nameTr ||
                                    card.name ||
                                    `Kart ${index + 1}`
                                  }
                                  positionTitle={`Pozisyon ${index + 1}`}
                                  positionNumber={index + 1}
                                  isReversed={Boolean(card.isReversed)}
                                  meaning={card.meaning || ''}
                                  keywords={[]}
                                  context={''}
                                  group={''}
                                />
                              )
                            )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className='relative bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-t border-slate-700/50 p-4 md:p-6'>
                  <div className='flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0'>
                    <div className='text-slate-400 text-sm'>
                      Okuma ID: {selectedReading?.id?.slice(0, 8)}...
                    </div>
                    <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto'>
                      <button
                        onClick={() => {
                          // Copy reading ID to clipboard
                          navigator.clipboard.writeText(
                            selectedReading?.id || ''
                          );
                          showToast('Okuma ID kopyalandı', 'success');
                        }}
                        className='px-4 py-2 admin-glass rounded-xl text-slate-300 hover:text-white transition-colors text-sm w-full sm:w-auto'
                      >
                        ID Kopyala
                      </button>
                      <button
                        onClick={() => setShowReadingModal(false)}
                        className='px-6 md:px-8 py-3 admin-gradient-primary rounded-2xl text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 w-full sm:w-auto'
                      >
                        Kapat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Reading Modal */}
      {showCreateReadingModal && (
        <CreateReadingModal
          onClose={() => setShowCreateReadingModal(false)}
          onSuccess={() => {
            setShowCreateReadingModal(false);
            showToast(
              'Okuma başarıyla oluşturuldu ve e-posta gönderildi',
              'success'
            );
            fetchReadings();
          }}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}

// Create Reading Modal Component
function CreateReadingModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { t } = useTranslations();
  const [formData, setFormData] = useState({
    customerEmail: '',
    customerFirstName: '',
    customerLastName: '',
    spreadKey: '',
    readingType: 'detailed' as 'detailed' | 'written',
    expiresInDays: 7,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.customerEmail ||
      !formData.spreadKey ||
      !formData.readingType
    ) {
      setError('Lütfen e-posta, tarot açılımı ve okuma tipi seçin');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/admin/reading-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail: formData.customerEmail,
          customerFirstName: formData.customerFirstName,
          customerLastName: formData.customerLastName,
          spreadKey: formData.spreadKey,
          readingType: formData.readingType,
          expiresInDays: formData.expiresInDays,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Okuma oluşturulamadı');
      }

      // Email gönder
      if (data.readingLink) {
        try {
          const emailResponse = await fetch('/api/admin/send-reading-link', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sessionId: data.sessionId,
              readingLink: data.readingLink,
              customerEmail: formData.customerEmail,
              customerName:
                `${formData.customerFirstName} ${formData.customerLastName}`.trim() ||
                'Müşteri',
              spreadName: (() => {
                const spread = tarotSpreads.find(
                  s => s.id === formData.spreadKey
                );
                if (spread?.name) {
                  // Translation key ise çevir, değilse direkt kullan
                  const translated = t(spread.name);
                  return translated !== spread.name ? translated : spread.name;
                }
                return formData.spreadKey;
              })(),
            }),
          });

          const emailData = await emailResponse.json();

          if (!emailResponse.ok) {
            // eslint-disable-next-line no-console
            console.error('Email gönderme hatası:', emailData);
            setError(
              `Okuma oluşturuldu ancak e-posta gönderilemedi: ${emailData.error || 'Bilinmeyen hata'}`
            );
            return; // Hata varsa modal'ı kapatma
          }
        } catch (emailErr) {
          // eslint-disable-next-line no-console
          console.error('Email gönderme hatası:', emailErr);
          setError(
            `Okuma oluşturuldu ancak e-posta gönderilemedi: ${emailErr instanceof Error ? emailErr.message : 'Bilinmeyen hata'}`
          );
          return; // Hata varsa modal'ı kapatma
        }
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4'>
      <div className='admin-card rounded-2xl p-6 w-full max-w-md'>
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-xl font-bold text-white'>Yeni Okuma Oluştur</h3>
          <button
            onClick={onClose}
            className='p-2 admin-glass rounded-lg hover:bg-slate-700/50 transition-colors'
          >
            <X className='h-5 w-5 text-slate-300' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Spread Seçimi */}
          <div>
            <label className='block text-sm font-medium text-slate-300 mb-2'>
              Tarot Açılımı <span className='text-red-400'>*</span>
            </label>
            <select
              value={formData.spreadKey}
              onChange={e =>
                setFormData({ ...formData, spreadKey: e.target.value })
              }
              className='w-full p-3 admin-glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            >
              <option value=''>Açılım seçin...</option>
              {tarotSpreads.map(spread => (
                <option key={spread.id} value={spread.id}>
                  {t(spread.name)} ({spread.cardCount} kart)
                </option>
              ))}
            </select>
          </div>

          {/* Reading Type Seçimi */}
          <div>
            <label className='block text-sm font-medium text-slate-300 mb-2'>
              Okuma Tipi <span className='text-red-400'>*</span>
            </label>
            <select
              value={formData.readingType}
              onChange={e =>
                setFormData({
                  ...formData,
                  readingType: e.target.value as 'detailed' | 'written',
                })
              }
              className='w-full p-3 admin-glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            >
              <option value='detailed'>🔮 Sesli Okuma (DETAILED)</option>
              <option value='written'>📝 Yazılı Okuma (WRITTEN)</option>
            </select>
            <p className='text-xs text-slate-400 mt-1'>
              Müşteri link&apos;e tıkladığında bu okuma tipine direkt geçecek
            </p>
          </div>

          {/* E-posta */}
          <div>
            <label className='block text-sm font-medium text-slate-300 mb-2'>
              E-posta <span className='text-red-400'>*</span>
            </label>
            <input
              type='email'
              value={formData.customerEmail}
              onChange={e =>
                setFormData({ ...formData, customerEmail: e.target.value })
              }
              className='w-full p-3 admin-glass rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              placeholder='musteri@example.com'
              required
            />
          </div>

          {/* Ad */}
          <div>
            <label className='block text-sm font-medium text-slate-300 mb-2'>
              Ad (Opsiyonel)
            </label>
            <input
              type='text'
              value={formData.customerFirstName}
              onChange={e =>
                setFormData({ ...formData, customerFirstName: e.target.value })
              }
              className='w-full p-3 admin-glass rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              placeholder='Müşteri adı'
            />
          </div>

          {/* Soyad */}
          <div>
            <label className='block text-sm font-medium text-slate-300 mb-2'>
              Soyad (Opsiyonel)
            </label>
            <input
              type='text'
              value={formData.customerLastName}
              onChange={e =>
                setFormData({ ...formData, customerLastName: e.target.value })
              }
              className='w-full p-3 admin-glass rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              placeholder='Müşteri soyadı'
            />
          </div>

          {/* Geçerlilik Süresi */}
          <div>
            <label className='block text-sm font-medium text-slate-300 mb-2'>
              Geçerlilik Süresi (Gün)
            </label>
            <input
              type='number'
              min='1'
              max='30'
              value={formData.expiresInDays}
              onChange={e =>
                setFormData({
                  ...formData,
                  expiresInDays: parseInt(e.target.value) || 7,
                })
              }
              className='w-full p-3 admin-glass rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
          </div>

          {/* Hata Mesajı */}
          {error && (
            <div className='p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm'>
              {error}
            </div>
          )}

          {/* Butonlar */}
          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 p-3 admin-glass rounded-lg text-white hover:bg-slate-700/50 transition-colors'
              disabled={loading}
            >
              İptal
            </button>
            <button
              type='submit'
              className='flex-1 p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={loading}
            >
              {loading ? 'Oluşturuluyor...' : 'Okuma Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
