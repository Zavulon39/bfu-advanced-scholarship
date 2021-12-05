import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import M from 'materialize-css'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../store/AuthContext'

export const AdminHeader: FC = () => {
  const navbar = useRef(null)
  const tooltipRef1 = useRef(null)
  const tooltipRef2 = useRef(null)
  const [title, setTitle] = useState(
    ' Повышенная государственная академическая стипендия'
  )
  const { fio, avatarUrl, role } = useContext(AuthContext)

  useEffect(() => {
    M.Sidenav.init(navbar.current!)
    M.Tooltip.init(tooltipRef1.current!)
    M.Tooltip.init(tooltipRef2.current!)

    window
      .matchMedia('(max-width: 1380px)')
      .addEventListener('change', () =>
        setTitle('Государственная академическая стипендия')
      )
    window
      .matchMedia('(max-width: 1050px)')
      .addEventListener('change', () => setTitle('Академическая стипендия'))
    window
      .matchMedia('(max-width: 800px)')
      .addEventListener('change', () => setTitle('ПВГА'))
  }, [])

  return (
    <>
      <nav className='blue darken-4 px-4'>
        <div className='nav-wrapper'>
          <NavLink to='/' className='brand-logo'>
            {title}
          </NavLink>
          <a href='#' data-target='mobile-demo' className='sidenav-trigger'>
            <i className='material-icons'>menu</i>
          </a>
          <ul className='right hide-on-med-and-down'>
            <li>
              <NavLink to='/admin/companies/'>Список компаний</NavLink>
            </li>
            <li>
              <NavLink to='/admin/requests/'>Список заявок</NavLink>
            </li>
            {role !== 'anonymous' ? (
              <li>
                <a
                  href='#'
                  className='btn-floating btn-large tooltipped waves-effect'
                  data-position='bottom'
                  data-tooltip={fio}
                  ref={tooltipRef1}
                  style={{
                    marginBottom: 2,
                  }}
                >
                  <img
                    src={avatarUrl}
                    style={{
                      objectFit: 'cover',
                      width: 56,
                      height: 56,
                    }}
                  />
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </nav>

      <ul className='sidenav' id='mobile-demo' ref={navbar}>
        {role !== 'anonymous' ? (
          <li>
            <a
              href='#'
              className='btn-floating btn-large tooltipped waves-effect'
              data-position='bottom'
              data-tooltip={fio}
              ref={tooltipRef2}
              style={{
                marginBottom: 2,
              }}
            >
              <img
                src={avatarUrl}
                style={{
                  objectFit: 'cover',
                  width: 56,
                  height: 56,
                }}
              />
            </a>
          </li>
        ) : null}
        <li>
          <NavLink to='/admin/companies/'>Список компаний</NavLink>
        </li>
        <li>
          <NavLink to='/admin/requests/'>Список заявок</NavLink>
        </li>
      </ul>
    </>
  )
}
