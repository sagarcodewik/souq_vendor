// src/store/languageSlice.js
import { createSlice } from '@reduxjs/toolkit'
import i18n from '../../utils/i18n'

const initialState = {
  lang: 'en',
}

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.lang = action.payload
      i18n.changeLanguage(action.payload) // update i18n when redux changes
      document.body.dir = action.payload === 'ar' ? 'rtl' : 'ltr' // handle RTL
    },
  },
})

export const { setLanguage } = languageSlice.actions
export default languageSlice.reducer
