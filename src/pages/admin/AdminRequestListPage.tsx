import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { Link, UNSAFE_LocationContext } from 'react-router-dom'
import { AdminHeader } from '../../components/Header'
import { RequestContext } from '../../store/RequestContext'
import M from 'materialize-css'
import { useFormater } from '../../hooks/useFormater'
import $api from '../../http'

export const AdminRequestListPage: FC = () => {
  const { requests, nominations, statuses, companies, bigBoys, fetchRequests } =
    useContext(RequestContext)

  const [qs, setQs] = useState(requests)
  const [fio, setFio] = useState('')
  const select1 = useRef(null)
  const select2 = useRef(null)
  const select3 = useRef(null)
  const nominationRef = useRef(null)
  const companyRef = useRef(null)
  const faceRef = useRef(null)
  const _ = useFormater()

  useEffect(() => {
    if (!requests.length) fetchRequests()
  }, [])

  useEffect(() => {
    M.FormSelect.init(select1.current!)
    M.FormSelect.init(select2.current!)
    M.FormSelect.init(select3.current!)
    setQs(requests)

    const elems = document.querySelectorAll('.modal')
    M.Modal.init(elems)

    M.FormSelect.init(nominationRef.current!)
    M.FormSelect.init(companyRef.current!)
    M.FormSelect.init(faceRef.current!)

    findClickHandler()
  }, [requests.length])

  const findClickHandler = (clearFio = false) => {
    setQs(
      requests
        .filter(r => {
          if (!clearFio)
            return r.fio.toLowerCase().indexOf(fio.toLowerCase()) + 1
          else return true
        })
        .map(r => ({
          ...r,
          subRequests: r.subRequests.filter(sr => {
            // @ts-ignore

            const company_cond =
              // @ts-ignore
              select1.current.value != -1
                ? // @ts-ignore
                  r.companyId == select1.current.value!
                : true
            const nomination_cond =
              // @ts-ignore
              select2.current.value! != -1
                ? // @ts-ignore
                  sr.nomination == select2.current.value!
                : true
            const status_cond =
              // @ts-ignore
              select3.current.value! != -1
                ? // @ts-ignore
                  sr.status == select3.current.value!
                : true

            return company_cond && nomination_cond && status_cond
          }),
        }))
    )
  }
  const resetClickHanlder = () => {
    // @ts-ignore
    select1.current!.value = -1
    // @ts-ignore
    select2.current!.value = -1
    // @ts-ignore
    select3.current!.value = -1

    document.cookie =
      encodeURIComponent('companySelect') + '=' + encodeURIComponent(-1)
    document.cookie =
      encodeURIComponent('nominationSelect') + '=' + encodeURIComponent(-1)
    document.cookie =
      encodeURIComponent('statusSelect') + '=' + encodeURIComponent(-1)

    M.FormSelect.init(select1.current!)
    M.FormSelect.init(select2.current!)
    M.FormSelect.init(select3.current!)

    setFio('')

    findClickHandler(true)
  }

  const sendWordFile = async () => {
    const resp = await $api.post('/api/statistic/', {
      // @ts-ignore
      compaing_id: companyRef.current!.value,
      // @ts-ignore
      typeMiracle_id: nominationRef.current!.value,
      big_boys: M.FormSelect.getInstance(faceRef.current!).getSelectedValues(),
    })

    window.location.replace(resp.data.url)
  }

  if (!requests.length) {
    return (
      <>
        <AdminHeader />
        <div className='my-center'>
          <div className='preloader-wrapper big active'>
            <div className='spinner-layer spinner-blue-only'>
              <div className='circle-clipper left'>
                <div className='circle'></div>
              </div>
              <div className='gap-patch'>
                <div className='circle'></div>
              </div>
              <div className='circle-clipper right'>
                <div className='circle'></div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <AdminHeader />
      <div className='container'>
        <h1 className='space-between'>
          Заявки
          <small>
            {qs.map(r => r.subRequests.length).reduce((c, p) => c + p, 0)}{' '}
            записи(ей)
          </small>
        </h1>
        <a href='/api/get-csv/'>Скачать заявки в CSV</a>
        <br />
        <a
          href='javascript:void()'
          data-target='word'
          className='modal-trigger'
        >
          Скачать заявки в Word
        </a>
        <div className='row'>
          <div className='input-field col s3'>
            <input
              id='fio'
              type='text'
              value={fio}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFio(event.target.value)
              }
            />
            <label htmlFor='fio'>ФИО</label>
          </div>
          <div className='col s3 input-field'>
            <select
              ref={select1}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                document.cookie =
                  encodeURIComponent('companySelect') +
                  '=' +
                  encodeURIComponent(event.target.value)
              }}
            >
              <option value={-1}>Все кампании</option>
              {companies.map(c => {
                return (
                  <option
                    value={c.id}
                    key={c.id}
                    selected={getCookie('companySelect') === c.id.toString()}
                  >
                    {c.name}
                  </option>
                )
              })}
            </select>
            <label>Кампания</label>
          </div>
          <div className='col s3 input-field'>
            <select
              ref={select2}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                document.cookie =
                  encodeURIComponent('nominationSelect') +
                  '=' +
                  encodeURIComponent(event.target.value)
              }}
            >
              <option value={-1}>Все номинации</option>
              {nominations.map(n => {
                return (
                  <option
                    value={n}
                    key={n}
                    selected={getCookie('nominationSelect') === n}
                  >
                    {n}
                  </option>
                )
              })}
            </select>
            <label>Номинация</label>
          </div>
          <div className='col s3 input-field'>
            <select
              ref={select3}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                document.cookie =
                  encodeURIComponent('statusSelect') +
                  '=' +
                  encodeURIComponent(event.target.value)
              }}
            >
              <option value={-1}>Все статусы</option>
              {statuses.map(s => {
                return (
                  <option
                    value={s}
                    key={s}
                    selected={getCookie('statusSelect') === s}
                  >
                    {s}
                  </option>
                )
              })}
            </select>
            <label>Статус</label>
          </div>

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
                className='waves-effect waves-light btn light-blue darken-2'
                onClick={() => findClickHandler()}
              >
                <i className='material-icons right'>search</i>Поиск
              </button>
              <button
                className='waves-effect waves-light btn red darken-4'
                style={{ marginLeft: 12 }}
                onClick={resetClickHanlder}
              >
                <i className='material-icons right'>block</i>Сбросить
              </button>
            </div>
          </div>
        </div>
        <table className='striped responsive-table'>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Номинация</th>
              <th>Институт</th>
              <th>Направление</th>
              <th>Обучение</th>
              <th>Дата подачи</th>
              <th>Статус</th>
            </tr>
          </thead>

          <tbody>
            {qs.map(r => {
              return r.subRequests.map(sr => {
                return (
                  <tr key={sr.id}>
                    <td>
                      <Link to={`/admin/requests/${r.id}/${sr.id}/`}>
                        {r.fio}
                      </Link>
                    </td>
                    <td>{sr.nomination}</td>
                    <td>{sr.institute}</td>
                    <td>{sr.direction}</td>
                    <td>{sr.educationForm}</td>
                    <td>{_(sr.createdDate)}</td>
                    <td>{sr.status}</td>
                  </tr>
                )
              })
            })}
          </tbody>
        </table>
      </div>

      <div id='word' className='modal'>
        <div className='modal-content'>
          <h4>Скачать заявки в Word</h4>
          <div className='input-field' style={{ marginTop: 16 }}>
            <select ref={companyRef}>
              {companies.map(c => (
                <option value={c.id} key={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <label>Кампания</label>
          </div>
          <div className='input-field'>
            <select ref={nominationRef}>
              {nominations.map(n => (
                <option value={n} key={n}>
                  {n}
                </option>
              ))}
            </select>
            <label>Номинация</label>
          </div>
          <div className='input-field'>
            <select ref={faceRef} multiple>
              {bigBoys.map(n => (
                <option value={n.fio} key={n.id}>
                  {n.fio}
                </option>
              ))}
            </select>
            <label>Должностные лица</label>
          </div>
          <button
            className='waves-effect waves-light btn light-blue darken-2'
            onClick={sendWordFile}
          >
            <i className='material-icons right'>send</i>отправить
          </button>
        </div>
      </div>
    </>
  )
}

function getCookie(name: string): string {
  return decodeURIComponent(
    document.cookie
      .split('; ')
      .find(e => e.split('=')[0] === name)
      ?.split('=')[1]!
  )
}
