#!/usr/bin/env node

/**
 * Create test user for Shopier webhook testing
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Load .env.local
function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return false;
  }

  try {
    const envContent = readFileSync(filePath, 'utf-8');
    const lines = envContent.split('\n');

    for (const line of lines) {
      if (!line.trim() || line.trim().startsWith('#')) {
        continue;
      }

      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        process.env[key] = value.replace(/^["']|["']$/g, '');
      }
    }

    return true;
  } catch (error) {
    console.error('⚠️  .env.local okunamadı:', error.message);
    return false;
  }
}

const envPath = join(projectRoot, '.env.local');
loadEnvFile(envPath);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ HATA: Supabase credentials bulunamadı');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const TEST_USER_ID = '1e29cb81-8635-42d7-aac4-c6932d5833e6';
const TEST_USER_EMAIL = 'test-shopier@example.com';

async function createTestUser() {
  console.log('Creating test user...');

  // Check if user exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', TEST_USER_ID)
    .single();

  if (existing) {
    console.log('✅ Test user already exists:', TEST_USER_ID);
    return;
  }

  // Create user
  const { error } = await supabase
    .from('profiles')
    .insert({
      id: TEST_USER_ID,
      email: TEST_USER_EMAIL,
      display_name: 'Test Shopier User',
      credit_balance: 0,
      created_at: new Date().toISOString(),
    });

  if (error) {
    console.error('❌ Failed to create user:', error.message);
    process.exit(1);
  }

  console.log('✅ Test user created successfully:', TEST_USER_ID);
}

createTestUser().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
