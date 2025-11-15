import type { Questions } from '../hooks/useTarotFormState';
import type { ThemeClasses } from '../types/tarot-modal.types';
import type { FormI18nKeys } from '../types/tarot-config.types';
import type { BaseTarotFormProps } from './BaseTarotForm';

type QuestionLabels = BaseTarotFormProps['questionLabels'];

interface QuestionSectionProps {
  isSingleCard: boolean;
  formKeys: FormI18nKeys;
  questionLabels?: QuestionLabels;
  themeClasses: ThemeClasses;
  questions: Questions;
  formErrors: BaseTarotFormProps['formErrors'];
  placeholders?: FormI18nKeys['placeholders'];
  getPlaceholder: (_key?: string) => string;
  translate: (key: string, fallback?: string) => string;
  onUpdateQuestion: BaseTarotFormProps['onUpdateQuestion'];
}

export function QuestionSection({
  isSingleCard,
  formKeys,
  questionLabels,
  themeClasses,
  questions,
  formErrors,
  placeholders,
  getPlaceholder,
  translate,
  onUpdateQuestion,
}: QuestionSectionProps) {
  if (isSingleCard) {
    return (
      <div>
        <label
          className={`block text-sm font-medium ${themeClasses.labelText} mb-2`}
        >
          {translate(
            formKeys.mainQuestion || 'spreads.singleCard.form.mainQuestion'
          )}
          <span className='text-red-400'> *</span>
        </label>
        <textarea
          value={questions.concern}
          onChange={event => onUpdateQuestion('concern', event.target.value)}
          placeholder={getPlaceholder(
            placeholders?.mainQuestion ||
              formKeys.mainQuestionPlaceholder ||
              'spreads.singleCard.form.mainQuestionPlaceholder'
          )}
          rows={4}
          className={`w-full px-4 py-3 bg-slate-800/80 border ${
            formErrors.concern ? 'border-red-500' : themeClasses.inputBorder
          } rounded-lg text-white placeholder-gray-400 focus:outline-none ${themeClasses.focusRing} transition-all resize-none`}
        />
        {formErrors.concern && (
          <p className='text-red-400 text-xs mt-1'>{formErrors.concern}</p>
        )}
      </div>
    );
  }

  return (
    <>
      <div>
        <label
          className={`block text-sm font-medium ${themeClasses.labelText} mb-2`}
        >
          {questionLabels?.concern || translate(formKeys.concernQuestion)}
          <span className='text-red-400'> *</span>
        </label>
        <textarea
          value={questions.concern}
          onChange={event => onUpdateQuestion('concern', event.target.value)}
          placeholder={getPlaceholder(placeholders?.concernQuestion)}
          rows={3}
          className={`w-full px-4 py-3 bg-slate-800/80 border ${
            formErrors.concern ? 'border-red-500' : themeClasses.inputBorder
          } rounded-lg text-white placeholder-gray-400 focus:outline-none ${themeClasses.focusRing} transition-all resize-none`}
        />
        {formErrors.concern && (
          <p className='text-red-400 text-xs mt-1'>{formErrors.concern}</p>
        )}
      </div>

      <div>
        <label
          className={`block text-sm font-medium ${themeClasses.labelText} mb-2`}
        >
          {questionLabels?.understanding ||
            translate(formKeys.understandingQuestion)}
        </label>
        <textarea
          value={questions.understanding}
          onChange={event => onUpdateQuestion('understanding', event.target.value)}
          placeholder={getPlaceholder(placeholders?.understandingQuestion)}
          rows={3}
          className={`w-full px-4 py-3 bg-slate-800/80 border ${
            formErrors.understanding
              ? 'border-red-500'
              : themeClasses.inputBorder
          } rounded-lg text-white placeholder-gray-400 focus:outline-none ${themeClasses.focusRing} transition-all resize-none`}
        />
        {formErrors.understanding && (
          <p className='text-red-400 text-xs mt-1'>{formErrors.understanding}</p>
        )}
      </div>

      <div>
        <label
          className={`block text-sm font-medium ${themeClasses.labelText} mb-2`}
        >
          {questionLabels?.emotional || translate(formKeys.emotionalQuestion)}
        </label>
        <textarea
          value={questions.emotional}
          onChange={event => onUpdateQuestion('emotional', event.target.value)}
          placeholder={getPlaceholder(placeholders?.emotionalQuestion)}
          rows={3}
          className={`w-full px-4 py-3 bg-slate-800/80 border ${
            formErrors.emotional
              ? 'border-red-500'
              : themeClasses.inputBorder
          } rounded-lg text-white placeholder-gray-400 focus:outline-none ${themeClasses.focusRing} transition-all resize-none`}
        />
        {formErrors.emotional && (
          <p className='text-red-400 text-xs mt-1'>{formErrors.emotional}</p>
        )}
      </div>
    </>
  );
}

