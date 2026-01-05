import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

/* ------------------------------------------------------------------ */
/*  THUNKS                                                            */
/* ------------------------------------------------------------------ */

/**
 * Fetch all categories (GET /category/getCategory)
 */
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  // in fetchCategories.js
  async ({ page = 1, pageSize = 100, search = '' } = {}, { rejectWithValue }) => {
    try {
      const res = await HttpClient.get('/category/getCategory', {
        params: { page, pageSize, search },
      })
      return res.data.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch categories.')
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

/* ------------------------------------------------------------------ */
/*  SLICE                                                             */
/* ------------------------------------------------------------------ */

const initialState = {
  categories: [],
  status: 'idle',
  error: null,

  totalRecords: 0,
  currentPage: 1,
  pageSize: 10,
}

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategories(state) {
      state.categories = []
      state.status = 'idle'
      state.error = null
      state.totalRecords = 0
      state.currentPage = 1
    },
  },
  extraReducers: (builder) => {
    /* ---------- FETCH CATEGORIES ---------- */
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.categories = payload.data
        state.totalRecords = payload.totalRecords
        state.currentPage = payload.currentPage
        state.pageSize = payload.pageSize
      })
      .addCase(fetchCategories.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Failed to fetch categories'
      })
  },
})

/* ------------------------------------------------------------------ */
/*  EXPORTS                                                           */
/* ------------------------------------------------------------------ */

export const { clearCategories } = categorySlice.actions
export default categorySlice.reducer
