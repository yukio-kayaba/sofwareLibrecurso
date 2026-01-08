import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiService } from '../../services/api'
import './RepositoryDetail.css'

const RepositoryDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [repository, setRepository] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadRepository = async () => {
      if (id) {
        try {
          setLoading(true)
          setError(null)
          const response = await apiService.getRepositoryById(Number(id))
          
          if (response.status === 'success' && response.data) {
            // response.data puede ser un array, tomar el primer elemento
            const repoData = Array.isArray(response.data) ? response.data[0] : response.data
            setRepository(repoData)
          } else {
            setError('No se pudo cargar la información del repositorio')
          }
        } catch (error: any) {
          console.error('Error al cargar repositorio:', error)
          setError(error?.message || 'Error al cargar el repositorio')
        } finally {
          setLoading(false)
        }
      }
    }

    loadRepository()
  }, [id])

  const handleDownloadInstaller = async () => {
    if (id) {
      try {
        await apiService.downloadInstaller(Number(id));
      } catch (error) {
        alert('Error al descargar instalador');
        console.error(error);
      }
    }
  }

  const handleDownloadFile = async (fileName: string) => {
    if (id) {
      try {
        await apiService.downloadScriptFile(Number(id), fileName);
      } catch (error) {
        alert(`Error al descargar ${fileName}`);
        console.error(error);
      }
    }
  }

  if (loading) {
    return (
      <div className="repository-detail">
        <div className="loading">Cargando información del repositorio...</div>
      </div>
    )
  }

  if (error || !repository) {
    return (
      <div className="repository-detail">
        <div className="error-state">
          <h2>{error || 'Repositorio no encontrado'}</h2>
          <button className="btn-primary" onClick={() => navigate('/')}>
            ← Volver a Mis Repositorios
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="repository-detail">
      <div className="detail-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Volver
        </button>
        <div>
          <h2 className="page-title">{repository.nombrerepo || repository.name || 'Repositorio'}</h2>
          <p className="page-subtitle">Información y archivos del repositorio</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={handleDownloadInstaller}>
            ⬇️ Instalador Completo
          </button>
        </div>
      </div>

      <div className="repository-info-card">
        <h3>Información del Repositorio</h3>
        <div className="info-grid">
          {repository.descripcion && (
            <div className="info-item">
              <span className="info-label">Descripción</span>
              <span className="info-value">{repository.descripcion}</span>
            </div>
          )}
          {repository.dominio && (
            <div className="info-item">
              <span className="info-label">Dominio</span>
              <span className="info-value">{repository.dominio}</span>
            </div>
          )}
          {repository.ipdata && (
            <div className="info-item">
              <span className="info-label">Dirección IP</span>
              <span className="info-value">{repository.ipdata}</span>
            </div>
          )}
          {repository.portdata && (
            <div className="info-item">
              <span className="info-label">Puerto</span>
              <span className="info-value">{repository.portdata}</span>
            </div>
          )}
          {repository.orgdata && (
            <div className="info-item">
              <span className="info-label">Organización</span>
              <span className="info-value">{repository.orgdata}</span>
            </div>
          )}
          {repository.fechacreacion && (
            <div className="info-item">
              <span className="info-label">Fecha de Creación</span>
              <span className="info-value">{new Date(repository.fechacreacion).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      <div className="downloads-section" style={{ marginTop: '20px' }}>
        <div className="section-header">
          <h3>Descargar Archivos de Configuración</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '15px' }}>
          <button 
            className="btn-primary" 
            onClick={() => handleDownloadFile('netplan.sh')}
            style={{ padding: '15px', textAlign: 'center' }}
          >
            ⬇️ Descargar netplan.sh
          </button>
          <button 
            className="btn-primary" 
            onClick={() => handleDownloadFile('lsap.sh')}
            style={{ padding: '15px', textAlign: 'center' }}
          >
            ⬇️ Descargar lsap.sh
          </button>
        </div>
      </div>

      <div className="users-section" style={{ marginTop: '20px', display: 'none' }}>
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
                          {repoUser.user.nombrecompleto && repoUser.user.nombrecompleto.charAt(0)}
                        </div>
                        <span>{repoUser.user.nombrecompleto}</span>
                      </div>
                    </td>
                    <td>{repoUser.user.correo}</td>
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
