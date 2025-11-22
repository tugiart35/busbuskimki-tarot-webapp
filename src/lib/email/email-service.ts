/*
 * Email Servisi - Tarot Okuma PDF'leri için
 *
 * Bu dosya email gönderme işlevselliğini içerir.
 * Tarot okuma PDF'lerini otomatik olarak gönderir.
 *
 * Bağlı dosyalar:
 * - Nodemailer (email gönderme)
 * - PDF generator servisi
 *
 * Geliştirme önerileri:
 * - Email template sistemi
 * - Attachment desteği
 * - Error handling
 *
 * Kullanım durumları:
 * - Gerekli: Otomatik PDF gönderimi
 * - Modern: Template tabanlı email
 * - Güvenli: Environment variables
 */

import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import TranslationCache from './translation-cache';
import { logger } from '@/lib/logger';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  // Connection pooling ayarları
  pool?: boolean;
  maxConnections?: number;
  maxMessages?: number;
  rateLimit?: number;
}

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

class EmailService {
  private static instance: EmailService;
  private transporter: nodemailer.Transporter | null = null;
  private isInitialized: boolean = false;

  private constructor() {
    this.initializeTransporter();
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private initializeTransporter() {
    if (this.isInitialized) {
      return;
    }

    try {
      const config: EmailConfig = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
        // Connection pooling ayarları
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        rateLimit: 10, // 10 emails per second
      };

      // SMTP configuration loaded from environment variables

      this.transporter = nodemailer.createTransport(config);
      this.isInitialized = true;
    } catch (error) {
      // eslint-disable-next-line no-console
      logger.error('Email transporter initialization failed', error, {
        action: 'init_transporter',
        resource: 'email_service',
      });
    }
  }

  async sendEmail(emailData: EmailData): Promise<boolean> {
    if (!this.transporter) {
      // eslint-disable-next-line no-console
      logger.error('Email transporter not initialized', null, {
        action: 'send_email',
        resource: 'email_service',
      });
      return false;
    }

    try {
      const mailOptions = {
        from: `"Busbuskimki Tarot" <${process.env.SMTP_USER}>`,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        ...(emailData.text && { text: emailData.text }),
        attachments: emailData.attachments,
      };

      await this.transporter.sendMail(mailOptions);

      return true;
    } catch (error) {
      // Always log errors (but sanitize in production)
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        logger.error('Email sending failed', error, {
          action: 'send_email',
          resource: 'email_service',
        });
      } else {
        logger.error('Email sending failed - check logs for details', null, {
          action: 'send_email',
          resource: 'email_service',
        });
      }
      return false;
    }
  }

  async sendTarotReadingPDF(
    userEmail: string,
    readingData: any,
    _pdfBuffer: Buffer | undefined,
    _fileName: string | undefined
  ): Promise<boolean> {
    // Sadece güzel e-posta template'i - PDF gönderimi yok
    const htmlTemplate = this.generateEmailTemplate(readingData, userEmail);

    const emailData: EmailData = {
      to: 'busbuskimkionline@gmail.com', // Sadece admin'e gönder
      subject: `📊 Yeni Tarot Okuma - ${readingData.title || 'Tarot okuma'}`,
      html: htmlTemplate,
      // PDF attachments kaldırıldı
    };

    return await this.sendEmail(emailData);
  }

  private generateEmailTemplate(readingData: any, userEmail: string): string {
    // Kullanıcı bilgilerini al
    const personalInfo = readingData.questions?.personalInfo || {};
    const userName = personalInfo.name || 'Bilinmiyor';
    const birthDate = personalInfo.birthDate || 'Bilinmiyor';
    const phoneNumber = personalInfo.phone || 'Belirtilmemiş';
    const whatsapp = personalInfo.whatsapp || false;

    // Partner bilgilerini al (varsa)
    const partnerInfo = readingData.questions?.partnerInfo || null;
    const hasPartnerInfo =
      partnerInfo && (partnerInfo.name || partnerInfo.birthDate);

    // Okuma tarihini formatla
    const readingDate = new Date(readingData.created_at).toLocaleDateString(
      'tr-TR',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    );

    // Okuma formatını belirle
    const getReadingFormat = () => {
      // Önce metadata'dan readingFormat bilgisini kontrol et (en güvenilir)
      if (readingData.metadata?.readingFormat) {
        const format = readingData.metadata.readingFormat.toLowerCase();
        if (format === 'detailed') {
          return 'Sesli';
        } else if (format === 'written') {
          return 'Yazılı';
        } else if (format === 'simple') {
          return 'Basit';
        }
      }

      // Fallback: reading_type'a göre belirle (eski format için)
      if (readingData.reading_type?.includes('DETAILED')) {
        return 'Sesli';
      } else if (readingData.reading_type?.includes('WRITTEN')) {
        return 'Yazılı';
      } else {
        return 'Standart';
      }
    };

    // İletişim tercihini belirle
    const getCommunicationPreference = () => {
      if (whatsapp && phoneNumber !== 'Belirtilmemiş') {
        return `📱 WhatsApp: ${phoneNumber}`;
      } else if (phoneNumber !== 'Belirtilmemiş') {
        return `📞 Telefon: ${phoneNumber}`;
      } else {
        return '📧 Sadece Email';
      }
    };

    // Seçilen kartları listele - Yorumları ile birlikte
    // Supabase'den gelen kart verisi { selectedCards: [...], positions: [...] } formatında olabilir
    let selectedCards: any[] = [];
    let positions: Array<{
      id: number;
      title: string;
      description?: string;
      desc?: string;
    }> = [];

    if (Array.isArray(readingData.cards)) {
      // Eğer direkt array ise (eski format)
      selectedCards = readingData.cards;
    } else if (readingData.cards && typeof readingData.cards === 'object') {
      // Eğer object ise ve selectedCards property'si varsa (yeni format)
      if (Array.isArray(readingData.cards.selectedCards)) {
        selectedCards = readingData.cards.selectedCards;
      } else if (Array.isArray(readingData.cards.cards)) {
        // Alternatif format kontrolü
        selectedCards = readingData.cards.cards;
      }

      // Pozisyon bilgilerini al
      if (Array.isArray(readingData.cards.positions)) {
        positions = readingData.cards.positions;
      }
    }

    // Single card okuması kontrolü
    const isSingleCardReading =
      readingData.metadata?.isSingleCardReading === true ||
      readingData.metadata?.isSingleCardReading === 'true';

    // Kart ismini JSON key'ine dönüştür (örn: "The Fool" -> "the-fool")
    const getCardKeyFromName = (cardName: string): string => {
      return cardName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    };

    // Translation dosyasından kart anlamını al (single card için)
    const getCardMeaningFromTranslations = (
      cardName: string,
      isReversed: boolean,
      locale: string = 'tr'
    ): string | null => {
      try {
        // Cache'den kontrol et
        let messages = TranslationCache.get(locale);

        if (!messages) {
          // Cache'de yok, dosyadan oku
          const messagesPath = path.join(
            process.cwd(),
            'messages',
            `${locale}.json`
          );
          const messagesContent = fs.readFileSync(messagesPath, 'utf-8');
          messages = JSON.parse(messagesContent);

          // Cache'e kaydet
          TranslationCache.set(locale, messages);
        }

        const cardKey = getCardKeyFromName(cardName);
        const meaningKey = isReversed
          ? `blog.cards.${cardKey}.meanings.reversed.general`
          : `blog.cards.${cardKey}.meanings.upright.general`;

        // Development modunda debug log
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Single card translation lookup', {
            cardName,
            cardKey,
            meaningKey,
            isReversed,
            locale,
          });
        }

        // Nested key'i çöz (örn: "blog.cards.the-fool.meanings.upright.general")
        const keys = meaningKey.split('.');
        let value: any = messages;
        for (const key of keys) {
          if (value && typeof value === 'object' && key in value) {
            value = value[key];
          } else {
            // Development modunda detaylı log
            if (process.env.NODE_ENV === 'development') {
              logger.debug('Translation key not found', {
                meaningKey,
                currentKey: key,
                availableKeys:
                  value && typeof value === 'object'
                    ? Object.keys(value).slice(0, 10)
                    : null,
              });
            }
            return null;
          }
        }

        return typeof value === 'string' ? value : null;
      } catch (error) {
        logger.error('Translation dosyası okuma hatası', error, {
          action: 'read_translation',
          metadata: { locale, cardName },
        });
        return null;
      }
    };

    // Kartların yorumlarını çıkar
    const getCardInterpretation = (
      cardIndex: number,
      cardName: string,
      isReversed: boolean = false,
      card?: any // Kart objesi (fallback için)
    ) => {
      // Single card okuması için translation dosyasından al
      if (isSingleCardReading) {
        // Locale'i metadata'dan veya varsayılan olarak 'tr' kullan
        const locale = readingData.metadata?.locale || 'tr';
        const meaning = getCardMeaningFromTranslations(
          cardName,
          isReversed,
          locale
        );
        if (meaning) {
          return meaning;
        }
        // Fallback: Kartın kendi anlamını kullan (eğer varsa)
        if (card) {
          if (isReversed && card.meaningTr?.reversed) {
            return card.meaningTr.reversed;
          }
          if (isReversed && card.meaning?.reversed) {
            return card.meaning.reversed;
          }
          if (!isReversed && card.meaningTr?.upright) {
            return card.meaningTr.upright;
          }
          if (!isReversed && card.meaning?.upright) {
            return card.meaning.upright;
          }
        }
        return 'Yorum bulunamadı.';
      }

      // Normal okuma için interpretation'dan çıkar
      const interpretation = readingData.interpretation || '';

      // Eğer interpretation boşsa veya geçersizse
      if (!interpretation || typeof interpretation !== 'string') {
        return 'Yorum bulunamadı.';
      }

      const lines = interpretation.split('\n');

      // Kart bölümünü bul - daha esnek arama
      const cardSectionIndex = lines.findIndex((line: string) => {
        const normalizedLine = line.toLowerCase().trim();
        const normalizedCardName = (cardName || '').toLowerCase();
        return (
          (normalizedLine.includes(`${cardIndex + 1}.`) ||
            normalizedLine.includes(`**${cardIndex + 1}.`) ||
            normalizedLine.includes(`*${cardIndex + 1}.`)) &&
          (normalizedLine.includes(normalizedCardName) ||
            normalizedCardName === '')
        );
      });

      if (cardSectionIndex === -1) {
        return 'Yorum bulunamadı.';
      }

      const meaningLines = [];
      // Kart açıklamasını topla - bir sonraki kart bölümüne kadar
      for (let i = cardSectionIndex + 1; i < lines.length; i++) {
        const currentLine = lines[i];

        // [object Object] kontrolü - bu satırı atla
        if (currentLine?.includes('[object Object]')) {
          continue;
        }

        // Durma koşulları
        if (
          !currentLine ||
          currentLine.trim() === '' ||
          currentLine.match(/^\*\*\d+\./) ||
          currentLine.match(/^\*\d+\./) ||
          currentLine.includes('**Aşk Hayatı Özeti**') ||
          currentLine.includes('💫 **tarotPage') ||
          (i > cardSectionIndex + 1 && currentLine.match(/^\d+\./)) // Bir sonraki kart numarası
        ) {
          break;
        }

        meaningLines.push(currentLine.trim());
      }

      const meaning = meaningLines.join(' ').trim();
      return meaning || 'Yorum bulunamadı.';
    };

    const cardsList = selectedCards
      .map((card: any, index: number) => {
        // Single card için kart ismini translation key'ine çevirirken İngilizce ismi kullan
        // Öncelik: card.name (İngilizce) -> card.nameTr (Türkçe)
        const cardNameForTranslation = isSingleCardReading
          ? card.name || card.nameTr
          : card.nameTr || card.name;
        const interpretation = getCardInterpretation(
          index,
          cardNameForTranslation,
          card.isReversed || false,
          card // Kart objesini geç (fallback için)
        );

        // Pozisyon bilgisini al
        const positionInfo = positions[index];
        const positionTitle = positionInfo?.title || `Pozisyon ${index + 1}`;
        const positionDesc =
          positionInfo?.description || positionInfo?.desc || '';

        return `
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #8b5cf6;">
            <h4 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">
              ${index + 1}. ${card.nameTr || card.name} ${card.isReversed ? '(Ters)' : '(Düz)'}
            </h4>
            ${
              positionDesc
                ? `
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; font-style: italic; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">
              <strong>${positionTitle}:</strong> ${positionDesc}
            </p>
            `
                : ''
            }
            <p style="margin: 0; color: #374151; font-size: 13px; line-height: 1.5;">
              ${interpretation}
            </p>
          </div>
        `;
      })
      .join('');

    // Kullanıcı sorularını al - userQuestions bir obje (concern, emotional, mainQuestion, understanding)
    const userQuestions = readingData.questions?.userQuestions || {};
    const questionsList = Object.entries(userQuestions)
      .filter(([_, value]) => value && String(value).trim() !== '')
      .map(([key, value], index) => {
        // Key'i Türkçe'ye çevir
        const questionLabels: Record<string, string> = {
          concern: 'Endişe/Şüphe',
          emotional: 'Duygusal Durum',
          mainQuestion: 'Ana Soru',
          understanding: 'Anlama/Anlayış',
        };
        const label = questionLabels[key] || key;
        return `<strong>${index + 1}. ${label}:</strong> ${String(value)}`;
      })
      .join('<br><br>');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #1a1a1a; 
            margin: 0; 
            padding: 0; 
            background-color: #f8fafc;
          }
          .container { 
            max-width: 700px; 
            margin: 0 auto; 
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
            border-radius: 8px 8px 0 0;
          }
          .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          .header p { 
            margin: 8px 0 0 0; 
            font-size: 16px; 
            opacity: 0.9;
          }
          .content { 
            padding: 30px; 
          }
          .section { 
            background: #ffffff; 
            padding: 20px; 
            border-radius: 12px; 
            margin: 20px 0; 
            border-left: 4px solid #667eea;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }
          .section.user-info { border-left-color: #3b82f6; }
          .section.reading-info { border-left-color: #8b5cf6; }
          .section.cards-info { border-left-color: #f59e0b; }
          .section.communication-info { border-left-color: #10b981; }
          .section.questions-info { border-left-color: #ef4444; }
          .section h3 { 
            margin: 0 0 15px 0; 
            font-size: 18px; 
            font-weight: 600; 
            color: #1f2937;
          }
          .info-row { 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            padding: 8px 0; 
            border-bottom: 1px solid #f3f4f6;
          }
          .info-row:last-child { border-bottom: none; }
          .info-label { 
            font-weight: 600; 
            color: #374151; 
            min-width: 140px;
          }
          .info-value { 
            color: #1f2937; 
            text-align: right;
            font-weight: 500;
          }
          .badge { 
            display: inline-block; 
            padding: 4px 8px; 
            border-radius: 6px; 
            font-size: 12px; 
            font-weight: 600;
          }
          .badge.success { background-color: #d1fae5; color: #065f46; }
          .badge.warning { background-color: #fef3c7; color: #92400e; }
          .badge.info { background-color: #dbeafe; color: #1e40af; }
          .footer { 
            background: linear-gradient(135deg, #4b5563, #374151); 
            color: white; 
            padding: 20px; 
            text-align: center; 
            font-size: 14px;
            border-radius: 0 0 8px 8px;
          }
          .priority-notice {
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
          }
          .priority-notice strong {
            color: #92400e;
          }
          @media (max-width: 600px) {
            .container { margin: 0; border-radius: 0; }
            .content { padding: 20px; }
            .info-row { flex-direction: column; align-items: flex-start; }
            .info-value { text-align: left; margin-top: 4px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔮 Yeni Tarot Okuma Bildirimi</h1>
            <p>Busbuskimki - Tarot Rehberlik Sistemi</p>
          </div>
          
          <div class="content">
            <div class="priority-notice">
              <strong>🚨 YENİ OKUMA TAMAMLANDI - HEMEN İNCELEYİN!</strong>
            </div>
            
            <div class="section user-info">
              <h3>👤 KULLANICI BİLGİLERİ</h3>
              <div class="info-row">
                <span class="info-label">Ad:</span> 
                <span class="info-value">${userName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span> 
                <span class="info-value">${userEmail}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Doğum Tarihi:</span> 
                <span class="info-value">${birthDate}</span>
              </div>
              <div class="info-row">
                <span class="info-label">İletişim:</span> 
                <span class="info-value">${getCommunicationPreference()}</span>
              </div>
            </div>
            
            ${
              hasPartnerInfo
                ? `
            <div class="section user-info" style="border-left-color: #ec4899;">
              <h3>💕 PARTNER BİLGİLERİ</h3>
              ${
                partnerInfo?.name
                  ? `
              <div class="info-row">
                <span class="info-label">Partner İsmi:</span> 
                <span class="info-value">${partnerInfo.name}</span>
              </div>
              `
                  : ''
              }
              ${
                partnerInfo?.birthDate || partnerInfo?.birthDateUnknown
                  ? `
              <div class="info-row">
                <span class="info-label">Partner Doğum Tarihi:</span> 
                <span class="info-value">${
                  partnerInfo.birthDateUnknown
                    ? 'Bilinmiyor'
                    : partnerInfo.birthDate || 'Belirtilmemiş'
                }</span>
              </div>
              `
                  : ''
              }
            </div>
            `
                : ''
            }
            
            <div class="section reading-info">
              <h3>🔮 OKUMA DETAYLARI</h3>
              <div class="info-row">
                <span class="info-label">Başlık:</span> 
                <span class="info-value">${readingData.title || 'Tarot okuma'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Yayılım:</span> 
                <span class="info-value">${readingData.spread_name || 'Genel Yayılım'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Format:</span> 
                <span class="info-value">${getReadingFormat()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Açılım Tarihi:</span> 
                <span class="info-value">${readingDate}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Durum:</span> 
                <span class="info-value"><span class="badge success">✅ ${readingData.status === 'completed' ? 'Tamamlandı' : readingData.status}</span></span>
              </div>
            </div>
            
            <div class="section cards-info">
              <h3>🎴 SEÇİLEN KARTLAR VE ANLAMLARI (${selectedCards.length} kart)</h3>
              <div style="text-align: left; line-height: 1.8;">
                ${cardsList || 'Kart bilgisi bulunamadı'}
              </div>
            </div>
            
            ${
              questionsList
                ? `
            <div class="section questions-info">
              <h3>❓ SORULAR VE CEVAPLAR</h3>
              <div class="info-value" style="text-align: left; line-height: 1.8;">
                ${questionsList}
              </div>
            </div>
            `
                : ''
            }
            
            <div class="section communication-info">
              <h3>📞 İLETİŞİM BİLGİLERİ</h3>
              <div class="info-row">
                <span class="info-label">Tercih Edilen İletişim:</span> 
                <span class="info-value">${getCommunicationPreference()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">WhatsApp:</span> 
                <span class="info-value">${whatsapp ? '<span class="badge success">✅ Aktif</span>' : '<span class="badge warning">❌ Pasif</span>'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Telefon:</span> 
                <span class="info-value">${phoneNumber}</span>
              </div>
            </div>
            
            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
              <p style="margin: 0; color: #991b1b; font-weight: 600;">
                ⚠️ <strong>ÖNEMLİ:</strong> Bu okuma otomatik olarak sistem tarafından oluşturulmuştur. 
                Kullanıcıya yanıt vermeden önce tüm detayları kontrol ediniz.
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Busbuskimki Tarot</strong> - Mistik Rehberlik Sistemi</p>
            <p>Bu email otomatik olarak gönderilmiştir - ${new Date().toLocaleString('tr-TR')}</p>
            <p style="font-size: 12px; opacity: 0.8;">Sistem ID: ${readingData.id || 'N/A'}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = EmailService.getInstance();
export default EmailService;
