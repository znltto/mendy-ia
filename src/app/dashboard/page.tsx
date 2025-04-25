import pool from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';
import { cookies } from 'next/headers';
import { RowDataPacket } from 'mysql2';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

interface User extends RowDataPacket {
  username: string;
}

// Função para buscar dados do usuário no lado do servidor
async function getUserData() {
  const token = cookies().get('token')?.value;

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  const [rows] = await pool.query<User[]>('SELECT username FROM users WHERE id = ?', [payload.userId]);
  return rows[0] || null;
}

export default async function DashboardPage() {
  // Buscar dados do usuário no servidor
  const user = await getUserData();

  // Se não houver usuário, redirecionar para login
  if (!user) {
    redirect('/login');
  }

  // Renderizar o Client Component com os dados do usuário
  return <DashboardClient user={user} />;
}