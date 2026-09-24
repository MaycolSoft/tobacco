import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TobaccoGuidePage from '@components/TobaccoGuidePage';

export default function BlendGuide() {
  const navigate = useNavigate();
  // Volver a la página anterior si existe historial dentro de la app; si no, ir al configurador.
  const handleClose = useCallback(() => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate('/craft-your-cigar');
  }, [navigate]);

  return <TobaccoGuidePage onClose={handleClose} />;
}
