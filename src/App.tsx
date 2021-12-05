import React, { useContext } from 'react'
import { useRouter } from './hooks/useRouter'

function App() {
  const routes = useRouter()

  return <>{routes}</>
}

export default App
