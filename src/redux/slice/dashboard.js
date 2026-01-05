// src/redux/slice/dashboard.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

/* ------------------------------------------------------------------ */
/*  THUNK ─ fetchDailySales                                            */
/* ------------------------------------------------------------------ */
/**
 * GET  /dashboard
 * query params:
 *   date      – YYYY-MM-DD    (defaults to today, server-side)
 *   timezone  – IANA string   (defaults to client TZ or 'UTC')
 *
 * The controller responds:
 * {
 *   data: {
 *     totalSales:    1234.56,
 *     pendingOrders: 7,
 *     date: '2025-06-26',
 *     timezone: 'Asia/Kolkata'
 *   }
 * }
 */
export const fetchDailySales = createAsyncThunk(
  'dashboard/fetchDailySales',
  async (
    {
      date, // YYYY-MM-DD   - optional
      timezone, // e.g. 'Asia/Kolkata' – optional
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const res = await HttpClient.get('/dashboard', {
        params: { date, timezone },
      })
      console.log('Dashboard data:', res.data.data)
      return res.data.data // { totalSales, pendingOrders, date, timezone }
    } catch (err) {
      console.error('Error fetching daily sales:', err)
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

/* ------------------------------------------------------------------ */
/*  SLICE                                                              */
/* ------------------------------------------------------------------ */
const initialState = {
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  /* dashboard payload */
  totalSales: 0,
  pendingOrders: 0,
  returnedOrders: 0,
  topCustomers: [],
  date: '',
  timezone: '',
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    resetDashboard(state) {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    /* ---------- FETCH DAILY SALES ---------- */
    builder
      .addCase(fetchDailySales.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchDailySales.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.totalSales = payload.totalSales
        state.pendingOrders = payload.pendingOrders
        state.date = payload.date
        state.timezone = payload.timezone
        state.returnedOrders = payload.returnedOrders || 0 // Handle returned orders if available
        state.topCustomers = payload.topCustomers || [] // Handle top customers if available
      })
      .addCase(fetchDailySales.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Failed to load dashboard data'
        toast.error(state.error)
      })
  },
})

/* ------------------------------------------------------------------ */
/*  EXPORTS                                                            */
/* ------------------------------------------------------------------ */
export const { resetDashboard } = dashboardSlice.actions
export default dashboardSlice.reducer
