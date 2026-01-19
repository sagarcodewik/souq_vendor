import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

export const createBoost = createAsyncThunk(
  'boost/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await HttpClient.post('/boost/add-boost', data)
      toast.success('Boost created successfully.')
      return res.data.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create boost.')
      return rejectWithValue(err.response?.data)
    }
  }
)

export const fetchBoosts = createAsyncThunk(
  'boost/fetch',
  async ({ search = '', boostType = '' }, { rejectWithValue }) => {
    try {
      const res = await HttpClient.get('/boost/boosts', {
        params: { search, boostType },
      })
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  }
)


export const updateBoost = createAsyncThunk(
  'boost/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log(data)
      const res = await HttpClient.put(`/boost/boost/${id}`, data)
      toast.success('boost updated successfully.')
      return res.data.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update boost.')
      return rejectWithValue(err.response?.data || { message: err.message })
    }
  },
)

export const stopBoost = createAsyncThunk(
  'boost/stop',
  async (id, { rejectWithValue }) => {
    try {
      const res = await HttpClient.post(`/boost/boost/${id}/stop`)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  }
)

export const deleteBoost = createAsyncThunk(
  'boost/delete',
  async (id, { rejectWithValue }) => {
    try {
      await HttpClient.delete(`/boost/boost/${id}`)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  }
)

const initialState = {
  list: [],
  loading: false,
  error: null,
}

const boostSlice = createSlice({
  name: 'boosts',
  initialState,
  reducers: {
    clearBoosts(state) {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBoost.pending, (state) => {
        state.loading = true
      })
      .addCase(createBoost.fulfilled, (state, { payload }) => {
        state.loading = false
        state.list.unshift(payload)
      })
      .addCase(createBoost.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload?.message
      })

      .addCase(fetchBoosts.fulfilled, (state, { payload }) => {
        state.list = payload
      })

      .addCase(stopBoost.fulfilled, (state, { payload }) => {
        const index = state.list.findIndex((b) => b._id === payload._id)
        if (index !== -1) state.list[index] = payload
      })

      .addCase(deleteBoost.fulfilled, (state, { payload }) => {
        state.list = state.list.filter((b) => b._id !== payload)
      })
  },
})

export const { clearBoosts } = boostSlice.actions
export default boostSlice.reducer
