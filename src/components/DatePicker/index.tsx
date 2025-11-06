'use client';

import { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';

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
 * Basit Manuel Tarih Input Componenti
 * 
 * Özellikler:
 * - Manuel giriş: GG.AA.YYYY formatı
 * - Otomatik formatlama (15031990 → 15.03.1990)
 * - Real-time validation
 * - Kolay ve hızlı kullanım
 * - Glassmorphic dark theme
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
  // Display value (GG.AA.YYYY format)
  const [displayValue, setDisplayValue] = useState('');

  // YYYY-MM-DD → GG.AA.YYYY conversion for display
  useEffect(() => {
    if (value) {
      const parts = value.split('-');
      if (parts.length === 3) {
        setDisplayValue(`${parts[2]}.${parts[1]}.${parts[0]}`);
      }
    } else {
      setDisplayValue('');
    }
  }, [value]);

  // Format input as user types
  const formatDateInput = (input: string): string => {
    // Remove all non-numeric characters
    const numbers = input.replace(/\D/g, '');
    
    // Limit to 8 digits (DDMMYYYY)
    const limited = numbers.slice(0, 8);
    
    // Auto-format: DD.MM.YYYY
    let formatted = '';
    for (let i = 0; i < limited.length; i++) {
      if (i === 2 || i === 4) {
        formatted += '.';
      }
      formatted += limited[i];
    }
    
    return formatted;
  };

  // Validate date format and range
  const validateDate = (dateStr: string): boolean => {
    // Check format: GG.AA.YYYY
    const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    const match = dateStr.match(regex);
    
    if (!match) return false;
    
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    
    // Basic validation
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > 2100) return false;
    
    // Check if date is valid (e.g., not 31.02.2020)
    const date = new Date(year, month - 1, day);
    if (
      date.getDate() !== day ||
      date.getMonth() !== month - 1 ||
      date.getFullYear() !== year
    ) {
      return false;
    }
    
    // Check min/max range
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    
    return true;
  };

  // Convert GG.AA.YYYY → YYYY-MM-DD
  const convertToISO = (dateStr: string): string => {
    const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    const match = dateStr.match(regex);
    
    if (!match) return '';
    
    const day = match[1];
    const month = match[2];
    const year = match[3];
    
    return `${year}-${month}-${day}`;
  };

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatDateInput(raw);
    
    setDisplayValue(formatted);
    
    // If complete date (10 chars: DD.MM.YYYY)
    if (formatted.length === 10) {
      if (validateDate(formatted)) {
        const isoDate = convertToISO(formatted);
        onChange(isoDate);
      } else {
        onChange(''); // Invalid date
      }
    } else {
      onChange(''); // Incomplete date
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    const formatted = formatDateInput(pasted);
    
    setDisplayValue(formatted);
    
    if (formatted.length === 10 && validateDate(formatted)) {
      const isoDate = convertToISO(formatted);
      onChange(isoDate);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    if (
      [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return;
    }
    
    // Ensure that it is a number
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className='relative group'>
      <input
        type='text'
        value={displayValue}
        onChange={handleChange}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-4 rounded-xl bg-white/20 border ${
          error
            ? 'border-red-500 focus:ring-red-400'
            : 'border-white/30 focus:ring-purple-400'
        } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 hover:bg-white/25 ${className}`}
        maxLength={10}
        inputMode='numeric'
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
      {/* Helper text */}
      {displayValue.length > 0 && displayValue.length < 10 && (
        <div className='absolute right-12 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 pointer-events-none'>
          {placeholder.slice(displayValue.length)}
        </div>
      )}
    </div>
  );
}

