import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { StudentHeader } from '../../components/Header'
import { RequestContext } from '../../store/RequestContext'
import { AuthContext } from '../../store/AuthContext'
import M from 'materialize-css'
import { useFormater } from '../../hooks/useFormater'
import $api from '../../http'

export const StudentRequestDetailPage: FC = () => {
  const { id1, id2 } = useParams()
  const pointRef = useRef(null)
  const messageRef = useRef(null)
  const [dict, setDict] = useState({
    dictTypeEvent: [],
    dictTypeWork: [],
    dictRoleStudentToWork: [],
    dictWinnerPlace: [],
  })
  const {
    requests,

    fetchRequests,
    addComment,
    setStudentData,
    addRow,
    setLinkToGradebook,
    setStatus,
  } = useContext(RequestContext)
  const { fio, avatarUrl, role, id } = useContext(AuthContext)
  const request = requests.find(r => r.id === Number(id1))
  const subRequest = requests
    .find(r => r.id === Number(id1))
    ?.subRequests.find(sb => sb.id === Number(id2))
  const [message, setMessage] = useState('')
  const _ = useFormater()
  const navigate = useNavigate()

  useEffect(() => {
    $api
      .post('/api/winner-place/get/', {
        nomination: subRequest?.nomination,
      })
      .then(r => {
        setDict(d => ({
          ...d,
          dictWinnerPlace: r.data,
        }))
      })
    $api
      .post('/api/type-work/get/', {
        nomination: subRequest?.nomination,
      })
      .then(r => {
        setDict(d => ({
          ...d,
          dictTypeWork: r.data,
        }))
      })
    $api
      .post('/api/type-event/get/', {
        nomination: subRequest?.nomination,
      })
      .then(r => {
        setDict(d => ({
          ...d,
          dictTypeEvent: r.data,
        }))
      })
    $api
      .post('/api/student-role/get/', {
        nomination: subRequest?.nomination,
      })
      .then(r => {
        setDict(d => ({
          ...d,
          dictRoleStudentToWork: r.data,
        }))
      })

    if (requests.filter(r => r.studentId === id).length === 0)
      navigate('/companies/')
    if (!requests.length) fetchRequests()
  }, [])
  useEffect(() => {
    // @ts-ignore
    if (pointRef.current) pointRef.current.focus()
    M.CharacterCounter.init(messageRef.current!)
  }, [requests.length])
  useEffect(() => {
    document.querySelectorAll('.tooltipped').forEach(el => {
      const url = el.getAttribute('data-tooltip-img')
      M.Tooltip.init(el, {
        html: `<img src="${url}" class="tooltip-img" />`,
      })
    })

    const elems = document.querySelectorAll('select')
    M.FormSelect.init(elems)
  }, [requests, dict])

  useEffect(() => {
    const elems = document.querySelectorAll('.datepicker')
    M.Datepicker.init(elems, {
      container: document.querySelector('body'),
      format: 'yyyy-mm-dd',
      onSelect(selectedDate: Date) {
        const rIdx = Number(this.el.getAttribute('data-rIdx')!)
        const bIdx = Number(this.el.getAttribute('data-bIdx')!)

        setStudentData(request!.id, subRequest!.id, rIdx, bIdx, _(selectedDate))
      },
    })
  }, [subRequest?.tables.body.length])

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
  const reqSaveHandler = async () => {
    try {
      // fetch

      await $api.post('/api/requests/set-student-point/', {
        id: subRequest?.id,
      })

      await $api.post('/api/requests/save/', {
        id: subRequest?.id,
        data: subRequest?.tables.body,
      })

      if (subRequest?.nomination === 'Учебная') {
        await $api.post('/api/requests/learning/save/', {
          id: subRequest?.id,
          linkToGradebook: subRequest.linkToGradebook,
          percent: subRequest.percent,
          point: subRequest.point,
        })
      }

      setStatus(request!.id, subRequest!.id, 'На проверке')

      M.toast({
        html: 'Вы успешно сохранили изменения!',
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
        <table className='responsive-table'>
          <thead>
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
        <table className='striped responsive-table'>
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
              <br />
              <small>Балл: "{subRequest?.point}"</small>
              <div className='file-field input-field'>
                <div className='waves-effect waves-light btn light-blue darken-1'>
                  <span>
                    <i className='material-icons'>insert_drive_file</i>
                  </span>
                  <input
                    type='file'
                    onChange={async (
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => {
                      try {
                        const fd = new FormData()
                        const file = event.target.files![0]

                        fd.append('image', file, file.name)

                        const resp = await $api.post('/api/set-image/', fd)

                        setLinkToGradebook(
                          request!.id,
                          subRequest.id,
                          resp.data.url
                        )

                        document.querySelectorAll('.tooltipped').forEach(el => {
                          const url = el.getAttribute('data-tooltip-img')
                          M.Tooltip.init(el, {
                            html: `<img src="${url}" class="tooltip-img" />`,
                          })
                        })
                      } catch (e) {
                        M.toast({
                          html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
                          classes: 'red darken-4',
                        })
                      }
                    }}
                  />
                </div>
                <div className='file-path-wrapper'>
                  <input
                    className='file-path validate'
                    style={{ maxWidth: 'fit-content' }}
                    type='text'
                    value={
                      subRequest.linkToGradebook.split('/')[
                        subRequest.linkToGradebook.split('/').length - 1
                      ]
                    }
                  />
                </div>
                <a
                  href={subRequest.linkToGradebook}
                  target='_blank'
                  className='tooltipped'
                  data-position='top'
                  data-tooltip-img={subRequest.linkToGradebook}
                  style={{ width: 'fit-content' }}
                >
                  Текущий документ
                </a>
              </div>
            </div>
          </>
        ) : null}
        <h3 className='mt-4'>
          Достижения
          <a
            className='btn-floating btn-large waves-effect waves-light red btn-small light-blue darken-1'
            style={{ float: 'right' }}
            onClick={() => addRow(request?.id!, subRequest!.id)}
          >
            <i className='material-icons'>add</i>
          </a>
        </h3>
        <table className='responsive-table'>
          <thead>
            <tr>
              {subRequest?.tables.header.map((h, hIdx) => (
                <th key={hIdx}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subRequest?.tables.body.map((r, rIdx) => {
              return (
                <tr key={rIdx}>
                  {r.data.map((b, bIdx) => {
                    try {
                      if (!(bIdx === 6)) throw Error()

                      return (
                        <td key={bIdx}>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            <div className='file-field input-field'>
                              <div className='waves-effect waves-light btn light-blue darken-1'>
                                <span>
                                  <i className='material-icons'>
                                    insert_drive_file
                                  </i>
                                </span>
                                <input
                                  type='file'
                                  onChange={async (
                                    event: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    try {
                                      /*
                                        send file to server and get path url from response
                                        then set this url to data
                                      */

                                      const fd = new FormData()
                                      const file = event.target.files![0]

                                      fd.append('image', file, file.name)

                                      const resp = await $api.post(
                                        '/api/set-image/',
                                        fd
                                      )

                                      setStudentData(
                                        request!.id,
                                        subRequest.id,
                                        rIdx,
                                        bIdx,
                                        resp.data.url
                                      )

                                      document
                                        .querySelectorAll('.tooltipped')
                                        .forEach(el => {
                                          const url =
                                            el.getAttribute('data-tooltip-img')
                                          M.Tooltip.init(el, {
                                            html: `<img src="${url}" class="tooltip-img" />`,
                                          })
                                        })
                                    } catch (e) {
                                      M.toast({
                                        html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
                                        classes: 'red darken-4',
                                      })
                                    }
                                  }}
                                />
                              </div>
                              <div className='file-path-wrapper'>
                                <input
                                  className='file-path validate'
                                  style={{ maxWidth: 'fit-content' }}
                                  type='text'
                                  value={b.split('/')[b.split('/').length - 1]}
                                />
                              </div>
                            </div>
                            <a
                              href={b}
                              target='_blank'
                              className='tooltipped'
                              data-position='top'
                              data-tooltip-img={b}
                              style={{ width: 'fit-content' }}
                            >
                              Текущий документ
                            </a>
                          </div>
                        </td>
                      )
                    } catch (e) {
                      if (bIdx === 0) {
                        return (
                          <td key={bIdx}>
                            <select
                              onChange={event => {
                                setStudentData(
                                  request!.id,
                                  subRequest.id,
                                  rIdx,
                                  bIdx,
                                  event.target.value
                                )
                              }}
                            >
                              {dict.dictTypeEvent.map(d => (
                                <option value={d} selected={d === b}>
                                  {d}
                                </option>
                              ))}
                            </select>
                          </td>
                        )
                      } else if (bIdx === 1) {
                        return (
                          <td key={bIdx}>
                            <select
                              onChange={event => {
                                setStudentData(
                                  request!.id,
                                  subRequest.id,
                                  rIdx,
                                  bIdx,
                                  event.target.value
                                )
                              }}
                            >
                              {dict.dictTypeWork.map(d => (
                                <option value={d} selected={d === b}>
                                  {d}
                                </option>
                              ))}
                            </select>
                          </td>
                        )
                      } else if (bIdx === 2) {
                        return (
                          <td>
                            <input
                              type='text'
                              className='datepicker'
                              value={b}
                              data-rIdx={rIdx}
                              data-bIdx={bIdx}
                            ></input>
                          </td>
                        )
                      } else if (bIdx === 4) {
                        return (
                          <td key={bIdx}>
                            <select
                              onChange={event => {
                                setStudentData(
                                  request!.id,
                                  subRequest.id,
                                  rIdx,
                                  bIdx,
                                  event.target.value
                                )
                              }}
                            >
                              {dict.dictWinnerPlace.map(d => (
                                <option value={d} selected={d === b}>
                                  {d}
                                </option>
                              ))}
                            </select>
                          </td>
                        )
                      } else if (bIdx === 5) {
                        return (
                          <td key={bIdx}>
                            <select
                              onChange={event => {
                                setStudentData(
                                  request!.id,
                                  subRequest.id,
                                  rIdx,
                                  bIdx,
                                  event.target.value
                                )
                              }}
                            >
                              {dict.dictRoleStudentToWork.map(d => (
                                <option value={d} selected={d === b}>
                                  {d}
                                </option>
                              ))}
                            </select>
                          </td>
                        )
                      }

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
                                request!.id,
                                subRequest.id,
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
                </tr>
              )
            })}
          </tbody>
        </table>

        <div
          style={{
            float: 'right',
            display: 'flex',
            flexDirection: 'row',
            marginTop: 36,
          }}
        >
          <div className='btn-container'>
            <button
              className='btn light-blue darken-2 waves-effect waves-light'
              onClick={reqSaveHandler}
            >
              <i className='material-icons left'>save</i>
              Сохранить
            </button>
            {/* <button
              className='btn light-blue darken-2 waves-effect waves-light'
              style={{ marginLeft: 12 }}
              onClick={reqSendHandler}
            >
              <i className='material-icons left'>send</i>
              Отправить
            </button> */}
          </div>
        </div>
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
      <div style={{ height: 100 }}></div>
    </>
  )
}
