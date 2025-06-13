// pages/api/organizations/[id]/members/[userId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { userOrganizations } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    
    const { id: organizationId, userId } = req.query;
    
    if (!organizationId || !userId) {
      return res.status(400).json({ message: 'Organization ID and User ID are required' });
    }
    
    // Get user's role in the organization
    const result = await db.select().from(userOrganizations)
      .where(and(
        eq(userOrganizations.organizationId, parseInt(organizationId as string)),
        eq(userOrganizations.userId, userId as string)
      ))
      .limit(1);
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found in organization' });
    }
    
    return res.status(200).json(result[0]);
  } catch (error) {
    console.error('Error fetching user role:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
