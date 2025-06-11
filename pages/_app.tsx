// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from '@aws-amplify/ui-react';
import Link from 'next/link';
import { UserProvider } from '@/contexts/UserContext';

Amplify.configure(outputs);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <UserProvider username={user?.username || null}>
          <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-blue-800">
                  GnuScan
                </Link>
                
                <nav className="hidden md:flex space-x-6">
                  <Link href="/" className="text-gray-600 hover:text-blue-800">
                    Home
                  </Link>
                  {user && (
                    <Link href="/dashboard" className="text-gray-600 hover:text-blue-800">
                      Dashboard
                    </Link>
                  )}
                  <Link href="/about" className="text-gray-600 hover:text-blue-800">
                    About
                  </Link>
                </nav>
                
                <div className="flex items-center gap-4">
                  {user && (
                    <>
                      <span className="text-sm text-gray-600 hidden md:inline">
                        {user.username}
                      </span>
                      <button 
                        onClick={signOut}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                      >
                        Sign out
                      </button>
                    </>
                  )}
                </div>
              </div>
            </header>
            
            <main className="container mx-auto px-4 py-6">
              <Component {...pageProps} />
            </main>
            
            <footer className="bg-white border-t mt-12 py-6">
              <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} GnuScan. All rights reserved.
              </div>
            </footer>
          </div>
        </UserProvider>
      )}
    </Authenticator>
  );
}
