'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "@/lib/auth-client";

export default function HomePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [session, isPending, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/20 dark:from-background dark:via-background dark:to-secondary/10 px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Loader */}
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-2 border-muted"></div>
          <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>

        {/* Text */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            Preparing your workspace
          </p>
          <p className="text-xs text-muted-foreground">
            Redirecting securely…
          </p>
        </div>
      </div>
    </div>
  );
}
