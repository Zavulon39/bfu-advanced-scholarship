import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { AdminHeader } from '../../components/Header'
import { RequestContext } from '../../store/RequestContext'
import M from 'materialize-css'

export const NotificationListPage: FC = () => {
  const { notifications, fetchRequests, removeNotification, addNotification } =
    useContext(RequestContext)
  const [message, setMessage] = useState('')
  const messageRef = useRef(null)

  const sendHandler = () => {
    try {
      addNotification(message)
      setMessage('')

      M.toast({
        html: 'Вы успешно добавили объявление!',
        classes: 'light-blue darken-1',
      })
    } catch (e) {
      // M.toast({
      //   html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
      //   classes: 'red darken-4',
      // })
    }
  }
  const removeHandler = (id: number) => {
    try {
      removeNotification(id)

      M.toast({
        html: 'Вы успешно удалили объявление!',
        classes: 'light-blue darken-1',
      })
    } catch (e) {
      // M.toast({
      //   html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
      //   classes: 'red darken-4',
      // })
    }
  }

  useEffect(() => {
    if (!notifications.length) fetchRequests()
  }, [])

  useEffect(() => {
    M.CharacterCounter.init(messageRef.current!)
  }, [notifications.length])

  return (
    <>
      <AdminHeader />
      <div className='container'>
        <h1>Объявления</h1>
        {notifications.map(n => (
          <div className='toast light-blue darken-1' key={n.id}>
            {n.text}
            <a
              className='btn-floating btn-large waves-effect waves-light red btn-small'
              style={{ float: 'right' }}
              onClick={() => removeHandler(n.id)}
            >
              <i className='material-icons'>delete</i>
            </a>
          </div>
        ))}
        <br />
        <br />
        <br />
        <div className='input-field'>
          <textarea
            id='message'
            className='materialize-textarea mt-4'
            data-length='200'
            value={message}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              if (message.length <= 200) setMessage(event.target.value)
            }}
            ref={messageRef}
          ></textarea>
          <label className='message'>Сообщение</label>
        </div>
        <button
          className='btn light-blue darken-2 waves-effect waves-light'
          style={{ float: 'right' }}
          onClick={sendHandler}
        >
          <i className='material-icons left'>send</i>
          Отправить
        </button>
      </div>
    </>
  )
}
