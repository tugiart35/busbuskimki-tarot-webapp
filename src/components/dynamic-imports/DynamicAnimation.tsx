'use client';

interface AnimationProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slide' | 'bounce';
  onAnimate?: (animation: any) => void;
}

// Simplified animation component
export function DynamicAnimation({
  children,
}: AnimationProps) {
  return <div>{children}</div>;
}
