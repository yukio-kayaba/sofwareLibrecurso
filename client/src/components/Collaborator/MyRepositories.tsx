import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserJoinedRepositories } from '../../services/dataService'
import { Repository } from '../../types'
import './MyRepositories.css'

const MyRepositories = () => {
  const navigate = useNavigate()
  // En producción, esto vendría del contexto de autenticación
  const currentUserId = '1' // Simulado
  const [repositories, setRepositories] = useState<ReturnType<typeof getUserJoinedRepositories>>([])

  useEffect(() => {
    try {
      const repos = getUserJoinedRepositories(currentUserId)
      setRepositories(repos)
    } catch (error) {
      console.error('Error al cargar repositorios:', error)
    }
  }, [currentUserId])

  const handleRepositoryClick = (repoId: string) => {
    navigate(`/collaborator/repository/${repoId}`)
  }

  return (
    <div className="my-repositories">
      <div className="list-header">
        <h2 className="page-title">Mis Repositorios</h2>
        <p className="page-subtitle">Repositorios a los que estás unido</p>
      </div>

      {repositories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No estás unido a ningún repositorio</h3>
          <p>Explora los repositorios disponibles o solicita acceso a uno</p>
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
                  <span className="info-label">Organización:</span>
                  <span className="info-value">{repo.org}</span>
                </div>
                <div className="permissions-badge">
                  <span className={`permission ${repo.permissions.canRead ? 'active' : 'inactive'}`}>
                    {repo.permissions.canRead ? '👁️ Lectura' : '🚫 Sin lectura'}
                  </span>
                  <span className={`permission ${repo.permissions.canDownload ? 'active' : 'inactive'}`}>
                    {repo.permissions.canDownload ? '⬇️ Descarga' : '🚫 Sin descarga'}
                  </span>
                </div>
              </div>
              <div className="card-footer">
                <span className="click-hint">Haz clic para explorar archivos</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyRepositories

