import React from 'react'
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
import CIcon from '@coreui/icons-react'
import { cilEnvelopeClosed } from '@coreui/icons'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPasswordValidationSchema } from '../../../utils/validations'
import { forgotPassword } from '../../../redux/slice/auth'
import Loader from '../../../components/loader/loader'
import styles from './forgotPassword.module.scss'
const ForgotPassword = () => {
  const dispatch = useDispatch()
  const { status } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const initialValues = {
    email: '',
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = await dispatch(forgotPassword(values)).unwrap()
      // ✅ Navigate with token as URL param
      navigate(`/verify-otp?token=${encodeURIComponent(token)}`)
    } catch (error) {
      console.error('Forgot password error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading') return <Loader />

  return (
    <div
      className={`bg-body-tertiary min-vh-100 d-flex flex-row align-items-center ${styles.forgotPasswordPage}`}
    >
      <div className={styles.cardContainer}>
        <Formik
          initialValues={initialValues}
          validationSchema={forgotPasswordValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form>
              <h1>Forgot Password</h1>
              <p className="text-body-secondary">Enter your email to receive an OTP</p>

              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilEnvelopeClosed} />
                </CInputGroupText>
                <Field
                  as={CFormInput}
                  name="email"
                  placeholder="Email"
                  autoComplete="email"
                  invalid={touched.email && !!errors.email}
                />
              </CInputGroup>
              <div className="text-danger small mb-3">
                <ErrorMessage name="email" />
              </div>

              <CRow>
                <CCol xs={12}>
                  <CButton color="primary" type="submit" className="w-100" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
                  </CButton>
                </CCol>
              </CRow>

              <div className="mt-3 text-center">
                <Link to="/login" className="small text-primary">
                  Back to Login
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default ForgotPassword
