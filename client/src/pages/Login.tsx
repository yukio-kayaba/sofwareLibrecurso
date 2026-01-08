import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Login.css'

const Login = () => {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  // Datos de registro
  const [registerData, setRegisterData] = useState({
    nombrecompleto: '',
    dni: '',
    correo: '',
    contra: ''
  })

  const { login, isAuthenticated, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()

  // Redirigir cuando el usuario se autentique
  useEffect(() => {
    console.log('Login useEffect - isAuthenticated:', isAuthenticated, 'authLoading:', authLoading)
    if (!authLoading && isAuthenticated) {
      console.log('Redirigiendo a dashboard...')
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, authLoading, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(usuario, password)
      // Esperar un momento para que el estado se actualice
      // Luego verificar si está autenticado y redirigir
      setTimeout(() => {
        const token = localStorage.getItem('auth_token')
        if (token && token !== 'undefined' && token !== 'null') {
          console.log('Token encontrado, redirigiendo...')
          navigate('/', { replace: true })
        } else {
          console.log('No se encontró token válido')
        }
        setIsLoading(false)
      }, 100)
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { apiService } = await import('../services/api')
      const response = await apiService.createAccount(registerData)

      if (response.data) {
        // Después de crear cuenta, hacer login automático
        await login(registerData.correo, registerData.contra)
        navigate('/')
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Gestión de Repositorios</h1>
          <p>{showRegister ? 'Crea tu cuenta' : 'Inicia sesión'}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {!showRegister ? (
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="usuario">Usuario / Email</label>
              <input
                type="text"
                id="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                placeholder="Ingresa tu usuario o email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>

            <p className="register-link">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                className="link-button"
                onClick={() => setShowRegister(true)}
              >
                Regístrate aquí
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="login-form">
            <div className="form-group">
              <label htmlFor="nombrecompleto">Nombre Completo</label>
              <input
                type="text"
                id="nombrecompleto"
                value={registerData.nombrecompleto}
                onChange={(e) => setRegisterData({ ...registerData, nombrecompleto: e.target.value })}
                required
                placeholder="Ingresa tu nombre completo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dni">DNI</label>
              <input
                type="text"
                id="dni"
                value={registerData.dni}
                onChange={(e) => setRegisterData({ ...registerData, dni: e.target.value })}
                required
                placeholder="Ingresa tu DNI"
                maxLength={9}
              />
            </div>

            <div className="form-group">
              <label htmlFor="correo">Correo Electrónico</label>
              <input
                type="email"
                id="correo"
                value={registerData.correo}
                onChange={(e) => setRegisterData({ ...registerData, correo: e.target.value })}
                required
                placeholder="Ingresa tu correo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contra">Contraseña</label>
              <input
                type="password"
                id="contra"
                value={registerData.contra}
                onChange={(e) => setRegisterData({ ...registerData, contra: e.target.value })}
                required
                placeholder="Crea una contraseña"
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>

            <p className="register-link">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                className="link-button"
                onClick={() => setShowRegister(false)}
              >
                Inicia sesión aquí
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login

