// pages/api/websites/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { websites, scanResults } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // GET - List all websites
    if (req.method === 'GET') {
      const { username } = req.query;
      
      if (username) {
        // Get all websites for the user
        const websitesList = await db.select().from(websites)
          .where(eq(websites.userId, username as string));
        
        // For each website, get the latest scan result
        const websitesWithScans = await Promise.all(websitesList.map(async (website) => {
          const latestScan = await db.select()
            .from(scanResults)
            .where(eq(scanResults.websiteId, website.id))
            .orderBy(desc(scanResults.scanDate))
            .limit(1);
          
          return {
            ...website,
            status: latestScan[0]?.isUp ? 'up' : latestScan[0]?.isUp === false ? 'down' : undefined,
            sslValid: latestScan[0]?.sslValid,
            lastScan: latestScan[0]?.scanDate ? new Date(latestScan[0].scanDate).toLocaleString() : undefined
          };
        }));
        
        return res.status(200).json(websitesWithScans);
      } else {
        const result = await db.select().from(websites);
        return res.status(200).json(result);
      }
    }
    
    // POST - Create a new website
    if (req.method === 'POST') {
      const { name, url, username } = req.body;
      
      if (!name || !url) {
        return res.status(400).json({ message: 'Name and URL are required' });
      }
      
      if (!username) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
      
      const result = await db.insert(websites).values({
        name,
        url,
        userId: username,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      return res.status(201).json(result[0]);
    }
    
    // Method not allowed
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling website request:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
