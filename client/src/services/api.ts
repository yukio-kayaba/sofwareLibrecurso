const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export interface ApiResponse<T> {
  status: 'success' | 'fail'
  message?: string
  data?: T
  error?: any
}

class ApiService {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    // Recuperar token del localStorage si existe
    this.token = localStorage.getItem('auth_token')
  }

  setToken(token: string | null) {
    this.token = token
    if (token) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en la petición')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(usuario: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usuario, password }),
    })
  }

  async createAccount(data: {
    nombrecompleto: string
    dni: string
    correo: string
    contra: string
  }) {
    return this.request<{ user: any }>('/auth/create', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Repository endpoints
  async getAllRepositories() {
    return this.request<any[]>('/repos/all', {
      method: 'GET',
    })
  }

  async createRepository(data: {
    nombrerepo: string
    descripcion?: string
    ipdata: string
    portdata: string
    dominio: string
    orgdata: string
    contrarepo: string
  }) {
    return this.request<any>('/repos/create', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getRepositoryById(id: number) {
    return this.request<any>(`/repos/${id}`, {
      method: 'GET',
    })
  }

  async requestJoinRepository(repositoryId: number, password: string) {
    return this.request<any>('/repos/join', {
      method: 'POST',
      body: JSON.stringify({ repositoryId, password }),
    })
  }

  async getRepositoryUsers(repositoryId: number) {
    return this.request<any[]>(`/repos/${repositoryId}/users`, {
      method: 'GET',
    })
  }

  async updateUserPermissions(
    repositoryId: number,
    userId: number,
    permissions: { leer: boolean; escribir: boolean; ejecutar: boolean }
  ) {
    return this.request<any>(`/repos/${repositoryId}/users/${userId}/permissions`, {
      method: 'PUT',
      body: JSON.stringify(permissions),
    })
  }

  async getJoinRequests(repositoryId: number) {
    return this.request<any[]>(`/repos/${repositoryId}/requests`, {
      method: 'GET',
    })
  }

  async approveJoinRequest(repositoryId: number, requestId: number) {
    return this.request<any>(`/repos/${repositoryId}/requests/${requestId}/approve`, {
      method: 'POST',
    })
  }

  async rejectJoinRequest(repositoryId: number, requestId: number) {
    return this.request<any>(`/repos/${repositoryId}/requests/${requestId}/reject`, {
      method: 'POST',
    })
  }
}

export const apiService = new ApiService(API_BASE_URL)

