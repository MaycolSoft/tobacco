import React, { useState } from 'react';
import { useAuthStore } from '@store/authStore';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, LockKeyhole } from 'lucide-react';

// Recorrido que abre el acceso: composición, resultado y elaboración.
const journey = ['Mesa de composición', 'Tripa · Capote · Capa', 'Tu cigarro', 'Ver cómo cobra forma'];

export default function Login() {
  const [credentials, setCredentials] = useState({ user: 'admin', pass: '1234' });
  const [error, setError] = useState('');
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const destination = from ? `${from.pathname}${from.search || ''}` : '/craft-your-cigar';

  const handleLogin = event => {
    event.preventDefault();
    if (login(credentials.user, credentials.pass)) navigate(destination, { replace: true });
    else setError('No pudimos abrir la experiencia con esos datos. Revisa el usuario y la contraseña.');
  };

  return (
    <div className="site-login">
      <div className="site-login__visual">
        <img src="/assets/full/CAPA HABANA.png" alt="Hoja de tabaco seleccionada para una composición" />
        <div className="site-login__visual-copy">
          <span className="site-kicker">Crear mi cigarro · Experiencia privada</span>
          <h1>Selecciona.<br />Equilibra.<br /><em>Observa.</em></h1>
          <p>Compón tu mezcla hoja por hoja y, cuando tu cigarro esté listo, mira cómo cobra forma.</p>
          <ol className="site-login__journey">{journey.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}</ol>
        </div>
      </div>
      <div className="site-login__panel">
        <Link className="site-login__back" to="/"><ArrowLeft size={16} /> Volver al recorrido</Link>
        <form onSubmit={handleLogin} aria-describedby="login-intro">
          <div className="site-login__mark"><LockKeyhole size={22} strokeWidth={1.4} aria-hidden="true" /></div>
          <span className="site-kicker">Acceso privado</span>
          <h2>Accede a tu experiencia.</h2>
          <p id="login-intro">La mesa de composición está reservada. Ingresa con los datos proporcionados por Tabacalera Tamboril.</p>
          <label>Usuario<input type="text" autoComplete="username" value={credentials.user} onChange={event => setCredentials({ ...credentials, user: event.target.value })} required /></label>
          <label>Contraseña<input type="password" autoComplete="current-password" value={credentials.pass} onChange={event => setCredentials({ ...credentials, pass: event.target.value })} required /></label>
          {error && <span className="site-form-error" role="alert">{error}</span>}
          <button type="submit" className="site-button site-button--primary">Entrar a la mesa <ArrowRight size={17} /></button>
          <p className="site-login__help">¿Aún no tienes acceso? <Link to="/reservation">Solicitar una presentación guiada</Link></p>
        </form>
      </div>
    </div>
  );
}
