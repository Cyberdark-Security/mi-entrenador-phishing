// app/page.tsx

'use client'; // Le dice a Next.js que este es un componente interactivo para el navegador

import { useState } from 'react';
import { saveResult } from './actions'; // Importamos la Server Action

// Array de ejercicios actualizado para usar imágenes
const exercises = [
    { image: 'q1.png', isPhishing: true, explanation: "Dominio sospechoso (.tk), urgencia artificial, amenaza de suspensión, y enlace que no va al sitio oficial del banco." },
    { image: 'q2.png', isPhishing: false, explanation: "Email legítimo: dominio oficial, sin urgencia, sin enlaces sospechosos, información estándar de facturación." },
    { image: 'q3.png', isPhishing: true, explanation: "Premio falso, solicita información personal sensible, presión por respuesta inmediata, Microsoft no hace loterías." },
    { image: 'q4.png', isPhishing: false, explanation: "Email interno legítimo: informa sobre mantenimiento, no solicita acciones del usuario, no tiene enlaces sospechosos." },
    { image: 'q5.png', isPhishing: true, explanation: "Dominio falso (paypal-verification.net), solicita credenciales y datos de tarjeta, presión temporal, amenaza de limitación." },
    { image: 'q6.png', isPhishing: false, explanation: "Email legítimo: notificación estándar de la aplicación, dominio oficial, opción de cancelar notificaciones." },
    { image: 'q7.png', isPhishing: false, explanation: "Alerta legítima de seguridad: informa sobre actividad real, dominio oficial, no solicita datos personales." },
    { image: 'q8.png', isPhishing: true, explanation: "Dominio falso, amenaza de eliminación, solicita credenciales completas, presión temporal extrema." },
    { image: 'q9.png', isPhishing: false, explanation: "Recibo legítimo: dominio oficial, información específica del viaje, no solicita acciones adicionales." },
    { image: 'q10.png', isPhishing: true, explanation: "Dominio sospechoso (.tk), solicita información financiera sensible, reembolso no solicitado, urgencia artificial." }
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
    let newScore = score;
    if (userAnswer === exercise.isPhishing) {
      newScore++;
      setScore(newScore);
    }

    const nextExercise = currentExercise + 1;
    if (nextExercise < exercises.length) {
      setCurrentExercise(nextExercise);
    } else {
      showResults(newScore);
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

    // Llamamos a la Server Action para guardar en la DB
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
          
          {/* --- CAMBIO PRINCIPAL: SE MUESTRA LA IMAGEN --- */}
          <div className="exercise-card">
            <img
                src={`/images/${exercises[currentExercise].image}`}
                alt={`Ejemplo de phishing ${currentExercise + 1}`}
                style={{ width: '100%', height: 'auto', borderRadius: '15px' }}
            />
          </div>
          {/* --- FIN DEL CAMBIO --- */}

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