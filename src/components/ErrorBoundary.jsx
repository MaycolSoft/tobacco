import React from "react";
import "@styles/error-boundory.css";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, resetKey: 0 };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Guarda el stack de React (componentStack) para mostrarlo
    this.setState({ error, errorInfo });

    // Callback opcional para loguear en algún servicio
    if (typeof this.props.onError === "function") {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    // “Resetea” el árbol descendiente forzando un nuevo montaje
    this.setState((s) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      resetKey: s.resetKey + 1
    }));
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      const message = error && (error.message || String(error));

      return (
        <div className="error-boundory-container" role="alert">
          <div className="error-boundory-card">
            <div className="error-boundory-icon" aria-hidden>⚠️</div>
            <h2 className="error-boundory-title">Algo salió mal</h2>

            {message && (
              <pre className="error-boundory-message">
                {message}
              </pre>
            )}

            {errorInfo?.componentStack && (
              <details className="error-boundory-details" open>
                <summary>Detalles técnicos</summary>
                <pre className="error-boundory-stack">
{errorInfo.componentStack.trim()}
                </pre>
              </details>
            )}

            <div className="error-boundory-actions">
              <button className="error-boundory-button" onClick={this.handleRetry}>
                Reintentar
              </button>
              {this.props.onReset && (
                <button
                  className="error-boundory-button secondary"
                  onClick={this.props.onReset}
                >
                  Restablecer app
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Nota: usamos un key interno para remount al reintentar
    return <div key={this.state.resetKey}>{this.props.children}</div>;
  }
}
