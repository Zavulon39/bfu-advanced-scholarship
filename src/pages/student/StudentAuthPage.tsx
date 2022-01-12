import React, { FC, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../store/AuthContext'

export const StudentAuthPage: FC = () => {
  const { login } = useContext(AuthContext)
  const [authData, setAuthData] = useState<{
    fio: string
    password: string
  }>({
    fio: '',
    password: '',
  })

  const loginHandler = () => {
    login(
      1,
      authData.fio,
      'https://avatars.mds.yandex.net/get-ott/374297/2a000001616b87458162c9216ccd5144e94d/678x380',
      'student',
      ['Матан', 'Высший матан']
    )
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
