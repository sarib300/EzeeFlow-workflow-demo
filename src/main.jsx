import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const rootElement = document.getElementById('root')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// ---- Service worker registration (for caching) ----
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('.public/sw.js')
      .catch(() => {
        // silently ignore errors – no crash in production
      })
  })
}