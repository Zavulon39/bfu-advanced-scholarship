import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  const {
    requests,
    fetchRequests,
    addComment,
    setStudentExamPoints,
    setStudentData,
    addRow,
  } = useContext(RequestContext)
  const { fio, avatarUrl } = useContext(AuthContext)
  const request = requests.find(r => r.id === Number(id1))
  const subRequest = requests
    .find(r => r.id === Number(id1))
    ?.subRequests.find(sb => sb.id === Number(id2))
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const _ = useFormater()

  if (request?.studentId !== Number(id1)) navigate('/companies/')

  useEffect(() => {
    if (!requests.length) fetchRequests()
  }, [])
  useEffect(() => {
    M.CharacterCounter.init(messageRef.current!)

    document.querySelectorAll('.tooltipped').forEach(el => {
      const url = el.getAttribute('data-tooltip-img')
      M.Tooltip.init(el, {
        html: `<img src="${url}" class="tooltip-img" />`,
      })
    })
  }, [requests])
  useEffect(() => {
    // @ts-ignore
    pointRef.current!.focus()
  }, [requests.length])

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
  const reqSaveHandler = async () => {
    try {
      // fetch

      const resp = await $api.post('/api/requests/set-student-point/', {
        id: subRequest?.id,
        point: subRequest?.examPoints,
      })

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
  // const reqSendHandler = () => {
  //   try {
  //     // fetch
  //     M.toast({
  //       html: 'Ваша заявка отправлена на рассмотрение!',
  //       classes: 'light-blue darken-1',
  //     })
  //   } catch (e) {
  //     M.toast({
  //       html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
  //       classes: 'red darken-4',
  //     })
  //   }
  // }

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
        <h3 className='mt-4'>Оценки</h3>
        <div>
          <small>Процент "{subRequest?.percent}"</small>
          <input
            type='text'
            value={subRequest?.examPoints}
            onKeyPress={event => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault()
              }
            }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setStudentExamPoints(
                request?.id!,
                subRequest?.id!,
                Number(event.target.value)
              )
            }
          />
          <div className='input-field'>
            <input
              type='text'
              id='point'
              ref={pointRef}
              value={subRequest?.point}
              style={{ maxWidth: 'fit-content' }}
            />
            <label htmlFor='point'>Балл</label>
          </div>
        </div>
        <h3 className='mt-4'>
          Таблицы
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
              <th>Баллы</th>
            </tr>
          </thead>
          <tbody>
            {subRequest?.tables.body.map((r, rIdx) => {
              return (
                <tr key={rIdx}>
                  {r.data.map((b, bIdx) => {
                    try {
                      if (b !== 'Документ') new URL(b)

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
                                  onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    try {
                                      /*
                                        send file to server and get path url from response
                                        then set this url to data
                                      */
                                      setStudentData(
                                        request!.id,
                                        subRequest.id,
                                        rIdx,
                                        bIdx,
                                        'https://купитьшахматы.рф/wa-data/public/shop/products/16/04/416/images/1565/gramota-shahmatnaja-2.970.jpg' // replace with server url
                                      )
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
                  <td>
                    {/* <input
                      type='text'
                      value={r.points}
                      style={{ maxWidth: 'fit-content' }}
                      key={'input' + rIdx}
                    /> */}
                    <strong style={{ fontSize: 18 }}>{r.points}</strong>
                  </td>
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
