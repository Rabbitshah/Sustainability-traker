import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const enforceLightTheme = () => {
  document.documentElement.classList.remove('dark')
  window.localStorage.setItem('theme', 'light')
}

enforceLightTheme()

const themeObserver = new MutationObserver(() => {
  enforceLightTheme()
})

themeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class'],
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
