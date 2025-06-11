// utils/auth.ts
import { NextApiRequest } from 'next';
import { Amplify } from 'aws-amplify';
import { getCurrentUser as getUser } from 'aws-amplify/auth';
import outputs from '@/amplify_outputs.json';

Amplify.configure(outputs);

export async function getCurrentUser(req: NextApiRequest) {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    
    // Verify the token with Cognito
    const user = await getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
