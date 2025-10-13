'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/auth/useAuth';
import {
  Coins,
  TrendingUp,
  Download,
  Filter,
  Calendar,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface Transaction {
  id: string;
  user_id: string;
  delta_credits: number;
  reason: string;
  ref_type?: string;
  ref_id?: string;
  created_at: string;
}

interface CreditStats {
  totalPurchased: number;
  totalUsed: number;
  totalRefunded: number;
  totalBonus: number;
  currentBalance: number;
  averagePerMonth: number;
}

export default function CreditsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Pathname'den locale'i çıkar
  const locale = pathname?.split('/')[1] || 'tr';
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<CreditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'usage' | 'purchase' | 'bonus'>(
    'all'
  );
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month' | 'year'>(
    'all'
  );

  // Auth kontrolü
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace(`/${locale}/auth`);
        return;
      }
      fetchTransactions();
    }
  }, [authLoading, user, filter, dateRange, router, locale]);

  const fetchTransactions = async () => {
    if (!user) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filter !== 'all') {
        if (filter === 'usage') {
          query = query.lt('delta_credits', 0); // Negatif değerler = kullanım
        } else if (filter === 'purchase') {
          query = query.gt('delta_credits', 0); // Pozitif değerler = satın alma
        } else if (filter === 'bonus') {
          query = query.ilike('reason', '%bonus%'); // Bonus içeren kayıtlar
        }
      }

      // Apply date range
      if (dateRange !== 'all') {
        const now = new Date();
        const startDate = new Date();

        switch (dateRange) {
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }

        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        // Eğer transactions tablosu yoksa boş liste göster
        if (
          error.code === 'PGRST204' ||
          error.message.includes('transactions')
        ) {
          setTransactions([]);
          setStats({
            totalPurchased: 0,
            totalUsed: 0,
            totalRefunded: 0,
            totalBonus: 0,
            currentBalance: 0,
            averagePerMonth: 0,
          });
          return;
        }
        throw error;
      }

      if (data && data.length > 0) {
        setTransactions(data);
        calculateStats(data);
      } else {
        // Veri yoksa boş liste göster
        setTransactions([]);
        setStats({
          totalPurchased: 0,
          totalUsed: 0,
          totalRefunded: 0,
          totalBonus: 0,
          currentBalance: 0,
          averagePerMonth: 0,
        });
      }
    } catch (error) {
      setError(t('dashboard.creditHistory.error'));
      // Hata durumunda boş liste göster
      setTransactions([]);
      setStats({
        totalPurchased: 0,
        totalUsed: 0,
        totalRefunded: 0,
        totalBonus: 0,
        currentBalance: 0,
        averagePerMonth: 0,
      });
    } finally {
      setLoading(false);
    }
  };
  const calculateStats = (transactions: Transaction[]) => {
    const totalPurchased = transactions
      .filter(
        t => t.delta_credits > 0 && !t.reason.toLowerCase().includes('bonus')
      )
      .reduce((sum, t) => sum + t.delta_credits, 0);

    const totalUsed = transactions
      .filter(t => t.delta_credits < 0)
      .reduce((sum, t) => sum + Math.abs(t.delta_credits), 0);

    const totalRefunded = transactions
      .filter(
        t => t.delta_credits > 0 && t.reason.toLowerCase().includes('refund')
      )
      .reduce((sum, t) => sum + t.delta_credits, 0);

    const totalBonus = transactions
      .filter(
        t => t.delta_credits > 0 && t.reason.toLowerCase().includes('bonus')
      )
      .reduce((sum, t) => sum + t.delta_credits, 0);

    const currentBalance =
      totalPurchased + totalRefunded + totalBonus - totalUsed;

    // Calculate average per month (assuming 12 months)
    const monthsActive = 12; // This could be calculated from user creation date
    const averagePerMonth = totalPurchased / monthsActive;

    setStats({
      totalPurchased,
      totalUsed,
      totalRefunded,
      totalBonus,
      currentBalance,
      averagePerMonth,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.delta_credits > 0) {
      if (transaction.reason.toLowerCase().includes('bonus')) {
        return <TrendingUp className='h-5 w-5 text-yellow-400' />;
      } else if (transaction.reason.toLowerCase().includes('refund')) {
        return <ArrowUp className='h-5 w-5 text-blue-400' />;
      } else {
        return <ArrowUp className='h-5 w-5 text-green-400' />;
      }
    } else {
      return <ArrowDown className='h-5 w-5 text-red-400' />;
    }
  };

  const getTransactionColor = (transaction: Transaction) => {
    if (transaction.delta_credits > 0) {
      if (transaction.reason.toLowerCase().includes('bonus')) {
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      } else if (transaction.reason.toLowerCase().includes('refund')) {
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      } else {
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      }
    } else {
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    }
  };

  const getTransactionLabel = (transaction: Transaction) => {
    if (transaction.delta_credits > 0) {
      if (transaction.reason.toLowerCase().includes('bonus')) {
        return 'Bonus';
      } else if (transaction.reason.toLowerCase().includes('refund')) {
        return 'İade';
      } else {
        return 'Satın Alma';
      }
    } else {
      return 'Kullanım';
    }
  };

  const exportTransactions = () => {
    const csvContent = [
      [t('dashboard.creditHistory.csvDate'), t('dashboard.creditHistory.csvType'), t('dashboard.creditHistory.csvAmount'), t('dashboard.creditHistory.csvDescription')],
      ...transactions.map(transaction => [
        formatDate(transaction.created_at),
        getTransactionLabel(transaction),
        transaction.delta_credits.toString(),
        transaction.reason,
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `kredi-gecmisi-${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (authLoading || loading) {
    return (
      <div className='min-h-screen bg-cosmic-black flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4'></div>
          <div className='text-text-celestial text-lg'>
            🔮 Kredi geçmişi yükleniyor...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-cosmic-black text-white'>
      {/* Header */}
      <header className='border-b border-cosmic-fog p-4'>
        <div className='container mx-auto flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Coins className='h-8 w-8 text-gold' />
            <span className='text-xl font-bold text-text-celestial'>
              Kredi Geçmişi
            </span>
          </div>
          <a
            href='/dashboard'
            className='text-text-mystic hover:text-gold transition-colors'
          >
            ← {t('dashboard.backToDashboard')}
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        {/* Page Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold mb-2 text-text-celestial'>
            Kredi Geçmişi
          </h1>
          <p className='text-text-mystic'>
            Kredi alım, kullanım ve işlem geçmişinizi takip edin
          </p>
          {error && (
            <div className='mt-4 p-4 bg-warning/10 border border-warning/30 rounded-lg'>
              <p className='text-warning text-sm'>{error}</p>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className='grid md:grid-cols-4 gap-6 mb-8'>
            <div className='card hover-lift p-6 text-center'>
              <div className='text-2xl font-bold text-success mb-1'>
                {stats.totalPurchased}
              </div>
              <div className='text-sm text-text-muted'>Toplam Satın Alınan</div>
            </div>

            <div className='card hover-lift p-6 text-center'>
              <div className='text-2xl font-bold text-danger mb-1'>
                {stats.totalUsed}
              </div>
              <div className='text-sm text-text-muted'>Toplam Kullanılan</div>
            </div>

            <div className='card hover-lift p-6 text-center'>
              <div className='text-2xl font-bold text-info mb-1'>
                {stats.totalRefunded}
              </div>
              <div className='text-sm text-text-muted'>Toplam İade</div>
            </div>

            <div className='card hover-lift p-6 text-center'>
              <div className='text-2xl font-bold text-warning mb-1'>
                {stats.currentBalance}
              </div>
              <div className='text-sm text-text-muted'>Mevcut Bakiye</div>
            </div>
          </div>
        )}

        {/* Filters and Export */}
        <div className='mb-8 space-y-4'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div className='flex items-center space-x-4'>
              {/* Type Filter */}
              <div className='flex items-center space-x-2'>
                <Filter className='h-5 w-5 text-text-mystic' />
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value as any)}
                  className='bg-crystal-clear border border-cosmic-fog rounded-lg px-3 py-2 text-text-celestial focus:outline-none focus:ring-2 focus:ring-gold/50'
                >
                  <option value='all'>Tüm İşlemler</option>
                  <option value='purchase'>Satın Almalar</option>
                  <option value='usage'>Kullanımlar</option>
                  <option value='refund'>İadeler</option>
                  <option value='bonus'>Bonuslar</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div className='flex items-center space-x-2'>
                <Calendar className='h-5 w-5 text-text-mystic' />
                <select
                  value={dateRange}
                  onChange={e => setDateRange(e.target.value as any)}
                  className='bg-crystal-clear border border-cosmic-fog rounded-lg px-3 py-2 text-text-celestial focus:outline-none focus:ring-2 focus:ring-gold/50'
                >
                  <option value='all'>Tüm Zamanlar</option>
                  <option value='week'>Son 7 Gün</option>
                  <option value='month'>Son 30 Gün</option>
                  <option value='year'>Son 1 Yıl</option>
                </select>
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={exportTransactions}
              className='btn btn-primary flex items-center space-x-2'
            >
              <Download className='h-4 w-4' />
              <span>{t('dashboard.creditHistory.downloadCSV')}</span>
            </button>
          </div>

          {/* Results Count */}
          <div className='text-sm text-text-mystic'>
            {t('dashboard.creditHistory.transactionsFound', { count: transactions.length })}
          </div>
        </div>

        {/* Transactions List */}
        <div className='space-y-4'>
          {transactions.map(transaction => (
            <div key={transaction.id} className='card hover-lift p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div
                    className={`p-3 rounded-lg border ${getTransactionColor(transaction)}`}
                  >
                    {getTransactionIcon(transaction)}
                  </div>

                  <div>
                    <div className='flex items-center space-x-3 mb-2'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getTransactionColor(transaction)}`}
                      >
                        {getTransactionLabel(transaction)}
                      </span>
                      <span className='text-sm text-text-mystic'>
                        {formatDate(transaction.created_at)}
                      </span>
                      <span className='text-xs px-2 py-1 rounded bg-success/20 text-success'>
                        Tamamlandı
                      </span>
                    </div>

                    <h3 className='font-semibold text-text-celestial mb-1'>
                      {transaction.reason}
                    </h3>

                    {transaction.ref_type && (
                      <span className='text-xs text-gold bg-gold/10 px-2 py-1 rounded'>
                        {transaction.ref_type}
                      </span>
                    )}
                  </div>
                </div>

                <div className='text-right'>
                  <div
                    className={`text-2xl font-bold ${
                      transaction.delta_credits > 0
                        ? 'text-success'
                        : 'text-danger'
                    }`}
                  >
                    {transaction.delta_credits > 0 ? '+' : ''}
                    {transaction.delta_credits} kredi
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {transactions.length === 0 && (
          <div className='text-center py-16'>
            <Coins className='h-16 w-16 text-text-muted mx-auto mb-4' />
            <h3 className='text-xl font-semibold text-text-celestial mb-2'>
              {t('dashboard.creditHistory.noTransactions')}
            </h3>
            <p className='text-text-mystic mb-6'>
              {t('dashboard.creditHistory.startWithFirstPurchase')}
            </p>
            <a href='/packages' className='btn btn-primary'>
              {t('dashboard.creditHistory.buyCredits')}
            </a>
          </div>
        )}

        {/* Navigation */}
        <div className='mt-12 text-center'>
          <a href='/dashboard' className='btn btn-primary'>
            {t('dashboard.backToDashboard')}
          </a>
        </div>
      </main>
    </div>
  );
}
