import React, { FC, useState, useRef, useEffect, useContext } from 'react'
import M from 'materialize-css'
import { AuthContext } from '../store/AuthContext'

export const AuthPage: FC = () => {
  const { login } = useContext(AuthContext)
  const [authData, setAuthData] = useState<{
    fio: string
    avatarUrl: string
  }>({
    fio: '',
    avatarUrl: 'https://place-hold.it/120x120/ff9d00/f5f5f5',
  })
  const selectRed = useRef(null)

  const loginHandler = () => {
    login(
      1,
      authData.fio,
      authData.avatarUrl,
      // @ts-ignore
      selectRed.current!.value,
      ['Матан', 'Высший матан']
    )
  }

  useEffect(() => {
    M.FormSelect.init(selectRed.current!)
  }, [])

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
        <label htmlFor='fio'>ФИО</label>
      </div>
      <div className='input-field'>
        <select ref={selectRed}>
          <option value='anonymous'>Anonymous</option>
          <option value='student'>Student</option>
          <option value='admin'>Admin</option>
        </select>
        <label>Роль</label>
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
