import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

/* ------------------------------------------------------------------ */
/*  ASYNC THUNKS                                                       */
/* ------------------------------------------------------------------ */

// GET boost pricing
export const fetchBoostPricing = createAsyncThunk(
  'boostPricing/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await HttpClient.get('/boostpricing')
      return res.data.data
    } catch (err) {
      return rejectWithValue(
        err.response?.data ?? { message: err.message },
      )
    }
  },
)

/* ------------------------------------------------------------------ */
/*  INITIAL STATE                                                     */
/* ------------------------------------------------------------------ */

const initialState = {
  status: 'idle',
  error: null,
  boostPricing: [],
}

/* ------------------------------------------------------------------ */
/*  SLICE                                                              */
/* ------------------------------------------------------------------ */

const boostPricingSlice = createSlice({
  name: 'boostPricing',
  initialState,
  reducers: {
    resetBoostPricingState(state) {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    builder
      /* -------------------- FETCH BOOST PRICING -------------------- */
      .addCase(fetchBoostPricing.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchBoostPricing.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.boostPricing = payload
      })
      .addCase(fetchBoostPricing.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error =
          payload?.message ?? 'Failed to load boost pricing'
        toast.error(state.error)
      })
  },
})

export const { resetBoostPricingState } = boostPricingSlice.actions
export default boostPricingSlice.reducer
