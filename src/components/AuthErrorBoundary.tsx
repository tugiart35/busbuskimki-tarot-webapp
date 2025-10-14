/*
 * AUTH ERROR BOUNDARY - PRODUCTION-READY
 *
 * AMAÇ:
 * Auth sistemi için error boundary.
 * Beklenmeyen hataları yakalar ve kullanıcı dostu fallback gösterir.
 *
 * KULLANIM:
 * ```tsx
 * <AuthErrorBoundary>
 *   <ProtectedRoute>
 *     <Page />
 *   </ProtectedRoute>
 * </AuthErrorBoundary>
 * ```
 */

'use client';

import React, { Component, ReactNode } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (_error: Error, _errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
}

export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorCount: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Production'da error logging (Sentry, etc.)
    if (process.env.NODE_ENV === 'production') {
      // Silent logging - console.error kaldırıldı
    }

    // Custom error handler varsa çağır
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorCount: prevState.errorCount + 1,
    }));

    // Sayfa yenileme (3. denemeden sonra)
    if (this.state.errorCount >= 2) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback varsa göster
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-mystical-950 via-mystical-900 to-mystical-950 p-4'>
          <div className='max-w-md w-full bg-mystical-900/50 backdrop-blur-sm border border-mystical-700/50 rounded-2xl p-8 text-center'>
            <div className='flex justify-center mb-6'>
              <div className='relative'>
                <div className='absolute inset-0 bg-red-500/20 blur-xl rounded-full'></div>
                <AlertCircle className='h-16 w-16 text-red-500 relative' />
              </div>
            </div>

            <h2 className='text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-4'>
              Bir Sorun Oluştu
            </h2>

            <p className='text-mystical-300 mb-6'>
              {this.state.errorCount >= 2
                ? 'Lütfen sayfa yenilenene kadar bekleyin...'
                : 'Auth sistemi geçici olarak kullanılamıyor. Lütfen tekrar deneyin.'}
            </p>

            {this.state.errorCount < 2 && (
              <button
                onClick={this.handleReset}
                className='w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2'
              >
                <RefreshCw className='h-5 w-5' />
                Tekrar Dene
              </button>
            )}

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className='mt-6 text-left'>
                <summary className='text-sm text-mystical-400 cursor-pointer hover:text-mystical-300'>
                  Error Details (Dev Only)
                </summary>
                <pre className='mt-2 p-4 bg-mystical-950 rounded-lg text-xs text-red-400 overflow-auto max-h-40'>
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className='mt-6 pt-6 border-t border-mystical-700/50'>
              <Link
                href='/'
                className='text-sm text-mystical-400 hover:text-mystical-300 transition-colors'
              >
                ← Ana Sayfaya Dön
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper - kullanım kolaylığı için
export function withAuthErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <AuthErrorBoundary fallback={fallback}>
        <Component {...props} />
      </AuthErrorBoundary>
    );
  };
}
