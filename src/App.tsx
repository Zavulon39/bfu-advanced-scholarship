import React, { useContext, useEffect } from 'react'
import { useRouter } from './hooks/useRouter'
import { AuthContext } from './store/AuthContext'
import $api from './http'

function App() {
  const { login } = useContext(AuthContext)

  useEffect(() => {
    if (!!localStorage.getItem('access') && !!localStorage.getItem('id')) {
      if (localStorage.getItem('role') === 'student') {
        $api
          .post('/api/auth/student/detail/', {
            id: Number(localStorage.getItem('id')),
          })
          .then(resp => {
            login(
              resp.data['id'],
              resp.data['fio'],
              resp.data['avatarUrl'],
              'student',
              resp.data['learningPlans']
            )
          })
      } else if (localStorage.getItem('role') === 'admin') {
        $api
          .post('/api/auth/admin/detail/', {
            id: Number(localStorage.getItem('id')),
          })
          .then(resp => {
            login(
              resp.data['id'],
              resp.data['fio'],
              resp.data['avatarUrl'],
              'admin',
              []
            )
          })
      }
    }
  }, [])

  const routes = useRouter()

  return <>{routes}</>
}

export default App
