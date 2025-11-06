'use client';

import { forwardRef } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { tr } from 'date-fns/locale/tr';
import { format, parse } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

// Türkçe locale'i kaydet
registerLocale('tr', tr);

interface DatePickerProps {
  value: string; // YYYY-MM-DD format (ISO)
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
}

/**
 * Modern DatePicker Component
 * 
 * Features:
 * - Turkish locale (dd.mm.yyyy display)
 * - ISO format output (YYYY-MM-DD)
 * - Keyboard accessible
 * - Mobile friendly
 * - Glassmorphic dark theme
 * - Min/max date constraints
 * - Error state styling
 */
export default function DatePicker({
  value,
  onChange,
  placeholder = 'GG.AA.YYYY',
  error = false,
  minDate = new Date(1900, 0, 1),
  maxDate = new Date(),
  disabled = false,
  className = '',
}: DatePickerProps) {
  // YYYY-MM-DD → Date object conversion
  const selectedDate = value
    ? parse(value, 'yyyy-MM-dd', new Date())
    : null;

  // Date object → YYYY-MM-DD conversion
  const handleChange = (date: Date | null) => {
    if (date) {
      const isoDate = format(date, 'yyyy-MM-dd');
      onChange(isoDate);
    } else {
      onChange('');
    }
  };

  // Custom input component with glassmorphic styling
  const CustomInput = forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
  >(({ value, onClick, placeholder }, ref) => (
    <div className='relative group'>
      <input
        ref={ref}
        value={value}
        onClick={onClick}
        placeholder={placeholder}
        readOnly
        className={`w-full px-4 py-4 rounded-xl bg-white/20 border ${
          error
            ? 'border-red-500 focus:ring-red-400'
            : 'border-white/30 focus:ring-purple-400'
        } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 hover:bg-white/25 cursor-pointer ${className}`}
        disabled={disabled}
      />
      <div className='absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
      {/* Calendar Icon */}
      <div className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none'>
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
          />
        </svg>
      </div>
    </div>
  ));

  CustomInput.displayName = 'CustomDateInput';

  return (
    <ReactDatePicker
      selected={selectedDate}
      onChange={handleChange}
      dateFormat='dd.MM.yyyy'
      locale='tr'
      minDate={minDate}
      maxDate={maxDate}
      disabled={disabled}
      placeholderText={placeholder}
      customInput={<CustomInput placeholder={placeholder} />}
      showMonthDropdown
      showYearDropdown
      dropdownMode='select'
      yearDropdownItemNumber={100}
      scrollableYearDropdown
      // Accessibility
      aria-label='Tarih seçici'
      aria-required='true'
      // Mobile optimization
      withPortal={false}
      // Keyboard navigation enabled by default
      shouldCloseOnSelect={true}
      // Week starts on Monday (TR standard)
      calendarStartDay={1}
    />
  );
}

