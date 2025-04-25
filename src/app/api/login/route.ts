import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '../../../../lib/db';
import { RowDataPacket } from 'mysql2';
import { generateToken } from '../../../../lib/auth';

interface User extends RowDataPacket {
  id: number;
  email: string;
  username: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json();

    // Buscar usuário por email ou username
    const [rows] = await pool.query<User[]>(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [identifier, identifier]
    );
    const user = rows[0];

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 401 });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }

    // Gerar token JWT
    const token = generateToken({ id: user.id, email: user.email, username: user.username });

    // Criar resposta com cookie
    const response = NextResponse.json(
      { id: user.id, email: user.email, username: user.username },
      { status: 200 }
    );
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 3600 // 1 hora
    });

    return response;
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}