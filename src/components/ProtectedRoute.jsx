import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const checkSession = useAuthStore((state) => state.checkSession);
  const location = useLocation();

  // Verificamos si existe el usuario y si el token no ha expirado
  const isAuthenticated = user && checkSession();

  if (!isAuthenticated) {
    // Guardamos la ubicación para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;