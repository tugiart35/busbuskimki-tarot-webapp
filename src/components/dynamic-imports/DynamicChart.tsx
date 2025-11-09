'use client';

interface ChartProps {
  data: any[];
  type?: 'line' | 'bar' | 'pie';
  onRender?: (_chart: any) => void;
}

// Simplified chart component
export function DynamicChart({ data: _data }: ChartProps) {
  return <div>Chart component simplified for production</div>;
}
