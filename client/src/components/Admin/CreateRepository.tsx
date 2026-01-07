import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRepository } from '../../services/dataService'
import './CreateRepository.css'

const CreateRepository = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    pc: '',
    ip: '',
    connectionType: 'ENPS3' as 'ENPS3' | 'ENPS4',
    mask: '',
    org: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newRepo = createRepository(formData)
      alert('Repositorio creado exitosamente')
      // Resetear formulario
      setFormData({
        name: '',
        pc: '',
        ip: '',
        connectionType: 'ENPS3',
        mask: '',
        org: ''
      })
      // Navegar al nuevo repositorio
      navigate(`/admin/repository/${newRepo.id}`)
    } catch (error) {
      alert('Error al crear el repositorio')
      console.error(error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="create-repository">
      <h2 className="page-title">Crear Nuevo Repositorio</h2>
      <p className="page-subtitle">Ingresa las credenciales y configuración del repositorio</p>

      <form onSubmit={handleSubmit} className="repository-form">
        <div className="form-group">
          <label htmlFor="name">Nombre del Repositorio</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ej: Repositorio Principal"
          />
        </div>

        <div className="form-group">
          <label htmlFor="pc">PC / Hostname</label>
          <input
            type="text"
            id="pc"
            name="pc"
            value={formData.pc}
            onChange={handleChange}
            required
            placeholder="Ej: servidor01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ip">Dirección IP</label>
          <input
            type="text"
            id="ip"
            name="ip"
            value={formData.ip}
            onChange={handleChange}
            required
            placeholder="Ej: 192.168.1.100"
            pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
          />
        </div>

        <div className="form-group">
          <label htmlFor="connectionType">Tipo de Conexión</label>
          <select
            id="connectionType"
            name="connectionType"
            value={formData.connectionType}
            onChange={handleChange}
            required
          >
            <option value="ENPS3">ENPS3</option>
            <option value="ENPS4">ENPS4</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="mask">Máscara</label>
          <input
            type="text"
            id="mask"
            name="mask"
            value={formData.mask}
            onChange={handleChange}
            required
            placeholder="Ej: 255.255.255.0"
            pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
          />
        </div>

        <div className="form-group">
          <label htmlFor="org">Organización</label>
          <input
            type="text"
            id="org"
            name="org"
            value={formData.org}
            onChange={handleChange}
            required
            placeholder="Ej: Mi Organización"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Crear Repositorio
          </button>
          <button type="button" className="btn-secondary" onClick={() => setFormData({
            name: '',
            pc: '',
            ip: '',
            connectionType: 'ENPS3',
            mask: '',
            org: ''
          })}>
            Limpiar
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateRepository

