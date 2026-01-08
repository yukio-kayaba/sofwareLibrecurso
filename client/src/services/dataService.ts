import { Repository, User, JoinRequest, FileItem, UserPermissions } from '../types'

export interface RepositoryUser {
  userId: string
  repositoryId: string
  enabled: boolean
  permissions: UserPermissions
  joinedAt: string
}

export interface DataStore {
  repositories: Repository[]
  users: User[]
  joinRequests: JoinRequest[]
  repositoryUsers: RepositoryUser[]
  repositoryFiles: { [repositoryId: string]: FileItem[] }
}

const STORAGE_KEY = 'repositorio-gestion-data'

// Datos iniciales de ejemplo
const initialData: DataStore = {
  repositories: [
    {
      id: '1',
      name: 'Repositorio Principal',
      pc: 'servidor01',
      ip: '192.168.1.100',
      connectionType: 'ENPS3',
      mask: '255.255.255.0',
      org: 'Mi Organización',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Repositorio Desarrollo',
      pc: 'servidor02',
      ip: '192.168.1.101',
      connectionType: 'ENPS4',
      mask: '255.255.255.0',
      org: 'Mi Organización',
      createdAt: '2024-01-20'
    }
  ],
  users: [
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      role: 'collaborator',
      joinedAt: '2024-01-10'
    },
    {
      id: '2',
      name: 'María García',
      email: 'maria@example.com',
      role: 'collaborator',
      joinedAt: '2024-01-12'
    },
    {
      id: '3',
      name: 'Carlos López',
      email: 'carlos@example.com',
      role: 'collaborator',
      joinedAt: '2024-01-15'
    }
  ],
  joinRequests: [
    {
      id: '1',
      userId: '1',
      userName: 'Juan Pérez',
      userEmail: 'juan@example.com',
      repositoryId: '1',
      repositoryName: 'Repositorio Principal',
      status: 'approved',
      requestedAt: '2024-01-25'
    },
    {
      id: '2',
      userId: '2',
      userName: 'María García',
      userEmail: 'maria@example.com',
      repositoryId: '1',
      repositoryName: 'Repositorio Principal',
      status: 'approved',
      requestedAt: '2024-01-26'
    },
    {
      id: '3',
      userId: '3',
      userName: 'Carlos López',
      userEmail: 'carlos@example.com',
      repositoryId: '2',
      repositoryName: 'Repositorio Desarrollo',
      status: 'approved',
      requestedAt: '2024-01-27'
    }
  ],
  repositoryUsers: [
    { 
      userId: '1', 
      repositoryId: '1', 
      enabled: true, 
      permissions: { canRead: true, canDownload: true },
      joinedAt: '2024-01-25' 
    },
    { 
      userId: '2', 
      repositoryId: '1', 
      enabled: true, 
      permissions: { canRead: true, canDownload: false },
      joinedAt: '2024-01-26' 
    },
    { 
      userId: '3', 
      repositoryId: '2', 
      enabled: false, 
      permissions: { canRead: false, canDownload: false },
      joinedAt: '2024-01-27' 
    }
  ],
  repositoryFiles: {
    '1': [
      { id: 'f1', name: 'src', type: 'folder', path: '/src', modifiedAt: '2024-01-15', parentId: undefined },
      { id: 'f2', name: 'README.md', type: 'file', path: '/README.md', size: 2048, modifiedAt: '2024-01-15', parentId: undefined },
      { id: 'f3', name: 'package.json', type: 'file', path: '/package.json', size: 1024, modifiedAt: '2024-01-15', parentId: undefined },
      { id: 'f4', name: 'components', type: 'folder', path: '/src/components', modifiedAt: '2024-01-16', parentId: 'f1' },
      { id: 'f5', name: 'App.tsx', type: 'file', path: '/src/App.tsx', size: 1536, modifiedAt: '2024-01-16', parentId: 'f1' },
      { id: 'f6', name: 'Button.tsx', type: 'file', path: '/src/components/Button.tsx', size: 512, modifiedAt: '2024-01-17', parentId: 'f4' },
      { id: 'f7', name: 'utils', type: 'folder', path: '/src/utils', modifiedAt: '2024-01-18', parentId: 'f1' },
      { id: 'f8', name: 'helpers.ts', type: 'file', path: '/src/utils/helpers.ts', size: 768, modifiedAt: '2024-01-18', parentId: 'f7' }
    ],
    '2': [
      { id: 'f9', name: 'docs', type: 'folder', path: '/docs', modifiedAt: '2024-01-20', parentId: undefined },
      { id: 'f10', name: 'index.html', type: 'file', path: '/index.html', size: 1024, modifiedAt: '2024-01-20', parentId: undefined },
      { id: 'f11', name: 'config.json', type: 'file', path: '/config.json', size: 512, modifiedAt: '2024-01-21', parentId: undefined }
    ]
  }
}

// Función para obtener datos del almacenamiento
export const getData = (): DataStore => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error al leer datos:', error)
  }
  // Si no hay datos, inicializar con datos de ejemplo
  saveData(initialData)
  return initialData
}

// Función para guardar datos
export const saveData = (data: DataStore): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error al guardar datos:', error)
  }
}

// Repositorios
export const getRepositories = (): Repository[] => {
  return getData().repositories
}

export const createRepository = (repository: Omit<Repository, 'id' | 'createdAt'>): Repository => {
  const data = getData()
  const newRepository: Repository = {
    ...repository,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0]
  }
  data.repositories.push(newRepository)
  saveData(data)
  return newRepository
}

export const getRepositoryById = (id: string): Repository | undefined => {
  return getData().repositories.find(r => r.id === id)
}

// Usuarios
export const getUsers = (): User[] => {
  return getData().users
}

export const getUserById = (id: string): User | undefined => {
  return getData().users.find(u => u.id === id)
}

// Usuarios de repositorio
export const getRepositoryUsers = (repositoryId: string): (RepositoryUser & { user: User })[] => {
  const data = getData()
  return data.repositoryUsers
    .filter(ru => ru.repositoryId === repositoryId)
    .map(ru => {
      const user = data.users.find(u => u.id === ru.userId)
      if (!user) throw new Error(`Usuario ${ru.userId} no encontrado`)
      return { ...ru, user }
    })
}

export const toggleUserPermission = (repositoryId: string, userId: string, enabled: boolean): void => {
  const data = getData()
  const repoUser = data.repositoryUsers.find(
    ru => ru.repositoryId === repositoryId && ru.userId === userId
  )
  if (repoUser) {
    repoUser.enabled = enabled
    saveData(data)
  }
}

export const updateUserPermissions = (
  repositoryId: string, 
  userId: string, 
  permissions: UserPermissions
): void => {
  const data = getData()
  const repoUser = data.repositoryUsers.find(
    ru => ru.repositoryId === repositoryId && ru.userId === userId
  )
  if (repoUser) {
    repoUser.permissions = permissions
    saveData(data)
  }
}

export const addUserToRepository = (repositoryId: string, userId: string): void => {
  const data = getData()
  const exists = data.repositoryUsers.some(
    ru => ru.repositoryId === repositoryId && ru.userId === userId
  )
  if (!exists) {
    data.repositoryUsers.push({
      userId,
      repositoryId,
      enabled: true,
      permissions: { canRead: true, canDownload: true },
      joinedAt: new Date().toISOString().split('T')[0]
    })
    saveData(data)
  }
}

export const removeUserFromRepository = (repositoryId: string, userId: string): void => {
  const data = getData()
  data.repositoryUsers = data.repositoryUsers.filter(
    ru => !(ru.repositoryId === repositoryId && ru.userId === userId)
  )
  saveData(data)
}

// Solicitudes
export const getJoinRequests = (): JoinRequest[] => {
  return getData().joinRequests
}

export const approveJoinRequest = (requestId: string): void => {
  const data = getData()
  const request = data.joinRequests.find(r => r.id === requestId)
  if (request && request.status === 'pending') {
    request.status = 'approved'
    addUserToRepository(request.repositoryId, request.userId)
    saveData(data)
  }
}

export const rejectJoinRequest = (requestId: string): void => {
  const data = getData()
  const request = data.joinRequests.find(r => r.id === requestId)
  if (request && request.status === 'pending') {
    request.status = 'rejected'
    saveData(data)
  }
}

// Archivos
export const getRepositoryFiles = (repositoryId: string, parentId?: string): FileItem[] => {
  const data = getData()
  const files = data.repositoryFiles[repositoryId] || []
  return files.filter(f => f.parentId === parentId)
}

export const getFileById = (repositoryId: string, fileId: string): FileItem | undefined => {
  const data = getData()
  const files = data.repositoryFiles[repositoryId] || []
  return files.find(f => f.id === fileId)
}

export const getAllRepositoryFiles = (repositoryId: string): FileItem[] => {
  const data = getData()
  return data.repositoryFiles[repositoryId] || []
}

// Permisos de usuario
export const getUserRepositoryPermissions = (
  repositoryId: string, 
  userId: string
): UserPermissions | null => {
  const data = getData()
  const repoUser = data.repositoryUsers.find(
    ru => ru.repositoryId === repositoryId && ru.userId === userId
  )
  if (!repoUser || !repoUser.enabled) {
    return null
  }
  return repoUser.permissions
}

export const getUserJoinedRepositories = (userId: string): (Repository & { permissions: UserPermissions })[] => {
  try {
    const data = getData()
    return data.repositoryUsers
      .filter(ru => ru.userId === userId && ru.enabled)
      .map(ru => {
        const repo = data.repositories.find(r => r.id === ru.repositoryId)
        if (!repo) {
          console.warn(`Repositorio ${ru.repositoryId} no encontrado`)
          return null
        }
        return { ...repo, permissions: ru.permissions }
      })
      .filter((repo): repo is Repository & { permissions: UserPermissions } => repo !== null)
  } catch (error) {
    console.error('Error en getUserJoinedRepositories:', error)
    return []
  }
}

