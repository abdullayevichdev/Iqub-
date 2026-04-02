import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    localStorage.removeItem('app_view');
    localStorage.removeItem('admin_access');
    localStorage.removeItem('demo_approved');
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = "Kutilmagan xatolik yuz berdi.";
      
      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.error.includes('permissions')) {
            errorMessage = "Sizda ushbu ma'lumotlarni ko'rish uchun ruxsat yo'q yoki tizimga kirilmagan.";
          }
        }
      } catch (e) {
        // Not a JSON error message
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2 italic">Xatolik yuz berdi</h2>
            <p className="text-slate-500 font-medium mb-8">
              {errorMessage}
            </p>
            
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
              >
                <RefreshCw size={20} />
                Sahifani yangilash
              </button>
              <button
                onClick={this.handleGoHome}
                className="w-full py-4 bg-white border border-slate-100 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
              >
                <Home size={20} />
                Bosh sahifaga qaytish
              </button>
            </div>
            
            {this.state.error && (
              <div className="mt-8 p-4 bg-slate-50 rounded-xl text-left overflow-auto max-h-40">
                <p className="text-[10px] font-mono text-slate-400 uppercase mb-2">Texnik tafsilotlar:</p>
                <pre className="text-[10px] font-mono text-slate-600 whitespace-pre-wrap">
                  {this.state.error.stack}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
