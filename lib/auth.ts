// lib/auth.ts
import { compare } from 'bcrypt';

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword);
}
