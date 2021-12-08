import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AdminHeader } from '../../components/Header'
import { RequestContext } from '../../store/RequestContext'
import M from 'materialize-css'
import { AuthContext } from '../../store/AuthContext'

export const AdminRequestDetailPage: FC = () => {
  const { id1, id2 } = useParams()
  const pointRef = useRef(null)
  const messageRef = useRef(null)
  const {
    requests,
    fetchRequests,
    setPoints,
    setExamPoints,
    addComment,
    setAward,
  } = useContext(RequestContext)
  const { fio, avatarUrl } = useContext(AuthContext)
  const request = requests.find(r => r.id === Number(id1))
  const subRequest = requests
    .find(r => r.id === Number(id1))
    ?.subRequests.find(sb => sb.id === Number(id2))
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!requests.length) fetchRequests()
  }, [])
  useEffect(() => {
    // @ts-ignore
    pointRef.current!.focus()
    M.CharacterCounter.init(messageRef.current!)
  }, [requests.length])

  const saveHandler = () => {
    try {
      // fetch
      M.toast({
        html: 'Данные были успешно сохранены!',
        classes: 'light-blue darken-1',
      })
    } catch (e) {
      M.toast({
        html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
        classes: 'red darken-4',
      })
    }
  }
  const sendHandler = () => {
    try {
      // fetch
      addComment(request?.id!, subRequest?.id!, fio, avatarUrl, message)
      setMessage('')
      M.toast({
        html: 'Вы успешно оставили коментарий!',
        classes: 'light-blue darken-1',
      })
    } catch (e) {
      M.toast({
        html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
        classes: 'red darken-4',
      })
    }
  }

  return (
    <>
      <AdminHeader />
      <div className='container'>
        <h3 className='mt-4'>Информация о заявлении</h3>
        <table>
          <thead>
            <tr>
              <th>Кампания</th>
              <th>Наминация</th>
              <th>Статус</th>
              <th>Дата создания</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{request?.company}</td>
              <td>{subRequest?.nomination}</td>
              <td>{subRequest?.status}</td>
              <td>{subRequest?.createdDate.toLocaleDateString()}</td>
            </tr>
          </tbody>
        </table>
        <h3 className='mt-4'>Информация о студенте</h3>
        <table>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Телефон</th>
              <th>Статус</th>
              <th>Институт</th>
              <th>Направление</th>
              <th>Форма обучения</th>
              <th>Источник финансирования</th>
              <th>Уровень</th>
              <th>Курс</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{request?.fio}</td>
              <td>{subRequest?.phone}</td>
              <td>{subRequest?.status}</td>
              <td>{subRequest?.institute}</td>
              <td>{subRequest?.direction}</td>
              <td>{subRequest?.educationForm}</td>
              <td>{subRequest?.financingSource}</td>
              <td>{subRequest?.level}</td>
              <td>{subRequest?.course}</td>
            </tr>
          </tbody>
        </table>
        <h3 className='mt-4'>Оценки</h3>
        <div>
          <small>Процент "{subRequest?.percent}"</small>
          <input type='text' value={subRequest?.examPoints} />
          <div className='input-field'>
            <input
              type='text'
              id='point'
              ref={pointRef}
              value={subRequest?.point}
              onKeyPress={event => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault()
                }
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setExamPoints(
                  request?.id!,
                  subRequest?.id!,
                  Number(event.target.value)
                )
              }
              style={{ maxWidth: 'fit-content' }}
            />
            <label htmlFor='point'>Балл</label>
          </div>
        </div>
        {subRequest?.tables.map((t, tIdx) => {
          return (
            <React.Fragment key={t.id}>
              <h3 className='mt-4'>{t.title}</h3>
              <table>
                <thead>
                  <tr>
                    {t.header.map((h, hIdx) => (
                      <th key={hIdx}>{h}</th>
                    ))}
                    <th>Награда</th>
                    <th>Баллы</th>
                  </tr>
                </thead>
                <tbody>
                  {t.body.map((r, rIdx) => {
                    return (
                      <tr key={rIdx}>
                        {r.data.map((b, bIdx) => {
                          try {
                            new URL(b)
                            return (
                              <td key={bIdx}>
                                <a
                                  className='waves-effect waves-light btn light-blue darken-1'
                                  href={b}
                                  target='_blank'
                                >
                                  <i className='material-icons'>
                                    insert_drive_file
                                  </i>
                                </a>
                              </td>
                            )
                          } catch (e) {
                            return <td key={bIdx}>{b}</td>
                          }
                        })}
                        <td>
                          <input
                            type='text'
                            value={r.award}
                            style={{ maxWidth: 'fit-content' }}
                            key={'award' + tIdx}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              setAward(
                                request!.id,
                                subRequest.id,
                                tIdx,
                                rIdx,
                                event.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type='text'
                            value={r.points}
                            style={{ maxWidth: 'fit-content' }}
                            key={'input' + tIdx}
                            onKeyPress={event => {
                              if (!/[0-9]/.test(event.key)) {
                                event.preventDefault()
                              }
                            }}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              setPoints(
                                request!.id,
                                subRequest.id,
                                tIdx,
                                rIdx,
                                Number(event.target.value)
                              )
                            }
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </React.Fragment>
          )
        })}
        <button
          className='btn light-blue darken-2 waves-effect waves-light'
          style={{ marginTop: 36, float: 'right' }}
          onClick={saveHandler}
        >
          <i className='material-icons left'>save</i>
          Сохранить
        </button>
        <h3 className='mt-4'>Коментарии</h3>
        <div>
          {subRequest?.comments.map((c, idx) => {
            return (
              <div key={idx} className='comment'>
                <div className='avatar'>
                  <img src={c.imageUrl} alt='avatar' />
                  <span>{c.name}</span>
                </div>
                <p>{c.text}</p>
                <small>{c.sendedDate.toLocaleString()}</small>
              </div>
            )
          })}
        </div>
        <div className='input-field'>
          <textarea
            id='message'
            className='materialize-textarea mt-4'
            data-length='1000'
            value={message}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              if (message.length <= 1000) setMessage(event.target.value)
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
      <div style={{ height: 100 }}></div>
    </>
  )
}
