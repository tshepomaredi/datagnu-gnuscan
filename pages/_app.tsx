import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from '@aws-amplify/ui-react';

Amplify.configure(outputs);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
          <div className="container mx-auto px-4 py-8">
            <header className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-blue-800">GnuScan</h1>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Hello, {user?.username}</span>
                <button 
                  onClick={signOut}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  Sign out
                </button>
              </div>
            </header>
            <main>
              <Component {...pageProps} />
            </main>
          </div>
        </div>
      )}
    </Authenticator>
  );
}
