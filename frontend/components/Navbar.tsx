'use client';

import Link from 'next/link';
import DarkModeToggle from './ui/DarkModeToggle';
import { authClient } from '@/lib/auth-client';
import { useStore } from '@nanostores/react';

const Navbar = () => {

const sessionData = authClient.useSession() as any;
const session = useStore(sessionData) as any;
const data = session?.data;
const isPending = session?.isPending;
  
  return (
    <nav className="bg-gray-800 dark:bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/">Todo App</Link>
        </div>

        <div className="flex items-center space-x-4">
          <DarkModeToggle />

          {isPending && <span>Loading...</span>}

          {!isPending && session && (
            <div className="flex items-center space-x-4">
              <span>Welcome, {session.user.email}</span>
              <button
                onClick={() => authClient.signOut()}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          )}

          {!isPending && !session && (
            <div className="space-x-4">
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/signup" className="hover:underline">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
