import React from 'react';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Здесь можно добавить логирование ошибок
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Что-то пошло не так</h2>
          <p>{this.state.error?.message || 'Произошла неизвестная ошибка'}</p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Попробовать снова
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export const withErrorBoundary = (WrappedComponent) => {
  return function WithErrorBoundary(props) {
    return (
      <ErrorBoundary>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
};

export default ErrorBoundary; 