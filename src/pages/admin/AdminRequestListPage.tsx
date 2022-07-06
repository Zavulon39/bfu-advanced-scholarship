import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminHeader } from '../../components/Header'
import { RequestContext } from '../../store/RequestContext'
import M from 'materialize-css'
import { useFormater } from '../../hooks/useFormater'
import $api from '../../http'
import { Loader } from '../../components/Loader'

export const AdminRequestListPage: FC = () => {
  const { requests, nominations, statuses, companies, bigBoys, fetchRequests } =
    useContext(RequestContext)

  const [qs, setQs] = useState(requests)
  const [fio, setFio] = useState('')
  const select1 = useRef<HTMLSelectElement | null>(null)
  const select2 = useRef<HTMLSelectElement | null>(null)
  const select3 = useRef<HTMLSelectElement | null>(null)
  const select4 = useRef<HTMLSelectElement | null>(null)

  const nominationRef = useRef(null)
  const companyRef = useRef(null)
  const faceRef = useRef(null)
  const criterionRef = useRef(null)
  const _directions = requests.map(r => r.subRequests.map(sr => sr.direction))
  const directions = new Set()

  for (const list of _directions) {
    for (const d of list) {
      directions.add(d)
    }
  }

  const _ = useFormater()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!requests.length) {
      // @ts-ignore
      fetchRequests().then(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    const elems = document.querySelectorAll('.modal')
    M.Modal.init(elems)
  })
  useEffect(() => {
    const elems = document.querySelectorAll('.modal')
    M.Modal.init(elems)

    M.FormSelect.init(nominationRef.current!)
    M.FormSelect.init(companyRef.current!)
    M.FormSelect.init(faceRef.current!)
    M.FormSelect.init(criterionRef.current!)

    setQs(requests)

    setTimeout(() => {
      const selects = document.querySelectorAll('select')
      M.FormSelect.init(selects)

      findClickHandler()
    }, 100)
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
            const company_cond =
              select1.current!.value !== '-1'
                ? getSelectValues(select1.current!).indexOf(
                    r.companyId.toString()
                  ) + 1
                : true

            const nomination_cond =
              select2.current!.value !== '-1'
                ? getSelectValues(select2.current!).indexOf(sr.nomination) + 1
                : true

            const status_cond =
              select3.current!.value !== '-1'
                ? getSelectValues(select3.current!).indexOf(sr.status) + 1
                : true

            const direction_cond =
              select4.current!.value !== '-1'
                ? getSelectValues(select4.current!).indexOf(sr.direction) + 1
                : true

            return (
              company_cond && nomination_cond && status_cond && direction_cond
            )
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
    // @ts-ignore
    select4.current!.value = -1

    document.cookie =
      encodeURIComponent('companySelect') + '=' + encodeURIComponent(-1)
    document.cookie =
      encodeURIComponent('nominationSelect') + '=' + encodeURIComponent(-1)
    document.cookie =
      encodeURIComponent('statusSelect') + '=' + encodeURIComponent(-1)
    document.cookie =
      encodeURIComponent('directionSelect') + '=' + encodeURIComponent(-1)

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
  const sendCSVFile = async () => {
    const resp = await $api.post('/api/get-csv/', {
      criterions: getSelectValues(criterionRef.current!),
    })

    window.location.replace(resp.data.url)
  }

  if (loading) {
    return <Loader header={<AdminHeader />} />
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
        <div
          className='btn-container'
          style={{ display: 'flex', flexDirection: 'row' }}
        >
          <button
            data-target='csv'
            className='waves-effect waves-light btn light-blue darken-2 modal-trigger'
          >
            <i className='material-icons left'>cloud_download</i>
            Скачать заявки в CSV
          </button>
          <br />
          <button
            data-target='word'
            className='waves-effect waves-light btn light-blue darken-2 modal-trigger'
            style={{ marginLeft: 12 }}
          >
            <i className='material-icons left'>cloud_download</i>
            Скачать заявки в Word
          </button>
        </div>
        <div className='row mt-4'>
          <div className='input-field col s4'>
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
          <div className='col s2 input-field'>
            <select
              ref={select1}
              multiple
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                document.cookie =
                  encodeURIComponent('companySelect') +
                  '=' +
                  encodeURIComponent(getSelectValues(event.target).join(';'))
              }}
            >
              <option
                value={-1}
                selected={
                  getCookie('companySelect') === '-1' ||
                  getCookie('companySelect') === '' ||
                  getCookie('companySelect') === 'undefined'
                }
              >
                Все кампании
              </option>
              {companies.map(c => {
                return (
                  <option
                    value={c.id}
                    key={c.id}
                    selected={
                      !!(
                        getCookie('companySelect')
                          .split(';')
                          .indexOf(c.id.toString()) + 1
                      )
                    }
                  >
                    {c.name}
                  </option>
                )
              })}
            </select>
            <label>Кампания</label>
          </div>
          <div className='col s2 input-field'>
            <select
              ref={select2}
              multiple
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                document.cookie =
                  encodeURIComponent('nominationSelect') +
                  '=' +
                  encodeURIComponent(getSelectValues(event.target).join(';'))
              }}
            >
              <option
                value={-1}
                selected={
                  getCookie('nominationSelect') === '-1' ||
                  getCookie('nominationSelect') === '' ||
                  getCookie('nominationSelect') === 'undefined'
                }
              >
                Все номинации
              </option>
              {nominations.map(n => {
                return (
                  <option
                    value={n}
                    key={n}
                    selected={
                      !!(
                        getCookie('nominationSelect').split(';').indexOf(n) + 1
                      )
                    }
                  >
                    {n}
                  </option>
                )
              })}
            </select>
            <label>Номинация</label>
          </div>
          <div className='col s2 input-field'>
            <select
              ref={select3}
              multiple
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                document.cookie =
                  encodeURIComponent('statusSelect') +
                  '=' +
                  encodeURIComponent(getSelectValues(event.target).join(';'))
              }}
            >
              <option
                value={-1}
                selected={
                  getCookie('statusSelect') === '-1' ||
                  getCookie('statusSelect') === '' ||
                  getCookie('statusSelect') === 'undefined'
                }
              >
                Все статусы
              </option>
              {statuses.map(s => {
                return (
                  <option
                    value={s}
                    key={s}
                    selected={
                      !!(getCookie('statusSelect').split(';').indexOf(s) + 1)
                    }
                  >
                    {s}
                  </option>
                )
              })}
            </select>
            <label>Статус</label>
          </div>
          <div className='col s2 input-field'>
            <select
              ref={select4}
              multiple
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                document.cookie =
                  encodeURIComponent('directionSelect') +
                  '=' +
                  encodeURIComponent(getSelectValues(event.target).join(';'))
              }}
            >
              <option
                value={-1}
                selected={
                  getCookie('directionSelect') === '-1' ||
                  getCookie('directionSelect') === '' ||
                  getCookie('directionSelect') === 'undefined'
                }
              >
                Все направления
              </option>
              {Array.from(directions.values()).map((d: any) => {
                return (
                  <option
                    value={d}
                    key={d}
                    selected={
                      !!(getCookie('directionSelect').split(';').indexOf(d) + 1)
                    }
                  >
                    {d}
                  </option>
                )
              })}
            </select>
            <label>Направление</label>
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
            <i className='material-icons right'>save</i>Скачать
          </button>
        </div>
      </div>

      <div id='csv' className='modal'>
        <div className='modal-content'>
          <h4>Скачать заявки в CSV</h4>
          <div className='input-field'>
            <select ref={criterionRef} multiple>
              <option value='compaing'>Кампания</option>
              <option value='typeMiracle'>Тип повышенной стипендии</option>
              <option value='learningPlan'>План обучения</option>
              <option value='last_status'>Текущий статус</option>
            </select>
            <label>Критерии сортировки</label>
          </div>
          <button
            className='waves-effect waves-light btn light-blue darken-2'
            onClick={sendCSVFile}
          >
            <i className='material-icons right'>save</i>Скачать
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

function getSelectValues(select: HTMLSelectElement) {
  var result = []
  var options = select && select.options
  var opt

  for (var i = 0, iLen = options.length; i < iLen; i++) {
    opt = options[i]

    if (opt.selected) {
      result.push(opt.value || opt.text)
    }
  }
  return result
}
