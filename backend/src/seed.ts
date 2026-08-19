import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from './db';

async function seed(): Promise<void> {
  const email = 'admin';
  const password = 'admin123';
  const name = 'Administrador';

  const hashed = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO users (email, password, name)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET password = $2, name = $3`,
    [email, hashed, name],
  );

  console.log(`Usuario "${email}" creado/actualizado.`);
}

seed()
  .then(() => pool.end())
  .catch((error) => {
    console.error('Error durante el seed:', error);
    pool.end();
    process.exitCode = 1;
  });
