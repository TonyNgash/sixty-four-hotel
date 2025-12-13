// scripts/seed-admin.ts
import { db } from '../lib/database';
import { users } from '../lib/database/schema';
import { hash } from 'bcryptjs';

async function seedAdmin() {
  try {
    // Hash the admin password
    const email = 'patrickmburu267@gmail.com';
    const phone = '254722759936';
    const normalPassword = 'admin123#456';
    const hashedPassword = await hash(normalPassword, 12);
    
    // Insert admin user
    await db.insert(users).values({
      email: email,
      password_hash: hashedPassword,
      role: 'admin',
      first_name: 'Patrick',
      last_name: 'Mburu',
      phone: phone,
      email_verified_at: new Date(),
      phone_verified_at: new Date(),
      account_status: 'active',
    });

    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${normalPassword}`);
    console.log(`📞 Phone: ${phone}`);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}

seedAdmin();