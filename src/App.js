import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useColorModes } from '@coreui/react'
import Loader from './components/loader/loader'
import './scss/style.scss'
import './scss/examples.scss'
import { Navigate } from 'react-router-dom'
import ResetPasswordProtectedRoute from './layout/ResetPasswordProtectedRoute'
import EmailVerifyLayout from './layout/EmailVerifyLayout'
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/registration/registration'))
const ForgotPassword = React.lazy(() => import('./views/pages/forgotPassword/ForgotPassword'))
const Verify_opt = React.lazy(() => import('./views/pages/verify-opt/Verify_opt'))
const Reset_password = React.lazy(() => import('./views/pages/reset-passord/Reset_password'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  // Theme setup
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const themeParam = urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)?.[0]
    if (themeParam) {
      setColorMode(themeParam)
      return
    }
    localStorage.setItem('coreui-free-react-admin-template-theme', 'light')
  }, [isColorModeSet, setColorMode])

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} /> ,
          <Route path="/login" element={<Login />} />
          <Route path="/vendor-signup" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/email-opt"
            element={
              <EmailVerifyLayout>
                <Verify_opt type="email" />
              </EmailVerifyLayout>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <ResetPasswordProtectedRoute>
                <Verify_opt type="password" />
              </ResetPasswordProtectedRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <ResetPasswordProtectedRoute>
                <Reset_password />
              </ResetPasswordProtectedRoute>
            }
          />
          <Route path="/404" element={<Page404 />} />
          <Route path="/*" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
