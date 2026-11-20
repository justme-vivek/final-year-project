import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import axios from 'axios'
import attachAuth from './api/authHeader'
import { AuthProvider } from './context/AuthProvider'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Provider } from 'react-redux'
import { store } from './redux/configureStore'
import { config } from './components/wagmi/config'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
attachAuth(axios)
const root = ReactDOM.createRoot(document.getElementById('root'))
const queryClient = new QueryClient()

root.render(
  <Provider store={store}>
    <AuthProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </WagmiProvider>
    </AuthProvider>
  </Provider>
)
