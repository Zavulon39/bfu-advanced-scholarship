import React, { FC, useContext, useEffect, useRef } from 'react'
import { StudentHeader } from '../../components/Header'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { RequestContext } from '../../store/RequestContext'
import { AuthContext } from '../../store/AuthContext'
import $api from '../../http'
import { ISubRequest } from '../../types/request'

export const StudentSubRequestDetailPage: FC = () => {
  const params = useParams()
  const { requests, nominations, fetchRequests, extendSubRequests } =
    useContext(RequestContext)
  const request = requests.find(r => r.id === Number(params.id))
  const { id } = useContext(AuthContext)
  const navigate = useNavigate()
  const nominationRef = useRef(null)

  useEffect(() => {
    if (requests.filter(r => r.studentId === id).length === 0)
      navigate('/companies/')
    if (!requests.length) fetchRequests()
  }, [])
  useEffect(() => {
    M.FormSelect.init(nominationRef.current!)
  }, [requests])
  const createClickHandler = async () => {
    try {
      // @ts-ignore
      const n = getSelectValues(nominationRef.current!).join(' | ')

      const resp = await $api.post('/api/requests/create/', {
        learningPlans: [],
        id,
        company_id: request?.companyId,
        nomination: n,
      })

      extendSubRequests(
        request!.id,
        resp.data.requests.map((sr: ISubRequest) => ({
          ...sr,
          createdDate: new Date(sr.createdDate),
        }))
      )

      M.toast({
        html: 'Заявка успешно обновлена!',
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
        <table className='mt-4 striped'>
          <thead>
            <tr>
              <th>Номинация</th>
              <th>Институт</th>
              <th>Направление</th>
              <th>Курс</th>
            </tr>
          </thead>
          <tbody>
            {request?.subRequests.map(sr => {
              return (
                <tr key={sr.id}>
                  <td>{sr.nomination}</td>
                  <td>{sr.institute}</td>
                  <td>{sr.direction}</td>
                  <td>{sr.course}</td>
                  <td>
                    <Link
                      className='btn-floating waves-effect waves-light light-blue darken-1'
                      to={`/requests/${request.id}/${sr.id}/`}
                    >
                      <i className='material-icons'>edit</i>
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <h4 className='mt-4'>Добавить номинацию</h4>
        {/* <div className='input-field' style={{ marginTop: 16 }}>
          <select ref={planRef}>
            {learningPlans.map(p => (
              <option value={p} key={p}>
                {p}
              </option>
            ))}
          </select>
          <label>Учебный план</label>
        </div> */}
        <div className='input-field'>
          <select multiple ref={nominationRef}>
            {nominations
              .filter(
                n =>
                  !!request?.subRequests.filter(sr => sr.nomination !== n)
                    .length
              )
              .map(n => (
                <option value={n} key={n}>
                  {n}
                </option>
              ))}
          </select>
          <label>Номинация</label>
        </div>
        <button
          className='btn light-blue darken-2 waves-effect waves-light'
          onClick={createClickHandler}
        >
          <i className='material-icons left'>save</i>
          Расширить заявку
        </button>
      </div>
    </>
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
