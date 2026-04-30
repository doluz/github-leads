/**
 * AES-256-GCM encryption for sensitive values at rest.
 *
 * Requires ENCRYPTION_KEY env var: 64 hex chars (32 bytes).
 * Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 *
 * Ciphertext format: <iv_hex>:<authTag_hex>:<data_hex>
 * The format is recognisable by the two colon separators, so safeDecrypt can
 * detect whether a stored value has already been encrypted.
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_BYTES = 12; // 96-bit IV — recommended for GCM
const TAG_BYTES = 16;

function getKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex) throw new Error('[encrypt] ENCRYPTION_KEY env var is not set');
  const buf = Buffer.from(hex, 'hex');
  if (buf.length !== 32) {
    throw new Error('[encrypt] ENCRYPTION_KEY must be 64 hex characters (32 bytes)');
  }
  return buf;
}

/** Encrypt a plaintext string. Returns a colon-delimited hex string. */
export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

/** Decrypt a ciphertext produced by encrypt(). Throws on tamper / wrong key. */
export function decrypt(ciphertext: string): string {
  const key = getKey();
  const parts = ciphertext.split(':');
  if (parts.length !== 3) throw new Error('[encrypt] invalid ciphertext format');
  const [ivHex, tagHex, dataHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const data = Buffer.from(dataHex, 'hex');
  if (iv.length !== IV_BYTES || tag.length !== TAG_BYTES) {
    throw new Error('[encrypt] invalid ciphertext lengths');
  }
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(data).toString('utf8') + decipher.final('utf8');
}

/**
 * Returns true if the value looks like a ciphertext produced by encrypt().
 * Plaintext values (legacy, pre-encryption) will not match this pattern.
 */
function isEncrypted(value: string): boolean {
  const parts = value.split(':');
  if (parts.length !== 3) return false;
  // IV must be 24 hex chars (12 bytes), tag must be 32 hex chars (16 bytes)
  return parts[0].length === IV_BYTES * 2 && parts[1].length === TAG_BYTES * 2;
}

/**
 * Decrypt a value that may or may not already be encrypted (migration helper).
 * - If ENCRYPTION_KEY is not set, returns the value as-is (dev/test mode).
 * - If the value doesn't look encrypted, returns it as-is (pre-migration plaintext).
 * - Otherwise decrypts and returns the plaintext.
 */
export function safeDecrypt(value: string | null | undefined): string | null {
  if (!value) return null;
  if (!process.env.ENCRYPTION_KEY) return value; // dev mode: no key, no encryption
  if (!isEncrypted(value)) return value;          // pre-migration plaintext
  try {
    return decrypt(value);
  } catch {
    // Corrupted ciphertext — return null rather than crashing
    console.error('[encrypt] safeDecrypt failed — corrupted ciphertext');
    return null;
  }
}

/**
 * Encrypt a value if ENCRYPTION_KEY is configured, otherwise return as-is.
 * Allows the app to run in dev mode without a key.
 */
export function safeEncrypt(plaintext: string | null | undefined): string | null {
  if (!plaintext) return null;
  if (!process.env.ENCRYPTION_KEY) return plaintext; // dev mode
  return encrypt(plaintext);
}
