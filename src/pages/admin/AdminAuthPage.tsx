import React, { FC, useState, useContext } from 'react'
import { AuthContext } from '../../store/AuthContext'
import $api from '../../http'

export const AdminAuthPage: FC = () => {
  const { login } = useContext(AuthContext)
  const [authData, setAuthData] = useState<{
    fio: string
    password: string
  }>({
    fio: '',
    password: '',
  })

  const loginHandler = async () => {
    try {
      const resp = await $api.post('/api/auth/admin/login/', {
        login: authData.fio,
        password: authData.password,
      })

      localStorage.setItem('access', resp.data['access_token'])
      localStorage.setItem('refresh', resp.data['refresh_token'])
      localStorage.setItem('role', 'admin')
      localStorage.setItem('id', `${resp.data['id']}`)

      login(resp.data['id'], authData.fio, resp.data['avatarUrl'], 'admin', [])
    } catch (e) {
      // M.toast({
      //   html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
      //   classes: 'red darken-4',
      // })
    }
  }

  return (
    <div className='container'>
      <h1>Авторизация администраторов</h1>
      <small style={{ position: 'relative', top: -20, left: 0 }}>
        * студент не сможет попасть в систему по этой форме
      </small>
      <div className='input-field'>
        <input
          id='fio'
          type='text'
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setAuthData(prev => ({
              ...prev,
              fio: event.target.value,
            }))
          }
        />
        <label htmlFor='fio'>Логин</label>
      </div>
      <div className='input-field'>
        <input
          id='fio'
          type='password'
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setAuthData(prev => ({
              ...prev,
              password: event.target.value,
            }))
          }
        />
        <label htmlFor='fio'>Пароль</label>
      </div>
      <button
        className='btn light-blue darken-2 waves-effect waves-light'
        style={{ float: 'right' }}
        onClick={loginHandler}
      >
        <i className='material-icons left'>person</i>
        Войти
      </button>
    </div>
  )
}
