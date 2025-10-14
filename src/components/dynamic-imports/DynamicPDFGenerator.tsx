'use client';

interface PDFGeneratorProps {
  data: any;
  onGenerate?: (pdf: any) => void;
}

// Simplified PDF generator component
export function DynamicPDFGenerator({ data: _data }: PDFGeneratorProps) {
  return <div>PDF Generator simplified for production</div>;
}
