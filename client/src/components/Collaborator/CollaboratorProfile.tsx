import './CollaboratorProfile.css'

const CollaboratorProfile = () => {
  // Datos de ejemplo - en producción vendrían del backend
  const userData = {
    name: 'Juan Pérez',
    email: 'juan@example.com',
    role: 'Colaborador',
    joinedAt: '2024-01-10',
    repositoriesCount: 3
  }

  return (
    <div className="collaborator-profile">
      <h2 className="page-title">Mi Perfil</h2>
      <p className="page-subtitle">Información de tu cuenta</p>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {userData.name.charAt(0)}
          </div>
          <div className="profile-info">
            <h3>{userData.name}</h3>
            <p>{userData.email}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">Rol</span>
            <span className="detail-value">{userData.role}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Fecha de Ingreso</span>
            <span className="detail-value">{new Date(userData.joinedAt).toLocaleDateString()}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Repositorios Activos</span>
            <span className="detail-value">{userData.repositoriesCount}</span>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn-primary">Editar Perfil</button>
        </div>
      </div>
    </div>
  )
}

export default CollaboratorProfile

