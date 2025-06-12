// pages/api/scan.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { websites, scanResults } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import https from 'https';
import http from 'http';
import { URL } from 'url';

async function checkWebsite(url: string): Promise<{
  isUp: boolean;
  sslValid: boolean | null;
  sslExpiryDate: Date | null;
  responseTime: number | null;
}> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    try {
      const parsedUrl = new URL(url);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;
      
      const req = protocol.get(url, { timeout: 10000 }, (res) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        // Check if website is up (status code 200-399)
        const isUp = res.statusCode !== undefined && res.statusCode >= 200 && res.statusCode < 400;
        
        // For HTTPS, check SSL certificate
        let sslValid = null;
        let sslExpiryDate = null;
        
        if (parsedUrl.protocol === 'https:' && res.socket && 'getPeerCertificate' in res.socket) {
          const cert = (res.socket as any).getPeerCertificate();
          if (cert && Object.keys(cert).length > 0) {
            sslValid = (res.socket as any).authorized === true;
            if (cert.valid_to) {
              sslExpiryDate = new Date(cert.valid_to);
            }
          }
        }
        
        resolve({
          isUp,
          sslValid,
          sslExpiryDate,
          responseTime
        });
      });
      
      req.on('error', () => {
        resolve({
          isUp: false,
          sslValid: null,
          sslExpiryDate: null,
          responseTime: null
        });
      });
      
      req.on('timeout', () => {
        req.destroy();
        resolve({
          isUp: false,
          sslValid: null,
          sslExpiryDate: null,
          responseTime: null
        });
      });
    } catch (error) {
      resolve({
        isUp: false,
        sslValid: null,
        sslExpiryDate: null,
        responseTime: null
      });
    }
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    
    const { websiteId, username } = req.body;
    
    if (!websiteId) {
      return res.status(400).json({ message: 'Website ID is required' });
    }
    
    if (!username) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Get the website and verify it belongs to the user
    const websiteResult = await db.select().from(websites)
      .where(and(
        eq(websites.id, websiteId),
        eq(websites.userId, username)
      ))
      .limit(1);
    
    if (websiteResult.length === 0) {
      return res.status(404).json({ message: 'Website not found' });
    }
    
    const website = websiteResult[0];
    
    // Check the website
    const scanResult = await checkWebsite(website.url);
    
    // Save the scan result
    const result = await db.insert(scanResults).values({
      websiteId: website.id,
      isUp: scanResult.isUp,
      sslValid: scanResult.sslValid,
      sslExpiryDate: scanResult.sslExpiryDate,
      responseTime: scanResult.responseTime,
    }).returning();
    
    return res.status(200).json({
      website,
      scanResult: result[0]
    });
  } catch (error) {
    console.error('Error scanning website:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}