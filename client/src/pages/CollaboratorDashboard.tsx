import { Routes, Route, NavLink } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import CollaboratorProfile from '../components/Collaborator/CollaboratorProfile'
import AvailableRepositories from '../components/Collaborator/AvailableRepositories'
import MyRepositories from '../components/Collaborator/MyRepositories'
import RepositoryExplorer from '../components/Collaborator/RepositoryExplorer'
import './CollaboratorDashboard.css'

const CollaboratorDashboard = () => {
  return (
    <Layout title="Panel de Colaborador" userType="collaborator">
      <div className="collaborator-dashboard">
        <nav className="collaborator-nav">
          <NavLink to="/collaborator" end className="nav-link">
            Mis Repositorios
          </NavLink>
          <NavLink to="/collaborator/available" className="nav-link">
            Repositorios Disponibles
          </NavLink>
          <NavLink to="/collaborator/profile" className="nav-link">
            Mi Perfil
          </NavLink>
        </nav>

        <div className="collaborator-content">
          <Routes>
            <Route path="/" element={<MyRepositories />} />
            <Route path="/available" element={<AvailableRepositories />} />
            <Route path="/repository/:id" element={<RepositoryExplorer />} />
            <Route path="/profile" element={<CollaboratorProfile />} />
          </Routes>
        </div>
      </div>
    </Layout>
  )
}

export default CollaboratorDashboard

