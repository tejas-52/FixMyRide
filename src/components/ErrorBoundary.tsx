import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-error/10 rounded-3xl flex items-center justify-center text-error mb-6">
        <AlertTriangle size={40} />
      </div>
      <h1 className="text-2xl font-black tracking-tight mb-2">Something went wrong</h1>
      <p className="text-on-surface-variant text-sm mb-8 max-w-xs">
        We've encountered an unexpected error. Our team has been notified.
      </p>
      <button
        onClick={resetErrorBoundary}
        className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-2xl font-bold active:scale-95 transition-all"
      >
        <RefreshCw size={18} />
        Reload Application
      </button>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-surface-container-low rounded-xl text-left max-w-md overflow-auto">
          <p className="text-xs font-mono text-error">{error.toString()}</p>
        </div>
      )}
    </div>
  );
};

export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
