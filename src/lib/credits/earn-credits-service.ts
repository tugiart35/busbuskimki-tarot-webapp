/**
 * Earn Credits Service
 * 
 * Handles credit earning from ad watching and other activities
 */

import { supabase } from '@/lib/supabase/client';

/**
 * Earn 1 credit from watching an ad
 */
export async function earnCreditFromAd(userId: string): Promise<{
  success: boolean;
  error?: string;
  newBalance?: number;
}> {
  try {
    // Get current credit balance
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credit_balance')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return {
        success: false,
        error: 'Kullanıcı profili bulunamadı',
      };
    }

    const currentBalance = profile.credit_balance || 0;
    const newBalance = currentBalance + 1;

    // Update credit balance
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credit_balance: newBalance })
      .eq('id', userId);

    if (updateError) {
      return {
        success: false,
        error: 'Kredi güncellenemedi',
      };
    }

    // Log transaction
    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'bonus',
        amount: 1,
        delta_credits: 1,
        description: 'Reklam izleme bonusu',
        ref_type: 'ad_watch_bonus',
        ref_id: null,
      });

    if (txError) {
      console.error('Transaction log error:', txError);
      // Don't fail if transaction log fails, credit was already added
    }

    return {
      success: true,
      newBalance,
    };
  } catch (error) {
    console.error('Error earning credit from ad:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
    };
  }
}

/**
 * Check if user is eligible to earn credit from ad
 * Note: No limit per requirements, but kept for future use
 */
export async function checkAdWatchEligibility(_userId: string): Promise<boolean> {
  // No limit per requirements - always eligible
  return true;
}

