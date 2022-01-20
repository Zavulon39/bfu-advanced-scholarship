import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AdminHeader } from '../../components/Header'
import { RequestContext } from '../../store/RequestContext'
import M from 'materialize-css'
import { AuthContext } from '../../store/AuthContext'
import { useFormater } from '../../hooks/useFormater'
import $api from '../../http'

export const AdminRequestDetailPage: FC = () => {
  const { id1, id2 } = useParams()
  const pointRef = useRef(null)
  const messageRef = useRef(null)
  const btnRef = useRef(null)
  const {
    requests,
    fetchRequests,
    setPoints,
    setExamPoints,
    addComment,
    setStatus,
  } = useContext(RequestContext)
  const { fio, avatarUrl, role, id } = useContext(AuthContext)
  const request = requests.find(r => r.id === Number(id1))
  const subRequest = requests
    .find(r => r.id === Number(id1))
    ?.subRequests.find(sb => sb.id === Number(id2))
  const [message, setMessage] = useState('')
  const _ = useFormater()
  const modalRef = useRef(null)

  useEffect(() => {
    M.Modal.init(modalRef.current!)

    if (!requests.length) fetchRequests()
  }, [])
  useEffect(() => {
    // @ts-ignore
    pointRef.current!.focus()
    M.CharacterCounter.init(messageRef.current!)

    document.querySelectorAll('.tooltipped').forEach(el => {
      const url = el.getAttribute('data-tooltip-img')
      M.Tooltip.init(el, {
        html: `<img src="${url}" class="tooltip-img" />`,
      })
    })

    M.FloatingActionButton.init(btnRef.current!, {
      toolbarEnabled: true,
    })
  }, [requests.length])

  const saveHandler = async () => {
    try {
      await $api.post('/api/requests/get/', {
        id: subRequest?.id,
        point: subRequest?.point,
      })
      await $api.post('/api/requests/set-admin-row-point/', {
        id: subRequest?.id,
        data: subRequest?.tables.body.map(b => b.points),
      })

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
      addComment(
        request?.id!,
        subRequest?.id!,
        fio,
        avatarUrl,
        message,
        role,
        id
      )
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
          <thead className='striped'>
            <tr>
              <th>Кампания</th>
              <th>Номинация</th>
              <th>Статус</th>
              <th>Дата создания</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{request?.company}</td>
              <td>{subRequest?.nomination}</td>
              <td>{subRequest?.status}</td>
              <td>{_(subRequest?.createdDate)}</td>
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
        {subRequest?.nomination === 'Учебная' ? (
          <>
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
          </>
        ) : null}

        <h3 className='mt-4'>Достижения</h3>
        <table className='responsive-table'>
          <thead>
            <tr>
              {subRequest?.tables.header.map((h, hIdx) => (
                <th key={hIdx}>{h}</th>
              ))}
              <th>Баллы</th>
            </tr>
          </thead>
          <tbody>
            {subRequest?.tables.body.map((r, rIdx) => {
              return (
                <tr key={rIdx}>
                  {r.data.map((b, bIdx) => {
                    try {
                      if (!(bIdx === 7)) throw Error()

                      return (
                        <td key={bIdx}>
                          <a
                            className='waves-effect waves-light btn light-blue darken-1 tooltipped'
                            href={b}
                            target='_blank'
                            data-position='top'
                            data-tooltip-img={b}
                          >
                            <i className='material-icons'>insert_drive_file</i>
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
                      value={r.points}
                      style={{ maxWidth: 'fit-content' }}
                      key={'input' + rIdx}
                      onKeyPress={event => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault()
                        }
                      }}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setPoints(
                          request!.id,
                          subRequest.id,
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
        <button
          className='btn light-blue darken-2 waves-effect waves-light'
          style={{ marginTop: 36, float: 'right' }}
          onClick={saveHandler}
        >
          <i className='material-icons left'>save</i>
          Сохранить
        </button>
        <h3 className='mt-4'>Комментарии</h3>
        <div>
          {subRequest?.comments.map((c, idx) => {
            return (
              <div key={idx} className='comment'>
                <div className='avatar'>
                  <img src={c.imageUrl} alt='avatar' />
                  <span>{c.name}</span>
                </div>
                <p>{c.text}</p>
                <small>{_(c.sendedDate)}</small>
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
      {!(
        // subRequest?.status === 'Победитель' ||
        // subRequest?.status === 'Принято' ||
        (subRequest?.status === 'Удалено')
      ) ? (
        <div className='fixed-action-btn toolbar' ref={btnRef}>
          <a className='btn-floating btn-large light-blue darken-4 pulse'>
            <i className='large material-icons'>mode_edit</i>
          </a>
          <ul>
            <li>
              <a>
                <button
                  className='waves-effect waves-light yellow darken-2 btn'
                  onClick={async () => {
                    try {
                      await $api.put('/api/requests/get/', {
                        id: subRequest?.id,
                        status: 'Отправленно на доработку',
                      })

                      setStatus(
                        request?.id!,
                        subRequest?.id!,
                        'Отправленно на доработку'
                      )

                      const i = M.Modal.getInstance(modalRef.current!)
                      i.open()

                      M.toast({
                        html: '<span>Вы успешно выставили статус <strong>Отправленно на доработку</strong> !</span>',
                        classes: 'light-blue darken-1',
                      })
                    } catch (e) {
                      M.toast({
                        html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
                        classes: 'red darken-4',
                      })
                    }
                  }}
                >
                  Отправленно на доработку
                </button>
              </a>
            </li>
            <li>
              <a>
                <button
                  className='waves-effect waves-light light-blue darken-3 btn'
                  onClick={async () => {
                    try {
                      await $api.put('/api/requests/get/', {
                        id: subRequest?.id,
                        status: 'Принято',
                      })

                      setStatus(request?.id!, subRequest?.id!, 'Принято')
                      M.toast({
                        html: '<span>Вы успешно выставили статус <strong>Принято</strong> !</span>',
                        classes: 'light-blue darken-1',
                      })
                    } catch (e) {
                      M.toast({
                        html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
                        classes: 'red darken-4',
                      })
                    }
                  }}
                >
                  Принято
                </button>
              </a>
            </li>
            <li>
              <a>
                <button
                  className='waves-effect waves-light teal darken-1 btn'
                  onClick={async () => {
                    try {
                      await $api.put('/api/requests/get/', {
                        id: subRequest?.id,
                        status: 'Победитель',
                      })

                      setStatus(request?.id!, subRequest?.id!, 'Победитель')
                      M.toast({
                        html: '<span>Вы успешно выставили статус <strong>Победитель</strong> !</span>',
                        classes: 'light-blue darken-1',
                      })
                    } catch (e) {
                      M.toast({
                        html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
                        classes: 'red darken-4',
                      })
                    }
                  }}
                >
                  Победитель
                </button>
              </a>
            </li>
          </ul>
        </div>
      ) : null}
      <div style={{ height: 100 }}></div>
      {/* modal */}
      <div ref={modalRef} className='modal'>
        <div className='modal-content'>
          <h4>Оставьте комментарии</h4>
          <div style={{ height: 20 }} />
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
          <div style={{ height: 20 }} />
        </div>
      </div>
    </>
  )
}
