// pages/api/users/invite.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { userOrganizations } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { AdminCreateUserCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import outputs from '@/amplify_outputs.json';

const cognitoClient = new CognitoIdentityProviderClient({ 
  region: outputs.auth.aws_region 
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    
    const { email, role, organizationId, inviterUsername } = req.body;
    
    if (!email || !role || !organizationId || !inviterUsername) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if inviter is an admin
    const adminCheck = await db.select().from(userOrganizations)
      .where(and(
        eq(userOrganizations.userId, inviterUsername),
        eq(userOrganizations.organizationId, parseInt(organizationId)),
        eq(userOrganizations.role, 'admin')
      ))
      .limit(1);
    
    if (adminCheck.length === 0) {
      return res.status(403).json({ message: 'Only admins can invite users' });
    }
    
    // Generate a temporary password
    const tempPassword = generateTemporaryPassword();
    
    // Create user in Cognito using AdminCreateUser
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: outputs.auth.user_pool_id,
      Username: email,
      TemporaryPassword: tempPassword,
      UserAttributes: [
        {
          Name: 'email',
          Value: email
        },
        {
          Name: 'email_verified',
          Value: 'true'
        }
      ],
      ForceAliasCreation: false,
      DesiredDeliveryMediums: [ "EMAIL",],
    });
    
    try {
      console.log('Sending AdminCreateUser command with UserPoolId:', outputs.auth.user_pool_id);
      const cognitoResult = await cognitoClient.send(createUserCommand);
      console.log('Cognito result:', cognitoResult);
      
      const userId = cognitoResult.User?.Username;
      
      if (!userId) {
        return res.status(500).json({ message: 'Failed to create user' });
      }
      
      // Add user to organization with specified role
      const result = await db.insert(userOrganizations).values({
        userId,
        organizationId: parseInt(organizationId),
        role,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      
      return res.status(201).json({
        message: 'User invited successfully. Cognito will send an email with login instructions.',
        userOrganization: result[0]
      });
    } catch (cognitoError) {
      console.error('Cognito error:', cognitoError);
      return res.status(500).json({ 
        message: 'Error creating user in Cognito',
        error: cognitoError instanceof Error ? cognitoError.message : String(cognitoError),
        userPoolId: outputs.auth.user_pool_id,
        region: outputs.auth.aws_region
      });
    }
  } catch (error) {
    console.error('Error inviting user:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

function generateTemporaryPassword() {
  const length = 12;
  const alphaUpper_charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const alphaLower_charset = 'abcdefghijklmnopqrstuvwxyz';
  const number_charset = '0123456789';
  const special_charset = '!@#$%^&*()_+';

  let password = '';
  
  for (let i = 0; i < length/4; i++) {
    const randomIndex1 = Math.floor(Math.random() * alphaUpper_charset.length);
    const randomIndex2 = Math.floor(Math.random() * alphaLower_charset.length);
    const randomIndex3 = Math.floor(Math.random() * number_charset.length);
    const randomIndex4 = Math.floor(Math.random() * special_charset.length);
    password += alphaUpper_charset[randomIndex1];
    password += alphaLower_charset[randomIndex2];
    password += number_charset[randomIndex3];
    password += special_charset[randomIndex4];
  }
  
  return password;
}
