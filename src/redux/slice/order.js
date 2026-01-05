// src/redux/slice/orders.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

/* ------------------------------------------------------------------ */
/*  THUNKS                                                            */
/* ------------------------------------------------------------------ */

/**
 * Fetch orders for the current vendor.
 */
export const fetchVendorOrders = createAsyncThunk(
  'orders/fetchVendorOrders',
  async (
    {
      page = 1,
      pageSize = 10,
      sortKey = 'createdAt',
      sortDirection = 'desc',
      search = '',
      status = '',
      type = '',
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const res = await HttpClient.post('/order/vendor-orders', {
        page,
        pageSize,
        sortKey,
        sortDirection,
        search,
        status,
        type,
      })
      return res.data.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch orders.')
      return rejectWithValue(err.response?.data || { message: err.message })
    }
  },
)

/**
 * Update an order’s status.
 */
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status, reason, vendorId, vehicleType = 'bike' }, { rejectWithValue }) => {
    try {
      const payload = {
        orderId,
        status,
        vendorId,
        vehicleType,
      }
      console.log('payload:', payload)
      if (reason) {
        payload.reason = reason
      }

      const res = await HttpClient.post('/order/update-status', payload)

      toast.success('Order status updated.')
      return res.data.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.')
      return rejectWithValue(err.response?.data || { message: err.message })
    }
  },
)

/* ------------------------------------------------------------------ */
/*  SLICE                                                             */
/* ------------------------------------------------------------------ */

const initialState = {
  orders: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,

  totalRecords: 0,
  currentPage: 1,
  pageSize: 10,

  updateStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrders(state) {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    builder

      // 🔄 Fetch Vendor Orders
      .addCase(fetchVendorOrders.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchVendorOrders.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.orders = payload.data
        state.totalRecords = payload.totalRecords
        state.currentPage = payload.currentPage
        state.pageSize = payload.pageSize
      })
      .addCase(fetchVendorOrders.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message || 'Failed to fetch orders'
      })

      // ✅ Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.updateStatus = 'loading'
      })
      .addCase(updateOrderStatus.fulfilled, (state, { payload }) => {
        state.updateStatus = 'succeeded'
        const index = state.orders.findIndex((order) => order._id === payload._id)
        if (index !== -1) {
          state.orders[index] = payload
        }
      })
      .addCase(updateOrderStatus.rejected, (state) => {
        state.updateStatus = 'failed'
      })
  },
})

/* ------------------------------------------------------------------ */
/*  EXPORTS                                                           */
/* ------------------------------------------------------------------ */
export const { clearOrders } = ordersSlice.actions
export default ordersSlice.reducer
