import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '9kX2mP7qW3zL8vN4tR1yU6iC0oA5bE2gH9jK'; // Use variável de ambiente em produção

export function generateToken(user: { id: number; email: string; username: string }): string {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch {
    return null;
  }
}