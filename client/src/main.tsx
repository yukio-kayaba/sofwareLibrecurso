import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('main.tsx ejecutándose...')
console.log('Root element:', document.getElementById('root'))

try {
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('No se encontró el elemento root')
  }

  const root = ReactDOM.createRoot(rootElement)
  console.log('Root creado, renderizando App...')
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  
  console.log('App renderizado')
} catch (error) {
  console.error('Error al renderizar:', error)
  const rootElement = document.getElementById('root')
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h1>Error al cargar la aplicación</h1>
        <p>${error instanceof Error ? error.message : 'Error desconocido'}</p>
        <pre>${error instanceof Error ? error.stack : ''}</pre>
      </div>
    `
  }
}

