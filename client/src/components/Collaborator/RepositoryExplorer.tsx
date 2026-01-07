import { useState, useEffect } from 'react'
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getRepositoryById,
  getRepositoryFiles,
  getUserRepositoryPermissions,
  getFileById
} from '../../services/dataService'
import { apiService } from '../../services/api'
import { Repository, FileItem } from '../../types'
import './RepositoryExplorer.css'

const RepositoryExplorer = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const currentUserId = '1' // Simulado - en producción vendría del contexto

  const [repository, setRepository] = useState<Repository | null>(null)
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [currentFiles, setCurrentFiles] = useState<FileItem[]>([])
  const [permissions, setPermissions] = useState<{ canRead: boolean; canDownload: boolean } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const repo = getRepositoryById(id)
      if (repo) {
        setRepository(repo)
        const userPerms = getUserRepositoryPermissions(id, currentUserId)
        setPermissions(userPerms)

        if (userPerms && userPerms.canRead) {
          loadFiles(undefined)
        }
      }
      setLoading(false)
    }
  }, [id, currentUserId])

  const handleDownloadInstaller = async () => {
    if (id && permissions?.canDownload) {
      try {
        await apiService.downloadInstaller(Number(id));
      } catch (error) {
        alert('Error al descargar instalador');
        console.error(error);
      }
    } else {
      alert("No tienes permiso para descargar el instalador");
    }
  }

  const loadFiles = (parentId?: string) => {
    if (id) {
      const files = getRepositoryFiles(id, parentId)
      setCurrentFiles(files)
    }
  }

  const handleFolderClick = (folder: FileItem) => {
    if (!permissions?.canRead) {
      alert('No tienes permisos para ver este contenido')
      return
    }
    setCurrentPath([...currentPath, folder.id])
    loadFiles(folder.id)
  }

  const handleFileClick = (file: FileItem) => {
    if (!permissions?.canRead) {
      alert('No tienes permisos para ver este archivo')
      return
    }
    // Mostrar contenido del archivo o información
    alert(`Archivo: ${file.name}\nTamaño: ${formatFileSize(file.size || 0)}\nModificado: ${new Date(file.modifiedAt).toLocaleDateString()}`)
  }

  const handleDownload = (file: FileItem) => {
    if (!permissions?.canDownload) {
      alert('No tienes permisos para descargar este archivo')
      return
    }
    // Simular descarga
    const blob = new Blob([`Contenido simulado de ${file.name}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleBreadcrumbClick = (index: number) => {
    const newPath = currentPath.slice(0, index + 1)
    setCurrentPath(newPath)
    if (newPath.length === 0) {
      loadFiles(undefined)
    } else {
      loadFiles(newPath[newPath.length - 1])
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  if (loading) {
    return <div className="loading">Cargando...</div>
  }

  if (!repository) {
    return (
      <div className="error-state">
        <h2>Repositorio no encontrado</h2>
        <button className="btn-primary" onClick={() => navigate('/collaborator')}>
          Volver
        </button>
      </div>
    )
  }

  if (!permissions || !permissions.canRead) {
    return (
      <div className="error-state">
        <h2>Sin permisos de acceso</h2>
        <p>No tienes permisos para ver este repositorio</p>
        <button className="btn-primary" onClick={() => navigate('/collaborator')}>
          Volver
        </button>
      </div>
    )
  }

  const breadcrumbs = currentPath.map((pathId, index) => {
    const file = getFileById(id!, pathId)
    return { id: pathId, name: file?.name || 'Desconocido', index }
  })

  return (
    <div className="repository-explorer">
      <div className="explorer-header">
        <button className="back-button" onClick={() => navigate('/collaborator')}>
          ← Volver
        </button>
        <div>
          <h2 className="page-title">{repository.nombrerepo}</h2>
          <p className="page-subtitle">Explorador de archivos</p>
        </div>
        {permissions.canDownload && (
          <button className="btn-primary download-installer-btn" style={{ marginLeft: 'auto' }} onClick={handleDownloadInstaller}>
            ⬇️ Descargar Instalador
          </button>
        )}
      </div>

      <div className="explorer-content">
        <div className="breadcrumb">
          <button
            className="breadcrumb-item"
            onClick={() => {
              setCurrentPath([])
              loadFiles(undefined)
            }}
          >
            📁 {repository.nombrerepo}
          </button>
          {breadcrumbs.map((crumb) => (
            <React.Fragment key={crumb.id}>
              <span className="breadcrumb-separator">/</span>
              <button
                className="breadcrumb-item"
                onClick={() => handleBreadcrumbClick(crumb.index)}
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="files-container">
          {currentFiles.length === 0 ? (
            <div className="empty-folder">
              <div className="empty-icon">📁</div>
              <p>Esta carpeta está vacía</p>
            </div>
          ) : (
            <table className="files-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tamaño</th>
                  <th>Modificado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentFiles
                  .sort((a, b) => {
                    // Carpetas primero, luego archivos
                    if (a.type !== b.type) {
                      return a.type === 'folder' ? -1 : 1
                    }
                    return a.name.localeCompare(b.name)
                  })
                  .map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="file-item" onClick={() => item.type === 'folder' ? handleFolderClick(item) : handleFileClick(item)}>
                          <span className="file-icon">
                            {item.type === 'folder' ? '📁' : '📄'}
                          </span>
                          <span className="file-name">{item.name}</span>
                        </div>
                      </td>
                      <td>{item.type === 'file' ? formatFileSize(item.size || 0) : '-'}</td>
                      <td>{new Date(item.modifiedAt).toLocaleDateString()}</td>
                      <td>
                        {item.type === 'file' && (
                          <button
                            className={`btn-download ${permissions.canDownload ? '' : 'disabled'}`}
                            onClick={() => handleDownload(item)}
                            disabled={!permissions.canDownload}
                            title={permissions.canDownload ? 'Descargar' : 'Sin permisos de descarga'}
                          >
                            ⬇️ Descargar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default RepositoryExplorer

