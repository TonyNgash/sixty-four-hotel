// SQLite connection setup
// Drizzle configuration 
// lib/database/index.ts
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { loadEnvConfig } from '@next/env';


// Load environment variables
loadEnvConfig(process.cwd());

const client = createClient({
  url: process.env.DATABASE_URL!,
});

export const db = drizzle(client, { schema });