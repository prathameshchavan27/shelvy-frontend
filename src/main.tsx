import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { WarehouseProvider } from './context/WarehouseContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <WarehouseProvider>
        <App />
      </WarehouseProvider>
    </BrowserRouter>
  </React.StrictMode>
)

