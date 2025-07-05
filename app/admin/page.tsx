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

// AQUÍ ESTÁ LA CORRECCIÓN: Se ajusta la definición de los props
export default async function AdminPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Usamos 'optional chaining' (?.) para acceder de forma segura
  const secretKey = searchParams?.secret;
  const adminKey = process.env.ADMIN_SECRET_KEY;

  // 1. Verificación de seguridad
  if (secretKey !== adminKey || !adminKey) {
    return (
      <div className="container">
        <h1>⛔ Acceso Denegado</h1>
        <p>No tienes permiso para ver esta página.</p>
      </div>
    );
  }

  // 2. Si la clave es correcta, se obtienen y muestran los datos
  const results = await getQuizResults();

  return (
    <div className="container" style={{ maxWidth: '1000px', padding: '20px' }}>
      <h1>👨‍💻 Panel de Administración</h1>
      <p>Resultados detallados de todos los participantes.</p>

      <div style={{ width: '100%', overflowX: 'auto', marginTop: '30px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Nombre</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Correo Electrónico</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Puntuación</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((result, index) => (
                <tr key={index}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{result.name}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{result.email}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{result.score} / 10</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {new Date(result.created_at).toLocaleString('es-CO', { timeZone: 'America/Bogota' })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ padding: '12px', textAlign: 'center' }}>
                  Aún no hay resultados para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}