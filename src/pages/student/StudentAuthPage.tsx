import React, { FC, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../store/AuthContext'
import $api from '../../http'

export const StudentAuthPage: FC = () => {
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
      const resp = await $api.post('/api/auth/student/login/', {
        login: authData.fio,
        password: authData.password,
      })

      localStorage.setItem('access', resp.data['access_token'])
      localStorage.setItem('refresh', resp.data['refresh_token'])
      localStorage.setItem('role', 'student')
      localStorage.setItem('id', `${resp.data['id']}`)

      login(
        resp.data['id'],
        resp.data['fio'],
        resp.data['avatarUrl'],
        'student',
        resp.data['learningPlans']
      )
    } catch (e) {
      M.toast({
        html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
        classes: 'red darken-4',
      })
    }
  }

  return (
    <div className='container'>
      <h1>Авторизация</h1>
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
      <small>
        <Link to='/admin/authentication/'>Я администратор</Link>
      </small>
    </div>
  )
}
