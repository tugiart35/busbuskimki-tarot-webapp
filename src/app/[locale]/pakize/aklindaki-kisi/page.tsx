'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Copy,
  Mail,
  Link as LinkIcon,
  Heart,
  List,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  ShoppingCart,
  RotateCcw,
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import Toast from '@/features/shared/ui/Toast';
import {
  CreateCustomerLinkRequest,
  CreateCustomerLinkResponse,
  SendEmailRequest,
  SendEmailResponse,
  LinkWithActivity,
} from '@/types/aklindaki-kisi.types';

export default function AklindakiKisiAdminPage() {
  const { toast, showToast, hideToast } = useToast();
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'shopier'>(
    'create'
  );

  // Link oluşturma state
  const [customerEmail, setCustomerEmail] = useState('');
  const [expiresInDays, setExpiresInDays] = useState(0); // 0 = süresiz
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [linkId, setLinkId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Link listesi state
  const [links, setLinks] = useState<LinkWithActivity[]>([]);
  const [linksLoading, setLinksLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Shopier linkleri state
  const [shopierLinks, setShopierLinks] = useState<LinkWithActivity[]>([]);
  const [shopierLinksLoading, setShopierLinksLoading] = useState(false);
  const [shopierSearchTerm, setShopierSearchTerm] = useState('');

  // Link listesini yükle
  const fetchLinks = useCallback(async () => {
    setLinksLoading(true);
    try {
      const response = await fetch('/api/admin/customer-links');
      const data = await response.json();

      if (!response.ok || !data.success) {
        showToast(data.error || 'Linkler yüklenemedi', 'error');
        setLinksLoading(false);
        return;
      }

      setLinks(data.links || []);
    } catch (error) {
      showToast('Linkler yüklenirken bir hata oluştu', 'error');
    } finally {
      setLinksLoading(false);
    }
  }, [showToast]);

  // Shopier linklerini yükle
  const fetchShopierLinks = useCallback(async () => {
    setShopierLinksLoading(true);
    try {
      const response = await fetch('/api/admin/customer-links/shopier');
      const data = await response.json();

      if (!response.ok || !data.success) {
        showToast(data.error || 'Shopier linkleri yüklenemedi', 'error');
        setShopierLinksLoading(false);
        return;
      }

      setShopierLinks(data.links || []);
    } catch (error) {
      showToast('Shopier linkleri yüklenirken bir hata oluştu', 'error');
    } finally {
      setShopierLinksLoading(false);
    }
  }, [showToast]);

  // Tab değiştiğinde linkleri yükle
  useEffect(() => {
    if (activeTab === 'list') {
      fetchLinks();
    } else if (activeTab === 'shopier') {
      fetchShopierLinks();
    }
  }, [activeTab, fetchLinks, fetchShopierLinks]);

  const handleCreateLink = async () => {
    if (!customerEmail.trim()) {
      showToast('Lütfen müşteri e-postasını girin', 'error');
      return;
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      showToast('Geçerli bir e-posta adresi giriniz', 'error');
      return;
    }

    setLoading(true);

    try {
      const request: CreateCustomerLinkRequest = {
        customerEmail: customerEmail.trim(),
        expiresInDays,
      };

      const response = await fetch('/api/admin/customer-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data: CreateCustomerLinkResponse = await response.json();

      if (!response.ok || !data.success) {
        showToast(data.error || 'Link oluşturulamadı', 'error');
        setLoading(false);
        return;
      }

      setGeneratedLink(data.link || null);
      setLinkId(data.linkId || null);
      showToast('Link başarıyla oluşturuldu', 'success');

      // Link listesini yenile
      if (activeTab === 'list') {
        fetchLinks();
      }
    } catch (error) {
      showToast('Link oluşturulurken bir hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async (link?: string) => {
    const linkToCopy = link || generatedLink;
    if (!linkToCopy) {
      return;
    }

    try {
      await navigator.clipboard.writeText(linkToCopy);
      showToast('Link kopyalandı', 'success');
    } catch (error) {
      showToast('Link kopyalanamadı', 'error');
    }
  };

  const handleSendEmail = async (
    linkIdToSend?: string,
    emailToSend?: string
  ) => {
    const targetLinkId = linkIdToSend || linkId;
    const targetEmail = emailToSend || customerEmail;

    if (!targetLinkId || !targetEmail) {
      showToast('Önce bir link oluşturun', 'error');
      return;
    }

    setSendingEmail(true);

    try {
      const request: SendEmailRequest = {
        linkId: targetLinkId,
        customerEmail: targetEmail,
      };

      const response = await fetch('/api/admin/customer-links/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data: SendEmailResponse = await response.json();

      if (!response.ok || !data.success) {
        showToast(data.error || 'E-posta gönderilemedi', 'error');
        setSendingEmail(false);
        return;
      }

      showToast('E-posta başarıyla gönderildi', 'success');
    } catch (error) {
      showToast('E-posta gönderilirken bir hata oluştu', 'error');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleResetDailyLimit = async (linkId: string, customerEmail: string) => {
    try {
      const response = await fetch(
        `/api/admin/customer-links/${linkId}/reset-daily-limit`,
        {
          method: 'PATCH',
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('Günlük limit başarıyla sıfırlandı', 'success');
        // Listeyi yenile
        if (activeTab === 'list') {
          fetchLinks();
        } else if (activeTab === 'shopier') {
          fetchShopierLinks();
        }
      } else {
        showToast(data.error || 'Günlük limit sıfırlanamadı', 'error');
      }
    } catch (error) {
      showToast('Bir hata oluştu', 'error');
      console.error('Günlük limit sıfırlama hatası', error);
    }
  };

  // Filtrelenmiş linkler
  const filteredLinks = links.filter(link => {
    if (!searchTerm) {
      return true;
    }
    const search = searchTerm.toLowerCase();
    return (
      link.customer_email.toLowerCase().includes(search) ||
      link.status.toLowerCase().includes(search) ||
      link.token_preview?.toLowerCase().includes(search)
    );
  });

  // Filtrelenmiş Shopier linkleri
  const filteredShopierLinks = shopierLinks.filter(link => {
    if (!shopierSearchTerm) {
      return true;
    }
    const search = shopierSearchTerm.toLowerCase();
    return (
      link.customer_email.toLowerCase().includes(search) ||
      link.status.toLowerCase().includes(search) ||
      link.token_preview?.toLowerCase().includes(search)
    );
  });

  // Status badge
  const getStatusBadge = (status: string, expiryDate?: string | null) => {
    let actualStatus = status;
    if (status === 'active' && expiryDate) {
      const expiry = new Date(expiryDate);
      if (expiry < new Date()) {
        actualStatus = 'expired';
      }
    }

    switch (actualStatus) {
      case 'active':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
            <CheckCircle className='h-3 w-3 mr-1' />
            Aktif
          </span>
        );
      case 'expired':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
            <XCircle className='h-3 w-3 mr-1' />
            Süresi Dolmuş
          </span>
        );
      case 'used':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
            <CheckCircle className='h-3 w-3 mr-1' />
            Kullanılmış
          </span>
        );
      default:
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
            {status}
          </span>
        );
    }
  };

  const tabs = [
    {
      id: 'create' as const,
      name: 'Link Oluştur',
      icon: Plus,
      gradient: 'from-pink-500 to-rose-600',
    },
    {
      id: 'list' as const,
      name: 'Oluşturulan Linkler',
      icon: List,
      gradient: 'from-purple-500 to-indigo-600',
    },
    {
      id: 'shopier' as const,
      name: 'Shopier',
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-cyan-600',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-2'>
            <Heart className='h-8 w-8 text-pink-500' />
            <h1 className='text-3xl font-bold text-slate-900'>
              Aklındaki Kişi - Link Yönetimi
            </h1>
          </div>
          <p className='text-slate-600'>
            Müşterilere özel kart çekme linkleri oluşturun ve yönetin
          </p>
        </div>

        {/* Tab Navigation */}
        <div className='bg-white rounded-xl shadow-lg p-2 mb-6'>
          <nav className='flex gap-2'>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <tab.icon className='h-5 w-5' />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'create' && (
          <>
            {/* Form Card */}
            <div className='bg-white rounded-xl shadow-lg p-6 mb-6'>
              <h2 className='text-xl font-semibold text-slate-900 mb-4'>
                Yeni Link Oluştur
              </h2>

              <div className='space-y-4'>
                {/* Customer Email */}
                <div>
                  <label
                    htmlFor='customerEmail'
                    className='block text-sm font-medium text-slate-700 mb-2'
                  >
                    Müşteri E-postası <span className='text-red-500'>*</span>
                  </label>
                  <input
                    id='customerEmail'
                    type='email'
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    placeholder='ornek@email.com'
                    className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-slate-900 placeholder:text-slate-400'
                    disabled={loading}
                  />
                </div>

                {/* Expiry Days */}
                <div>
                  <label
                    htmlFor='expiresInDays'
                    className='block text-sm font-medium text-slate-700 mb-2'
                  >
                    Geçerlilik Süresi (Gün){' '}
                    <span className='text-slate-500 text-xs'>
                      (0 = süresiz)
                    </span>
                  </label>
                  <input
                    id='expiresInDays'
                    type='number'
                    min='0'
                    max='365'
                    value={expiresInDays}
                    onChange={e =>
                      setExpiresInDays(parseInt(e.target.value) || 0)
                    }
                    className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-slate-900 placeholder:text-slate-400'
                    disabled={loading}
                  />
                  <p className='text-xs text-slate-500 mt-1'>
                    {expiresInDays === 0
                      ? 'Link süresiz geçerli olacak'
                      : `${expiresInDays} gün sonra link geçersiz olacak`}
                  </p>
                </div>

                {/* Create Link Button */}
                <button
                  onClick={handleCreateLink}
                  disabled={loading || !customerEmail.trim()}
                  className='w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2'
                >
                  {loading ? (
                    <>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <LinkIcon className='h-5 w-5' />
                      Link Oluştur
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Link Card */}
            {generatedLink && (
              <div className='bg-white rounded-xl shadow-lg p-6 mb-6'>
                <h2 className='text-xl font-semibold text-slate-900 mb-4'>
                  Oluşturulan Link
                </h2>

                <div className='space-y-4'>
                  {/* Link Display */}
                  <div className='bg-slate-50 border border-slate-200 rounded-lg p-4'>
                    <div className='flex items-center gap-2 mb-2'>
                      <LinkIcon className='h-4 w-4 text-slate-500' />
                      <span className='text-sm font-medium text-slate-700'>
                        Link:
                      </span>
                    </div>
                    <p className='text-sm text-slate-900 break-all font-mono'>
                      {generatedLink}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex gap-3'>
                    <button
                      onClick={() => handleCopyLink()}
                      className='flex-1 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-all flex items-center justify-center gap-2'
                    >
                      <Copy className='h-4 w-4' />
                      Kopyala
                    </button>

                    <button
                      onClick={() => handleSendEmail()}
                      disabled={sendingEmail || !linkId}
                      className='flex-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-4 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2'
                    >
                      {sendingEmail ? (
                        <>
                          <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          <Mail className='h-4 w-4' />
                          Mail Gönder
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Info Card */}
            <div className='bg-blue-50 border border-blue-200 rounded-xl p-6'>
              <h3 className='text-lg font-semibold text-blue-900 mb-2'>
                Bilgilendirme
              </h3>
              <ul className='space-y-2 text-sm text-blue-800'>
                <li>• Müşteriler günde maksimum 3 kart çekebilir</li>
                <li>• Son 24 çekilen kart tekrar çekilemez</li>
                <li>
                  • Link oluşturulduktan sonra müşteriye e-posta ile
                  gönderilebilir
                </li>
                <li>
                  • Geçerlilik süresi belirtilirse, link süresi dolduğunda
                  otomatik olarak geçersiz hale gelir
                </li>
                <li>
                  • Geçerlilik süresi 0 olarak ayarlanırsa link süresiz geçerli
                  olur
                </li>
              </ul>
            </div>
          </>
        )}

        {activeTab === 'list' && (
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-semibold text-slate-900'>
                Oluşturulan Linkler
              </h2>
              <button
                onClick={fetchLinks}
                disabled={linksLoading}
                className='flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all disabled:opacity-50'
              >
                <RefreshCw
                  className={`h-4 w-4 ${linksLoading ? 'animate-spin' : ''}`}
                />
                Yenile
              </button>
            </div>

            {/* Search */}
            <div className='mb-6'>
              <input
                type='text'
                placeholder='E-posta veya token ile ara...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-slate-900 placeholder:text-slate-400'
              />
            </div>

            {/* Links Table */}
            {linksLoading ? (
              <div className='text-center py-12'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4'></div>
                <p className='text-slate-600'>Yükleniyor...</p>
              </div>
            ) : filteredLinks.length === 0 ? (
              <div className='text-center py-12'>
                <p className='text-slate-600'>
                  {searchTerm
                    ? 'Arama sonucu bulunamadı'
                    : 'Henüz link oluşturulmamış'}
                </p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b border-slate-200'>
                      <th className='text-left py-3 px-4 text-sm font-semibold text-slate-700'>
                        Müşteri E-postası
                      </th>
                      <th className='text-left py-3 px-4 text-sm font-semibold text-slate-700'>
                        Durum
                      </th>
                      <th className='text-left py-3 px-4 text-sm font-semibold text-slate-700'>
                        Çekilen Kart
                      </th>
                      <th className='text-left py-3 px-4 text-sm font-semibold text-slate-700'>
                        Son Çekim
                      </th>
                      <th className='text-left py-3 px-4 text-sm font-semibold text-slate-700'>
                        Oluşturulma
                      </th>
                      <th className='text-left py-3 px-4 text-sm font-semibold text-slate-700'>
                        Geçerlilik
                      </th>
                      <th className='text-right py-3 px-4 text-sm font-semibold text-slate-700'>
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLinks.map(link => {
                      const baseUrl =
                        process.env.NEXT_PUBLIC_READING_LINK_BASE_URL ||
                        process.env.NEXT_PUBLIC_SITE_URL ||
                        'https://www.busbuskimki.com';
                      const locale = 'tr'; // Türkçe locale - linkler Türkçe açılacak
                      const fullLink = `${baseUrl}/${locale}/aklindaki-kisi?token=${link.token}`;

                      return (
                        <tr
                          key={link.id}
                          className='border-b border-slate-100 hover:bg-slate-50 transition-colors'
                        >
                          <td className='py-4 px-4'>
                            <div className='flex items-center gap-2'>
                              <Mail className='h-4 w-4 text-slate-400' />
                              <span className='text-sm text-slate-900'>
                                {link.customer_email}
                              </span>
                            </div>
                          </td>
                          <td className='py-4 px-4'>
                            {getStatusBadge(link.status, link.expiry_date)}
                          </td>
                          <td className='py-4 px-4'>
                            <div className='flex items-center gap-2'>
                              <span className='text-sm font-medium text-slate-900'>
                                {link.totalCardsDrawn}/3
                              </span>
                              <span className='text-xs text-slate-500'>
                                (bugün)
                              </span>
                            </div>
                          </td>
                          <td className='py-4 px-4'>
                            {link.lastDrawDate ? (
                              <div className='flex items-center gap-2'>
                                <Clock className='h-4 w-4 text-slate-400' />
                                <span className='text-sm text-slate-600'>
                                  {new Date(link.lastDrawDate).toLocaleString(
                                    'tr-TR',
                                    {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }
                                  )}
                                </span>
                              </div>
                            ) : (
                              <span className='text-sm text-slate-400'>
                                Henüz çekilmedi
                              </span>
                            )}
                          </td>
                          <td className='py-4 px-4'>
                            <div className='flex items-center gap-2'>
                              <Calendar className='h-4 w-4 text-slate-400' />
                              <span className='text-sm text-slate-600'>
                                {new Date(link.created_at).toLocaleDateString(
                                  'tr-TR'
                                )}
                              </span>
                            </div>
                          </td>
                          <td className='py-4 px-4'>
                            {link.expiry_date ? (
                              <span className='text-sm text-slate-600'>
                                {new Date(link.expiry_date).toLocaleDateString(
                                  'tr-TR'
                                )}
                              </span>
                            ) : (
                              <span className='text-sm text-green-600 font-medium'>
                                Süresiz
                              </span>
                            )}
                          </td>
                          <td className='py-4 px-4'>
                            <div className='flex items-center justify-end gap-2'>
                              <button
                                onClick={() =>
                                  handleResetDailyLimit(link.id, link.customer_email)
                                }
                                className='p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all'
                                title='Günlük kart çekme hakkını sıfırla'
                              >
                                <RotateCcw className='h-4 w-4' />
                              </button>
                              <button
                                onClick={() => handleCopyLink(fullLink)}
                                className='p-2 text-slate-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all'
                                title='Linki kopyala'
                              >
                                <Copy className='h-4 w-4' />
                              </button>
                              <button
                                onClick={() =>
                                  handleSendEmail(link.id, link.customer_email)
                                }
                                disabled={sendingEmail}
                                className='p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50'
                                title='E-posta gönder'
                              >
                                <Mail className='h-4 w-4' />
                              </button>
                              <a
                                href={fullLink}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all'
                                title='Linki aç'
                              >
                                <ExternalLink className='h-4 w-4' />
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'shopier' && (
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h2 className='text-xl font-semibold text-slate-900'>
                  Shopier Siparişleri
                </h2>
                <p className='text-sm text-slate-500 mt-1'>
                  Shopier&apos;den gelen siparişler ve oluşturulan linkler
                </p>
              </div>
              <button
                onClick={fetchShopierLinks}
                disabled={shopierLinksLoading}
                className='flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all disabled:opacity-50'
              >
                <RefreshCw
                  className={`h-4 w-4 ${shopierLinksLoading ? 'animate-spin' : ''}`}
                />
                Yenile
              </button>
            </div>

            {/* Search */}
            <div className='mb-6'>
              <input
                type='text'
                placeholder='E-posta veya token ile ara...'
                value={shopierSearchTerm}
                onChange={e => setShopierSearchTerm(e.target.value)}
                className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder:text-slate-400'
              />
            </div>

            {/* Shopier Links Table */}
            {shopierLinksLoading ? (
              <div className='text-center py-12'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
                <p className='text-slate-600'>Yükleniyor...</p>
              </div>
            ) : filteredShopierLinks.length === 0 ? (
              <div className='text-center py-12'>
                <ShoppingCart className='h-12 w-12 text-slate-400 mx-auto mb-4' />
                <p className='text-slate-600'>
                  {shopierSearchTerm
                    ? 'Arama sonucu bulunamadı'
                    : 'Henüz Shopier siparişi yok'}
                </p>
                <p className='text-sm text-slate-500 mt-2'>
                  Shopier&apos;den sipariş geldiğinde burada görünecek
                </p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b border-slate-200'>
                      <th className='text-left py-3 px-4 text-sm font-semibold text-slate-700'>
                        Müşteri E-postası
                      </th>
                      <th className='text-left py-3 px-4 text-sm font-semibold text-slate-700'>
                        Durum
                      </th>
                      <th className='text-left py-3 px-4 text-sm font-semibold text-slate-700'>
                        Çekilen Kart
                      </th>
                      <th className='text-left py-3 px-4 text-sm font-semibold text-slate-700'>
                        Son Çekim
                      </th>
                      <th className='text-left py-3 px-4 text-sm font-semibold text-slate-700'>
                        Oluşturulma
                      </th>
                      <th className='text-left py-3 px-4 text-sm font-semibold text-slate-700'>
                        Geçerlilik
                      </th>
                      <th className='text-right py-3 px-4 text-sm font-semibold text-slate-700'>
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredShopierLinks.map(link => {
                      const baseUrl =
                        process.env.NEXT_PUBLIC_READING_LINK_BASE_URL ||
                        process.env.NEXT_PUBLIC_SITE_URL ||
                        'https://www.busbuskimki.com';
                      const locale = 'tr';
                      const fullLink = `${baseUrl}/${locale}/aklindaki-kisi?token=${link.token}`;

                      return (
                        <tr
                          key={link.id}
                          className='border-b border-slate-100 hover:bg-slate-50 transition-colors'
                        >
                          <td className='py-4 px-4'>
                            <div className='flex items-center gap-2'>
                              <Mail className='h-4 w-4 text-slate-400' />
                              <span className='text-sm text-slate-900'>
                                {link.customer_email}
                              </span>
                            </div>
                          </td>
                          <td className='py-4 px-4'>
                            {getStatusBadge(link.status, link.expiry_date)}
                          </td>
                          <td className='py-4 px-4'>
                            <div className='flex items-center gap-2'>
                              <span className='text-sm font-medium text-slate-900'>
                                {link.totalCardsDrawn}/3
                              </span>
                              <span className='text-xs text-slate-500'>
                                (bugün)
                              </span>
                            </div>
                          </td>
                          <td className='py-4 px-4'>
                            {link.lastDrawDate ? (
                              <div className='flex items-center gap-2'>
                                <Clock className='h-4 w-4 text-slate-400' />
                                <span className='text-sm text-slate-600'>
                                  {new Date(link.lastDrawDate).toLocaleString(
                                    'tr-TR',
                                    {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }
                                  )}
                                </span>
                              </div>
                            ) : (
                              <span className='text-sm text-slate-400'>
                                Henüz çekilmedi
                              </span>
                            )}
                          </td>
                          <td className='py-4 px-4'>
                            <div className='flex items-center gap-2'>
                              <Calendar className='h-4 w-4 text-slate-400' />
                              <span className='text-sm text-slate-600'>
                                {new Date(link.created_at).toLocaleDateString(
                                  'tr-TR'
                                )}
                              </span>
                            </div>
                          </td>
                          <td className='py-4 px-4'>
                            {link.expiry_date ? (
                              <span className='text-sm text-slate-600'>
                                {new Date(link.expiry_date).toLocaleDateString(
                                  'tr-TR'
                                )}
                              </span>
                            ) : (
                              <span className='text-sm text-green-600 font-medium'>
                                Süresiz
                              </span>
                            )}
                          </td>
                          <td className='py-4 px-4'>
                            <div className='flex items-center justify-end gap-2'>
                              <button
                                onClick={() =>
                                  handleResetDailyLimit(link.id, link.customer_email)
                                }
                                className='p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all'
                                title='Günlük kart çekme hakkını sıfırla'
                              >
                                <RotateCcw className='h-4 w-4' />
                              </button>
                              <button
                                onClick={() => handleCopyLink(fullLink)}
                                className='p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all'
                                title='Linki kopyala'
                              >
                                <Copy className='h-4 w-4' />
                              </button>
                              <button
                                onClick={() =>
                                  handleSendEmail(link.id, link.customer_email)
                                }
                                disabled={sendingEmail}
                                className='p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50'
                                title='E-posta gönder'
                              >
                                <Mail className='h-4 w-4' />
                              </button>
                              <a
                                href={fullLink}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all'
                                title='Linki aç'
                              >
                                <ExternalLink className='h-4 w-4' />
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Info Card */}
            <div className='mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6'>
              <h3 className='text-lg font-semibold text-blue-900 mb-2'>
                Shopier Entegrasyonu Hakkında
              </h3>
              <ul className='space-y-2 text-sm text-blue-800'>
                <li>
                  • Shopier&apos;den gelen siparişler otomatik olarak burada
                  görüntülenir
                </li>
                <li>
                  • Belirli ürünler için otomatik olarak aklındaki kişi linki
                  oluşturulur
                </li>
                <li>• Müşterilere otomatik olarak email gönderilir</li>
                <li>• Tüm linkler süresiz geçerlidir</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && <Toast {...toast} onClose={hideToast} />}
    </div>
  );
}
