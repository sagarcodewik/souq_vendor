import React from 'react'
import { useDispatch } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { resetPassword } from '../../../redux/slice/auth'
import { ResetPasswordvalidationSchema } from '../../../utils/validations'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormLabel,
  CFormInput,
  CContainer,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import styles from './reset.module.scss'
const Reset_password = () => {
  const dispatch = useDispatch()
  const token = localStorage.getItem('resetToken')
  const navigate = useNavigate()
  const initialValues = {
    newPassword: '',
    confirmPassword: '',
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(resetPassword({ newPassword: values.newPassword })).unwrap()
      localStorage.removeItem('resetToken')
      localStorage.removeItem('token')
      navigate(`/login`)
    } catch (error) {
      console.error('Reset password error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className={`bg-body-tertiary min-vh-100 d-flex flex-row align-items-center ${styles.resetPasswordPage}`}
    >
      <div className={styles.cardContainer}>
        {' '}
        <Formik
          initialValues={initialValues}
          validationSchema={ResetPasswordvalidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <h4>Reset Password</h4>
                <CFormLabel htmlFor="newPassword">New Password</CFormLabel>
                <Field
                  name="newPassword"
                  type="password"
                  as={CFormInput}
                  placeholder="Enter new password"
                />
                <ErrorMessage name="newPassword" component="div" className="text-danger mt-1" />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="confirmPassword">Confirm Password</CFormLabel>
                <Field
                  name="confirmPassword"
                  type="password"
                  as={CFormInput}
                  placeholder="Confirm new password"
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-danger mt-1" />
              </div>

              <CButton type="submit" color="primary" disabled={isSubmitting} className="w-100">
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </CButton>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default Reset_password
