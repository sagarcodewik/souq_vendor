import React, { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { cilShieldAlt } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useDispatch } from 'react-redux'
import { resendOtp } from '../../../redux/slice/registration'
import { verifyOtp as verifyPasswordResetOtp } from '../../../redux/slice/auth'
import { verifyEmailOtp } from '../../../redux/slice/auth'
import { OtpvalidationSchema } from '../../../utils/validations'
import { toast } from 'react-toastify'
import { forgotPassword } from '../../../redux/slice/auth'
import Loader from '../../../components/loader/loader'
import styles from './verify.module.scss'
const OtpVerification = ({ type = 'email' }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { search } = useLocation()
  const [countdownFromToken, setCountdownFromToken] = useState(0)
  const [resending, setResending] = useState(false)

  const token = localStorage.getItem('token')
  const initialValues = {
    otp: '',
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (type === 'email') {
        await dispatch(verifyEmailOtp({ otp: values.otp })).unwrap()
        localStorage.removeItem('token')
        navigate('/login')
      } else if (type === 'password') {
        const newToken = await dispatch(verifyPasswordResetOtp({ otp: values.otp, token })).unwrap()
        navigate('/reset-password?token=' + encodeURIComponent(newToken))
      }
    } catch (error) {
      console.error('OTP verification failed:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleResendOtp = async () => {
    setResending(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) toast.error('Token not found in localStorage')
      if (type === 'email') {
        await dispatch(resendOtp()).unwrap()
      } else if (type === 'password') {
        const decoded = jwtDecode(token)
        const email = decoded?.email

        if (!email) toast.error('Email not found in token')

        await dispatch(forgotPassword({ email })).unwrap()
      }
    } catch (error) {
      console.error('Resend OTP failed:', error)
    } finally {
      setResending(false)
    }
  }
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const decoded = jwtDecode(token)
      const expiryUTC = new Date(decoded.expiresIn) // This is parsed as UTC
      const now = new Date()
      const diffInSeconds = Math.floor((expiryUTC.getTime() - now.getTime()) / 1000)

      if (diffInSeconds > 0) {
        setCountdownFromToken(diffInSeconds)

        const interval = setInterval(() => {
          setCountdownFromToken((prev) => {
            if (prev <= 1) {
              clearInterval(interval)
              return 0
            }
            return prev - 1
          })
        }, 1000)
        console.log(diffInSeconds, 'seconds remaining until OTP expires')
        return () => clearInterval(interval)
      } else {
        setCountdownFromToken(0)
      }
    } catch (err) {
      console.error('Token decode failed:', err)
    }
  }, [search, token])

  return (
    <div
      className={`bg-body-tertiary min-vh-100 d-flex flex-row align-items-center ${styles.verifyOtpPage}`}
    >
      <div className={styles.cardContainer}>
        <Formik
          initialValues={initialValues}
          validationSchema={OtpvalidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form>
              <h1>Verify OTP</h1>
              <p className="text-body-secondary">Enter the 6-digit code sent to your email</p>

              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilShieldAlt} />
                </CInputGroupText>
                <Field
                  as={CFormInput}
                  name="otp"
                  placeholder="Enter OTP"
                  autoComplete="one-time-code"
                  invalid={touched.otp && !!errors.otp}
                />
              </CInputGroup>
              <div className="text-danger small mb-2">
                <ErrorMessage name="otp" />
              </div>
              <p className="text-body-secondary text-center mb-2">
                {countdownFromToken > 0
                  ? `OTP expires in ${Math.floor(countdownFromToken / 60)}:${('0' + (countdownFromToken % 60)).slice(-2)} minutes`
                  : 'OTP expired'}
              </p>
              <CRow className="mb-2">
                <CCol xs={12}>
                  <CButton type="submit" color="primary" className="w-100" disabled={isSubmitting}>
                    {isSubmitting ? 'Verifying...' : 'Verify'}
                  </CButton>
                </CCol>
              </CRow>

              {countdownFromToken <= 570 && (
                <CRow className="mb-2">
                  <CCol xs={12} className="text-center">
                    <CButton type="button" color="link" onClick={handleResendOtp}>
                      {resending ? <Loader /> : 'Resend OTP'}
                    </CButton>
                  </CCol>
                </CRow>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default OtpVerification
