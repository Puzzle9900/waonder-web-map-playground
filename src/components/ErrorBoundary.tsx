'use client';

import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary component to catch React errors and display fallback UI
 *
 * Catches errors during rendering, in lifecycle methods, and in constructors
 * of the whole tree below them.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error details to console for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error details:', errorInfo);

    // Update state with error info
    this.setState({
      error,
      errorInfo
    });

    // In production, you could send error to logging service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleRefresh = (): void => {
    // Reload the page to recover from error
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          padding: '20px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px 40px',
            maxWidth: '600px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            {/* Error Icon */}
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#ff4444',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '30px',
              color: 'white'
            }}>
              ⚠
            </div>

            {/* Error Title */}
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '10px'
            }}>
              Something went wrong
            </h1>

            {/* Error Message */}
            <p style={{
              fontSize: '16px',
              color: '#666',
              marginBottom: '20px',
              lineHeight: '1.5'
            }}>
              We encountered an error while loading the map. Please try refreshing the page.
            </p>

            {/* Refresh Button */}
            <button
              onClick={this.handleRefresh}
              style={{
                backgroundColor: '#3388ff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                marginBottom: isDevelopment ? '20px' : '0'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#2277ee';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#3388ff';
              }}
            >
              Refresh Page
            </button>

            {/* Error Details (Development Only) */}
            {isDevelopment && this.state.error && (
              <details style={{
                marginTop: '20px',
                textAlign: 'left',
                backgroundColor: '#f9f9f9',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px'
              }}>
                <summary style={{
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '10px'
                }}>
                  Error Details (Development Mode)
                </summary>
                <div style={{
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: '#c33',
                  marginTop: '10px'
                }}>
                  <strong>Error:</strong>
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    margin: '5px 0',
                    padding: '10px',
                    backgroundColor: '#fff',
                    border: '1px solid #eee',
                    borderRadius: '4px'
                  }}>
                    {this.state.error.toString()}
                  </pre>

                  {this.state.errorInfo && (
                    <>
                      <strong>Component Stack:</strong>
                      <pre style={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        margin: '5px 0',
                        padding: '10px',
                        backgroundColor: '#fff',
                        border: '1px solid #eee',
                        borderRadius: '4px',
                        fontSize: '11px'
                      }}>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
