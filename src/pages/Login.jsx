import React, { useState } from 'react';
import { useAuthStore } from '@store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ user: 'admin', pass: '1234' });
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(credentials.user, credentials.pass)) {
      navigate(from, { replace: true });
    } else {
      alert("Acceso denegado");
    }
  };

  return (
    <div className="login-container" style={{ background: '#1a1a1a', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <h2 style={{ color: '#d4af37' }}>Cigar Shop Admin</h2>
        <input 
          type="text" 
          placeholder="Usuario" 
          value={credentials.user}
          onChange={(e) => setCredentials({...credentials, user: e.target.value})} 
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={credentials.pass}
          onChange={(e) => setCredentials({...credentials, pass: e.target.value})} 
        />
        <button type="submit" style={{ background: '#d4af37', color: '#000', padding: '10px', border: 'none', cursor: 'pointer' }}>
          ENTRAR
        </button>
      </form>
    </div>
  );
};

export default Login;