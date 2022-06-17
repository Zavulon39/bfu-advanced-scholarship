import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { StudentHeader } from '../../components/Header'
import { RequestContext } from '../../store/RequestContext'
import { AuthContext } from '../../store/AuthContext'
import M from 'materialize-css'
import { useFormater } from '../../hooks/useFormater'
import $api from '../../http'
import { Loader } from '../../components/Loader'

export const StudentRequestDetailPage: FC = () => {
  const { id1, id2 } = useParams()
  const pointRef = useRef(null)
  const messageRef = useRef(null)
  const {
    requests,
    tables,

    fetchRequests,
    addComment,
    setStudentData,
    addRow,
    setLinkToGradebook,
    setStatus,
    removeRow,
  } = useContext(RequestContext)
  const { fio, avatarUrl, role, id } = useContext(AuthContext)
  const request = requests.find(r => r.id === Number(id1))
  const subRequest = requests
    .find(r => r.id === Number(id1))
    ?.subRequests.find(sb => sb.id === Number(id2))
  const [message, setMessage] = useState('')
  const _ = useFormater()
  const navigate = useNavigate()
  const dict = tables.find(t => t.name === subRequest?.nomination)?.progress!

  useEffect(() => {
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
    document.querySelectorAll('.tooltipped.img').forEach(el => {
      const url = el.getAttribute('data-tooltip-img')
      M.Tooltip.init(el, {
        html: `<img src="${url}" class="tooltip-img" />`,
      })
    })

    const tooltippedElems = document.querySelectorAll('.tooltipped.link')!
    M.Tooltip.init(tooltippedElems)

    const selectElems = document.querySelectorAll('select')
    M.FormSelect.init(selectElems)
  }, [requests])

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
      if (message.trim().length === 0)
        return M.toast({
          html: `<span>Что-то пошло не так: <b>Комментрий не должен быть пустым!</b></span>`,
          classes: 'red darken-4',
        })

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
        html: 'Вы успешно оставили комментарий!',
        classes: 'light-blue darken-1',
      })
    } catch (e) {
      // M.toast({
      //   html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
      //   classes: 'red darken-4',
      // })
    }
  }
  const reqSaveHandler = async () => {
    try {
      // fetch

      for (const body of subRequest?.tables.body!) {
        if (body.data[0].trim() === '')
          return M.toast({
            html: `<span>Название не должно быть пустым!</span>`,
            classes: 'red darken-4',
          })
        // if (body.data[7].trim() === 'Документ')
        //   return M.toast({
        //     html: `<span>Документ должен быть прикреплён!</span>`,
        //     classes: 'red darken-4',
        //   })
      }
      // if (
      //   subRequest?.nomination === 'Учебная деятельность' &&
      //   subRequest.linkToGradebook.trim() === ''
      // ) {
      //   return M.toast({
      //     html: `<span>Зачётный документ должен быть прикреплён!</span>`,
      //     classes: 'red darken-4',
      //   })
      // }

      await $api.post('/api/requests/set-student-point/', {
        id: subRequest?.id,
      })

      await $api.post('/api/requests/save/', {
        id: subRequest?.id,
        data: subRequest?.tables.body,
      })

      if (subRequest?.nomination === 'Учебная деятельность') {
        await $api.post('/api/requests/learning/save/', {
          id: subRequest?.id,
          linkToGradebook: subRequest.linkToGradebook,
          percent: subRequest.percent,
          point: subRequest.point,
        })
      }

      M.toast({
        html: 'Вы успешно сохранили изменения!',
        classes: 'light-blue darken-1',
      })
    } catch (e) {
      // M.toast({
      //   html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
      //   classes: 'red darken-4',
      // })
    }
  }
  const reqSendHandler = async () => {
    try {
      for (const body of subRequest?.tables.body!) {
        if (body.data[0].trim() === '')
          return M.toast({
            html: `<span>Название не должно быть пустым!</span>`,
            classes: 'red darken-4',
          })

        // if (body.data[7].trim() === 'Документ')
        //   return M.toast({
        //     html: `<span>Документ должен быть прикреплён!</span>`,
        //     classes: 'red darken-4',
        //   })
      }

      setStatus(request!.id, subRequest!.id, 'На рассмотрении')
      addComment(
        request?.id!,
        subRequest?.id!,
        fio,
        avatarUrl,
        'Статус изменён на "На рассмотрении"',
        role,
        id
      )

      M.toast({
        html: 'Ваша заявка отправлена на рассмотрение!',
        classes: 'light-blue darken-1',
      })
    } catch (e) {
      // M.toast({
      //   html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
      //   classes: 'red darken-4',
      // })
    }
  }

  if (!requests.length) {
    return <Loader header={<StudentHeader />} />
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
              <th>Учебный план</th>
              <th>Статус</th>
              <th>Дата создания</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{request?.company}</td>
              <td>{subRequest?.nomination}</td>
              <td>{subRequest?.learningPlan}</td>
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
        {subRequest?.nomination === 'Учебная деятельность' ? (
          <>
            <h3 className='mt-4'>Оценки</h3>
            <div>
              {/* <small>Процент "{subRequest?.percent}"</small>
              <br /> */}
              {/* <small>Балл: "{subRequest?.point}"</small> */}
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
                        if (
                          !(
                            subRequest?.status === 'Черновик' ||
                            subRequest?.status === 'Отправлено на доработку'
                          )
                        ) {
                          return
                        }

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
                        // M.toast({
                        //   html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
                        //   classes: 'red darken-4',
                        // })
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
                  className='tooltipped img'
                  data-position='top'
                  data-tooltip-img={subRequest.linkToGradebook}
                  href={
                    subRequest.linkToGradebook === 'Документ'
                      ? 'javascript:void(0)'
                      : subRequest.linkToGradebook
                  }
                  style={{ width: 'fit-content' }}
                >
                  Текущий документ
                </a>
              </div>
              <small>
                * прикрепите копию зачетной книжки или справку об успеваемости
              </small>
            </div>
          </>
        ) : null}
        <h3 className='mt-4'>
          Достижения
          {subRequest?.status === 'Черновик' ||
          subRequest?.status === 'Отправлено на доработку' ? (
            <a
              className='waves-effect waves-light btn light-blue darken-1'
              style={{ float: 'right' }}
              onClick={() => addRow(request?.id!, subRequest!.id)}
            >
              <i className='material-icons left'>add</i>Добавить достижение
            </a>
          ) : null}
        </h3>
        <table className='responsive-table'>
          <thead>
            <tr>
              {subRequest?.status === 'Черновик' ||
              subRequest?.status === 'Отправлено на доработку' ? (
                <th>#</th>
              ) : null}
              {subRequest?.tables.header.map((h, hIdx) => (
                <th key={hIdx}>{h}</th>
              ))}
              {/* {subRequest?.status === 'Принято' ||
              subRequest?.status === 'Победитель' ? (
                <th>Баллы</th>
              ) : null} */}
            </tr>
          </thead>
          <tbody>
            {subRequest?.tables.body.map((r, rIdx) => {
              return (
                <tr key={rIdx}>
                  {subRequest?.status === 'Черновик' ||
                  subRequest?.status === 'Отправлено на доработку' ? (
                    <td>
                      {/* <a
                        className='btn-floating btn-large waves-effect waves-light red darken-3 btn-small tooltipped link'
                        data-position='top'
                        data-tooltip='Вы не сможете восстановить это достижение!'
                        onClick={() =>
                          removeRow(request!.id, subRequest!.id, r.id)
                        }
                      >
                        <i className='material-icons'>close</i>
                      </a> */}
                      {rIdx + 1}
                    </td>
                  ) : null}

                  {r.data.map((b, bIdx) => {
                    try {
                      if (!(bIdx === 7)) throw Error()

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

                                      if (
                                        event.target.files![0].size > 10485760
                                      ) {
                                        M.toast({
                                          html: `<span>Файл должен быть до 10 МБ!</span>`,
                                          classes: 'red darken-4',
                                        })

                                        return
                                      }

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
                                        .querySelectorAll('.tooltipped.img')
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
                                  value={
                                    b
                                      ? b.split('/')[b.split('/').length - 1]
                                      : ''
                                  }
                                />
                              </div>
                            </div>
                            <a
                              href={b === 'Документ' ? 'javascript:void(0)' : b}
                              className='tooltipped img'
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
                      if (bIdx === 1) {
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
                                setStudentData(
                                  request!.id,
                                  subRequest.id,
                                  rIdx,
                                  bIdx + 1,
                                  dict.find(p => p.name === event.target.value)
                                    ?.viewprogress[0].name!
                                )
                              }}
                            >
                              {dict.map(p => (
                                <option
                                  value={p.name}
                                  selected={p.name === b}
                                  key={p.name}
                                >
                                  {p.name}
                                </option>
                              ))}
                            </select>
                          </td>
                        )
                      } else if (bIdx === 2) {
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
                                setStudentData(
                                  request!.id,
                                  subRequest.id,
                                  rIdx,
                                  bIdx + 1,
                                  dict
                                    .find(
                                      p =>
                                        p.name ===
                                        subRequest.tables.body[rIdx].data[1]
                                    )
                                    ?.viewprogress.find(
                                      v => v.name === event.target.value
                                    )?.statusprogress[0].name!
                                )
                              }}
                            >
                              {dict
                                .find(
                                  p =>
                                    p.name ===
                                    subRequest.tables.body[rIdx].data[1]
                                )
                                ?.viewprogress.map(v => (
                                  <option
                                    value={v.name}
                                    selected={v.name === b}
                                    key={v.name}
                                  >
                                    {v.name}
                                  </option>
                                ))}
                            </select>
                          </td>
                        )
                      } else if (bIdx === 3) {
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
                                setStudentData(
                                  request!.id,
                                  subRequest.id,
                                  rIdx,
                                  bIdx + 1,
                                  dict
                                    .find(
                                      p =>
                                        p.name ===
                                        subRequest.tables.body[rIdx].data[1]
                                    )
                                    ?.viewprogress.find(
                                      v =>
                                        v.name ===
                                        subRequest.tables.body[rIdx].data[2]
                                    )
                                    ?.statusprogress.find(
                                      s => s.name === event.target.value
                                    )?.levelprogress[0]!
                                )
                              }}
                            >
                              {dict
                                .find(
                                  p =>
                                    p.name ===
                                    subRequest.tables.body[rIdx].data[1]
                                )
                                ?.viewprogress.find(
                                  v =>
                                    v.name ===
                                    subRequest.tables.body[rIdx].data[2]
                                )
                                ?.statusprogress.map(s => (
                                  <option
                                    value={s.name}
                                    selected={s.name === b}
                                    key={s.name}
                                  >
                                    {s.name}
                                  </option>
                                ))}
                            </select>
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
                              {dict
                                .find(
                                  p =>
                                    p.name ===
                                    subRequest.tables.body[rIdx].data[1]
                                )
                                ?.viewprogress.find(
                                  v =>
                                    v.name ===
                                    subRequest.tables.body[rIdx].data[2]
                                )
                                ?.statusprogress.find(
                                  s =>
                                    s.name ===
                                    subRequest.tables.body[rIdx].data[3]
                                )
                                ?.levelprogress.map(l => (
                                  <option value={l} selected={l === b} key={l}>
                                    {l}
                                  </option>
                                ))}
                            </select>
                          </td>
                        )
                      } else if (bIdx === 5) {
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
                      }

                      return (
                        <td key={bIdx}>
                          <input
                            type='text'
                            style={{ maxWidth: 'max-content' }}
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
                  {/* {subRequest?.status === 'Принято' ||
                  subRequest?.status === 'Победитель' ? (
                    <td>{r.points}</td>
                  ) : null} */}
                </tr>
              )
            })}
          </tbody>
        </table>

        {subRequest?.status === 'Черновик' ||
        subRequest?.status === 'Отправлено на доработку' ? (
          <div
            style={{
              float: 'right',
              display: 'flex',
              flexDirection: 'column',
              marginTop: 36,
            }}
          >
            <div className='btn-container'>
              <button
                className='btn light-blue darken-2 waves-effect waves-light'
                onClick={reqSaveHandler}
              >
                <i className='material-icons left'>save</i>
                Сохранить изменения
              </button>
              <button
                className='btn light-blue darken-2 waves-effect waves-light'
                style={{ marginLeft: 12 }}
                onClick={reqSendHandler}
              >
                <i className='material-icons left'>send</i>
                Отправить изменения
              </button>
            </div>
            <small>* сохраните изменения перед отправкой</small>
          </div>
        ) : null}
        <h3 style={{ marginTop: 80 }}>Комментарии</h3>
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
          Отправить комментарий
        </button>
      </div>
      <div style={{ height: 100 }}></div>
    </>
  )
}
