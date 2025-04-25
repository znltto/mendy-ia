import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'X9mW3zL5vN7tR1yU4iC6oA2bE9gH0jK8lP2qF5rT7uV=='; // Use variável de ambiente em produção

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