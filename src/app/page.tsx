import { permanentRedirect } from 'next/navigation';

export default function RootPage() {
  // Server-side redirect - instant, no loading state
  // SEO Fix: Direct redirect to /tr (no redirect chain)
  permanentRedirect('/tr');
}
