import { readFileSync } from 'fs';
import { join } from 'path';
import { pool } from './client.js';

async function migrate() {
  const sql = readFileSync(join(import.meta.dirname, 'schema.sql'), 'utf-8');
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log('[migrate] schema applied successfully');
  } catch (err) {
    console.error('[migrate] failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
