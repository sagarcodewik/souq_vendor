import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

/* ------------------------------------------------------------------ */
/*  THUNKS                                                            */
/* ------------------------------------------------------------------ */

/**
 * Create or retrieve chat between two users
 */
export const createOrGetChat = createAsyncThunk(
  'chat/createOrGet',
  async ({ userOneId, userTwoId, orderId, chatType }, { rejectWithValue }) => {
    try {
      const res = await HttpClient.post('/chat', {
        userOneId,
        userTwoId,
        orderId,
        chatType,
      })
      return res.data.data.chat
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create chat.')
      return rejectWithValue(err.response?.data || { message: err.message })
    }
  },
)

/**
 * Get messages of a chat
 */
export const fetchMessagesByChatId = createAsyncThunk(
  'chat/fetchMessages',
  async (chatId, { getState, rejectWithValue }) => {
    try {
      const res = await HttpClient.get(`/chat/${chatId}/messages`)
      console.log('Fetched messages:', res.data.data.messages)
      return res.data.data.messages
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch messages.')
      return rejectWithValue(err.response?.data || { message: err.message })
    }
  },
)

export const fetchChatUsersByUserId = createAsyncThunk(
  'chat/fetchChatUsers',
  async ({ userId, search = '', role = null, type = 'general' }, { rejectWithValue }) => {
    try {
      const res = await HttpClient.get(`/chat/${userId}?search=${search}&role=${role}&type=${type}`)
      console.log('Fetched chat users:', res)
      return res.data.data.users
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch chat users.')
      return rejectWithValue(err.response?.data || { message: err.message })
    }
  },
)
/* ------------------------------------------------------------------ */
/*  SLICE                                                             */
/* ------------------------------------------------------------------ */

const initialState = {
  chat: null,
  messages: [],
  chatUsers: [],
  fetchStatus: 'idle',
  messageFetchStatus: 'idle',
  chatUsersFetchStatus: 'idle',
  error: null,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearChat(state) {
      Object.assign(state, initialState)
    },
    addSocketMessage(state, action) {
      // Use a more efficient duplicate check
      const messageExists = state.messages.find((msg) => msg._id === action.payload._id)
      if (!messageExists) {
        state.messages.push(action.payload)
      }
    },
    resetFetchStatus(state) {
      state.fetchStatus = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      // 🧾 Create/Get Chat
      .addCase(createOrGetChat.pending, (state) => {
        state.fetchStatus = 'loading'
        state.error = null
      })
      .addCase(createOrGetChat.fulfilled, (state, { payload }) => {
        state.fetchStatus = 'succeeded'
        state.chat = payload
      })
      .addCase(createOrGetChat.rejected, (state, { payload }) => {
        state.fetchStatus = 'failed'
        state.error = payload?.message || 'Failed to create chat'
      })

      // 💬 Fetch Messages
      .addCase(fetchMessagesByChatId.pending, (state) => {
        state.messageFetchStatus = 'loading'
        state.error = null
      })
      .addCase(fetchMessagesByChatId.fulfilled, (state, { payload }) => {
        state.messageFetchStatus = 'succeeded'
        // Always set messages from API response
        if (payload) {
          state.messages = Array.isArray(payload) ? payload : []
        }
      })
      .addCase(fetchMessagesByChatId.rejected, (state, { payload }) => {
        state.messageFetchStatus = 'failed'
        state.error = payload?.message || 'Failed to fetch messages'
      })
      .addCase(fetchChatUsersByUserId.pending, (state) => {
        state.chatUsersFetchStatus = 'loading'
        state.error = null
      })
      .addCase(fetchChatUsersByUserId.fulfilled, (state, { payload }) => {
        state.chatUsersFetchStatus = 'succeeded'
        state.chatUsers = payload || []
      })
      .addCase(fetchChatUsersByUserId.rejected, (state, { payload }) => {
        state.chatUsersFetchStatus = 'failed'
        state.error = payload?.message || 'Failed to fetch chat users'
      })
  },
})

/* ------------------------------------------------------------------ */
/*  EXPORTS                                                           */
/* ------------------------------------------------------------------ */
export const { clearChat, addSocketMessage, resetFetchStatus } = chatSlice.actions
export default chatSlice.reducer
