import { useState, useEffect } from 'react'
import { getRepositories } from '../../services/dataService'
import { Repository } from '../../types'
import './AvailableRepositories.css'

const AvailableRepositories = () => {
  const [accessKey, setAccessKey] = useState('')
  const [showKeyInput, setShowKeyInput] = useState<string | null>(null)
  const [availableRepos, setAvailableRepos] = useState<Repository[]>([])

  useEffect(() => {
    setAvailableRepos(getRepositories())
  }, [])

  const handleAccessWithKey = (repoId: string) => {
    if (accessKey.trim()) {
      // Aquí se enviaría la clave al backend para validar
      console.log('Accediendo con clave:', accessKey, 'al repositorio:', repoId)
      alert('Acceso concedido (simulado)')
      setAccessKey('')
      setShowKeyInput(null)
    }
  }

  const handleDirectAccess = (repoId: string) => {
    // Acceso directo si el usuario ya tiene permisos
    console.log('Acceso directo al repositorio:', repoId)
    alert('Accediendo al repositorio (simulado)')
  }

  return (
    <div className="available-repositories">
      <div className="list-header">
        <h2 className="page-title">Repositorios Disponibles</h2>
        <p className="page-subtitle">Accede a los repositorios disponibles o ingresa con una clave</p>
      </div>

      {availableRepos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No hay repositorios disponibles</h3>
          <p>Contacta al administrador para obtener acceso</p>
        </div>
      ) : (
        <div className="repositories-grid">
          {availableRepos.map((repo) => (
            <div key={repo.id} className="repository-card">
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
              </div>
              
              {showKeyInput === repo.id ? (
                <div className="key-input-section">
                  <input
                    type="text"
                    placeholder="Ingresa la clave de acceso"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    className="key-input"
                    autoFocus
                  />
                  <div className="key-actions">
                    <button
                      className="btn-primary"
                      onClick={() => handleAccessWithKey(repo.id)}
                    >
                      Acceder
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => {
                        setShowKeyInput(null)
                        setAccessKey('')
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card-actions">
                  <button
                    className="btn-primary"
                    onClick={() => handleDirectAccess(repo.id)}
                  >
                    Acceder
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => setShowKeyInput(repo.id)}
                  >
                    Ingresar con Clave
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AvailableRepositories

