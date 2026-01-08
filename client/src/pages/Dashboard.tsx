import { Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import MyRepositories from '../components/Collaborator/MyRepositories'
import CreateRepository from '../components/CreateRepository'
import RepositoryDetail from '../components/Admin/RepositoryDetail'
import RepositoryExplorer from '../components/Collaborator/RepositoryExplorer'
import Profile from '../components/Collaborator/CollaboratorProfile'
import ErrorBoundary from '../components/ErrorBoundary'
import './Dashboard.css'

const Dashboard = () => {
  const location = useLocation()

  useEffect(() => {
    console.log('Dashboard renderizado, ruta actual:', location.pathname)
  }, [location.pathname])

  console.log('Dashboard: Renderizando componente...')

  return (
    <ErrorBoundary>
      <Layout>
        <div className="dashboard" style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#fff' }}>
          <h1 style={{ marginBottom: '20px', color: '#333' }}>Dashboard - Bienvenido</h1>
          <nav className="dashboard-nav" style={{ marginBottom: '20px' }}>
            <NavLink to="/" end className="nav-link">
              Mis Repositorios
            </NavLink>
            <NavLink to="/create" className="nav-link">
              Crear Repositorio
            </NavLink>
            <NavLink to="/profile" className="nav-link">
              Mi Perfil
            </NavLink>
          </nav>

          <div className="dashboard-content" style={{ marginTop: '20px' }}>
            <ErrorBoundary>
              <Routes>
                <Route index element={<MyRepositories />} />
                <Route path="create" element={<CreateRepository />} />
                <Route path="repository/:id" element={<RepositoryDetail />} />
                <Route path="repository/:id/explore" element={<RepositoryExplorer />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ErrorBoundary>
          </div>
          {/* Debug: Mostrar ruta actual */}
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f0', fontSize: '12px', border: '1px solid #ccc' }}>
            Debug - Ruta actual: {location.pathname}
          </div>
        </div>
      </Layout>
    </ErrorBoundary>
  )
}

export default Dashboard


