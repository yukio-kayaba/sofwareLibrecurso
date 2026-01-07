import { Routes, Route, NavLink } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import CreateRepository from '../components/Admin/CreateRepository'
import ManageUsers from '../components/Admin/ManageUsers'
import JoinRequests from '../components/Admin/JoinRequests'
import RepositoriesList from '../components/Admin/RepositoriesList'
import RepositoryDetail from '../components/Admin/RepositoryDetail'
import './AdminDashboard.css'

const AdminDashboard = () => {
  return (
    <Layout title="Panel de Administración" userType="admin">
      <div className="admin-dashboard">
        <nav className="admin-nav">
          <NavLink to="/admin" end className="nav-link">
            Repositorios
          </NavLink>
          <NavLink to="/admin/create" className="nav-link">
            Crear Repositorio
          </NavLink>
          <NavLink to="/admin/users" className="nav-link">
            Gestionar Usuarios
          </NavLink>
          <NavLink to="/admin/requests" className="nav-link">
            Solicitudes
          </NavLink>
        </nav>

        <div className="admin-content">
          <Routes>
            <Route path="/" element={<RepositoriesList />} />
            <Route path="/repository/:id" element={<RepositoryDetail />} />
            <Route path="/create" element={<CreateRepository />} />
            <Route path="/users" element={<ManageUsers />} />
            <Route path="/requests" element={<JoinRequests />} />
          </Routes>
        </div>
      </div>
    </Layout>
  )
}

export default AdminDashboard

