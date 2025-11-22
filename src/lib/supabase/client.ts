/*
info:
Bağlantılı dosyalar:
- lib/services/question-service.ts: Soru kaydetme servisi (gerekli)
- lib/services/reading-service.ts: Okuma kaydetme servisi (gerekli)
- hooks/useAuth.ts: Kimlik doğrulama hook'u (gerekli)

Dosyanın amacı:
- Supabase bağlantısını yapılandırmak.
- Client instance'ını export etmek.
- Environment variables'ları kullanmak.
- Yeni optimize edilmiş şema için TypeScript tip tanımları sağlamak.

Supabase değişkenleri ve tabloları:
- profiles: Kullanıcı profilleri tablosu (users yerine)
- readings: Tarot okumaları tablosu (readings_new yerine)
- transactions: Kredi işlemleri tablosu (transactions_new yerine)
- packages: Kredi paketleri tablosu
- spreads: Tarot açılımları tablosu
- admin_logs: Admin işlem logları tablosu

Geliştirme önerileri:
- Tüm tablo isimleri yeni şemaya uygun
- TypeScript tip güvenliği sağlanmış
- JSONB alanları (cards, questions, metadata) destekleniyor

Tespit edilen hatalar:
- ✅ Eski tablo isimleri güncellendi (users → profiles, readings_new → readings, transactions_new → transactions)

Kullanım durumu:
- ✅ Gerekli: Tüm Supabase işlemleri için temel client
- ✅ Production-ready: Yeni şemaya uygun
*/

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabase client configuration

// Environment değişkenleri eksikse dummy client oluştur
const createDummyClient = () => {
  console.warn(
    '⚠️ Supabase Client: Environment değişkenleri eksik, dummy client oluşturuluyor'
  );

  return {
    auth: {
      getSession: () =>
        Promise.resolve({
          data: { session: null },
          error: new Error('Environment variables missing'),
        }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      signInWithPassword: () =>
        Promise.resolve({
          data: null,
          error: new Error('Environment variables missing'),
        }),
      signUp: () =>
        Promise.resolve({
          data: null,
          error: new Error('Environment variables missing'),
        }),
      signOut: () =>
        Promise.resolve({ error: new Error('Environment variables missing') }),
      resetPasswordForEmail: () =>
        Promise.resolve({ error: new Error('Environment variables missing') }),
      resend: () =>
        Promise.resolve({ error: new Error('Environment variables missing') }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve({
              data: null,
              error: new Error('Environment variables missing'),
            }),
          order: () => ({
            limit: () =>
              Promise.resolve({
                data: [],
                error: new Error('Environment variables missing'),
              }),
          }),
        }),
        order: () => ({
          limit: () =>
            Promise.resolve({
              data: [],
              error: new Error('Environment variables missing'),
            }),
        }),
      }),
      insert: () =>
        Promise.resolve({
          data: null,
          error: new Error('Environment variables missing'),
        }),
      update: () =>
        Promise.resolve({
          data: null,
          error: new Error('Environment variables missing'),
        }),
      delete: () =>
        Promise.resolve({
          data: null,
          error: new Error('Environment variables missing'),
        }),
    }),
    rpc: () =>
      Promise.resolve({
        data: null,
        error: new Error('Environment variables missing'),
      }),
  };
};

// Supabase browser client'ı oluştur
export const supabase =
  !supabaseUrl || !supabaseAnonKey
    ? (createDummyClient() as any)
    : createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

// Database types için tip tanımları - Yeni optimize edilmiş şema
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          avatar_url?: string;
          credit_balance: number;
          timezone: string;
          created_at: string;
          updated_at: string;
          first_name?: string;
          last_name?: string;
          full_name?: string;
          birth_date?: string;
          gender?: string;
          bio?: string;
          last_login_at?: string;
          login_count?: number;
        };
        Insert: {
          id?: string;
          email: string;
          display_name?: string;
          avatar_url?: string;
          credit_balance?: number;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
          first_name?: string;
          last_name?: string;
          full_name?: string;
          birth_date?: string;
          gender?: string;
          bio?: string;
          last_login_at?: string;
          login_count?: number;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          avatar_url?: string;
          credit_balance?: number;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
          first_name?: string;
          last_name?: string;
          full_name?: string;
          birth_date?: string;
          gender?: string;
          bio?: string;
          last_login_at?: string;
          login_count?: number;
        };
      };
      readings: {
        Row: {
          id: string;
          user_id: string;
          reading_type:
            | 'tarot'
            | 'numerology'
            | 'love'
            | 'career'
            | 'general'
            | 'relationshipAnalysis'
            | 'money'
            | 'relationshipProblems'
            | 'situationAnalysis'
            | 'newLover'
            | 'problemSolving'
            | 'marriage'
            | 'single-card';
          spread_name: string;
          title: string;
          interpretation: string;
          cards?: any;
          questions?: any;
          cost_credits: number;
          status: 'pending' | 'completed' | 'failed';
          metadata?: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          reading_type:
            | 'tarot'
            | 'numerology'
            | 'love'
            | 'career'
            | 'general'
            | 'relationshipAnalysis'
            | 'money'
            | 'relationshipProblems'
            | 'situationAnalysis'
            | 'newLover'
            | 'problemSolving'
            | 'marriage'
            | 'single-card';
          spread_name?: string;
          title?: string;
          interpretation?: string;
          cards?: any;
          questions?: any;
          cost_credits?: number;
          status?: 'pending' | 'completed' | 'failed';
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          reading_type:
            | 'tarot'
            | 'numerology'
            | 'love'
            | 'career'
            | 'general'
            | 'relationshipAnalysis'
            | 'money'
            | 'relationshipProblems'
            | 'situationAnalysis'
            | 'newLover'
            | 'problemSolving'
            | 'marriage'
            | 'single-card';
          spread_name?: string;
          title?: string;
          interpretation?: string;
          cards?: any;
          questions?: any;
          cost_credits?: number;
          status?: 'pending' | 'completed' | 'failed';
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'purchase' | 'refund' | 'bonus' | 'deduction' | 'reading';
          amount: number;
          description?: string;
          reference_type?: string;
          reference_id?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'purchase' | 'refund' | 'bonus' | 'deduction' | 'reading';
          amount: number;
          description?: string;
          reference_type?: string;
          reference_id?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'purchase' | 'refund' | 'bonus' | 'deduction' | 'reading';
          amount?: number;
          description?: string;
          reference_type?: string;
          reference_id?: string;
          created_at?: string;
        };
      };
      packages: {
        Row: {
          id: number;
          name: string;
          description?: string;
          credits: number;
          price_eur: number;
          price_try: number;
          active: boolean;
          shopier_product_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string;
          credits: number;
          price_eur: number;
          price_try: number;
          active?: boolean;
          shopier_product_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string;
          credits?: number;
          price_eur?: number;
          price_try?: number;
          active?: boolean;
          shopier_product_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      spreads: {
        Row: {
          id: number;
          name_tr: string;
          name_en: string;
          name_sr: string;
          description_tr?: string;
          description_en?: string;
          description_sr?: string;
          positions: any;
          card_count: number;
          cost_credits: number;
          category:
            | 'general'
            | 'love'
            | 'career'
            | 'spiritual'
            | 'health'
            | 'relationshipAnalysis'
            | 'money'
            | 'relationshipProblems'
            | 'situationAnalysis'
            | 'newLover'
            | 'problemSolving'
            | 'marriage';
          difficulty_level: 'beginner' | 'intermediate' | 'advanced';
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name_tr: string;
          name_en: string;
          name_sr: string;
          description_tr?: string;
          description_en?: string;
          description_sr?: string;
          positions: any;
          card_count?: number;
          cost_credits?: number;
          category?:
            | 'general'
            | 'love'
            | 'career'
            | 'spiritual'
            | 'health'
            | 'relationshipAnalysis'
            | 'money'
            | 'relationshipProblems'
            | 'situationAnalysis'
            | 'newLover'
            | 'problemSolving'
            | 'marriage';
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name_tr?: string;
          name_en?: string;
          name_sr?: string;
          description_tr?: string;
          description_en?: string;
          description_sr?: string;
          positions?: any;
          card_count?: number;
          cost_credits?: number;
          category?:
            | 'general'
            | 'love'
            | 'career'
            | 'spiritual'
            | 'health'
            | 'relationshipAnalysis'
            | 'money'
            | 'relationshipProblems'
            | 'situationAnalysis'
            | 'newLover'
            | 'problemSolving'
            | 'marriage';
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_logs: {
        Row: {
          id: string;
          admin_id: string;
          action: string;
          target_type?: string;
          target_id?: string;
          details: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id: string;
          action: string;
          target_type?: string;
          target_id?: string;
          details?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string;
          action?: string;
          target_type?: string;
          target_id?: string;
          details?: any;
          created_at?: string;
        };
      };
    };
    Functions: {
      fn_create_reading_with_debit: {
        Args: {
          p_user_id: string;
          p_reading_type:
            | 'tarot'
            | 'numerology'
            | 'love'
            | 'career'
            | 'general'
            | 'relationshipAnalysis'
            | 'money'
            | 'relationshipProblems'
            | 'situationAnalysis'
            | 'newLover'
            | 'problemSolving'
            | 'marriage';
          p_spread_name: string;
          p_title: string;
          p_interpretation: string;
          p_cards: any;
          p_questions: any;
          p_cost_credits: number;
          p_metadata?: any;
          p_idempotency_key?: string;
        };
        Returns: {
          id: string;
          user_id: string;
          reading_type:
            | 'tarot'
            | 'numerology'
            | 'love'
            | 'career'
            | 'general'
            | 'relationshipAnalysis'
            | 'money'
            | 'relationshipProblems'
            | 'situationAnalysis'
            | 'newLover'
            | 'problemSolving'
            | 'marriage'
            | 'marriage';
          spread_name: string;
          title: string;
          interpretation: string;
          cards?: any;
          questions?: any;
          cost_credits: number;
          status: 'pending' | 'completed' | 'failed';
          metadata?: any;
          created_at: string;
          updated_at: string;
        };
      };
      customer_links: {
        Row: {
          id: string;
          customer_email: string;
          token: string;
          token_hash: string;
          generated_date: string;
          expiry_date?: string;
          status: 'active' | 'expired' | 'used';
          created_by_admin_id?: string;
          allowed_ips?: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_email: string;
          token: string;
          token_hash: string;
          generated_date?: string;
          expiry_date?: string;
          status?: 'active' | 'expired' | 'used';
          created_by_admin_id?: string;
          allowed_ips?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_email?: string;
          token?: string;
          token_hash?: string;
          generated_date?: string;
          expiry_date?: string;
          status?: 'active' | 'expired' | 'used';
          created_by_admin_id?: string;
          allowed_ips?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      card_sessions: {
        Row: {
          id: string;
          customer_email: string;
          last_draw_date?: string;
          cards_drawn_today_count: number;
          last_24_drawn_cards: any; // JSONB - DrawnCard[] formatında
          period_start_date?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_email: string;
          last_draw_date?: string;
          cards_drawn_today_count?: number;
          last_24_drawn_cards?: any; // JSONB - DrawnCard[] formatında
          period_start_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_email?: string;
          last_draw_date?: string;
          cards_drawn_today_count?: number;
          last_24_drawn_cards?: any; // JSONB - DrawnCard[] formatında
          period_start_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      all_cards: {
        Row: {
          id: number;
          card_number: number;
          card_name: string;
          image_path: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          card_number: number;
          card_name: string;
          image_path: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          card_number?: number;
          card_name?: string;
          image_path?: string;
          created_at?: string;
        };
      };
    };
  };
}
