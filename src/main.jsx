
import React from "react";
import { createRoot } from 'react-dom/client'
import App from "@components/App";
import CentralLogViewer from '@components/CentralLogViewer.jsx'
import ErrorBoundary from "@components/ErrorBoundary";


createRoot(document.getElementById('root')).render(
  <>
    <ErrorBoundary
      onError={(error, info) => {
        // Aquí podrías enviar el error a Sentry/LogRocket/etc.
        console.error("ErrorBoundary atrapó:", error, info);
      }}
      onReset={() => {
        // Limpia estado global, cache, etc, si quieres
        window.location.reload();
      }}
    >
      <App />
      <CentralLogViewer /> 
    </ErrorBoundary>
  </>
)
