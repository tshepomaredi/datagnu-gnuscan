import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { organizations, websites, userOrganizations } from '@/db/schema';
import { sql } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // First try a simple connection test
    await db.execute(sql`SELECT 1 as test`);
    
    // If that works, try the actual query
    const result = await db.select().from(userOrganizations).limit(5);
    
    return res.status(200).json({ 
      message: 'Database connection successful', 
      data: result,
      hasDbUrl: !!process.env.DATABASE_URL,
      dbUrlHasQuotes: process.env.DATABASE_URL?.startsWith("'") || process.env.DATABASE_URL?.startsWith('"')
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ 
      message: 'Database connection failed', 
      error: error instanceof Error ? error.message : String(error),
      hasDbUrl: !!process.env.DATABASE_URL,
      dbUrlHasQuotes: process.env.DATABASE_URL?.startsWith("'") || process.env.DATABASE_URL?.startsWith('"')
    });
  }
}
