import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { apiService } from '../../services/api'
import './MyRepositories.css'

const MyRepositories = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [repositories, setRepositories] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRepositories = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('MyRepositories: Cargando repositorios...', location.pathname)

        const response = await apiService.getMyRepositories()

        console.log('MyRepositories: Respuesta completa:', response)
        console.log('MyRepositories: Tipo de respuesta:', typeof response)
        console.log('MyRepositories: Status:', response?.status)
        console.log('MyRepositories: Data:', response?.data)
        console.log('MyRepositories: Es array?', Array.isArray(response?.data))
        console.log('MyRepositories: Longitud:', response?.data?.length)

        if (response && response.status === 'success') {
          // Verificar si hay datos y si es un array
          const data = response.data || []

          if (Array.isArray(data) && data.length > 0) {
            console.log('MyRepositories: Mapeando', data.length, 'repositorios...')
            // Mapear los datos del backend al formato esperado por el componente
            const mappedRepos = data.map((repo: any) => {
              console.log('MyRepositories: Mapeando repo:', repo)
              return {
                id: repo.idrepo?.toString() || repo.id?.toString(),
                name: repo.nombrerepo || repo.name || 'Sin nombre',
                descripcion: repo.descripcion || '',
                connectionType: 'Local', // Valor por defecto
                pc: repo.dominio || null,
                ip: repo.ipdata || repo.ip || null,
                org: repo.orgdata || repo.org || null,
                permissions: {
                  // Por defecto, si el usuario puede ver el repositorio, tiene permiso de lectura
                  // Los permisos específicos se pueden obtener después si es necesario
                  canRead: true,
                  canDownload: false // Se puede actualizar cuando se obtengan los permisos reales
                }
              }
            })
            console.log('MyRepositories: Repositorios mapeados:', mappedRepos)
            setRepositories(mappedRepos)
          } else {
            // Array vacío o sin datos
            console.log('MyRepositories: No hay repositorios (array vacío o sin datos)')
            setRepositories([])
          }
        } else {
          // Error en la respuesta
          console.log('MyRepositories: Error en la respuesta. Status:', response?.status)
          setRepositories([])
          const errorMsg = response?.error || response?.message || 'Error al obtener repositorios'
          setError(errorMsg)
        }
      } catch (error: any) {
        console.error('MyRepositories: Error al cargar repositorios:', error)
        console.error('MyRepositories: Stack trace:', error?.stack)
        const errorMessage = error?.message || error?.error || 'Error al cargar repositorios'
        setError(errorMessage)
        setRepositories([])
      } finally {
        setLoading(false)
      }
    }

    loadRepositories()
  }, [location.pathname])

  const handleRepositoryClick = (repoId: string) => {
    navigate(`/repository/${repoId}`)
  }

  if (loading) {
    return (
      <div className="my-repositories">
        <div className="list-header">
          <h2 className="page-title">Mis Repositorios</h2>
          <p className="page-subtitle">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="my-repositories">
      <div className="list-header">
        <h2 className="page-title">Mis Repositorios</h2>
        <p className="page-subtitle">Repositorios a los que estás unido</p>
      </div>

      {error && (
        <div className="error-message" style={{ padding: '1rem', backgroundColor: '#fee', color: '#c33', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

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
                {repo.descripcion && (
                  <div className="info-row">
                    <span className="info-label">Descripción:</span>
                    <span className="info-value">{repo.descripcion}</span>
                  </div>
                )}
                {repo.pc && repo.pc !== 'N/A' && (
                  <div className="info-row">
                    <span className="info-label">Dominio:</span>
                    <span className="info-value">{repo.pc}</span>
                  </div>
                )}
                {repo.ip && repo.ip !== 'N/A' && (
                  <div className="info-row">
                    <span className="info-label">IP:</span>
                    <span className="info-value">{repo.ip}</span>
                  </div>
                )}
                {repo.org && repo.org !== 'N/A' && (
                  <div className="info-row">
                    <span className="info-label">Organización:</span>
                    <span className="info-value">{repo.org}</span>
                  </div>
                )}
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

