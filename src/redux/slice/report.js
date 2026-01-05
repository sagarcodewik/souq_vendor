// src/redux/slice/report.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'
import { data } from 'react-router-dom'

export const fetchSalesReport = createAsyncThunk(
  'report/fetchSalesReport',
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      // Convert dates to UTC format
      const params = {}
      if (startDate) params.startDate = new Date(startDate).toISOString()
      if (endDate) params.endDate = new Date(endDate).toISOString()

      const res = await HttpClient.get('report/sales', { params })
      console.log('Sales report data:', res.data.data)
      return res.data.data
    } catch (err) {
      console.error('Error fetching sales report:', err)
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

const initialState = {
  status: 'idle',
  error: null,
  data: {},
}

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    resetReport(state) {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesReport.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchSalesReport.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.data = payload
      })
      .addCase(fetchSalesReport.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message || 'Failed to load sales report'
        toast.error(state.error)
      })
  },
})

export const { resetReport } = reportSlice.actions
export default reportSlice.reducer
