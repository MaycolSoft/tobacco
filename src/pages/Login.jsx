import React, { useState } from 'react';
import { useAuthStore } from '@store/authStore';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, KeyRound, Layers3, Leaf } from 'lucide-react';

export default function Login() {
  const [credentials, setCredentials] = useState({ user: 'admin', pass: '1234' });
  const [error, setError] = useState('');
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/craft-your-cigar';

  const handleLogin = event => {
    event.preventDefault();
    if (login(credentials.user, credentials.pass)) navigate(from, { replace: true });
    else setError('No pudimos iniciar la experiencia con esos datos.');
  };

  return (
    <div className="site-login"><div className="site-login__visual"><img src="/assets/full/CAPA HABANA.png" alt="Hoja de tabaco seleccionada para una composición" /><div className="site-login__visual-copy"><span className="site-kicker">Mesa de composición</span><h1>Selecciona.<br />Equilibra.<br /><em>Observa.</em></h1><p>Construye una mezcla con capa, capote y tripa; después acompaña su elaboración en video.</p><div><span><Leaf size={16} /> Explora las hojas</span><span><Layers3 size={16} /> Forma la mezcla</span></div></div></div><div className="site-login__panel"><Link className="site-login__back" to="/"><ArrowLeft size={16} /> Volver al recorrido</Link><form onSubmit={handleLogin}><div className="site-login__mark"><KeyRound size={22} strokeWidth={1.4} /></div><span className="site-kicker">Acceso a la experiencia</span><h2>Crea tu cigarro.</h2><p>Ingresa para abrir la mesa de selección.</p><label>Usuario<input type="text" autoComplete="username" value={credentials.user} onChange={event => setCredentials({ ...credentials, user: event.target.value })} /></label><label>Contraseña<input type="password" autoComplete="current-password" value={credentials.pass} onChange={event => setCredentials({ ...credentials, pass: event.target.value })} /></label>{error && <span className="site-form-error" role="alert">{error}</span>}<button type="submit" className="site-button site-button--primary">Entrar a la mesa <ArrowRight size={17} /></button></form></div></div>
  );
}
