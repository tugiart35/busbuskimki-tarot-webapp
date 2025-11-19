import { supabase } from '@/lib/supabase/client';
import type { User, SupabaseClient } from '@supabase/supabase-js';

// Profil oluşturma için gerekli veri türü
export interface CreateProfileData {
  userId: string;
  firstName?: string;
  lastName?: string;
  fullName?: string; // Geriye uyumluluk için
  email?: string | undefined;
  birthDate?: string;
  gender?: string;
  bio?: string;
  timezone?: string;
}

// Profil oluşturma sonucu
export interface CreateProfileResult {
  success: boolean;
  profile?: any;
  error?: string;
}

/**
 * Kullanıcı için display name oluşturur
 * Öncelik sırası: fullName > email kullanıcı adı > varsayılan
 */
export function generateDisplayName(
  fullName?: string,
  email?: string,
  fallback: string = 'Mistik Kullanıcı'
): string {
  if (fullName && fullName.trim()) {
    return fullName.trim();
  }

  if (email) {
    const username = email.split('@')[0];
    if (username && username.length > 0) {
      return username;
    }
  }

  return fallback;
}

/**
 * Profil oluşturma verilerini hazırlar
 */
export function prepareProfileData(data: CreateProfileData) {
  // firstName ve lastName varsa birleştir, yoksa fullName kullan
  const fullName =
    data.firstName && data.lastName
      ? `${data.firstName} ${data.lastName}`
      : data.fullName;

  const displayName = generateDisplayName(fullName, data.email);

  return {
    id: data.userId,
    email: data.email || null,
    first_name: data.firstName || null,
    last_name: data.lastName || null,
    full_name: fullName || displayName,
    display_name: displayName,
    credit_balance: 0, // Kredi ataması kaldırıldı
    birth_date: data.birthDate || null,
    gender: data.gender || null,
    bio: data.bio || null,
    timezone: data.timezone || 'Europe/Istanbul',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Supabase'de profil oluşturur veya günceller
 * @param data - Profil verisi
 * @param supabaseClient - Opsiyonel: Server-side client
 */
export async function createOrUpdateProfile(
  data: CreateProfileData,
  supabaseClient?: SupabaseClient
): Promise<CreateProfileResult> {
  try {
    const client = supabaseClient || supabase;
    const profileData = prepareProfileData(data);

    // Önce mevcut profile'ı kontrol et
    const { data: existingProfile, error: fetchError } = await client
      .from('profiles')
      .select('id')
      .eq('id', data.userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = no rows found, bu normal
      return {
        success: false,
        error: `Profile kontrol hatası: ${fetchError.message}`,
      };
    }

    let result;
    if (existingProfile) {
      // Mevcut profile'ı güncelle
      result = await client
        .from('profiles')
        .update({
          email: profileData.email,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          full_name: profileData.full_name,
          display_name: profileData.display_name,
          birth_date: profileData.birth_date,
          gender: profileData.gender,
          bio: profileData.bio,
          timezone: profileData.timezone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.userId)
        .select()
        .single();
    } else {
      // Yeni profile oluştur
      result = await client
        .from('profiles')
        .insert(profileData)
        .select()
        .single();
    }

    if (result.error) {
      // eslint-disable-next-line no-console
      console.error('Profile işlemi hatası:', result.error);
      return {
        success: false,
        error: `Database hatası: ${result.error.message}`,
      };
    }

    return {
      success: true,
      profile: result.data,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Profile oluşturma/güncelleme hatası:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
    };
  }
}

/**
 * Mevcut profili kontrol eder ve yoksa oluşturur
 * OAuth kullanıcıları için 15 kredi hediye eder
 * @param user - Supabase User objesi
 * @param supabaseClient - Opsiyonel: Server-side client (callback route için)
 */
export async function ensureProfileExists(
  user: User,
  supabaseClient?: SupabaseClient
): Promise<CreateProfileResult> {
  try {
    // Server-side client varsa onu kullan, yoksa browser client'ı kullan
    const client = supabaseClient || supabase;

    // Önce mevcut profili kontrol et
    const { data: existingProfile, error: fetchError } = await client
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (fetchError && fetchError.code === 'PGRST116') {
      // Profil yoksa oluştur - 15 kredi ile (OAuth kullanıcıları için)
      // Trigger'ın çalışmasını beklemek yerine direkt 15 kredi ile oluşturuyoruz
      const createData: CreateProfileData = {
        userId: user.id,
        firstName: user.user_metadata?.first_name,
        lastName: user.user_metadata?.last_name,
        fullName: user.user_metadata?.full_name,
        email: user.email || undefined,
        birthDate: user.user_metadata?.birth_date,
        gender: user.user_metadata?.gender,
        bio: user.user_metadata?.bio,
        timezone: user.user_metadata?.timezone,
      };

      const result = await createOrUpdateProfile(createData, supabaseClient);

      // Eğer profil başarıyla oluşturulduysa, 15 kredi ekle ve transaction log oluştur
      if (result.success && result.profile) {
        const initialCredits = 15;
        
        // Profil 0 kredi ile oluşturulmuşsa, 15 kredi ekle
        if (result.profile.credit_balance === 0) {
          try {
            // Kredi bakiyesini güncelle
            const { error: updateError } = await client
              .from('profiles')
              .update({ credit_balance: initialCredits })
              .eq('id', user.id);

            if (updateError) {
              console.error('Kredi güncelleme hatası:', updateError);
            } else {
              // Transaction log oluştur
              const { error: txError } = await client
                .from('transactions')
                .insert({
                  user_id: user.id,
                  type: 'bonus',
                  amount: initialCredits,
                  delta_credits: initialCredits,
                  description: 'Hoş geldin hediyesi - Kayıt bonusu',
                  ref_type: 'welcome_bonus',
                  ref_id: null,
                });

              if (txError) {
                console.error('Transaction log hatası:', txError);
              }

              // Güncellenmiş profili al
              const { data: updatedProfile } = await client
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

              if (updatedProfile) {
                result.profile = updatedProfile;
              }
            }
          } catch (creditError) {
            console.error('Kredi ekleme hatası:', creditError);
            // Hata olsa bile profil oluşturuldu, devam et
          }
        }
      }

      return result;
    }

    if (fetchError) {
      return {
        success: false,
        error: fetchError.message,
      };
    }

    // Profil zaten varsa, eğer 0 kredisi varsa 15 kredi ekle (OAuth kullanıcıları için)
    if (existingProfile && existingProfile.credit_balance === 0) {
      // Welcome bonus transaction'ı var mı kontrol et
      const { data: existingTx, error: txCheckError } = await client
        .from('transactions')
        .select('id')
        .eq('user_id', user.id)
        .eq('ref_type', 'welcome_bonus')
        .limit(1)
        .maybeSingle();

      // Eğer welcome bonus transaction'ı yoksa, 15 kredi ekle
      if (!existingTx && (!txCheckError || txCheckError.code === 'PGRST116')) {
        try {
          const initialCredits = 15;
          
          // Kredi bakiyesini güncelle
          const { error: updateError } = await client
            .from('profiles')
            .update({ credit_balance: initialCredits })
            .eq('id', user.id);

          if (!updateError) {
            // Transaction log oluştur
            await client
              .from('transactions')
              .insert({
                user_id: user.id,
                type: 'bonus',
                amount: initialCredits,
                delta_credits: initialCredits,
                description: 'Hoş geldin hediyesi - Kayıt bonusu',
                ref_type: 'welcome_bonus',
                ref_id: null,
              });

            // Güncellenmiş profili al
            const { data: updatedProfile } = await client
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();

            if (updatedProfile) {
              return {
                success: true,
                profile: updatedProfile,
              };
            }
          }
        } catch (creditError) {
          console.error('Kredi ekleme hatası:', creditError);
          // Hata olsa bile mevcut profili döndür
        }
      }
    }

    return {
      success: true,
      profile: existingProfile,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
    };
  }
}
