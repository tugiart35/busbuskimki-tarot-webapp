import { redirect } from 'next/navigation';

export default function RootPage() {
  // Server-side redirect - instant, no loading state
  redirect('/tr/anasayfa');
}
