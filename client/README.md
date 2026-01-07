# Sistema de Gestión de Repositorios

Sistema moderno de gestión de repositorios desarrollado con React, Vite y TypeScript. Permite a administradores gestionar repositorios y usuarios, mientras que los colaboradores pueden acceder a repositorios disponibles.

## 🚀 Características

### Para Administradores
- ✅ Crear nuevos repositorios con credenciales (PC, IP, tipo de conexión ENPS3/ENPS4, máscara, organización)
- ✅ Gestionar usuarios (colaboradores)
- ✅ Ver y gestionar solicitudes de usuarios que quieren unirse a repositorios
- ✅ Ver lista de todos los repositorios creados

### Para Colaboradores
- ✅ Ver perfil personal
- ✅ Ver repositorios disponibles
- ✅ Acceder a repositorios directamente o mediante clave de acceso

## 🛠️ Tecnologías

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router** - Enrutamiento
- **CSS3** - Estilos modernos con paleta azul

## 📦 Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npm run dev
```

3. Abre tu navegador en `http://localhost:5173`

## 🎨 Paleta de Colores

El proyecto utiliza una paleta de colores profesional con azul como color primario:

- **Azul Primario**: `#2563eb`
- **Azul Oscuro**: `#1e40af`
- **Azul Claro**: `#3b82f6`
- **Azul Secundario**: `#60a5fa`
- **Azul Acento**: `#93c5fd`

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── Admin/
│   │   ├── CreateRepository.tsx      # Formulario de creación de repositorio
│   │   ├── ManageUsers.tsx           # Gestión de usuarios
│   │   ├── JoinRequests.tsx          # Solicitudes de ingreso
│   │   └── RepositoriesList.tsx      # Lista de repositorios
│   ├── Collaborator/
│   │   ├── AvailableRepositories.tsx # Repositorios disponibles
│   │   └── CollaboratorProfile.tsx   # Perfil del colaborador
│   └── Layout/
│       └── Layout.tsx                 # Layout principal
├── pages/
│   ├── Login.tsx                      # Página de login
│   ├── AdminDashboard.tsx            # Dashboard del administrador
│   └── CollaboratorDashboard.tsx     # Dashboard del colaborador
├── types/
│   └── index.ts                       # Tipos TypeScript
├── App.tsx                            # Componente principal
└── main.tsx                           # Punto de entrada
```

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## 📝 Notas

- El proyecto está configurado para trabajar con un backend que se está desarrollando por separado
- Los datos mostrados son de ejemplo y se deben reemplazar con llamadas al backend real
- El estado del usuario se persiste en localStorage para mantener la sesión

## 🎯 Próximos Pasos

1. Conectar con el backend cuando esté disponible
2. Implementar autenticación real
3. Agregar validaciones más robustas
4. Implementar manejo de errores
5. Agregar tests

---

Desarrollado con ❤️ usando React + Vite + TypeScript

