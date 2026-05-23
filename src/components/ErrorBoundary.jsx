import { Component } from 'react'
import { AlertTriangle, Home } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center p-6">
          <div className="paper-shell max-w-md bg-[#ffffff]/95 p-7 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-md border-2 border-[var(--ink)] bg-paper-red text-white shadow-[5px_5px_0_rgba(33,37,41,0.2)]">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <h1 className="mt-6 font-display text-4xl uppercase text-ink">Something tore</h1>
            <p className="mt-3 text-sm leading-6 text-muted-paper">
              A page folded the wrong way. Try heading back to the floor.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.href = '/'
              }}
              className="paper-button mt-6 px-6 py-3 font-black"
            >
              <Home className="h-4 w-4" />
              Back to floor
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
