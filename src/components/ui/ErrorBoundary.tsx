import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-2xl border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-2xl font-display font-bold text-primary mb-4">Something went wrong</h2>
          <p className="text-primary/60 mb-8 max-w-md mx-auto">
            The editor encountered an unexpected error. This might be due to a component rendering issue or a data conflict.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto shadow-lg shadow-primary/20"
          >
            <RefreshCw size={18} />
            Reload Editor
          </button>
          {process.env.NODE_ENV !== 'production' && (
            <div className="mt-8 p-4 bg-white rounded-lg border border-red-100 text-left overflow-auto max-w-full">
              <p className="text-xs font-mono text-red-500 whitespace-pre-wrap">
                {this.state.error?.toString()}
              </p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
