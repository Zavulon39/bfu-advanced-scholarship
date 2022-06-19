import React, { FC, useContext, useState } from 'react'
import { StudentHeader } from '../../components/Header'
import { AuthContext } from '../../store/AuthContext'

export const StudentChangeEmailPage: FC = () => {
  const { email, saveStudentEmail } = useContext(AuthContext)
  const [value, setValue] = useState(email)

  return (
    <>
      <StudentHeader />
      <div className='container'>
        <h1 style={{ marginBottom: 0 }}>Измените Email</h1>
        <small>* на него Вам будут приходить уведомления</small>
        <br />
        <div className='input-field'>
          <input
            placeholder='Введите Email'
            type='email'
            value={value}
            onChange={e => setValue(e.target.value)}
          />
        </div>
        <button
          className='btn light-blue darken-2 waves-effect waves-light'
          style={{ float: 'right' }}
          onClick={() => {
            saveStudentEmail(value)

            M.toast({
              html: 'Вы успешно сохранили Email!',
              classes: 'light-blue darken-1',
            })
          }}
        >
          <i className='material-icons left'>send</i>
          Сохранить
        </button>
      </div>
    </>
  )
}
