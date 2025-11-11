// Points to your database file
// Sets up migration outputs
import type { Config } from 'drizzle-kit';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Manually read .env.local
const envPath = resolve(process.cwd(), '.env.local');
const envFile = readFileSync(envPath, 'utf8');
const envVars = envFile.split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=');
  if (key && value) acc[key] = value.replace(/"/g, '');
  return acc;
}, {} as Record<string, string>);

export default {
  schema: './lib/database/schema.ts',  // Path to your table definitions
  out: './migrations',                 // Where to save migration files
  dialect: 'sqlite',                   // Database type
  dbCredentials: {
    url: envVars.DATABASE_URL,    // Your SQLite file path
    // url: "file:./hotel.db",
  },
} satisfies Config;