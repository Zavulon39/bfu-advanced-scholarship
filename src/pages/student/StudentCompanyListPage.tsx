import React, { FC, useContext, useEffect } from 'react'
import { StudentHeader } from '../../components/Header'
import { AuthContext } from '../../store/AuthContext'
import { CompanyContext } from '../../store/CompanyContext'
import { RequestContext } from '../../store/RequestContext'

export const StudentCompanyListPage: FC = () => {
  const { companies, fetchCompanies } = useContext(CompanyContext)
  const { requests, fetchRequests } = useContext(RequestContext)
  const { id } = useContext(AuthContext)

  const createClickHandler = () => {}
  const editClickHandler = () => {}

  useEffect(() => {
    if (!companies.length) fetchCompanies()
    if (!requests.length) fetchRequests()
  }, [])

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
                      <button
                        className='btn-floating waves-effect waves-light light-blue darken-1'
                        onClick={() => editClickHandler()}
                      >
                        <i className='material-icons'>edit</i>
                      </button>
                    ) : (
                      <button
                        className='btn-floating waves-effect waves-light light-blue darken-1'
                        onClick={() => createClickHandler()}
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
    </>
  )
}
