import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminCompanyListPage } from '../pages/admin/AdminCompanyListPage'
import { AdminRequestDetailPage } from '../pages/admin/AdminRequestDetailPage'
import { AdminRequestListPage } from '../pages/admin/AdminRequestListPage'
import { AuthContext } from '../store/AuthContext'

export const useRouter = () => {
  const { role, login } = useContext(AuthContext)

  if (role === 'admin')
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/admin/companies/' element={<AdminCompanyListPage />} />
          <Route path='/admin/requests/' element={<AdminRequestListPage />} />
          <Route
            path='/admin/requests/:id/'
            element={<AdminRequestDetailPage />}
          />
          <Route path='*' element={<Navigate to='/admin/companies/' />} />
        </Routes>
      </BrowserRouter>
    )
}
