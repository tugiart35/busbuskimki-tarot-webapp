import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div
      className={`
        backdrop-blur-lg bg-white/5 border border-white/10 
        rounded-2xl p-6 sm:p-8
        shadow-xl
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}

