"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-100 max-w-md text-center">
              <div className="mb-4 text-4xl">⚠️</div>
              <h2 className="text-xl font-semibold text-zinc-900 mb-2">
                Une erreur est survenue
              </h2>
              <p className="text-sm text-zinc-600 mb-4">
                Nous sommes désolés, une erreur s'est produite. Veuillez rafraîchir la page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center rounded-full bg-[#2FB190] px-6 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#27a07d]"
              >
                Rafraîchir la page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}


