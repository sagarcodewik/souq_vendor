import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token)
    return !!decoded?.id
  } catch (err) {
    return false
  }
}

const ResetPasswordProtectedRoute = ({ children }) => {
  const { search } = useLocation()
  const token = new URLSearchParams(search).get('token')

  if (!token || !isTokenValid(token)) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ResetPasswordProtectedRoute
