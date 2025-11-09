'use client';

interface AnimationProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slide' | 'bounce';
  onAnimate?: (_animation: any) => void;
}

// Simplified animation component
export function DynamicAnimation({ children }: AnimationProps) {
  return <div>{children}</div>;
}
