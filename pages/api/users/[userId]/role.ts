// pages/api/users/[userId]/role.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { userOrganizations } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'PUT') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    
    const { userId } = req.query;
    const { role, organizationId, updaterUsername } = req.body;
    
    if (!role || !organizationId || !updaterUsername) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    if (role !== 'admin' && role !== 'member') {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    // Check if updater is an admin
    const adminCheck = await db.select().from(userOrganizations)
      .where(and(
        eq(userOrganizations.userId, updaterUsername),
        eq(userOrganizations.organizationId, organizationId),
        eq(userOrganizations.role, 'admin')
      ))
      .limit(1);
    
    if (adminCheck.length === 0) {
      return res.status(403).json({ message: 'Only admins can update roles' });
    }
    
    // Update user role
    const result = await db.update(userOrganizations)
      .set({ 
        role,
        updatedAt: new Date()
      })
      .where(and(
        eq(userOrganizations.userId, userId as string),
        eq(userOrganizations.organizationId, organizationId)
      ))
      .returning();
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found in organization' });
    }
    
    return res.status(200).json({
      message: 'User role updated successfully',
      userOrganization: result[0]
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
