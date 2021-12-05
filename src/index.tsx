import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { CompanyProvider } from './store/CompanyContext'
import { RequestProvider } from './store/RequestContext'
import { AuthProvider } from './store/AuthContext'
import App from './App'

ReactDOM.render(
  <CompanyProvider>
    <RequestProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </RequestProvider>
  </CompanyProvider>,
  document.getElementById('root')
)
