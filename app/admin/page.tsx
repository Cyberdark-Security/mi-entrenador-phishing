// app/admin/page.tsx

import { db } from '@vercel/postgres';

// Función para obtener los resultados individuales
async function getQuizResults() {
  try {
    const { rows } = await db.query(
      `SELECT name, email, score, created_at FROM quiz_results ORDER BY created_at DESC`
    );
    return rows;
  } catch (error) {
    console.error('Error al obtener los resultados detallados:', error);
    return [];
  }
}

// NUEVA Función para obtener las estadísticas agregadas
async function getAggregateStats() {
  try {
    const { rows } = await db.query(`
      SELECT
        COUNT(*) AS total_participants,
        AVG(score) AS average_score,
        COUNT(*) FILTER (WHERE score <= 4) AS beginners,
        COUNT(*) FILTER (WHERE score >= 5 AND score <= 7) AS intermediates,
        COUNT(*) FILTER (WHERE score >= 8) AS experts
      FROM quiz_results;
    `);
    return rows[0];
  } catch (error) {
    console.error('Error al obtener las estadísticas agregadas:', error);
    return null;
  }
}

export default async function AdminPage({ searchParams }: { searchParams: any }) {
  const secretKey = searchParams?.secret;
  const adminKey = process.env.ADMIN_SECRET_KEY;

  if (secretKey !== adminKey || !adminKey) {
    return (
      <div className="container">
        <h1>⛔ Acceso Denegado</h1>
        <p>No tienes permiso para ver esta página.</p>
      </div>
    );
  }

  // Obtenemos tanto las estadísticas agregadas como los resultados detallados
  const stats = await getAggregateStats();
  const detailedResults = await getQuizResults();

  return (
    <div className="container" style={{ maxWidth: '1200px', padding: '20px' }}>
      <h1>👨‍💻 Panel de Administración</h1>
      
      {/* SECCIÓN DE ESTADÍSTICAS GENERALES */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', margin: '30px 0' }}>
        <div className="stat-card" style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px', minWidth: '180px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', fontWeight: 'bold' }}>{stats ? Number(stats.total_participants) : 0}</div>
          <div style={{ fontSize: '16px', color: '#666' }}>Participantes</div>
        </div>
        <div className="stat-card" style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px', minWidth: '180px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', fontWeight: 'bold' }}>{stats ? Number(stats.average_score).toFixed(1) : 0}</div>
          <div style={{ fontSize: '16px', color: '#666' }}>Promedio</div>
        </div>
        <div className="stat-card" style={{ background: '#fff0f0', padding: '20px', borderRadius: '15px', minWidth: '180px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', fontWeight: 'bold' }}>{stats ? Number(stats.beginners) : 0}</div>
          <div style={{ fontSize: '16px', color: '#666' }}>🤔 Principiantes</div>
        </div>
        <div className="stat-card" style={{ background: '#fffbe6', padding: '20px', borderRadius: '15px', minWidth: '180px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', fontWeight: 'bold' }}>{stats ? Number(stats.intermediates) : 0}</div>
          <div style={{ fontSize: '16px', color: '#666' }}>👍 Intermedios</div>
        </div>
        <div className="stat-card" style={{ background: '#f0fff0', padding: '20px', borderRadius: '15px', minWidth: '180px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', fontWeight: 'bold' }}>{stats ? Number(stats.experts) : 0}</div>
          <div style={{ fontSize: '16px', color: '#666' }}>🏆 Expertos</div>
        </div>
      </div>

      {/* SECCIÓN DE LA TABLA DETALLADA */}
      <h2 style={{ marginTop: '50px' }}>Resultados Detallados</h2>
      <div style={{ width: '100%', overflowX: 'auto', marginTop: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          {/* ... (código de la tabla sin cambios) ... */}
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Nombre</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Correo Electrónico</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Puntuación</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {detailedResults.length > 0 ? (
              detailedResults.map((result: any, index: number) => (
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