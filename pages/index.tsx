// pages/index.tsx
import { useAuthenticator } from '@aws-amplify/ui-react';
import Link from 'next/link';
import Head from 'next/head';

export default function LandingPage() {
  const { user } = useAuthenticator();

  return (
    <>
      <Head>
        <title>GnuScan - Website Security Monitoring</title>
        <meta name="description" content="Monitor your website uptime and SSL certificate validity with GnuScan" />
      </Head>

      <div className="py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            GnuScan Security Monitoring
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Monitor your websites for uptime and SSL certificate validity with our powerful scanning tools.
          </p>
          
          <div className="mt-8">
            <Link 
              href={user ? "/dashboard" : "#"}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium mx-2"
            >
              {user ? "Go to Dashboard" : "Get Started"}
            </Link>
            
            <Link 
              href="/about"
              className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md font-medium mx-2"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl text-blue-600 font-bold text-center mb-8">Key Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg text-blue-600 font-semibold mb-2">Uptime Monitoring</h3>
              <p className="text-gray-600">
                Continuous monitoring of your websites to ensure they&apos;re always accessible to your users.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg text-blue-600 font-semibold mb-2">SSL Certificate Validation</h3>
              <p className="text-gray-600">
                Automatic checks for SSL certificate validity and expiration warnings.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-lg text-blue-600 font-semibold mb-2">Instant Alerts</h3>
              <p className="text-gray-600">
                Get notified immediately when your websites go down or certificates are about to expire.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
