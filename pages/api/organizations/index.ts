// pages/api/organizations/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { organizations, userOrganizations } from '@/db/schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // POST - Create a new organization
    if (req.method === 'POST') {
      const { name, username } = req.body;
      
      if (!name || !username) {
        return res.status(400).json({ message: 'Name and username are required' });
      }
      
      // Create the organization
      const orgResult = await db.insert(organizations).values({
        name,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      if (orgResult.length === 0) {
        return res.status(500).json({ message: 'Failed to create organization' });
      }
      
      const organization = orgResult[0];
      console.log("creating userOrg")
      // Add the creator as an admin
      await db.insert(userOrganizations).values({
        userId: username,
        organizationId: organization.id,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log("created userOrg")
      return res.status(201).json(organization);
    }
    
    // Method not allowed
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling organization request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
