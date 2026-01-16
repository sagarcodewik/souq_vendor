import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCardBody,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CCol,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilBlind, cilLowVision } from '@coreui/icons'
import Loader from '../../../components/loader/loader'
import { loginValidationSchema } from '../../../utils/validations'
import { login } from '../../../redux/slice/auth'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'
import styles from './login.module.scss'
import { useTranslation } from 'react-i18next'

const Login = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation('login')
  const navigate = useNavigate()
  const { status } = useSelector((state) => state.auth)
  const [showPassword, setShowPassword] = useState(false)
  const initialValues = {
    email: '',
    password: '',
  }
  const [processing, setProcessing] = useState(false)
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setProcessing(true)
      const payload = await dispatch(login(values)).unwrap()
      const { user, profileComplete, status } = payload.data
      if (user?.verified === false) {
        toast.error('Please verify your email to continue.')
        setProcessing(false)
      } else if (profileComplete === false) {
        toast.error('Please complete your profile.')
        navigate('/dashboard/profile/profile-update', { replace: true })
      } else if (profileComplete === true && status === 'Pending') {
        toast.info('Your account is under review. Please wait for approval.')
        navigate('/dashboard/profile/profile-update', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    } catch (error) {
      console.error('Login failed:', error)
      setProcessing(false)
    } finally {
      setSubmitting(false)
      // setProcessing(false)
    }
  }


  if (status === 'loading' || processing) return <Loader />
  return (
    <div className={styles.loginPage}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.floatingElements}>
          <div className={styles.floatingCircle}></div>
          <div className={styles.floatingCircle}></div>
          <div className={styles.floatingCircle}></div>
        </div>
        <div className={styles.heroIllustration}>
          <div className={styles.heroIcon}>
            <img src="/login.png" alt="banner" />
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          {/* Logo Section */}
          <div className={styles.logoSection}>
            <div className={styles.logoContainer}>
              <img src="/loginlogo.png" alt="Souq Logo" className={styles.logoImage} />
            </div>
          </div>

          {/* Welcome Text */}
          <div className={styles.welcomeText}>
            <h1 className={styles.title}>{t('vendorLogin')}</h1>
            {/* <p className={styles.subtitle}>Nice to see you again</p> */}
          </div>

          {/* Login Form */}
          <div className={styles.loginCard}>
            <CCardBody className={styles.cardBody}>
              <Formik
                initialValues={initialValues}
                validationSchema={loginValidationSchema}
                onSubmit={handleSubmit}
              >
                {({ touched, errors, isSubmitting }) => (
                  <Form>
                    {/* Email Field */}
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Email Address</label>
                      <CInputGroup className={styles.inputGroup}>
                        <CInputGroupText className={styles.inputIcon}>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <Field
                          as={CFormInput}
                          name="email"
                          placeholder={"Enter your email"}
                          autoComplete="email"
                          className={`${styles.formInput} ${touched.email && errors.email ? styles.inputError : ''}`}
                          invalid={touched.email && !!errors.email}
                        />
                      </CInputGroup>
                      {touched.email && errors.email && (
                        <div className={styles.errorMessage}>
                          <ErrorMessage name="email" />
                        </div>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Password</label>
                      <CInputGroup className={styles.inputGroup}>
                        <CInputGroupText className={styles.inputIcon}>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <Field
                          as={CFormInput}
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          className={`${styles.formInput} ${touched.password && errors.password ? styles.inputError : ''}`}
                          invalid={touched.password && !!errors.password}
                        />
                        <CInputGroupText
                          className={styles.passwordToggle}
                          role="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          <CIcon icon={showPassword ? cilBlind : cilLowVision} />
                        </CInputGroupText>
                      </CInputGroup>
                      {touched.password && errors.password && (
                        <div className={styles.errorMessage}>
                          <ErrorMessage name="password" />
                        </div>
                      )}
                    </div>

                    {/* Forgot Password Link */}
                    <div className={styles.forgotPassword}>
                      <Link to="/forgot-password" className={styles.forgotLink}>
                        Forgot password?
                      </Link>
                    </div>

                    {/* Login Button */}
                    <CButton type="submit" disabled={isSubmitting} className={styles.loginBtn}>
                      {isSubmitting ? 'Logging in...' : 'Login'}
                    </CButton>

                    {/* Sign Up Button */}
                    <CButton
                      variant="outline"
                      className={styles.signupBtn}
                      type="button"
                      onClick={() => navigate('/vendor-signup')}
                    >
                      Sign up
                    </CButton>
                  </Form>
                )}
              </Formik>
            </CCardBody>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
