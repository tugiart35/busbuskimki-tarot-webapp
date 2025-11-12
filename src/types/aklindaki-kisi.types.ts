// Aklındaki Kişi Kart Çekme Sistemi - Type Definitions

// Çekilen kart bilgisi - kart numarası ve çekilme zamanı
export interface DrawnCard {
  cardNumber: number;
  drawnAt: string; // ISO timestamp
}

export interface CustomerLink {
  id: string;
  customer_email: string;
  token: string;
  token_hash: string;
  token_preview?: string; // Token'ın önizlemesi (arama için)
  generated_date: string;
  expiry_date?: string;
  status: 'active' | 'expired' | 'used';
  created_by_admin_id?: string;
  allowed_ips?: string[]; // Email girildiğinde kaydedilen IP adresleri - Maksimum 3 farklı IP
  created_at: string;
  updated_at: string;
}

export interface CardSession {
  id: string;
  customer_email: string;
  last_draw_date?: string;
  cards_drawn_today_count: number;
  last_24_drawn_cards: DrawnCard[]; // Kart numarası ve çekilme zamanı - 24 saat geçen kartlar otomatik kapanır
  period_start_date?: string; // İlk kart çekildiğinde kaydedilen tarih - 30 gün sonra 1 günlük geri sayım başlar
  created_at: string;
  updated_at: string;
}

export interface AllCard {
  id: number;
  card_number: number;
  card_name: string;
  image_path: string;
  created_at: string;
}

// API Request/Response Types
export interface DrawCardRequest {
  token: string;
}

export interface DrawCardResponse {
  success: boolean;
  card?: {
    id: number;
    card_number: number;
    card_name: string;
    image_path: string;
  };
  error?: string;
  dailyLimitReached?: boolean;
  remainingCards?: number;
  periodStartDate?: string; // İlk kart çekildiğinde kaydedilen tarih
  resetCountdown?: number; // Toplam kalan süre (milisaniye) - 31 gün sonra sıfırlanır
  periodDaysRemaining?: number; // 30 günlük aktif dönemden kalan gün sayısı
  resetDaysRemaining?: number; // 1 günlük sıfırlanma geri sayımından kalan gün sayısı
}

export interface ValidateTokenResponse {
  valid: boolean;
  customerEmail?: string;
  error?: string;
  expired?: boolean;
  requiresEmail?: boolean; // E-posta girişi gerekiyor mu?
  ipLimitReached?: boolean; // IP limiti aşıldı mı? (Maksimum 3 farklı IP)
  remainingCards?: number; // Kalan kart hakkı (günlük limit)
  openedCards?: number[]; // Açılan kart numaraları (last_24_drawn_cards'dan unique)
  periodStartDate?: string; // İlk kart çekildiğinde kaydedilen tarih
  resetCountdown?: number; // Toplam kalan süre (milisaniye) - 31 gün sonra sıfırlanır
  periodDaysRemaining?: number; // 30 günlük aktif dönemden kalan gün sayısı
  resetDaysRemaining?: number; // 1 günlük sıfırlanma geri sayımından kalan gün sayısı
}

export interface CreateCustomerLinkRequest {
  customerEmail: string;
  expiresInDays?: number;
}

export interface CreateCustomerLinkResponse {
  success: boolean;
  token?: string;
  link?: string;
  expiresAt?: string;
  linkId?: string;
  error?: string;
}

export interface SendEmailRequest {
  linkId: string;
  customerEmail: string;
}

export interface SendEmailResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface LinkWithActivity extends CustomerLink {
  cardSession: CardSession | null;
  totalCardsDrawn: number;
  lastDrawDate: string | null;
}

export interface GetLinksResponse {
  success: boolean;
  links?: LinkWithActivity[];
  error?: string;
}
