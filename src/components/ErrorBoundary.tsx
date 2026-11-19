import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Swad Mohalla ErrorBoundary caught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-3xl border-2 border-red-200 text-center shadow-lg">
          <p className="text-3xl mb-2">🛵</p>
          <h3 className="text-base font-black text-stone-900 mb-1">
            डेटा लोड हो रहा है...
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            स्क्रीन को रीफ्रेश करने के लिए नीचे क्लिक करें।
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false })
              if (this.props.onReset) this.props.onReset()
            }}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
          >
            स्क्रीन रीसेट करें (Reload)
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
