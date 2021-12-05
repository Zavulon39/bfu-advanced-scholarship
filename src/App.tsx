import React from 'react'
import { CompanyProvider } from './store/CompanyContext'
import { useRouter } from './hooks/useRouter'
import { RequestProvider } from './store/RequestContext'
import { AuthProvider } from './store/AuthContext'

function App() {
  const routes = useRouter()

  return (
    <CompanyProvider>
      <RequestProvider>
        <AuthProvider>{routes}</AuthProvider>
      </RequestProvider>
    </CompanyProvider>
  )
}

export default App
