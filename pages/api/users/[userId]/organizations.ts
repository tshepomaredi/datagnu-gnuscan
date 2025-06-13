// pages/api/users/[userId]/organizations.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { userOrganizations, organizations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    
    const { userId } = req.query;
    // console.log('Fetching organizations for userId:', userId);

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    // console.log("getting user org data from org.ts");
    // Get user organizations with organization details
    const result = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        role: userOrganizations.role,
        createdAt: userOrganizations.createdAt
      })
      .from(userOrganizations)
      .innerJoin(organizations, eq(userOrganizations.organizationId, organizations.id))
      .where(eq(userOrganizations.userId, userId as string));
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching user organizations:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
