import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

/* ------------------------------------------------------------------ */
/*  THUNKS                                                            */
/* ------------------------------------------------------------------ */

/**
 * Get reviews by product ID
 */
export const fetchReviewsByProductId = createAsyncThunk(
  'reviews/fetchByProductId',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await HttpClient.get(`/review/get-reviews/${productId}`)
      return res.data.data // { reviews: [...], totalReviews: n }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch reviews.')
      return rejectWithValue(err.response?.data || { message: err.message })
    }
  },
)

export const fetchRatingByProductId = createAsyncThunk(
  'ratings/fetchByProductId',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await HttpClient.get(`/review/get-ratings/${productId}`)
      console.log(res.data)
      return res.data.data // { reviews: [...], totalReviews: n }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch reviews.')
      return rejectWithValue(err.response?.data || { message: err.message })
    }
  },
)
/**
 * Reply to a specific review
 */
export const replyToReview = createAsyncThunk(
  'reviews/replyToReview',
  async ({ reviewId, message }, { rejectWithValue }) => {
    try {
      const res = await HttpClient.post(`/review/update-review/${reviewId}`, {
        message,
      })
      toast.success('Reply sent successfully.')
      return {
        reviewId,
        reply: res.data.data.reply, // only reply part from the updated review
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reply.')
      return rejectWithValue(err.response?.data || { message: err.message })
    }
  },
)

/* ------------------------------------------------------------------ */
/*  SLICE                                                             */
/* ------------------------------------------------------------------ */

const initialState = {
  reviews: [],
  totalReviews: 0,
  averageRating: 0,
  fetchStatus: 'idle',
  error: null,
}

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviews(state) {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    builder
      // 📥 Fetch Reviews
      .addCase(fetchReviewsByProductId.pending, (state) => {
        state.fetchStatus = 'loading'
        state.error = null
      })
      .addCase(fetchReviewsByProductId.fulfilled, (state, { payload }) => {
        state.fetchStatus = 'succeeded'
        state.reviews = payload.reviews
        state.totalReviews = payload.totalReviews
      })
      .addCase(fetchReviewsByProductId.rejected, (state, { payload }) => {
        state.fetchStatus = 'failed'
        state.error = payload?.message || 'Failed to fetch reviews'
      })

      // ✉️ Reply to a Review
      .addCase(replyToReview.fulfilled, (state, { payload }) => {
        const index = state.reviews?.findIndex((r) => r._id === payload.reviewId)
        if (index !== -1) {
          state.reviews[index].reply = payload.reply
        }
      })
      .addCase(replyToReview.rejected, (state, { payload }) => {
        state.error = payload?.message || 'Failed to send reply.'
      })
      .addCase(fetchRatingByProductId.fulfilled, (state, { payload }) => {
        state.averageRating = payload.overall || 0
      })
      .addCase(fetchRatingByProductId.rejected, (state, { payload }) => {
        state.error = payload?.message || 'Failed to fetch ratings.'
      })
  },
})

/* ------------------------------------------------------------------ */
/*  EXPORTS                                                           */
/* ------------------------------------------------------------------ */
export const { clearReviews } = reviewsSlice.actions
export default reviewsSlice.reducer
