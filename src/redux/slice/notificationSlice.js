import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import HttpClient from '../../helper/http-client'

// 🔹 Thunk: Mark ALL notifications as read
export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const res = await HttpClient.post('notification/update')
      return res.data.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark notifications as read.')
      return rejectWithValue(err.response?.data || { message: err.message })
    }
  },
)

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload) // latest first
    },
    setNotifications: (state, action) => {
      state.items = action.payload
    },
    markAsRead: (state, action) => {
      const notif = state.items.find((n) => n._id === action.payload)
      if (notif) notif.isRead = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(markAllAsRead.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.loading = false
        state.items.forEach((n) => {
          n.isRead = true
        })
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Something went wrong'
      })
  },
})

export const { addNotification, setNotifications, markAsRead } = notificationSlice.actions
export default notificationSlice.reducer
