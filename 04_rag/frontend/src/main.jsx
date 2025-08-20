import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import FileContextWrapper from '../context-api/FileContext/FileProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FileContextWrapper>
      <App />
    </FileContextWrapper>
  </StrictMode>,
)
