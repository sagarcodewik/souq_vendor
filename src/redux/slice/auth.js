import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await HttpClient.post('/user/login', {
        email,
        password,
        role: Number(process.env.REACT_APP_ROLE || 2),
      })
      const { status: accountStatus, token } = response.data.data
      localStorage.setItem('token', token)
      // console.log('Account status:', response.data)
      // Only Approved can succeed, Pending/Rejected cause rejection
      if (accountStatus !== 'Approved' && accountStatus !== 'Pending') {
        return rejectWithValue({
          status: accountStatus,
          message:
            accountStatus === 'Rejected'
              ? 'Your account has been rejected. Contact support.'
              : 'Your account status is not valid for this action.',
        })
      }
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const role = Number(process.env.REACT_APP_ROLE || 2)
      const response = await HttpClient.post('/user/forgot/password', { email, role })
      const { token } = response.data.data
      localStorage.setItem('token', token)
      return token
    } catch (err) {
      const message = err.response?.data?.message || err.message
      return rejectWithValue({ message })
    }
  },
)

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ otp }, { rejectWithValue }) => {
    try {
      const response = await HttpClient.post('/user/verify/password-otp', {
        otp,
      })
      const newToken = response?.data?.data?.token
      if (newToken) {
        localStorage.setItem('token', newToken)
      }

      return newToken
    } catch (err) {
      const message = err.response?.data?.message || err.message
      // toast.error(message)
      return rejectWithValue({ message })
    }
  },
)
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ newPassword }, { rejectWithValue }) => {
    try {
      const response = await HttpClient.post('/user/reset/password', {
        newPassword,
      })
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || err.message
      return rejectWithValue({ message })
    }
  },
)

export const verifyEmailOtp = createAsyncThunk(
  'email/verifyOtp',
  async ({ otp }, { rejectWithValue }) => {
    try {
      const response = await HttpClient.post('/user/verify/otp', {
        otp,
      })
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'OTP verification failed'
      console.error('Verify OTP error:', message)
      return rejectWithValue({ message })
    }
  },
)

const initialState = {
  email: null,
  token: null,
  resetToken: localStorage.getItem('resetToken') || null,
  status: 'idle',
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.email = null
      state.token = null
      state.resetToken = null
      state.status = 'idle'
      state.error = null
      localStorage.clear()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        const { token, user } = payload.data
        console.log('Login successful:', payload.data)
        state.status = 'succeeded'
        state.email = user.email
        state.token = token
        localStorage.setItem('token', token)
        toast.success('Login successful!')
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Login failed'
        toast.error(state.error) // shows "pending" or "rejected" message
      })
      .addCase(forgotPassword.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(forgotPassword.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.resetToken = payload
        toast.success('OTP sent to your email.')
      })
      .addCase(forgotPassword.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message
        toast.error(state.error)
      })
      .addCase(verifyOtp.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.status = 'succeeded'
        toast.success('OTP verified.')
      })
      .addCase(verifyOtp.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message
        toast.error(state.error)
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = 'succeeded'
        toast.success('Password has been reset successfully.')
      })
      .addCase(resetPassword.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message
        toast.error(state.error)
      })
      .addCase(verifyEmailOtp.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(verifyEmailOtp.fulfilled, (state) => {
        state.status = 'succeeded'
        toast.success('Email OTP verified successfully.')
      })
      .addCase(verifyEmailOtp.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message
        toast.error(state.error)
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
