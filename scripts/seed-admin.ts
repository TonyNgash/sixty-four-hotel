// scripts/seed-admin.ts
import { db } from '../lib/database';
import { users } from '../lib/database/schema';
import { hash } from 'bcryptjs';

async function seedAdmin() {
  try {
    // Hash the admin password
    const hashedPassword = await hash('admin123', 12);
    
    // Insert admin user
    await db.insert(users).values({
      email: 'admin@hotel.com',
      password_hash: hashedPassword,
      role: 'admin',
      first_name: 'System',
      last_name: 'Administrator',
      phone: '+254790818789',
      email_verified_at: new Date(),
      phone_verified_at: new Date(),
      account_status: 'active',
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@hotel.com');
    console.log('🔑 Password: admin123');
    console.log('📞 Phone: +1234567890');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}

seedAdmin();