import React, { Suspense, useEffect, useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { AppSidebar, AppHeader, AppFooter } from '../components/index'
import routes from '../routes'
import Loader from '../components/loader/loader'
import { role as VENDOR_ROLE } from '../utils/constants'
import { useDispatch } from 'react-redux'
import { fetchCurrencySymbol } from '../redux/slice/symbolSlice'
import { socket } from '../socket' // <-- import socket instance
import { addNotification } from '../redux/slice/notificationSlice' // <-- redux slice

const DefaultLayout = () => {
  const [isAuthorized, setIsAuthorized] = useState(null)
  const [decoded, setDecoded] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  /* ─────────── Decode token once on mount ─────────── */
  useEffect(() => {
    const token = localStorage.getItem('token')
    dispatch(fetchCurrencySymbol())
    if (!token) return setIsAuthorized(false)

    try {
      const d = jwtDecode(token)

      if (d.role === VENDOR_ROLE) {
        setDecoded(d)
        setIsAuthorized(true)
      } else {
        setIsAuthorized(false)
      }
    } catch (e) {
      setIsAuthorized(false)
    }
  }, [dispatch])

  /* ─────────── Setup socket connection after auth ─────────── */

  /* ─────────── Routing guard on every location change ─────────── */
  useEffect(() => {
    if (!decoded) return

    const { verified, status, profileComplete } = decoded
    const path = location.pathname

    if (verified === false) {
      if (path !== '/email-opt') navigate('/login', { replace: true })
      return
    }

    if (profileComplete === false && path !== '/dashboard/profile/profile-update') {
      navigate('/dashboard/profile/profile-update', { replace: true })
      return
    }

    if (
      profileComplete === true &&
      status !== 'Approved' &&
      path !== '/dashboard/profile/profile-update'
    ) {
      navigate('/dashboard/profile/profile-update', { replace: true })
    }
  }, [decoded, location.pathname, navigate])

  useEffect(() => {
    if (!decoded) return
    const payload = decoded.id
    socket.on('getNotification', (payload) => {
      console.log('📩 New notification:', payload)
      dispatch(addNotification(payload))
    })
    return () => {
      socket.off('getNotification')
    }
  }, [decoded, dispatch])
  if (isAuthorized === null) return <Loader />
  if (isAuthorized === false) {
    navigate('/login', { replace: true })
    return null
  }

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <Suspense fallback={<Loader />}>
            <Routes>
              {routes.map((route, idx) => (
                <Route
                  key={idx}
                  path={route.path}
                  element={route.element ? React.createElement(route.element) : null}
                />
              ))}
              <Route path="*" element={<>404</>} />
            </Routes>
          </Suspense>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
