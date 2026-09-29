// Usage: node scripts/hash-admin-password.mjs "your-strong-password"
// Prints the value for SHAIS_ADMIN_PASSWORD_HASH and a fresh SHAIS_ADMIN_SECRET.
import { scryptSync, randomBytes } from 'node:crypto';

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error('Provide a password of at least 12 characters.');
  process.exit(1);
}
const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
console.log(`SHAIS_ADMIN_PASSWORD_HASH=scrypt:${salt.toString('hex')}:${hash.toString('hex')}`);
console.log(`SHAIS_ADMIN_SECRET=${randomBytes(32).toString('hex')}`);
