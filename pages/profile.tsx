// pages/profile.tsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

export default function Profile() {
  const [userOrganizations, setUserOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { username } = useUser();

  useEffect(() => {
    async function fetchUserData() {
      if (!username) return;
      
      try {
        // Get user organizations and roles
        // const response = await fetch(`/api/users/${username}/organizations`);
        const response = await fetch(`/api/user-organizations?userId=${encodeURIComponent(username)}`);
        if (response.ok) {
          const data = await response.json();
          setUserOrganizations(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, [username]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>My Profile - GnuScan</title>
      </Head>

      <div className="py-6">
        <div className="mb-6">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
            &larr; Back to Dashboard
          </Link>
        </div>

        <h1 className="text-2xl text-blue-600 font-bold mb-6">My Profile</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg text-blue-600 font-semibold mb-4">Personal Information</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="text-black">{username}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg text-blue-600 font-semibold">Organizations</h2>
            <Link 
            href="/organizations" 
            className="text-blue-600 hover:text-blue-800 text-sm"
            >
            View All Organizations
            </Link>
        </div>
          
          {userOrganizations.length === 0 ? (
            <p className="text-gray-500">You are not a member of any organizations.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {userOrganizations.map((org) => (
                <li key={org.id} className="py-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-black">{org.name}</p>
                      <p className="text-sm text-gray-500">
                        Role: <span className="capitalize">{org.role}</span>
                      </p>
                    </div>
                    {org.role === 'admin' && (
                      <Link 
                        href={`/organizations/${org.id}/members`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Manage Members
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
