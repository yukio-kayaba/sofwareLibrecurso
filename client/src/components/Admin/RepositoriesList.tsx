import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { apiService } from '../../services/api'
import './RepositoriesList.css'

const RepositoriesList = () => {
  const [repositories, setRepositories] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const loadRepositories = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('RepositoriesList: Cargando repositorios...')
        
        const response = await apiService.getMyRepositories()
        
        if (response.status === 'success' && response.data) {
          // Filtrar solo los repositorios donde el usuario es creador (admin)
          const ownedRepos = response.data
            .filter((repo: any) => repo.isOwner)
            .map((repo: any) => ({
              id: repo.idrepo?.toString() || repo.id?.toString(),
              name: repo.nombrerepo || repo.name,
              connectionType: 'Local', // Valor por defecto
              pc: repo.dominio || 'N/A',
              ip: repo.ipdata || repo.ip || 'N/A',
              mask: '255.255.255.0', // Valor por defecto
              org: repo.orgdata || repo.org || 'N/A',
              createdAt: repo.fechacreacion || new Date().toISOString()
            }))
          setRepositories(ownedRepos)
          console.log('RepositoriesList: Repositorios cargados:', ownedRepos.length)
        } else {
          setRepositories([])
          console.log('RepositoriesList: No se encontraron repositorios')
        }
      } catch (error: any) {
        console.error('Error al cargar repositorios:', error)
        setError(error.message || 'Error al cargar repositorios')
        setRepositories([])
      } finally {
        setLoading(false)
      }
    }
    
    loadRepositories()
  }, [location.pathname])

  const handleRepositoryClick = (repoId: string) => {
    navigate(`/admin/repository/${repoId}`)
  }

  if (loading) {
    return (
      <div className="repositories-list">
        <div className="list-header">
          <h2 className="page-title">Repositorios</h2>
          <p className="page-subtitle">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="repositories-list">
      <div className="list-header">
        <h2 className="page-title">Repositorios</h2>
        <p className="page-subtitle">Gestiona todos tus repositorios</p>
      </div>

      {error && (
        <div className="error-message" style={{ padding: '1rem', backgroundColor: '#fee', color: '#c33', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {repositories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No hay repositorios</h3>
          <p>Crea tu primer repositorio para comenzar</p>
        </div>
      ) : (
        <div className="repositories-grid">
          {repositories.map((repo) => (
            <div
              key={repo.id}
              className="repository-card clickable"
              onClick={() => handleRepositoryClick(repo.id)}
            >
              <div className="card-header">
                <h3>{repo.name}</h3>
                <span className={`connection-badge ${repo.connectionType.toLowerCase()}`}>
                  {repo.connectionType}
                </span>
              </div>
              <div className="card-content">
                <div className="info-row">
                  <span className="info-label">PC:</span>
                  <span className="info-value">{repo.pc}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">IP:</span>
                  <span className="info-value">{repo.ip}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Máscara:</span>
                  <span className="info-value">{repo.mask}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Organización:</span>
                  <span className="info-value">{repo.org}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Creado:</span>
                  <span className="info-value">{new Date(repo.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="card-footer">
                <span className="click-hint">Haz clic para ver detalles y gestionar usuarios</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RepositoriesList

