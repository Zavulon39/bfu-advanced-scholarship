import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { StudentHeader } from '../../components/Header'
import { AuthContext } from '../../store/AuthContext'
import { CompanyContext } from '../../store/CompanyContext'
import { RequestContext } from '../../store/RequestContext'
import M from 'materialize-css'
import { Link } from 'react-router-dom'

export const StudentCompanyListPage: FC = () => {
  const { companies, fetchCompanies } = useContext(CompanyContext)
  const { requests, nominations, fetchRequests, addRequest } =
    useContext(RequestContext)
  const { id, fio, learningPlans } = useContext(AuthContext)
  const [companyData, setCompanyData] = useState<{
    companyId: number
    company: string
  }>({ companyId: -1, company: '' })
  const createModalRef = useRef(null)
  const nominationRef = useRef(null)
  const planRef = useRef(null)

  const createClickHandler = (id: number, name: string) => {
    setCompanyData(prev => ({ companyId: id, company: name }))
    const i = M.Modal.getInstance(createModalRef.current!)
    i.open()
  }
  const modalCreateClickHandler = () => {
    // @ts-ignore
    const p = planRef.current!.value
    const n = getSelectValues(nominationRef.current!).join(' | ')
    addRequest(
      companyData.companyId,
      id,
      companyData.company,
      n,
      'Черновик',
      new Date(),
      fio,
      p
    )
  }

  useEffect(() => {
    if (!companies.length) fetchCompanies()
    if (!requests.length) fetchRequests()
  }, [])
  useEffect(() => {
    M.Modal.init(createModalRef.current!)
    M.FormSelect.init(nominationRef.current!)
    M.FormSelect.init(planRef.current!)
  }, [companies.length, requests.length])

  return (
    <>
      <StudentHeader />
      <div className='container'>
        <h1>Компании</h1>
        <table className='mt-4 striped'>
          <thead>
            <tr>
              <th>Название</th>
              <th>Дата начала</th>
              <th>Дата окончания</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(c => {
              return (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.startDate.toLocaleDateString()}</td>
                  <td>{c.endDate.toLocaleDateString()}</td>
                  <td>
                    {requests.filter(r => r.companyId === c.id).length ? (
                      <Link
                        className='btn-floating waves-effect waves-light light-blue darken-1'
                        to={`/requests/${
                          requests.find(
                            r => r.companyId === c.id && r.studentId === id
                          )?.id
                        }`}
                      >
                        <i className='material-icons'>edit</i>
                      </Link>
                    ) : (
                      <button
                        className='btn-floating waves-effect waves-light light-blue darken-1'
                        onClick={() => createClickHandler(c.id, c.name)}
                      >
                        <i className='material-icons'>add</i>
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* create modal */}
      <div ref={createModalRef} className='modal'>
        <div className='modal-content'>
          <h4>
            Создать заявку на компанию "<strong>{companyData.company}</strong>"
          </h4>
          <div className='input-field' style={{ marginTop: 16 }}>
            <select ref={planRef}>
              {learningPlans.map(p => (
                <option value={p} key={p}>
                  {p}
                </option>
              ))}
            </select>
            <label>Учебный план</label>
          </div>
          <div className='input-field'>
            <select multiple ref={nominationRef}>
              {nominations.map(n => (
                <option value={n} key={n}>
                  {n}
                </option>
              ))}
            </select>
            <label>Номинация</label>
          </div>
        </div>
        <div className='modal-footer'>
          <button
            className='btn light-blue darken-2 waves-effect waves-light'
            onClick={modalCreateClickHandler}
          >
            <i className='material-icons left'>save</i>
            Создать заявку
          </button>
        </div>
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
