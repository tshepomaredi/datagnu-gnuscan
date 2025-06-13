// pages/api/organizations/[id]/members.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { userOrganizations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { CognitoIdentityProviderClient, AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
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
    
    // Get user details from Cognito and filter out users that don't exist
    const membersWithDetailsPromises = members.map(async (member) => {
      try {
        const command = new AdminGetUserCommand({
          UserPoolId: outputs.auth.user_pool_id,
          Username: member.userId
        });
        
        const userData = await cognitoClient.send(command);
        const emailAttribute = userData.UserAttributes?.find(attr => attr.Name === 'email');
        
        return {
          ...member,
          email: emailAttribute?.Value || member.userId,
          exists: true
        };
      } catch (error: any) { // Use any type for error
        console.error(`Error fetching user ${member.userId}:`, error);
        // If the error is UserNotFoundException, mark the user as non-existent
        if (error.name === 'UserNotFoundException') {
          return {
            ...member,
            email: member.userId,
            exists: false
          };
        }
        // For other errors, still include the user but mark as existing
        return {
          ...member,
          email: member.userId,
          exists: true
        };
      }
    });
    
    const membersWithDetails = await Promise.all(membersWithDetailsPromises);
    
    // Filter out users that don't exist in Cognito
    const existingMembers = membersWithDetails.filter(member => member.exists);
    
    // If any users were filtered out, also remove them from the database
    const nonExistingMembers = membersWithDetails.filter(member => !member.exists);
    if (nonExistingMembers.length > 0) {
      // Delete non-existing users from the organization
      for (const member of nonExistingMembers) {
        await db.delete(userOrganizations)
          .where(eq(userOrganizations.id, member.id));
        console.log(`Removed non-existing user ${member.userId} from organization ${organizationId}`);
      }
    }
    
    return res.status(200).json(existingMembers);
  } catch (error) {
    console.error('Error fetching organization members:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
