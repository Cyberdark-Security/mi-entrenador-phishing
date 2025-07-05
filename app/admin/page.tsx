// app/admin/page.tsx

import { db } from '@vercel/postgres';

async function getQuizResults() {
  try {
    const { rows } = await db.query(
      `SELECT name, email, score, created_at FROM quiz_results ORDER BY created_at DESC`
    );
    return rows;
  } catch (error) {
    console.error('Error al obtener los resultados del quiz:', error);
    return [];
  }
}

export default async function AdminPage({ searchParams }: { searchParams: any }) {
  const secretKey = searchParams?.secret;
  const adminKey = process.env.ADMIN_SECRET_KEY;

  // --- LÍNEAS DE DEPURACIÓN ---
  console.log("Clave recibida en la URL:", secretKey);
  console.log("Clave esperada del servidor:", adminKey);
  // --------------------------

  if (secretKey !== adminKey || !adminKey) {
    return (
      <div className="container">
        <h1>⛔ Acceso Denegado</h1>
        <p>No tienes permiso para ver esta página.</p>
      </div>
    );
  }

  const results = await getQuizResults();

  return (
    <div className="container" style={{ maxWidth: '1000px', padding: '20px' }}>
      <h1>👨‍💻 Panel de Administración</h1>
      <p>Resultados detallados de todos los participantes.</p>
      {/* El resto de la tabla va aquí como antes... */}
    </div>
  );
}