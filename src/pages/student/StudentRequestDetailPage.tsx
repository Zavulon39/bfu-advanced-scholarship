import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { StudentHeader } from '../../components/Header'
import { RequestContext } from '../../store/RequestContext'
import { AuthContext } from '../../store/AuthContext'
import M from 'materialize-css'

export const StudentRequestDetailPage: FC = () => {
  const { id } = useParams()
  const pointRef = useRef(null)
  const messageRef = useRef(null)
  const {
    requests,
    fetchRequests,
    addComment,
    setStudentExamPoints,
    setStudentData,
  } = useContext(RequestContext)
  const { fio, avatarUrl } = useContext(AuthContext)
  const request = requests.find(r => r.id === Number(id))
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  // if (request?.studentId !== id) navigate('/companies/')

  useEffect(() => {
    if (!requests.length) fetchRequests()
  }, [])
  useEffect(() => {
    // @ts-ignore
    pointRef.current!.focus()
    M.CharacterCounter.init(messageRef.current!)
  }, [requests.length])

  const sendHandler = () => {
    try {
      // fetch
      addComment(request?.id!, fio, avatarUrl, message)
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
      <StudentHeader />
      <div className='container'>
        <h3 className='mt-4'>Информация о заявлении</h3>
        <table>
          <thead>
            <tr>
              <th>Компания</th>
              <th>Наминация</th>
              <th>Статус</th>
              <th>Дата создания</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{request?.company}</td>
              <td>{request?.nomination}</td>
              <td>{request?.status}</td>
              <td>{request?.createdDate.toLocaleDateString()}</td>
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
              <td>{request?.phone}</td>
              <td>{request?.status}</td>
              <td>{request?.institute}</td>
              <td>{request?.direction}</td>
              <td>{request?.educationForm}</td>
              <td>{request?.financingSource}</td>
              <td>{request?.level}</td>
              <td>{request?.course}</td>
            </tr>
          </tbody>
        </table>
        <h3 className='mt-4'>Оценки</h3>
        <div>
          <small>Процент "{request?.percent}"</small>
          <input
            type='text'
            value={request?.examPoints}
            onKeyPress={event => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault()
              }
            }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setStudentExamPoints(request?.id!, Number(event.target.value))
            }
          />
          <div className='input-field'>
            <input
              type='text'
              id='point'
              ref={pointRef}
              value={request?.point}
              style={{ maxWidth: 'fit-content' }}
            />
            <label htmlFor='point'>Балл</label>
          </div>
        </div>
        {request?.tables.map((t, tIdx) => {
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
                                <div className='file-field input-field'>
                                  <div className='waves-effect waves-light btn light-blue darken-1'>
                                    <span>
                                      <i className='material-icons'>
                                        insert_drive_file
                                      </i>
                                    </span>
                                    <input
                                      type='file'
                                      onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        /*
                                          send file to server and get path url from response
                                          then se this url to data
                                        */
                                      }}
                                    />
                                  </div>
                                  <div className='file-path-wrapper'>
                                    <input
                                      className='file-path validate'
                                      style={{ maxWidth: 'fit-content' }}
                                      type='text'
                                    />
                                  </div>
                                </div>
                              </td>
                            )
                          } catch (e) {
                            return (
                              <td key={bIdx}>
                                <input
                                  type='text'
                                  style={{ maxWidth: 'fit-content' }}
                                  value={b}
                                  onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                  ) =>
                                    setStudentData(
                                      request.id,
                                      tIdx,
                                      rIdx,
                                      bIdx,
                                      event.target.value
                                    )
                                  }
                                />
                              </td>
                            )
                          }
                        })}
                        <td>
                          <input
                            type='text'
                            value={r.award}
                            style={{ maxWidth: 'fit-content' }}
                            key={'award' + tIdx}
                          />
                        </td>
                        <td>
                          <input
                            type='text'
                            value={r.points}
                            style={{ maxWidth: 'fit-content' }}
                            key={'input' + tIdx}
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
        <h3 className='mt-4'>Коментарии</h3>
        <div>
          {request?.comments.map((c, idx) => {
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
