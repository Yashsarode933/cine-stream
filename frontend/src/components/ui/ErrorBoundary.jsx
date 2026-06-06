import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
    
    // You can also log to an error reporting service here
    // logErrorToService(error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    // Reload the current page
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    this.props.navigate('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
          <div className="max-w-md w-full glass-card rounded-lg p-8 text-center text-white">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </div>

            {/* Error Title */}
            <h2 className="text-2xl font-bold mb-2">
              Something went wrong
            </h2>

            {/* Error Message */}
            <p className="text-gray-400 text-sm mb-6">
              We're sorry, but the application encountered an unexpected error. 
              Please try refreshing the page or go back to the home page.
            </p>

            {/* Error Details (Development Mode) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-black/40 rounded-lg p-4 mb-6 text-left">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Error Details
                </h4>
                <pre className="text-xs text-red-400 overflow-auto max-h-32 scrollbar-hide">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <pre className="text-xs text-gray-500 overflow-auto max-h-32 scrollbar-hide mt-2">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-brand-red hover:bg-red-700 text-white font-semibold py-3 px-6 rounded flex items-center justify-center gap-2 transition"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded flex items-center justify-center gap-2 transition"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>

            {/* Additional Help Text */}
            <p className="text-xs text-gray-500 mt-6">
              If the problem persists, please contact support or try again later.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper component to use with React Router
const ErrorBoundaryWrapper = ({ children }) => {
  const navigate = useNavigate();
  return <ErrorBoundary navigate={navigate}>{children}</ErrorBoundary>;
};

export default ErrorBoundaryWrapper;