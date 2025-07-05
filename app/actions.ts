// app/actions.ts

'use server';

// Paso 1: Cambiamos la importación por la de @vercel/postgres
import { db } from '@vercel/postgres';

export async function saveResult(name: string, email: string, score: number) {
  try {
    // Paso 2: Usamos db.query para ejecutar el SQL. Es más directo.
    // Los valores se pasan en un array para mayor seguridad.
    await db.query(
      `INSERT INTO quiz_results (name, email, score) VALUES ($1, $2, $3)`,
      [name, email, score]
    );

    console.log('Resultado guardado exitosamente con @vercel/postgres.');
    return { success: true };
    
  } catch (error) {
    console.error('Error de base de datos con @vercel/postgres:', error);
    throw new Error('Error al guardar el resultado.');
  }
}