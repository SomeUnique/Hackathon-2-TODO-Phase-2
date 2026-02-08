'use client';

import React, { useEffect } from 'react';
import { useSession } from 'better-auth/react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

interface ProtectedRouteWrapperProps {
  children: React.ReactNode;
}

const ProtectedRouteWrapper: React.FC<ProtectedRouteWrapperProps> = ({ children }) => {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If user is not logged in and is trying to access a protected route, redirect to login
    if (!isPending && !session && pathname.startsWith('/dashboard')) {
      router.push('/login');
    }
  }, [session, isPending, router, pathname]);

  // Show loading state while checking session
  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // If user is not logged in, don't render the protected content
  if (!session && pathname.startsWith('/dashboard')) {
    return null; // The redirect happens in the effect above
  }

  // Render the protected content
  return <>{children}</>;
};

export default ProtectedRouteWrapper;