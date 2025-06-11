// db/index.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';

// Configure Neon to use WebSocket for better connection stability
if (typeof globalThis.WebSocket !== 'undefined') {
  neonConfig.webSocketConstructor = globalThis.WebSocket;
}
// Force SSL connections
neonConfig.useSecureWebSocket = true;

let db: ReturnType<typeof drizzle>;

try {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('DATABASE_URL environment variable is not set');
    throw new Error('Database connection string is missing');
  }
  
  // Create a Neon SQL client
  const sql = neon(connectionString);
  
  // Create the database client with Drizzle
  db = drizzle(sql, { schema });
  
  console.log('Database connection initialized successfully');
} catch (error) {
  console.error('Failed to initialize database connection:', error);
  throw error;
}

export { db };
