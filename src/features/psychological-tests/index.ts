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
  mbtiTypes,
  loveLanguages,
  bigFiveTraits,
  enneagramTypes,
  friendEnergyRoles,
  loveVibrationProfiles,
  stressProfiles,
  nameTarotCards,
  calculateNameTarotResult,
} from './lib/kokolojiData';
export type { PsychologicalTest, TestQuestion } from './lib/kokolojiData';
