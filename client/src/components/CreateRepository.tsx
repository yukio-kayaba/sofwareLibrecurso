import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiService } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './CreateRepository.css'

const CreateRepository = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    nombrerepo: '',
    descripcion: '',
    ipdata: '',
    portdata: '',
    dominio: '',
    orgdata: '',
    contrarepo: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await apiService.createRepository(formData)
      if (response.data) {
        alert('Repositorio creado exitosamente')
        navigate('/')
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear el repositorio')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="create-repository">
      <h2 className="page-title">Crear Nuevo Repositorio</h2>
      <p className="page-subtitle">Como creador, serás el administrador de este repositorio</p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="repository-form">
        <div className="form-group">
          <label htmlFor="nombrerepo">Nombre del Repositorio</label>
          <input
            type="text"
            id="nombrerepo"
            name="nombrerepo"
            value={formData.nombrerepo}
            onChange={handleChange}
            required
            placeholder="Ej: Repositorio Principal"
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción (Opcional)</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción del repositorio"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ipdata">Dirección IP</label>
          <input
            type="text"
            id="ipdata"
            name="ipdata"
            value={formData.ipdata}
            onChange={handleChange}
            required
            placeholder="Ej: 192.168.1.100"
            pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
          />
        </div>

        <div className="form-group">
          <label htmlFor="portdata">Puerto</label>
          <input
            type="text"
            id="portdata"
            name="portdata"
            value={formData.portdata}
            onChange={handleChange}
            required
            placeholder="Ej: 8080"
            maxLength={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="dominio">Dominio</label>
          <input
            type="text"
            id="dominio"
            name="dominio"
            value={formData.dominio}
            onChange={handleChange}
            required
            placeholder="Ej: unamad.org"
          />
        </div>

        <div className="form-group">
          <label htmlFor="orgdata">Organización</label>
          <input
            type="text"
            id="orgdata"
            name="orgdata"
            value={formData.orgdata}
            onChange={handleChange}
            required
            placeholder="Ej: Mi Organización"
          />
        </div>

        <div className="form-group">
          <label htmlFor="contrarepo">Contraseña del Repositorio</label>
          <input
            type="password"
            id="contrarepo"
            name="contrarepo"
            value={formData.contrarepo}
            onChange={handleChange}
            required
            placeholder="Contraseña para acceder al repositorio"
          />
          <small className="form-hint">Los usuarios necesitarán esta contraseña para unirse</small>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Creando...' : 'Crear Repositorio'}
          </button>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => navigate('/')}
            disabled={isLoading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateRepository


