/**
 * Spread ID Mapping Utility
 *
 * Supabase'deki numeric spread_id ile tarotSpreads'teki string id'leri
 * arasında mapping yapar.
 */

import { tarotSpreads } from '@/lib/constants/tarotSpreads';

/**
 * Supabase category değerini tarotSpreads string id'sine çevirir
 */
export function mapCategoryToSpreadId(
  category: string | null | undefined
): string | null {
  if (!category) {
    return null;
  }

  const categoryMap: Record<string, string> = {
    love: 'love-spread',
    career: 'career-spread',
    problemSolving: 'problem-solving-spread',
    situationAnalysis: 'situation-analysis-spread',
    relationshipAnalysis: 'relationship-analysis-spread',
    relationshipProblems: 'relationship-problems-spread',
    marriage: 'marriage-spread',
    newLover: 'new-lover-spread',
    money: 'money-spread',
  };

  return categoryMap[category] ?? null;
}

/**
 * Supabase spread_id (numeric) ile tarotSpreads id (string) arasında mapping yapar
 * Önce category'ye göre eşleştirmeye çalışır, bulamazsa null döner
 */
export async function mapSpreadIdToTarotSpreadId(
  supabaseSpreadId: number | null,
  category?: string | null
): Promise<string | null> {
  if (!supabaseSpreadId) {
    return null;
  }

  // Önce category'ye göre eşleştirmeye çalış
  if (category) {
    const mappedId = mapCategoryToSpreadId(category);
    if (mappedId) {
      // Eşleşen spread'in var olduğunu kontrol et
      const spread = tarotSpreads.find(s => s.id === mappedId);
      if (spread) {
        return mappedId;
      }
    }
  }

  // Category mapping başarısız olduysa, Supabase'den spread bilgisini çek
  // Bu durumda category'yi almak için API çağrısı gerekir
  // Şimdilik null döndürüyoruz, gerekirse burada Supabase query yapılabilir
  return null;
}

/**
 * tarotSpreads string id'sini Supabase category'sine çevirir
 */
export function mapSpreadIdToCategory(spreadId: string): string | null {
  const spread = tarotSpreads.find(s => s.id === spreadId);
  if (!spread) {
    return null;
  }

  const idToCategoryMap: Record<string, string> = {
    'love-spread': 'love',
    'career-spread': 'career',
    'problem-solving-spread': 'problemSolving',
    'situation-analysis-spread': 'situationAnalysis',
    'relationship-analysis-spread': 'relationshipAnalysis',
    'relationship-problems-spread': 'relationshipProblems',
    'marriage-spread': 'marriage',
    'new-lover-spread': 'newLover',
    'money-spread': 'money',
  };

  return idToCategoryMap[spreadId] ?? null;
}

/**
 * Supabase'den spread bilgisini çekip tarotSpreads id'sine çevirir
 */
export async function getSpreadIdFromSupabase(
  supabaseSpreadId: number | null,
  supabaseClient: any
): Promise<string | null> {
  if (!supabaseSpreadId) {
    return null;
  }

  try {
    const { data, error } = await supabaseClient
      .from('spreads')
      .select('id, category')
      .eq('id', supabaseSpreadId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapCategoryToSpreadId(data.category);
  } catch {
    return null;
  }
}
