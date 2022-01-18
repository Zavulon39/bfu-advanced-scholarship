import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminAuthPage } from '../pages/admin/AdminAuthPage'
import { AdminCompanyListPage } from '../pages/admin/AdminCompanyListPage'
import { AdminRequestDetailPage } from '../pages/admin/AdminRequestDetailPage'
import { AdminRequestListPage } from '../pages/admin/AdminRequestListPage'
import { NotificationListPage } from '../pages/admin/NotificationListPage'
import { StudentAuthPage } from '../pages/student/StudentAuthPage'
import { StudentCompanyListPage } from '../pages/student/StudentCompanyListPage'
import { StudentRequestDetailPage } from '../pages/student/StudentRequestDetailPage'
import { StudentSubRequestDetailPage } from '../pages/student/StudentSubRequestDetailPage'
import { AuthContext } from '../store/AuthContext'

export const useRouter = () => {
  const { role } = useContext(AuthContext)

  if (role === 'admin')
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path='/admin/notifications/'
            element={<NotificationListPage />}
          />
          <Route path='/admin/companies/' element={<AdminCompanyListPage />} />
          <Route path='/admin/requests/' element={<AdminRequestListPage />} />
          <Route
            path='/admin/requests/:id1/:id2/'
            element={<AdminRequestDetailPage />}
          />
          <Route path='*' element={<Navigate to='/admin/companies/' />} />
        </Routes>
      </BrowserRouter>
    )
  if (role === 'student') {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/companies/' element={<StudentCompanyListPage />} />
          <Route
            path='/requests/:id1/:id2/'
            element={<StudentRequestDetailPage />}
          />
          <Route
            path='/requests/:id/'
            element={<StudentSubRequestDetailPage />}
          />
          <Route path='*' element={<Navigate to='/companies/' />} />
        </Routes>
      </BrowserRouter>
    )
  }
  if (role === 'anonymous')
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/authentication/' element={<StudentAuthPage />} />
          <Route path='/admin/authentication/' element={<AdminAuthPage />} />
          <Route path='*' element={<Navigate to='/authentication/' />} />
        </Routes>
      </BrowserRouter>
    )
}
