import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token)
    return !!decoded?.id && decoded?.verified === false
  } catch (err) {
    return false
  }
}

const ResetPasswordProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')

  if (!token || !isTokenValid(token)) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ResetPasswordProtectedRoute
