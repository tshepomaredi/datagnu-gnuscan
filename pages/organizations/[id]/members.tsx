// pages/organizations/[id]/members.tsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';

interface Member {
  id: number;
  userId: string;
  email: string;
  role: string;
}



export default function ManageMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  const { id: organizationId } = router.query;
  const { username, email: userEmail, userId } = useUser();

  useEffect(() => {
    if (!organizationId || !username) return;
    
  async function fetchData() {
    try {
      // Get all members
      const membersResponse = await fetch(`/api/organizations/${organizationId}/members`);
      if (membersResponse.ok) {
        const membersData = await membersResponse.json() as Member[];
        setMembers(membersData);
        
        // Check if current user is admin by finding them in the members list
        const currentUser = membersData.find((member: Member) => member.userId === username);
        if (currentUser) {
          setIsAdmin(currentUser.role === 'admin');
        } else {
          setIsAdmin(false);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }
  
  fetchData();
}, [organizationId, username]);
    

  async function inviteUser(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await fetch('/api/users/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: 'member',
          organizationId,
          inviterUsername: username
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setInviteEmail('');
        setSuccessMessage(`User invited successfully. Cognito will send an email with login instructions.`);
        
        // Refresh member list
        const membersResponse = await fetch(`/api/organizations/${organizationId}/members`);
        if (membersResponse.ok) {
          const membersData = await membersResponse.json();
          setMembers(membersData);
        }
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to invite user');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setInviting(false);
    }
  }

  async function updateRole(userId: string, newRole: string) {
    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: newRole,
          organizationId,
          updaterUsername: username
        }),
      });
      
      if (response.ok) {
        // Update the member in the list
        setMembers(members.map(member => {
          if (member.userId === userId) {
            return { ...member, role: newRole };
          }
          return member;
        }));
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="py-6">
        <h1 className="text-2xl text-black font-bold mb-6">Access Denied</h1>
        <p className="text-black">You must be an admin to manage organization members.</p>
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Manage Members - GnuScan</title>
      </Head>

      <div className="py-6">
        <div className="mb-6">
          <Link href="/organizations" className="text-blue-600 hover:text-blue-800">
            &larr; Back to Organizations
          </Link>
        </div>

        <h1 className="text-2xl text-blue-600 font-bold mb-6">Manage Organization Members</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg text-black font-semibold mb-4">Invite New Member</h2>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
              {successMessage}
            </div>
          )}
          
          <form onSubmit={inviteUser} className="flex gap-4">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Email address"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <button
              type="submit"
              disabled={inviting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              {inviting ? 'Inviting...' : 'Invite'}
            </button>
          </form>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-black whitespace-nowrap">{member.email}</td>
                  <td className="px-6 py-4 text-black whitespace-nowrap capitalize">{member.role}</td>
                  <td className="px-6 py-4 text-black whitespace-nowrap text-right">
                    {member.userId !== username && (
                      <select
                        value={member.role}
                        onChange={(e) => updateRole(member.userId, e.target.value)}
                        className="border text-white border-blue-600 bg-blue-600 rounded-md px-2 py-1"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
