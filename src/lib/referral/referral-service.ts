/**
 * Referral Service
 * 
 * Handles referral code generation, link creation, and referral tracking
 */

import { supabase } from '@/lib/supabase/client';

export interface ReferralInfo {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
}

/**
 * Get user's referral information
 */
export async function getReferralInfo(userId: string): Promise<ReferralInfo | null> {
  try {
    // Get user's referral code
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('referral_code')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching referral code:', error);
      return null;
    }

    let referralCode = profile?.referral_code;

    // If referral code doesn't exist, generate and assign one
    if (!referralCode) {
      const { data: newCode, error: generateError } = await supabase.rpc(
        'generate_and_assign_referral_code',
        { p_user_id: userId }
      );

      if (generateError || !newCode) {
        console.error('Error generating referral code:', generateError);
        return null;
      }

      referralCode = newCode;
    }

    // Get current locale from pathname
    const locale = typeof window !== 'undefined' 
      ? window.location.pathname.split('/')[1] || 'tr'
      : 'tr';

    // Generate referral link
    const referralLink = generateReferralLink(referralCode, locale);

    // Count total referrals (optional - for display purposes)
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('referred_by', userId);

    return {
      referralCode,
      referralLink,
      totalReferrals: count || 0,
    };
  } catch (error) {
    console.error('Error getting referral info:', error);
    return null;
  }
}

/**
 * Generate referral link with locale
 */
export function generateReferralLink(referralCode: string, locale: string): string {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_APP_URL || '';
  
  return `${baseUrl}/${locale}/auth?ref=${referralCode}`;
}

/**
 * Earn credit from referral (called when referred user registers)
 * Note: This is primarily handled by the database trigger, but kept for consistency
 */
export async function earnCreditFromReferral(
  referrerId: string,
  newUserId: string
): Promise<boolean> {
  try {
    // This is handled by the database trigger, but we can verify it worked
    const { data: transaction } = await supabase
      .from('transactions')
      .select('id')
      .eq('user_id', referrerId)
      .eq('ref_type', 'referral_bonus')
      .eq('ref_id', newUserId)
      .single();

    return !!transaction;
  } catch (error) {
    console.error('Error checking referral credit:', error);
    return false;
  }
}

