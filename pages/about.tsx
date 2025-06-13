// pages/about.tsx
import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Head>
        <title>About - GnuScan</title>
        <meta name="description" content="About GnuScan website security monitoring tool" />
      </Head>

      <div className="py-6">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            &larr; Back to Home
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-blue-600 mb-6">About GnuScan</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-black mb-4">Our Mission</h2>
          <p className="mb-4 text-gray-700">
            GnuScan provides simple yet powerful website monitoring to help businesses ensure their online presence 
            remains secure and accessible. We focus on two critical aspects of website health: uptime and SSL certificate validity.
          </p>
          <p className="text-gray-700">
            Our goal is to make website security monitoring accessible to everyone, from small businesses to large enterprises.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-black mb-4">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium text-blue-600 mb-2">Uptime Monitoring</h3>
              <p className="text-gray-700">
                GnuScan regularly checks your websites to ensure they&apos;re accessible to your users.
                Get notified immediately when your site goes down.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-600 mb-2">SSL Certificate Validation</h3>
              <p className="text-gray-700">
                Never let your SSL certificates expire. GnuScan monitors certificate validity and warns you
                before they expire, preventing security warnings for your users.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-600 mb-2">Team Collaboration</h3>
              <p className="text-gray-700">
                Create organizations and invite team members to collaborate on monitoring your websites.
                Assign admin or member roles to control access.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-600 mb-2">Secure Authentication</h3>
              <p className="text-gray-700">
                Built with AWS Cognito for enterprise-grade security and user management.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-black mb-4">Technology Stack</h2>
          <p className="mb-4 text-gray-700">
            GnuScan is built with modern technologies to ensure reliability, security, and performance:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><span className="font-medium text-gray-900">Frontend:</span> Next.js, Tailwind CSS</li>
            <li><span className="font-medium text-gray-900">Backend:</span> AWS Amplify Gen2</li>
            <li><span className="font-medium text-gray-900">Authentication:</span> AWS Cognito</li>
            <li><span className="font-medium text-gray-900">Database:</span> Neon Postgres with Drizzle ORM</li>
            <li><span className="font-medium text-gray-900">Hosting & CI/CD:</span> AWS Amplify</li>
          </ul>
        </div>
      </div>
      
    </>
  );
}
