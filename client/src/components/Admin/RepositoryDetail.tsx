import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  getRepositoryById, 
  getRepositoryUsers, 
  toggleUserPermission,
  removeUserFromRepository,
  updateUserPermissions
} from '../../services/dataService'
import { Repository, UserPermissions } from '../../types'
import './RepositoryDetail.css'

const RepositoryDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [repository, setRepository] = useState<Repository | null>(null)
  const [repositoryUsers, setRepositoryUsers] = useState<ReturnType<typeof getRepositoryUsers>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const repo = getRepositoryById(id)
      if (repo) {
        setRepository(repo)
        const users = getRepositoryUsers(id)
        setRepositoryUsers(users)
      }
      setLoading(false)
    }
  }, [id])

  const handleTogglePermission = (userId: string, currentEnabled: boolean) => {
    if (id) {
      toggleUserPermission(id, userId, !currentEnabled)
      const users = getRepositoryUsers(id)
      setRepositoryUsers(users)
    }
  }

  const handleToggleReadPermission = (userId: string, currentCanRead: boolean) => {
    if (id) {
      const repoUser = repositoryUsers.find(ru => ru.userId === userId)
      if (repoUser && repoUser.enabled) {
        updateUserPermissions(id, userId, {
          ...repoUser.permissions,
          canRead: !currentCanRead,
          // Si se desactiva lectura, también desactivar descarga
          canDownload: !currentCanRead ? false : repoUser.permissions.canDownload
        })
        const users = getRepositoryUsers(id)
        setRepositoryUsers(users)
      }
    }
  }

  const handleToggleDownloadPermission = (userId: string, currentCanDownload: boolean) => {
    if (id) {
      const repoUser = repositoryUsers.find(ru => ru.userId === userId)
      if (repoUser && repoUser.enabled && repoUser.permissions.canRead) {
        updateUserPermissions(id, userId, {
          ...repoUser.permissions,
          canDownload: !currentCanDownload
        })
        const users = getRepositoryUsers(id)
        setRepositoryUsers(users)
      }
    }
  }

  const handleRemoveUser = (userId: string) => {
    if (id && window.confirm('¿Estás seguro de que quieres eliminar este usuario del repositorio?')) {
      removeUserFromRepository(id, userId)
      const users = getRepositoryUsers(id)
      setRepositoryUsers(users)
    }
  }

  if (loading) {
    return <div className="loading">Cargando...</div>
  }

  if (!repository) {
    return (
      <div className="error-state">
        <h2>Repositorio no encontrado</h2>
        <button className="btn-primary" onClick={() => navigate('/admin')}>
          Volver a Repositorios
        </button>
      </div>
    )
  }

  return (
    <div className="repository-detail">
      <div className="detail-header">
        <button className="back-button" onClick={() => navigate('/admin')}>
          ← Volver
        </button>
        <div>
          <h2 className="page-title">{repository.name}</h2>
          <p className="page-subtitle">Gestiona los usuarios de este repositorio</p>
        </div>
      </div>

      <div className="repository-info-card">
        <h3>Información del Repositorio</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">PC / Hostname</span>
            <span className="info-value">{repository.pc}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Dirección IP</span>
            <span className="info-value">{repository.ip}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Tipo de Conexión</span>
            <span className={`connection-badge ${repository.connectionType.toLowerCase()}`}>
              {repository.connectionType}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Máscara</span>
            <span className="info-value">{repository.mask}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Organización</span>
            <span className="info-value">{repository.org}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Fecha de Creación</span>
            <span className="info-value">{new Date(repository.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="users-section">
        <div className="section-header">
          <h3>Usuarios del Repositorio</h3>
          <span className="user-count">{repositoryUsers.length} usuario{repositoryUsers.length !== 1 ? 's' : ''}</span>
        </div>

        {repositoryUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No hay usuarios en este repositorio</h3>
            <p>Los usuarios aparecerán aquí cuando se unan al repositorio</p>
          </div>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Fecha de Ingreso</th>
                  <th>Estado</th>
                  <th>Permisos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {repositoryUsers.map((repoUser) => (
                  <tr key={repoUser.userId}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-small">
                          {repoUser.user.name.charAt(0)}
                        </div>
                        <span>{repoUser.user.name}</span>
                      </div>
                    </td>
                    <td>{repoUser.user.email}</td>
                    <td>{new Date(repoUser.joinedAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${repoUser.enabled ? 'enabled' : 'disabled'}`}>
                        {repoUser.enabled ? 'Habilitado' : 'Deshabilitado'}
                      </span>
                    </td>
                    <td>
                      <div className="permissions-controls">
                        <label className="permission-toggle">
                          <input
                            type="checkbox"
                            checked={repoUser.permissions.canRead}
                            onChange={() => handleToggleReadPermission(repoUser.userId, repoUser.permissions.canRead)}
                            disabled={!repoUser.enabled}
                          />
                          <span className={`permission-label ${repoUser.permissions.canRead ? 'active' : ''}`}>
                            👁️ Lectura
                          </span>
                        </label>
                        <label className="permission-toggle">
                          <input
                            type="checkbox"
                            checked={repoUser.permissions.canDownload}
                            onChange={() => handleToggleDownloadPermission(repoUser.userId, repoUser.permissions.canDownload)}
                            disabled={!repoUser.enabled || !repoUser.permissions.canRead}
                          />
                          <span className={`permission-label ${repoUser.permissions.canDownload ? 'active' : ''}`}>
                            ⬇️ Descarga
                          </span>
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className={`btn-toggle ${repoUser.enabled ? 'btn-disable' : 'btn-enable'}`}
                          onClick={() => handleTogglePermission(repoUser.userId, repoUser.enabled)}
                          title={repoUser.enabled ? 'Deshabilitar' : 'Habilitar'}
                        >
                          {repoUser.enabled ? '🔒 Deshabilitar' : '🔓 Habilitar'}
                        </button>
                        <button
                          className="btn-remove"
                          onClick={() => handleRemoveUser(repoUser.userId)}
                          title="Eliminar del repositorio"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default RepositoryDetail

