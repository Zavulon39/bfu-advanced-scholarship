import React, { FC, useContext, useEffect } from 'react'
import { StudentHeader } from '../../components/Header'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { RequestContext } from '../../store/RequestContext'

export const StudentSubRequestDetailPage: FC = () => {
  const { id } = useParams()
  const { requests, fetchRequests } = useContext(RequestContext)
  const request = requests.find(r => r.id === Number(id))
  const navigate = useNavigate()

  if (request?.studentId !== Number(id)) navigate('/companies/')

  useEffect(() => {
    if (!requests.length) fetchRequests()
  }, [])

  return (
    <>
      <StudentHeader />
      <div className='container'>
        <table className='mt-4 striped'>
          <thead>
            <tr>
              <th>Наминация</th>
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
      </div>
    </>
  )
}
