import { useState, useEffect } from 'react'
import { getJoinRequests, approveJoinRequest, rejectJoinRequest } from '../../services/dataService'
import { JoinRequest } from '../../types'
import './JoinRequests.css'

const JoinRequests = () => {
  const [requests, setRequests] = useState<JoinRequest[]>([])

  useEffect(() => {
    setRequests(getJoinRequests())
  }, [])

  const handleApprove = (id: string) => {
    approveJoinRequest(id)
    setRequests(getJoinRequests())
  }

  const handleReject = (id: string) => {
    rejectJoinRequest(id)
    setRequests(getJoinRequests())
  }

  const pendingRequests = requests.filter(req => req.status === 'pending')

  return (
    <div className="join-requests">
      <div className="list-header">
        <h2 className="page-title">Solicitudes de Ingreso</h2>
        <p className="page-subtitle">Gestiona las solicitudes de usuarios que quieren unirse a repositorios</p>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h3>No hay solicitudes pendientes</h3>
          <p>Todas las solicitudes han sido procesadas</p>
        </div>
      ) : (
        <div className="requests-grid">
          {pendingRequests.map((request) => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <div className="request-user">
                  <div className="user-avatar">{request.userName.charAt(0)}</div>
                  <div>
                    <h3>{request.userName}</h3>
                    <p>{request.userEmail}</p>
                  </div>
                </div>
                <span className="status-badge pending">Pendiente</span>
              </div>
              
              <div className="request-content">
                <div className="request-info">
                  <span className="info-label">Solicita acceso a:</span>
                  <span className="info-value">{request.repositoryName}</span>
                </div>
                <div className="request-info">
                  <span className="info-label">Fecha de solicitud:</span>
                  <span className="info-value">{new Date(request.requestedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="request-actions">
                <button 
                  className="btn-approve"
                  onClick={() => handleApprove(request.id)}
                >
                  Aprobar
                </button>
                <button 
                  className="btn-reject"
                  onClick={() => handleReject(request.id)}
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {requests.filter(req => req.status !== 'pending').length > 0 && (
        <div className="processed-requests">
          <h3 className="section-title">Solicitudes Procesadas</h3>
          <div className="requests-grid">
            {requests.filter(req => req.status !== 'pending').map((request) => (
              <div key={request.id} className="request-card processed">
                <div className="request-header">
                  <div className="request-user">
                    <div className="user-avatar">{request.userName.charAt(0)}</div>
                    <div>
                      <h3>{request.userName}</h3>
                      <p>{request.userEmail}</p>
                    </div>
                  </div>
                  <span className={`status-badge ${request.status}`}>
                    {request.status === 'approved' ? 'Aprobada' : 'Rechazada'}
                  </span>
                </div>
                <div className="request-content">
                  <div className="request-info">
                    <span className="info-label">Repositorio:</span>
                    <span className="info-value">{request.repositoryName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default JoinRequests

