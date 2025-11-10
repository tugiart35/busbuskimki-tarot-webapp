/*
  Psikolojik Test Bileşenleri Ana Export Dosyası
  ----------------------------------------------------------------------
  Bu dosya ne işe yarar?
  - Tüm psikolojik test bileşenlerini organize eder
  - Ana bileşenleri dışa aktarır
  - Modüler yapıyı destekler
*/

export { default as KokolojiTest } from './components/KokolojiTest';
export {
  psychologicalTests,
  getPsychologicalTests,
  getTestResult,
  getMBTITypes,
  getLoveLanguages,
  getBigFiveTraits,
  getEnneagramTypes,
  getFriendEnergyRoles,
  getLoveVibrationProfiles,
  getStressProfiles,
  nameTarotCards,
  calculateNameTarotResult,
} from './lib/kokolojiData';
export type { PsychologicalTest, TestQuestion } from './lib/kokolojiData';
