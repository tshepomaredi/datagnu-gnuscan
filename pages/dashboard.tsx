// pages/dashboard.tsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '@/contexts/UserContext';

interface Website {
  id: number;
  name: string;
  url: string;
  lastScan?: string;
  status?: 'up' | 'down';
  sslValid?: boolean;
}

interface ScanResult {
  id: number;
  websiteId: number;
  isUp: boolean;
  sslValid: boolean | null;
  sslExpiryDate: string | null;
  responseTime: number | null;
  scanDate: string;
}

export default function Dashboard() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState<number | null>(null);
  const router = useRouter();
  const { username } = useUser();

  useEffect(() => {
    fetchWebsites();
  }, [username]);

  async function fetchWebsites() {
    if (!username) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/websites?username=${encodeURIComponent(username)}`);
      if (response.ok) {
        const data = await response.json();
        setWebsites(data);
      }
    } catch (error) {
      console.error('Error fetching websites:', error);
    } finally {
      setLoading(false);
    }
  }

  async function scanWebsite(websiteId: number) {
    if (!username) return;
    
    try {
      setScanning(websiteId);
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteId, username }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Update the website in the list with the scan result
        setWebsites(websites.map(website => {
          if (website.id === websiteId) {
            return {
              ...website,
              status: data.scanResult.isUp ? 'up' : 'down',
              sslValid: data.scanResult.sslValid,
              lastScan: new Date().toLocaleString()
            };
          }
          return website;
        }));
      }
    } catch (error) {
      console.error('Error scanning website:', error);
    } finally {
      setScanning(null);
    }
  }

  return (
    <>
      <Head>
        <title>Dashboard - GnuScan</title>
      </Head>

      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Websites</h1>
          <Link 
            href="/websites/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
          >
            + Add Website
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : websites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No websites yet</h2>
            <p className="text-gray-600 mb-6">Add your first website to start monitoring</p>
            <Link 
              href="/websites/new" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Add Website
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SSL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Scan</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {websites.map((website) => (
                  <tr key={website.id} className="hover:bg-gray-50">
                    <td className="px-6 text-black py-4 whitespace-nowrap">{website.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href={website.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {website.url}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {website.status === 'up' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Up</span>
                      ) : website.status === 'down' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Down</span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Unknown</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {website.sslValid === true ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Valid</span>
                      ) : website.sslValid === false ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Invalid</span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Unknown</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-black whitespace-nowrap">{website.lastScan || 'Never'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => scanWebsite(website.id)}
                        disabled={scanning === website.id}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        {scanning === website.id ? 'Scanning...' : 'Scan Now'}
                      </button>
                      <Link href={`/websites/${website.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                      <button 
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this website?')) {
                            const response = await fetch(`/api/websites/${website.id}`, { 
                              method: 'DELETE',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({ username }),
                              
                            });
                            // console.log('username:', username);
                            if (response.ok) {
                              // Refresh the websites list after successful deletion
                              fetchWebsites();
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
