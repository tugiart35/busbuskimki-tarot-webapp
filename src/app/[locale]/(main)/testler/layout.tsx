// ISR Configuration for optimal performance
export const revalidate = 3600; // 1 hour cache
export const fetchCache = 'force-cache'; // Aggressive caching

export default function TestlerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

