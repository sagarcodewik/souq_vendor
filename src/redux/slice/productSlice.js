import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (
    {
      page = 1,
      pageSize = 10,
      sortKey = 'createdAt',
      sortDirection = 'desc',
      search,
      categoryName,
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await HttpClient.get('/product', {
        params: { page, pageSize, sortKey, sortDirection, search, categoryName },
      })
      console.log('Fetched products:', response.data.data)
      return response.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

// ✅ Create a new product
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await HttpClient.post('/product/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('Product created successfully!')
      return response.data.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product.')
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

// ✅ Update a product
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, formData }, { rejectWithValue }) => {
    try {
      const response = await HttpClient.put(`/product/update/${productId}`, formData)
      toast.success('Product updated successfully!')
      return response.data.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product.')
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

// ✅ Delete a product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await HttpClient.delete(`/product/delete/${productId}`)
      toast.success('Product deleted successfully!')
      return productId
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product.')
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)
// ✅ Update Product Status
export const updateProductStatus = createAsyncThunk(
  'products/updateProductStatus',
  async ({ productId, statesName, status }, { rejectWithValue }) => {
    try {
      const response = await HttpClient.post(`/product/update-status/${productId}`, {
        statesName,
        status,
      })
      toast.success('Product status updated!')
      return response.data.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product status.')
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)
export const fetchAllCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await HttpClient.get('/category/getCategory', {
        params: { page: 1, pageSize: 1000 }, // or call /getCategory/all
      })
      return response.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

const initialState = {
  products: [],
  updateStatusStatus: 'idle',
  status: 'idle',
  categories: [],
  categoryStatus: 'idle',
  error: null,
  createStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
  totalRecords: 0,
  currentPage: 1,
  pageSize: 10,
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProducts(state) {
      state.products = []
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.products = action.payload.data
        state.totalRecords = action.payload.totalRecords
        state.currentPage = action.payload.currentPage
        state.pageSize = action.payload.pageSize
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload?.message ?? 'Failed to fetch products'
      })

      // 🟢 CREATE PRODUCT
      .addCase(createProduct.pending, (state) => {
        state.createStatus = 'loading'
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.createStatus = 'succeeded'
        state.products.push(action.payload)
      })
      .addCase(createProduct.rejected, (state) => {
        state.createStatus = 'failed'
      })

      // 🔵 UPDATE PRODUCT
      .addCase(updateProduct.pending, (state) => {
        state.updateStatus = 'loading'
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded'
        const updatedProduct = action.payload
        const index = state.products.findIndex((p) => p._id === updatedProduct._id)
        if (index !== -1) {
          state.products[index] = updatedProduct
        }
      })
      .addCase(updateProduct.rejected, (state) => {
        state.updateStatus = 'failed'
      })

      // 🔴 DELETE PRODUCT
      .addCase(deleteProduct.pending, (state) => {
        state.deleteStatus = 'loading'
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded'
        state.products = state.products.filter((p) => p._id !== action.payload)
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.deleteStatus = 'failed'
      })
      // 🔴 UPDATE PRODUCT STATUS
      .addCase(updateProductStatus.pending, (state) => {
        state.updateStatusStatus = 'loading'
      })
      .addCase(updateProductStatus.fulfilled, (state) => {
        state.updateStatusStatus = 'succeeded'
      })
      .addCase(updateProductStatus.rejected, (state) => {
        state.updateStatusStatus = 'failed'
      })
      .addCase(fetchAllCategories.pending, (state) => {
        state.categoryStatus = 'loading'
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.categoryStatus = 'succeeded'
        state.categories = action.payload.data
      })
      .addCase(fetchAllCategories.rejected, (state) => {
        state.categoryStatus = 'failed'
      })
  },
})

export const { clearProducts } = productSlice.actions

export default productSlice.reducer
