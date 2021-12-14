import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminHeader } from '../../components/Header'
import { RequestContext } from '../../store/RequestContext'
import M from 'materialize-css'

export const AdminRequestListPage: FC = () => {
  const { requests, nominations, statuses, companies, fetchRequests } =
    useContext(RequestContext)

  const [qs, setQs] = useState(requests)
  const [fio, setFio] = useState('')
  const select1 = useRef(null)
  const select2 = useRef(null)
  const select3 = useRef(null)

  useEffect(() => {
    if (!requests.length) fetchRequests()
  }, [])

  useEffect(() => {
    M.FormSelect.init(select1.current!)
    M.FormSelect.init(select2.current!)
    M.FormSelect.init(select3.current!)
    setQs(requests)
  }, [requests.length])

  const findClickHandler = () => {
    setQs(
      requests.filter(r => {
        return r.fio.toLowerCase().indexOf(fio.toLowerCase()) + 1
      })
    )
    setQs(
      requests
        .filter(r => {
          return r.fio.toLowerCase().indexOf(fio.toLowerCase()) + 1
        })
        .map(r => ({
          ...r,
          subRequests: r.subRequests.filter(sr => {
            const company_cond =
              // @ts-ignore
              select1.current.value != -1
                ? // @ts-ignore
                  sr.companyId == select1.current.value!
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

  return (
    <>
      <AdminHeader />
      <div className='container'>
        <h1 className='space-between'>
          Заявки <small>{requests.length} записи(ей)</small>
        </h1>
        <div className='row'>
          <div className='input-field col s3'>
            <input
              id='fio'
              type='text'
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFio(event.target.value)
              }
            />
            <label htmlFor='fio'>ФИО</label>
          </div>
          <div className='col s3 input-field'>
            <select ref={select1}>
              <option value={-1}>Все компании</option>
              {companies.map(c => {
                return (
                  <option value={c.id} key={c.id}>
                    {c.name}
                  </option>
                )
              })}
            </select>
            <label>Кампания</label>
          </div>
          <div className='col s3 input-field'>
            <select ref={select2}>
              <option value={-1}>Все наминации</option>
              {nominations.map(n => {
                return (
                  <option value={n} key={n}>
                    {n}
                  </option>
                )
              })}
            </select>
            <label>Наминация</label>
          </div>
          <div className='col s3 input-field'>
            <select ref={select3}>
              <option value={-1}>Все статусы</option>
              {statuses.map(s => {
                return (
                  <option value={s} key={s}>
                    {s}
                  </option>
                )
              })}
            </select>
            <label>Статус</label>
          </div>
          <button
            className='waves-effect waves-light btn light-blue darken-2'
            style={{ float: 'right' }}
            onClick={findClickHandler}
          >
            <i className='material-icons right'>search</i>Поиск
          </button>
        </div>
        <table className='striped responsive-table'>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Наминация</th>
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
                    <td>{sr.createdDate.toLocaleDateString()}</td>
                    <td>{sr.status}</td>
                  </tr>
                )
              })
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
