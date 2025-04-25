import pool from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';
import { cookies } from 'next/headers';
import { RowDataPacket } from 'mysql2';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

interface User extends RowDataPacket {
  username: string;
}

async function getUserData() {
  // Correção definitiva para Next.js 13+ App Router
  const cookieStore = await cookies(); // Note o await aqui
  const token = cookieStore.get('token')?.value;

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
  const user = await getUserData();

  if (!user) {
    redirect('/');
  }

  return <DashboardClient user={user} />;
}