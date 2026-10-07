import { withTranslation } from 'react-i18next';
import React from "react";
import "@styles/error-boundary.css";

class ErrorBoundary extends React.Component {
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
    const { t } = this.props;
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      const message = error && (error.message || String(error));

      return (
        <div className="error-boundary-container" role="alert">
          <div className="error-boundary-card">
            <div className="error-boundary-icon" aria-hidden>⚠️</div>
            <h2 className="error-boundary-title">{t('errors:errorBoundary.somethingWentWrong')}</h2>

            {message && (
              <pre className="error-boundary-message">
                {message}
              </pre>
            )}

            {errorInfo?.componentStack && (
              <details className="error-boundary-details" open>
                <summary>{t('errors:errorBoundary.technicalDetails')}</summary>
                <pre className="error-boundary-stack">
{errorInfo.componentStack.trim()}
                </pre>
              </details>
            )}

            <div className="error-boundary-actions">
              <button className="error-boundary-button" onClick={this.handleRetry}>{t('errors:errorBoundary.tryAgain')}</button>
              {this.props.onReset && (
                <button
                  className="error-boundary-button secondary"
                  onClick={this.props.onReset}
                >{t('errors:errorBoundary.resetApp')}</button>
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

const TranslatedErrorBoundary = withTranslation()(ErrorBoundary);
export default TranslatedErrorBoundary;
