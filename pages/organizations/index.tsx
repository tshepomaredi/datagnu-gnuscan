// pages/organizations/index.tsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

// Define the Organization interface
interface Organization {
  id: number;
  name: string;
  role: string;
  createdAt: string;
}

export default function Organizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const { username, email } = useUser();

  useEffect(() => {
    async function fetchOrganizations() {
      if (!username) return;
      
      try {
        // Use the username directly instead of the UUID
        const response = await fetch(`/api/user-organizations?userId=${encodeURIComponent(username)}`);
        console.log('Fetching organizations for:', email);
        
        if (response.ok) {
          const data = await response.json() as Organization[];
          setOrganizations(data);
          console.log('Organizations data:', data);
        } else {
          console.error('Failed to fetch organizations:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrganizations();
  }, [username]);

  return (
    <>
      <Head>
        <title>Organizations - GnuScan</title>
      </Head>

      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">Organizations</h1>
          <Link 
            href="/organizations/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
          >
            + New Organization
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : organizations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No organizations yet</h2>
            <p className="text-gray-600 mb-6">Create your first organization to start inviting members</p>
            <Link 
              href="/organizations/new" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Create Organization
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org: Organization) => (
              <div key={org.id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl text-black font-semibold mb-2">{org.name}</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Role: <span className="capitalize">{org.role}</span>
                </p>
                <div className="flex justify-end">
                  {org.role === 'admin' && (
                    <Link 
                      href={`/organizations/${org.id}/members`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Manage Members
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
