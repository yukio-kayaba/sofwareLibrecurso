import { Routes, Route, NavLink } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import MyRepositories from '../components/Collaborator/MyRepositories'
import CreateRepository from '../components/CreateRepository'
import RepositoryDetail from '../components/Admin/RepositoryDetail'
import RepositoryExplorer from '../components/Collaborator/RepositoryExplorer'
import Profile from '../components/Collaborator/CollaboratorProfile'
import './Dashboard.css'

const Dashboard = () => {
  return (
    <Layout>
      <div className="dashboard">
        <nav className="dashboard-nav">
          <NavLink to="/" end className="nav-link">
            Mis Repositorios
          </NavLink>
          <NavLink to="/create" className="nav-link">
            Crear Repositorio
          </NavLink>
          <NavLink to="/profile" className="nav-link">
            Mi Perfil
          </NavLink>
        </nav>

        <div className="dashboard-content">
          <Routes>
            <Route path="/" element={<MyRepositories />} />
            <Route path="/create" element={<CreateRepository />} />
            <Route path="/repository/:id" element={<RepositoryDetail />} />
            <Route path="/repository/:id/explore" element={<RepositoryExplorer />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard


