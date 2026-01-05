import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'
import { jwtDecode } from 'jwt-decode'
// --- Thunks ---
const token = localStorage.getItem('token')
export const fetchVendorProfile = createAsyncThunk(
  'vendor/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await HttpClient.get('/vendor/')
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

export const fetchVendorDeliveryHours = createAsyncThunk(
  'vendor/fetchDeliveryHours',
  async (_, { rejectWithValue }) => {
    try {
      const response = await HttpClient.get('/deliveryhours')
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

export const saveAllVendorDeliveryHours = createAsyncThunk(
  'vendor/saveDeliveryHours',
  async (payloadArray, { rejectWithValue }) => {
    try {
      console.log('Saving delivery hours:', payloadArray)
      const response = await HttpClient.post('/deliveryhours/create', { hours: payloadArray })
      toast.success(response?.message || 'Delivery hours updated successfully')
      return response.data
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Failed to save delivery hours'
      toast.error(msg)
      return rejectWithValue(err.response?.data ?? { message: msg })
    }
  },
)
export const updateVendorProfile = createAsyncThunk(
  'vendor/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await HttpClient.post('/vendor/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (token) {
        try {
          const decoded = jwtDecode(token)
          const vendorStatus = decoded?.status
          console.log('vendorStatus:', vendorStatus)
          if (vendorStatus === 'Pending') {
            toast.info('Profile updated and is under review.')
          } else {
            toast.success('Profile updated successfully')
          }
        } catch (decodeError) {
          toast.success('Profile updated successfully') // fallback if decode fails
        }
      }
      return data // will hold updated vendor doc
    } catch (err) {
      console.error(err)
      const msg = err?.response?.data?.message || 'Failed to update profile'
      toast.error(msg)
      return rejectWithValue({ message: msg })
    }
  },
)
export const subscribeVendor = createAsyncThunk(
  'vendor/subscribeVendor',
  async (premiumPlan, { rejectWithValue }) => {
    try {
      const response = await HttpClient.post('/vendor/primium/subscribe', { premiumPlan })
      toast.success(response?.message || 'Subscription request sent successfully')
      return response.data
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to subscribe'
      toast.error(msg)
      return rejectWithValue({ message: msg })
    }
  },
)

// --- Initial State ---

const initialState = {
  profile: {
    vendor: null,
    status: 'idle', // fetch / update status
    error: null,
  },
  deliveryHours: {
    data: [],
    status: 'idle',
    error: null,
  },
}

// --- Slice ---

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    resetVendorProfileState: (state) => {
      state.profile = { vendor: null, status: 'idle', error: null }
    },
    resetVendorDeliveryHoursState: (state) => {
      state.deliveryHours = { data: [], status: 'idle', error: null }
    },
  },
  extraReducers: (builder) => {
    // --- Profile ---
    builder
      .addCase(fetchVendorProfile.pending, (state) => {
        state.profile.status = 'loading'
        state.profile.error = null
      })
      .addCase(fetchVendorProfile.fulfilled, (state, { payload }) => {
        state.profile.status = 'succeeded'
        state.profile.vendor = payload?.data
      })
      .addCase(fetchVendorProfile.rejected, (state, { payload }) => {
        state.profile.status = 'failed'
        state.profile.error = payload?.message ?? 'Failed to fetch vendor profile'
        toast.error(state.profile.error)
      })

      // --- Delivery Hours: Fetch ---
      .addCase(fetchVendorDeliveryHours.pending, (state) => {
        state.deliveryHours.status = 'loading'
        state.deliveryHours.error = null
      })
      .addCase(fetchVendorDeliveryHours.fulfilled, (state, { payload }) => {
        state.deliveryHours.status = 'succeeded'
        state.deliveryHours.data = payload?.data || []
      })
      .addCase(fetchVendorDeliveryHours.rejected, (state, { payload }) => {
        state.deliveryHours.status = 'failed'
        state.deliveryHours.error = payload?.message ?? 'Failed to fetch delivery hours'
      })

      // --- Delivery Hours: Save ---
      .addCase(saveAllVendorDeliveryHours.pending, (state) => {
        state.deliveryHours.status = 'loading'
        state.deliveryHours.error = null
      })
      .addCase(saveAllVendorDeliveryHours.fulfilled, (state, { payload }) => {
        state.deliveryHours.status = 'succeeded'
        state.deliveryHours.data = payload?.data || []
      })
      .addCase(saveAllVendorDeliveryHours.rejected, (state, { payload }) => {
        state.deliveryHours.status = 'failed'
        state.deliveryHours.error = payload?.message ?? 'Failed to save delivery hours'
      })
      //update profile
      .addCase(updateVendorProfile.pending, (state) => {
        state.profile.status = 'loading'
        state.profile.error = null
      })
      .addCase(updateVendorProfile.fulfilled, (state, { payload }) => {
        state.profile.status = 'succeeded'
        state.profile.vendor = payload?.data // backend returns { data: <vendor> }
      })
      .addCase(updateVendorProfile.rejected, (state, { payload }) => {
        state.profile.status = 'failed'
        state.profile.error = payload?.message ?? 'Failed to update profile'
      })
  },
})

// --- Exports ---

export const { resetVendorProfileState, resetVendorDeliveryHoursState } = vendorSlice.actions

export default vendorSlice.reducer
