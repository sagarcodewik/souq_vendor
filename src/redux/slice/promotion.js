import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

/* ------------------------------------------------------------------ */
/*  THUNKS                                                            */
/* ------------------------------------------------------------------ */

// ➕ Add Promotion
export const createPromotion = createAsyncThunk(
  'promotion/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await HttpClient.post('/promotion/add-promotion', data)
      toast.success('Promotion created successfully.')
      return res.data.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create promotion.')
      return rejectWithValue(err.response?.data || { message: err.message })
    }
  },
)

// 📥 Get All Promotions
export const fetchPromotions = createAsyncThunk(
  'promotion/fetch',
  async ({ search = '', type = '' }, { rejectWithValue }) => {
    try {
      const res = await HttpClient.get('/promotion/promotions', {
        params: {
          search,
          type,
        },
      })
      return res.data.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch promotions.')
      return rejectWithValue(err.response?.data || { message: err.message })
    }
  },
)

// ✏️ Update Promotion
export const updatePromotion = createAsyncThunk(
  'promotion/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log(data)
      const res = await HttpClient.put(`/promotion/promotion/${id}`, data)
      toast.success('Promotion updated successfully.')
      return res.data.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update promotion.')
      return rejectWithValue(err.response?.data || { message: err.message })
    }
  },
)

// ❌ Delete Promotion
export const deletePromotion = createAsyncThunk(
  'promotion/delete',
  async (id, { rejectWithValue }) => {
    try {
      await HttpClient.delete(`/promotion/promotion/${id}`)
      toast.success('Promotion deleted successfully.')
      return id
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete promotion.')
      return rejectWithValue(err.response?.data || { message: err.message })
    }
  },
)

/* ------------------------------------------------------------------ */
/*  SLICE                                                             */
/* ------------------------------------------------------------------ */

const initialState = {
  list: [],
  loading: false,
  error: null,
}

const promotionSlice = createSlice({
  name: 'promotion',
  initialState,
  reducers: {
    clearPromotions(state) {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createPromotion.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createPromotion.fulfilled, (state, { payload }) => {
        state.loading = false
        state.list.unshift(payload)
      })
      .addCase(createPromotion.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload?.message || 'Failed to create promotion'
      })

      // GET
      .addCase(fetchPromotions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPromotions.fulfilled, (state, { payload }) => {
        state.loading = false
        state.list = payload
      })
      .addCase(fetchPromotions.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload?.message || 'Failed to fetch promotions'
      })

      // UPDATE
      .addCase(updatePromotion.fulfilled, (state, { payload }) => {
        const index = state.list.findIndex((p) => p._id === payload._id)
        if (index !== -1) state.list[index] = payload
      })
.addCase(updatePromotion.pending, (state) => {
  state.loading = true
  state.error = null
})
.addCase(updatePromotion.rejected, (state, { payload }) => {
  state.loading = false
  state.error = payload?.message || 'Failed to update promotion'
})
      // DELETE
      .addCase(deletePromotion.fulfilled, (state, { payload: id }) => {
        state.list = state.list.filter((p) => p._id !== id)
      })
  },
})

/* ------------------------------------------------------------------ */
/*  EXPORTS                                                           */
/* ------------------------------------------------------------------ */
export const { clearPromotions } = promotionSlice.actions
export default promotionSlice.reducer
