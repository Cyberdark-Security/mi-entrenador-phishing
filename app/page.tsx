// app/page.tsx

'use client'; // Le dice a Next.js que este es un componente interactivo para el navegador

import { useState } from 'react';
import { saveResult } from './actions'; // Importaremos esta función en un paso posterior

// Los datos de los ejercicios los ponemos aquí mismo
const exercises = [
    { type: "email", content: { from: "seguridad@banco-santander.com", subject: "Urgente: Actualice su información de seguridad", body: "Estimado cliente,\n\nHemos detectado actividad sospechosa en su cuenta. Por favor, haga clic en el enlace a continuación para verificar su identidad:\n\nhttp://banco-santander-verificacion.tk/login\n\nTiene 24 horas para completar este proceso o su cuenta será suspendida.\n\nAtentamente,\nEquipo de Seguridad" }, isPhishing: true, explanation: "Dominio sospechoso (.tk), urgencia artificial, amenaza de suspensión, y enlace que no va al sitio oficial del banco." },
    { type: "email", content: { from: "noreply@netflix.com", subject: "Tu factura de Netflix", body: "Hola,\n\nTu factura mensual de Netflix está disponible. Puedes revisarla en tu cuenta o descargar el PDF adjunto.\n\nGracias por ser suscriptor de Netflix.\n\nEquipo de Netflix" }, isPhishing: false, explanation: "Email legítimo: dominio oficial, sin urgencia, sin enlaces sospechosos, información estándar de facturación." },
    { type: "email", content: { from: "microsoft-security@outlook.com", subject: "¡Felicidades! Has ganado $1,000,000", body: "¡FELICIDADES!\n\nHas sido seleccionado para recibir $1,000,000 en nuestra lotería internacional de Microsoft.\n\nPara reclamar tu premio, envía los siguientes datos:\n- Nombre completo\n- Número de documento\n- Número de cuenta bancaria\n\nResponde INMEDIATAMENTE para no perder tu premio." }, isPhishing: true, explanation: "Premio falso, solicita información personal sensible, presión por respuesta inmediata, Microsoft no hace loterías." },
    { type: "email", content: { from: "admin@miempresa.com", subject: "Cambio de contraseña del sistema", body: "Estimado colaborador,\n\nInformamos que el sistema de gestión tendrá mantenimiento este fin de semana. No es necesario realizar ninguna acción.\n\nLos cambios entrarán en vigor el lunes.\n\nIT Support" }, isPhishing: false, explanation: "Email interno legítimo: informa sobre mantenimiento, no solicita acciones del usuario, no tiene enlaces sospechosos." },
    { type: "email", content: { from: "support@paypal.com", subject: "Verificación de cuenta requerida", body: "Su cuenta de PayPal ha sido limitada debido a actividad inusual.\n\nPara restaurar el acceso, haga clic aquí: http://paypal-verification.net/restore\n\nIngrese su usuario, contraseña y número de tarjeta para verificar su identidad.\n\nEste proceso debe completarse en 48 horas." }, isPhishing: true, explanation: "Dominio falso (paypal-verification.net), solicita credenciales y datos de tarjeta, presión temporal, amenaza de limitación." },
    { type: "email", content: { from: "team@slack.com", subject: "Nuevo mensaje en tu workspace", body: "Tienes 3 mensajes nuevos en tu workspace 'Equipo Desarrollo'.\n\nAbrir Slack\n\nSi no deseas recibir estas notificaciones, puedes configurarlas desde tu perfil." }, isPhishing: false, explanation: "Email legítimo: notificación estándar de la aplicación, dominio oficial, opción de cancelar notificaciones." },
    { type: "email", content: { from: "security@amazon.com", subject: "Inicio de sesión desde nuevo dispositivo", body: "Hola,\n\nDetectamos un nuevo inicio de sesión en tu cuenta desde:\n- Dispositivo: iPhone\n- Ubicación: Bogotá, Colombia\n- Fecha: 4 de julio, 2025\n\nSi no fuiste tú, cambia tu contraseña inmediatamente.\n\nEquipo de Seguridad de Amazon" }, isPhishing: false, explanation: "Alerta legítima de seguridad: informa sobre actividad real, dominio oficial, no solicita datos personales." },
    { type: "email", content: { from: "no-reply@apple.com", subject: "Su Apple ID ha sido deshabilitado", body: "Su Apple ID ha sido deshabilitado por violación de términos de servicio.\n\nPara reactivarlo, debe verificar su identidad haciendo clic aquí:\nhttp://apple-id-verification.com/unlock\n\nProporcione su ID, contraseña y respuestas de seguridad.\n\nTiene 24 horas antes de que se elimine permanentemente." }, isPhishing: true, explanation: "Dominio falso, amenaza de eliminación, solicita credenciales completas, presión temporal extrema." },
    { type: "email", content: { from: "receipts@uber.com", subject: "Recibo de tu viaje", body: "Gracias por viajar con Uber.\n\nViaje: Casa - Oficina\nFecha: 4 de julio, 2025\nTotal: $15,000 COP\n\nPuedes ver los detalles completos en la app de Uber.\n\nGracias por elegirnos." }, isPhishing: false, explanation: "Recibo legítimo: dominio oficial, información específica del viaje, no solicita acciones adicionales." },
    { type: "email", content: { from: "admin@gobierno.co", subject: "Reembolso tributario pendiente", body: "Estimado contribuyente,\n\nTiene un reembolso tributario de $2,450,000 COP pendiente.\n\nPara procesarlo, complete el formulario en:\nhttp://reembolso-tributario.tk/form\n\nIngrese su número de cédula, datos bancarios y declare sus ingresos.\n\nProceso válido hasta mañana." }, isPhishing: true, explanation: "Dominio sospechoso (.tk), solicita información financiera sensible, reembolso no solicitado, urgencia artificial." }
];

export default function PhishingTrainerPage() {
  // Estados para controlar la aplicación
  const [screen, setScreen] = useState('start'); // 'start', 'quiz', 'result'
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ title: '', celebration: '', scoreClass: '', details: '' });

  const handleStartSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userName && userEmail) {
      setScreen('quiz');
    }
  };

  const handleAnswer = (userAnswer: boolean) => {
    const exercise = exercises[currentExercise];
    if (userAnswer === exercise.isPhishing) {
      setScore(prevScore => prevScore + 1);
    }

    const nextExercise = currentExercise + 1;
    if (nextExercise < exercises.length) {
      setCurrentExercise(nextExercise);
    } else {
      showResults(score + (userAnswer === exercise.isPhishing ? 1 : 0));
    }
  };
  
  const showResults = async (finalScore: number) => {
    let newFeedback = { title: '', celebration: '', scoreClass: '', details: '' };

    if (finalScore === exercises.length) {
        newFeedback = {
            title: "¡Excelente! ¡Eres un experto en detectar phishing!",
            celebration: "🎉🏆🎉",
            scoreClass: "score perfect",
            details: "Has demostrado excelentes habilidades. ¡Sigue así!"
        };
    } else if (finalScore >= 7) {
        newFeedback = {
            title: "¡Muy bien! Tienes buenos conocimientos",
            celebration: "👏",
            scoreClass: "score good",
            details: "Buen trabajo, pero hay áreas que puedes reforzar."
        };
    } else {
        newFeedback = {
            title: "Necesitas reforzar algunos conceptos",
            celebration: "📚",
            scoreClass: "score needs-improvement",
            details: "No te preocupes, la práctica hace al maestro. ¡Inténtalo de nuevo!"
        };
    }
    setFeedback(newFeedback);
    setScreen('result');

    // ¡Aquí llamamos a la Server Action para guardar en la DB!
    try {
        await saveResult(userName, userEmail, finalScore);
        console.log("Resultado guardado en la base de datos.");
    } catch (error) {
        console.error("Error al guardar el resultado:", error);
    }
  };

  const restartQuiz = () => {
    setScore(0);
    setCurrentExercise(0);
    setScreen('quiz');
  };

  return (
    <div className="container">
      {screen === 'start' && (
        <div id="start-screen">
            <h1>Bienvenido al Entrenador Anti-Phishing</h1>
            <p>Antes de comenzar, por favor ingresa tus datos.</p>
            <form id="start-form" onSubmit={handleStartSubmit}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '5px' }}>
                    <label htmlFor="name">Nombre Completo:</label>
                    <input type="text" id="name" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Escribe tu nombre" required style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '5px' }}>
                    <label htmlFor="email">Correo Electrónico:</label>
                    <input type="email" id="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="Escribe tu correo" required style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}/>
                </div>
                <div className="disclaimer-box" style={{ background: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: '10px', padding: '15px', marginTop: '10px', fontSize: '13px', textAlign: 'justify', color: '#555' }}>
                    <h4>Aviso de Privacidad y Uso de Datos</h4>
                    <p>Al continuar, aceptas que los datos proporcionados serán recolectados con fines exclusivamente estadísticos y educativos. <strong>Tus datos no serán compartidos ni vendidos a terceros.</strong></p>
                </div>
                <div className="checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', justifyContent: 'center', marginTop: '15px'}}>
                    <input type="checkbox" id="terms" required />
                    <label htmlFor="terms">He leído y acepto los términos de uso.</label>
                </div>
                <button type="submit" className="btn restart-btn" style={{marginTop: '20px'}}>Iniciar Entrenamiento</button>
            </form>
        </div>
      )}

      {screen === 'quiz' && (
        <div id="quiz-screen">
          <h1>🛡️ Entrenador Anti-Phishing</h1>
          <p>Evalúa cada situación y decide si es phishing o legítimo</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(currentExercise / exercises.length) * 100}%` }}></div>
          </div>
          <div className="question-counter">Pregunta {currentExercise + 1} de {exercises.length}</div>
          <div className="exercise-card">
            <div className="email-header">
              <strong>De:</strong> {exercises[currentExercise].content.from}<br />
              <strong>Asunto:</strong> {exercises[currentExercise].content.subject}
            </div>
            <div className="email-content" dangerouslySetInnerHTML={{ __html: exercises[currentExercise].content.body.replace(/\n/g, '<br />') }}>
            </div>
          </div>
          <div className="buttons">
            <button className="btn btn-phishing" onClick={() => handleAnswer(true)}>⚠️ ES PHISHING</button>
            <button className="btn btn-legitimate" onClick={() => handleAnswer(false)}>✅ ES LEGÍTIMO</button>
          </div>
        </div>
      )}

      {screen === 'result' && (
        <div id="result-screen">
          <div className="result-screen">
            <div id="celebration" className="celebration">{feedback.celebration}</div>
            <h2 id="result-title">{feedback.title}</h2>
            <div id="score" className={feedback.scoreClass}>{score}/{exercises.length}</div>
            <div id="feedback" className="feedback" style={{textAlign: 'center'}}>{feedback.details}</div>
            <button className="restart-btn" onClick={restartQuiz}>🔄 Intentar de Nuevo</button>
          </div>
        </div>
      )}
    </div>
  );
}