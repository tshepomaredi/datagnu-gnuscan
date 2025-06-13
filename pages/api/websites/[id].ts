// pages/api/websites/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { websites, scanResults } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const websiteId = parseInt(id as string);
    
    if (isNaN(websiteId)) {
      return res.status(400).json({ message: 'Invalid website ID' });
    }
    
    // GET - Get a single website
    if (req.method === 'GET') {
      const { username } = req.query;
      
      if (!username) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
      
      const result = await db.select().from(websites)
        .where(and(
          eq(websites.id, websiteId),
          eq(websites.userId, username as string)
        ))
        .limit(1);
      
      if (result.length === 0) {
        return res.status(404).json({ message: 'Website not found' });
      }
      
      return res.status(200).json(result[0]);
    }
    
    // PUT - Update a website
    if (req.method === 'PUT') {
      const { name, url, username } = req.body;
      
      if (!name || !url) {
        return res.status(400).json({ message: 'Name and URL are required' });
      }
      
      if (!username) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
      
      const result = await db.update(websites)
        .set({ 
          name, 
          url, 
          updatedAt: new Date() 
        })
        .where(and(
          eq(websites.id, websiteId),
          eq(websites.userId, username)
        ))
        .returning();
      
      if (result.length === 0) {
        return res.status(404).json({ message: 'Website not found or you do not have permission to update it' });
      }
      
      return res.status(200).json(result[0]);
    }
    
    // DELETE - Delete a website
    if (req.method === 'DELETE') {
      const { username } = req.body;
      
      if (!username) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
      
      // First, delete all scan results for this website
      await db.delete(scanResults)
        .where(eq(scanResults.websiteId, websiteId));
      
      // Then delete the website
      const result = await db.delete(websites)
        .where(and(
          eq(websites.id, websiteId),
          eq(websites.userId, username)
        ))
        .returning();
      
      if (result.length === 0) {
        return res.status(404).json({ message: 'Website not found or you do not have permission to delete it' });
      }
      
      return res.status(200).json({ message: 'Website deleted successfully' });
    }
    
    // Method not allowed
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling website request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
