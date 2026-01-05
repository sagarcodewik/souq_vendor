import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { CButton, CFormInput, CInputGroup, CInputGroupText, CCardBody } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilBlind, cilLowVision, cilUser } from '@coreui/icons'
import { useDispatch } from 'react-redux'
import { createVendor } from '../../../redux/slice/registration'
import { useNavigate } from 'react-router-dom'
import { loginValidationSchema } from '../../../utils/validations'
import Loader from '../../../components/loader/loader'
import styles from './registration.module.scss'

const Registration = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)

  const initialValues = {
    email: '',
    password: '',
  }

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const role = parseInt(process.env.REACT_APP_ROLE || '2', 10)
      const payload = { ...values, role }
      await dispatch(createVendor(payload)).unwrap()
      resetForm()
      navigate('/email-opt')
    } catch (err) {
      console.error('Vendor creation error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.registrationPage}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.floatingElements}>
          <div className={styles.floatingCircle}></div>
          <div className={styles.floatingCircle}></div>
          <div className={styles.floatingCircle}></div>
        </div>
        <div className={styles.heroIllustration}>
          <div className={styles.heroIcon}>
            {' '}
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
            <h1 className={styles.title}>Create Account</h1>
            <p className={styles.subtitle}>Register as a vendor</p>
          </div>

          {/* Registration Form */}
          <div className={styles.registrationCard}>
            <CCardBody className={styles.cardBody}>
              <Formik
                initialValues={initialValues}
                validationSchema={loginValidationSchema}
                onSubmit={handleSubmit}
              >
                {({ touched, errors, isSubmitting }) =>
                  isSubmitting ? (
                    <div className={styles.loaderContainer}>
                      <Loader />
                    </div>
                  ) : (
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
                            type="email"
                            name="email"
                            placeholder="Enter your email"
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
                            placeholder="Create a secure password"
                            autoComplete="new-password"
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

                      {/* Create Account Button */}
                      <CButton color="primary" type="submit" className={styles.createBtn}>
                        Create Account
                      </CButton>

                      {/* Login Link Button */}
                      <CButton
                        color="secondary"
                        variant="outline"
                        type="button"
                        className={styles.loginBtn}
                        onClick={() => navigate('/login')}
                      >
                        Already have an account? Login
                      </CButton>
                    </Form>
                  )
                }
              </Formik>
            </CCardBody>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Registration
