import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingPage from './components/LoadingPage'
import WaveBackground from './components/WaveBackground'

const HomePage = lazy(() => import('./pages/HomePage'))
const BotsPage = lazy(() => import('./pages/BotsPage'))
const SuccessPage = lazy(() => import('./pages/SuccessPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="relative min-h-screen overflow-x-hidden text-ink">
          <WaveBackground />
          <div className="relative z-10">
            <Suspense fallback={<LoadingPage />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/bots" element={<BotsPage />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </ErrorBoundary>
    </Router>
  )
}

export default App
