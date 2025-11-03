import { redirect } from 'next/navigation';
import { Metadata } from 'next';

// Google'a bu sayfayı dizine eklememesini söyle
// Root path zaten locale'e yönlendiriyor, dizine eklenmesine gerek yok
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootPage() {
  // Server-side redirect - instant, no loading state
  // SEO Fix: Direct redirect to /tr (no redirect chain)
  redirect('/tr');
}
