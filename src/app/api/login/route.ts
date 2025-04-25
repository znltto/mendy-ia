import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '../../../../lib/db';
import { RowDataPacket } from 'mysql2';

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

    // Sucesso: retornar dados do usuário (sem a senha)
    return NextResponse.json(
      { id: user.id, email: user.email, username: user.username },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}