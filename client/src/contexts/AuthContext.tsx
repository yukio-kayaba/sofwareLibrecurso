import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiService } from '../services/api'
import { User } from '../types'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (usuario: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay token guardado
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')

    // Limpiar valores inválidos del localStorage
    if (savedUser === 'undefined' || savedUser === 'null' || savedUser === null) {
      localStorage.removeItem('auth_user')
    }

    if (savedToken && savedToken !== 'undefined' && savedToken !== 'null') {
      setToken(savedToken)
      apiService.setToken(savedToken)

      // Solo parsear si savedUser existe y es válido
      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        try {
          const parsedUser = JSON.parse(savedUser)
          // Verificar que el objeto parseado sea válido
          if (parsedUser && typeof parsedUser === 'object') {
            setUser(parsedUser)
          } else {
            localStorage.removeItem('auth_user')
          }
        } catch (error) {
          console.error('Error al parsear usuario guardado:', error)
          // Si hay error, limpiar el localStorage
          localStorage.removeItem('auth_user')
        }
      }
    } else if (savedToken === 'undefined' || savedToken === 'null') {
      // Limpiar token inválido
      localStorage.removeItem('auth_token')
    }

    setIsLoading(false)
  }, [])

  const login = async (usuario: string, password: string) => {
    try {
      const response = await apiService.login(usuario, password)
      console.log('Respuesta del login:', response)

      if (response.data) {
        // El backend retorna { tokenZ } dentro de data
        const newToken = response.data.token || response.data.tokenZ
        const userData = response.data.user || null

        console.log('Token recibido:', newToken ? 'Sí' : 'No')
        console.log('User data recibido:', userData ? 'Sí' : 'No')

        if (newToken) {
          setToken(newToken)
          apiService.setToken(newToken)
          localStorage.setItem('auth_token', newToken)
          console.log('Token guardado en estado y localStorage')

          // Solo guardar usuario si existe y es válido
          if (userData && typeof userData === 'object') {
            setUser(userData)
            localStorage.setItem('auth_user', JSON.stringify(userData))
          } else {
            // Si no hay datos de usuario, limpiar el localStorage pero mantener el token
            localStorage.removeItem('auth_user')
            setUser(null)
          }

          // Forzar actualización del estado
          console.log('Estado actualizado, isAuthenticated debería ser:', !!newToken)
        } else {
          throw new Error('No se recibió token del servidor')
        }
      } else {
        throw new Error('Respuesta inválida del servidor')
      }
    } catch (error) {
      console.error('Error en login:', error)
      // Limpiar localStorage en caso de error
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    apiService.setToken(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  const isAuthenticated = !!token

  // Debug: Log cuando cambia el estado de autenticación
  useEffect(() => {
    console.log('AuthContext - Token:', token ? 'Presente' : 'Ausente')
    console.log('AuthContext - isAuthenticated:', isAuthenticated)
  }, [token, isAuthenticated])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


