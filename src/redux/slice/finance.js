import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

/* ------------------------------------------------------------------ */
/*  THUNKS                                                            */
/* ------------------------------------------------------------------ */

/**
 * Fetch admin financial breakdown
 * GET /order/admin-financial-breakdown
 */
export const fetchFinancialBreakdown = createAsyncThunk(
  'financial/fetchFinancialBreakdown',
  async ({ page = 1, pageSize = 10, search = '' } = {}, { rejectWithValue }) => {
    try {
      const res = await HttpClient.get('/order/vendor-financial-breakdown', {
        params: { page, pageSize, search },
      })
      // API returns { statusCode, status, data: [ ... ], message }
      return res.data.data.data // <-- return just the array
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch financial breakdown.')
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

/* ------------------------------------------------------------------ */
/*  SLICE                                                             */
/* ------------------------------------------------------------------ */

const initialState = {
  financials: [],
  status: 'idle',
  error: null,

  totalRecords: 0,
  currentPage: 1,
  pageSize: 10,
}

const financialBreakdownSlice = createSlice({
  name: 'financial',
  initialState,
  reducers: {
    clearFinancialBreakdown(state) {
      state.financials = []
      state.status = 'idle'
      state.error = null
      state.totalRecords = 0
      state.currentPage = 1
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- FETCH FINANCIAL BREAKDOWN ---------- */
      .addCase(fetchFinancialBreakdown.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchFinancialBreakdown.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.financials = payload || []      // payload is array
        state.totalRecords = payload?.length || 0
      })
      .addCase(fetchFinancialBreakdown.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Failed to fetch financial breakdown'
      })
  },
})

/* ------------------------------------------------------------------ */
/*  EXPORTS                                                           */
/* ------------------------------------------------------------------ */

export const { clearFinancialBreakdown } = financialBreakdownSlice.actions
export default financialBreakdownSlice.reducer
