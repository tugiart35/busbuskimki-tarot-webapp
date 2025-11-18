/*
 * Auth Accessibility Wrapper
 *
 * Bu component auth form'ları için accessibility özelliklerini sağlar.
 * WCAG 2.1 AA compliance için gerekli özellikler.
 */

'use client';

import React, { useRef } from 'react';
import BottomNavigation from '@/features/shared/layout/BottomNavigation';

interface AuthAccessibilityWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function AuthAccessibilityWrapper({
  children,
  description,
}: AuthAccessibilityWrapperProps) {
  const mainRef = useRef<HTMLElement>(null);

  return (
    <>
      {/* Main content area - AuthForm zaten full-screen tasarım içeriyor */}
      <main
        ref={mainRef}
        id='main-content'
        role='main'
        aria-labelledby='auth-title'
        aria-describedby={description ? 'auth-description' : undefined}
        tabIndex={-1}
      >
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </>
  );
}

// Accessibility utilities
export const AccessibilityUtils = {
  // Announce messages to screen readers
  announceToScreenReader: (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Focus trap for modals
  trapFocus: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  },

  // High contrast mode detection
  isHighContrastMode: () => {
    return window.matchMedia('(prefers-contrast: high)').matches;
  },

  // Reduced motion detection
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Keyboard navigation helper
  handleKeyboardNavigation: (
    e: React.KeyboardEvent,
    onEnter?: () => void,
    onEscape?: () => void,
    onArrowUp?: () => void,
    onArrowDown?: () => void
  ) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        onEnter?.();
        break;
      case 'Escape':
        onEscape?.();
        break;
      case 'ArrowUp':
        onArrowUp?.();
        break;
      case 'ArrowDown':
        onArrowDown?.();
        break;
    }
  },
};
