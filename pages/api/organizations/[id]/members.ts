// pages/api/organizations/[id]/members.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { userOrganizations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { CognitoIdentityProviderClient, AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import outputs from '@/amplify_outputs.json';

const cognitoClient = new CognitoIdentityProviderClient({
  region: outputs.auth.aws_region
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    
    const { id: organizationId } = req.query;
    
    if (!organizationId) {
      return res.status(400).json({ message: 'Organization ID is required' });
    }
    
    // Get all members of the organization
    const members = await db.select().from(userOrganizations)
      .where(eq(userOrganizations.organizationId, parseInt(organizationId as string)));
    
    // Get user details from Cognito
    const membersWithDetails = await Promise.all(members.map(async (member) => {
      try {
        const command = new AdminGetUserCommand({
          UserPoolId: outputs.auth.user_pool_id,
          Username: member.userId
        });
        
        const userData = await cognitoClient.send(command);
        const emailAttribute = userData.UserAttributes?.find(attr => attr.Name === 'email');
        
        return {
          ...member,
          email: emailAttribute?.Value || member.userId
        };
      } catch (error) {
        console.error(`Error fetching user ${member.userId}:`, error);
        return {
          ...member,
          email: member.userId
        };
      }
    }));
    
    return res.status(200).json(membersWithDetails);
  } catch (error) {
    console.error('Error fetching organization members:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
