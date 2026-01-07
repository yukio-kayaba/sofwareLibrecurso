import { useState, useEffect } from 'react'
import { getUsers } from '../../services/dataService'
import { User } from '../../types'
import './ManageUsers.css'

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    setUsers(getUsers())
  }, [])

  return (
    <div className="manage-users">
      <div className="list-header">
        <h2 className="page-title">Gestionar Usuarios</h2>
        <p className="page-subtitle">Administra los colaboradores del sistema</p>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No hay usuarios</h3>
          <p>Los colaboradores aparecerán aquí cuando se unan</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Fecha de Ingreso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="role-badge">{user.role === 'collaborator' ? 'Colaborador' : 'Administrador'}</span>
                  </td>
                  <td>{new Date(user.joinedAt).toLocaleDateString()}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon" title="Editar">✏️</button>
                      <button className="btn-icon btn-danger" title="Eliminar">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ManageUsers

