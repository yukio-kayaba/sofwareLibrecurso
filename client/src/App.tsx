import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()

  console.log('ProtectedRoute - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated)

  if (isLoading) {
    console.log('ProtectedRoute - Mostrando pantalla de carga')
    return <div className="loading-screen">Cargando...</div>
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute - No autenticado, redirigiendo a /login')
    return <Navigate to="/login" replace />
  }

  console.log('ProtectedRoute - Usuario autenticado, renderizando children')
  return <>{children}</>
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div className="loading-screen">Cargando...</div>
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  console.log('App component renderizando...')
  
  try {
    return (
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    )
  } catch (error) {
    console.error('Error en App:', error)
    return (
      <div style={{ padding: '20px' }}>
        <h1>Error al cargar la aplicación</h1>
        <p>{error instanceof Error ? error.message : 'Error desconocido'}</p>
      </div>
    )
  }
}

export default App

