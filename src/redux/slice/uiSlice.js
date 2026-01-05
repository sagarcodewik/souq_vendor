// src/store/slice/uiSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarShow: true,
  sidebarUnfoldable: false,
  theme: 'light',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    set: (state, action) => {
      return { ...state, ...action.payload }
    },
    setTheme(state, action) {
      state.theme = action.payload // eg. 'light' | 'dark'
    },
  },
})

export const { set, setTheme } = uiSlice.actions
export default uiSlice.reducer
