import React from 'react'
import { Link } from 'react-router-dom'

/**
 * ErrorBoundary — catches runtime errors in lazy-loaded route chunks.
 * Prevents a white blank screen on chunk load failures.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // In production, send to an error tracking service (e.g., Sentry)
    console.error('ErrorBoundary caught an error:', error, info.componentStack)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          minHeight: '60vh', padding: '2rem', textAlign: 'center',
          background: '#060103', color: '#fff'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚖️</div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.5rem', marginBottom: '0.75rem' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', maxWidth: 400 }}>
            We encountered an unexpected error loading this page. Please try again or return home.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={this.handleRetry}
              style={{
                padding: '0.75rem 1.5rem', borderRadius: 8, border: 'none',
                background: 'var(--bur, #7B1D2E)', color: '#fff',
                fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem'
              }}
            >
              Try Again
            </button>
            <Link
              to="/"
              style={{
                padding: '0.75rem 1.5rem', borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', fontWeight: 700, fontSize: '0.9rem',
                textDecoration: 'none'
              }}
            >
              Go Home
            </Link>
          </div>
          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <pre style={{
              marginTop: '2rem', padding: '1rem', background: 'rgba(255,0,0,0.1)',
              borderRadius: 8, textAlign: 'left', fontSize: '0.75rem',
              color: '#ff6b6b', maxWidth: '90vw', overflow: 'auto'
            }}>
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
