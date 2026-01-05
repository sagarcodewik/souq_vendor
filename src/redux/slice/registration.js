import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

export const createVendor = createAsyncThunk(
  'vendor/createVendor',
  async (vendorPayload, { rejectWithValue }) => {
    try {
      const response = await HttpClient.post('/user/create', vendorPayload)
      const { token } = response.data.data
      localStorage.setItem('token', token)
      HttpClient.defaults.headers.common.Authorization = `Bearer ${token}`
      console.log('token:', token)
      return response.data
    } catch (err) {
      console.error('Vendor creation error:', err)
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)
export const resendOtp = createAsyncThunk('vendor/resendOtp', async (_, { rejectWithValue }) => {
  try {
    const response = await HttpClient.post('/user/resend/otp')
    return response.data
  } catch (err) {
    console.error('Resend OTP error:', err)
    return rejectWithValue(err.response?.data ?? { message: err.message })
  }
})

const initialState = {
  status: 'idle',
  error: null,
  vendor: null,
  otpResendStatus: 'idle', // NEW
}

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    resetVendorState: (state) => {
      state.status = 'idle'
      state.error = null
      state.vendor = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createVendor.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(createVendor.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.vendor = payload.data
        const { token } = payload.data
        localStorage.setItem('token', token)
        toast.success('Vendor registered successfully. OTP sent to email.')
      })
      .addCase(createVendor.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Vendor registration failed'
        toast.error(state.error)
      })
      .addCase(resendOtp.pending, (state) => {
        state.otpResendStatus = 'loading'
      })
      .addCase(resendOtp.fulfilled, (state, { payload }) => {
        state.otpResendStatus = 'succeeded'
        const { token } = payload.data
        localStorage.setItem('token', token)
        toast.success('OTP resent successfully.')
      })
      .addCase(resendOtp.rejected, (state, { payload }) => {
        state.otpResendStatus = 'failed'
        toast.error(payload?.message ?? 'Failed to resend OTP')
      })
  },
})

export const { resetVendorState } = vendorSlice.actions
export default vendorSlice.reducer
