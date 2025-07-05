// app/actions.ts

'use server'; // Magia de Next.js para ejecutar esto en el servidor

import { neon } from '@neondatabase/serverless';

export async function saveResult(name: string, email: string, score: number) {
  // Obtenemos la URL de la base de datos del archivo .env que Vercel creó
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('La variable de entorno DATABASE_URL no está definida.');
  }

  const db_sql = neon(connectionString);

  try {
    await db_sql`
      INSERT INTO quiz_results (name, email, score)
      VALUES (${name}, ${email}, ${score});
    `;
    return { success: true };
  } catch (error) {
    console.error('Error de base de datos:', error);
    throw new Error('Error al guardar el resultado.');
  }
}