import React, {
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from 'react'
import M from 'materialize-css'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../store/AuthContext'

export const AdminHeader: FC = () => {
  const navbar = useRef(null)
  const tooltipRef1 = useRef(null)
  const tooltipRef2 = useRef(null)
  const [title, setTitle] = useState(
    'Повышенная государственная академическая стипендия'
  )
  const { fio, avatarUrl, role, login } = useContext(AuthContext)

  const logout = () => login(0, '', '', 'anonymous', [])

  useEffect(() => {
    M.Sidenav.init(navbar.current!)
    M.Tooltip.init(tooltipRef1.current!)
    M.Tooltip.init(tooltipRef2.current!)
  }, [])

  useLayoutEffect(() => {
    function updateSize() {
      if (window.innerWidth < 1280)
        setTitle('Государственная академическая стипендия')
      if (window.innerWidth < 1050) setTitle('Академическая стипендия')
      if (window.innerWidth < 800) setTitle('ПГАС')
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
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
              <NavLink to='/admin/notifications/'>Объявления</NavLink>
            </li>
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
                  onClick={logout}
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
          <NavLink to='/admin/notifications/'>Объявления</NavLink>
        </li>
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

export const StudentHeader: FC = () => {
  const navbar = useRef(null)
  const tooltipRef1 = useRef(null)
  const tooltipRef2 = useRef(null)
  const [title, setTitle] = useState(
    'Повышенная государственная академическая стипендия'
  )
  const { fio, avatarUrl, role, login } = useContext(AuthContext)

  const logout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('role')
    localStorage.removeItem('id')

    window.location.reload()
  }

  useEffect(() => {
    M.Sidenav.init(navbar.current!)
    M.Tooltip.init(tooltipRef1.current!)
    M.Tooltip.init(tooltipRef2.current!)
  }, [])

  useLayoutEffect(() => {
    function updateSize() {
      if (window.innerWidth < 1280)
        setTitle('Государственная академическая стипендия')
      if (window.innerWidth < 1050) setTitle('Академическая стипендия')
      if (window.innerWidth < 800) setTitle('ПГАС')
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
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
              <NavLink to='/companies/'>Список компаний</NavLink>
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
                  onClick={logout}
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
          <NavLink to='/companies/'>Список компаний</NavLink>
        </li>
      </ul>
    </>
  )
}
