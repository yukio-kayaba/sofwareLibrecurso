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
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken && savedToken !== 'undefined' && savedToken !== 'null') {
      this.token = savedToken
      console.log('ApiService - Token recuperado del localStorage')
    } else {
      this.token = null
      console.log('ApiService - No hay token guardado')
    }
  }

  setToken(token: string | null) {
    console.log('ApiService - setToken llamado con:', token ? 'Token presente' : 'null')
    this.token = token
    if (token && token !== 'undefined' && token !== 'null') {
      localStorage.setItem('auth_token', token)
      console.log('ApiService - Token guardado en localStorage')
    } else {
      localStorage.removeItem('auth_token')
      console.log('ApiService - Token eliminado del localStorage')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    console.log('API Request:', {
      method: options.method || 'GET',
      url,
      hasToken: !!this.token
    })
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    }

    if (this.token) {
      headers['Authorization'] = `bearer ${this.token}`
      console.log('API Request - Token incluido en headers:', this.token.substring(0, 20) + '...')
    } else {
      console.warn('API Request - NO HAY TOKEN disponible')
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      console.log('API Response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }))
        console.error('API Error Response:', errorData)
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('API Response data:', data)
      return data
    } catch (error: any) {
      console.error('API Error:', error)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:4000')
      }
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
    return this.request<any[]>('/repositorios/', {
      method: 'GET',
    })
  }

  async getMyRepositories() {
    return this.request<any[]>('/repositorios/', {
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
    console.log('Enviando datos al backend:', data)
    return this.request<any>('/repositorios/create', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getRepositoryById(id: number) {
    return this.request<any>(`/repositorios/${id}`, {
      method: 'GET',
    })
  }

  async requestJoinRepository(repositoryId: number, password: string) {
    return this.request<any>('/repositorios/addteam', {
      method: 'POST',
      body: JSON.stringify({ idRepositorio: repositoryId, contra: password }),
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

  async downloadInstaller(repositoryId: number) {
    const url = `${this.baseURL}/installer/${repositoryId}`;
    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al descargar instalador');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `install_repo_${repositoryId}.sh`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download Error:', error);
      throw error;
    }
  }

  async downloadScriptFile(repositoryId: number, fileName: string) {
    const url = `${this.baseURL}/installer/${repositoryId}/${fileName}`;
    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error al descargar ${fileName}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download Error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService(API_BASE_URL)

