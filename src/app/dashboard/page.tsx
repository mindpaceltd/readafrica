// src/app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This component just redirects to the main dashboard page /my-books
export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/my-books');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to your dashboard...</p>
    </div>
  );
}
