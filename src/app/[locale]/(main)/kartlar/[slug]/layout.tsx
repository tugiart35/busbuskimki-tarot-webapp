// ISR Configuration - 78 Turkish tarot card pages
export const revalidate = 3600; // 1 hour cache
export const fetchCache = 'force-cache'; // Aggressive caching

export default function KartlarSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
