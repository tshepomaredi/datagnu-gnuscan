// import { NextApiRequest, NextApiResponse } from 'next';
// import { db } from '@/db';
// import { websites } from '@/db/schema';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     // Test the database connection
//     const result = await db.select().from(websites).limit(5);
    
//     return res.status(200).json({ 
//       message: 'Database connection successful', 
//       data: result 
//     });
//   } catch (error) {
//     console.error('Database connection error:', error);
//     return res.status(500).json({ 
//       message: 'Database connection failed', 
//       error: error instanceof Error ? error.message : String(error) 
//     });
//   }
// }
