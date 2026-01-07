import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getRepositories } from '../../services/dataService'
import { Repository } from '../../types'
import './RepositoriesList.css'

const RepositoriesList = () => {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Refrescar lista cuando se vuelve a esta página
    setRepositories(getRepositories())
  }, [location.pathname])

  const handleRepositoryClick = (repoId: string) => {
    navigate(`/admin/repository/${repoId}`)
  }

  return (
    <div className="repositories-list">
      <div className="list-header">
        <h2 className="page-title">Repositorios</h2>
        <p className="page-subtitle">Gestiona todos tus repositorios</p>
      </div>

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

