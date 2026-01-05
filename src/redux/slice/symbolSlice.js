// src/store/slice/symbolSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Thunk to fetch currency symbol, code, and USD exchange rate
export const fetchCurrencySymbol = createAsyncThunk('symbol/fetchCurrencySymbol', async () => {
  let currencyCode = 'SYP'
  let countryCode = 'SY'

  try {
    // Try getting country and currency from ipapi
    const ipapiRes = await fetch('https://ipapi.co/json/')
    const ipapiData = await ipapiRes.json()

    currencyCode = ipapiData.currency || currencyCode
    countryCode = ipapiData.country_code || countryCode
  } catch (err) {
    // Fallback to restcountries
    try {
      const fallbackRes = await fetch('https://restcountries.com/v3.1/alpha/US')
      const fallbackData = await fallbackRes.json()

      if (fallbackData?.[0]?.currencies) {
        const fallbackCurrency = Object.keys(fallbackData[0].currencies)[0]
        currencyCode = fallbackCurrency || currencyCode
      }
    } catch (fallbackError) {
      console.error('Both IPAPI and restcountries failed:', fallbackError)
    }
  }

  // Format currency symbol using Intl
  let symbol
  try {
    const formatted = new Intl.NumberFormat(countryCode, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(1)

    symbol = formatted.replace(/\d+/g, '').trim()
    if (symbol === 'Rs') symbol = '₹'
    if (!symbol || symbol.toUpperCase() === currencyCode.toUpperCase()) {
      symbol = currencyCode
    }
  } catch {
    symbol = currencyCode
  }

  // Fetch USD → user's currency exchange rate using open.er-api.com
  let rate = 1
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD')
    const data = await res.json()

    if (data?.result === 'success' && data?.rates?.[currencyCode]) {
      rate = data.rates[currencyCode]
    }
  } catch (rateErr) {
    console.error('Exchange rate fetch failed:', rateErr)
  }

  return {
    code: currencyCode,
    symbol,
    rate,
  }
})

const symbolSlice = createSlice({
  name: 'symbol',
  initialState: {
    code: 'SYP',
    symbol: 'SYP',
    rate: 1,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrencySymbol(state, action) {
      state.code = action.payload.code
      state.symbol = action.payload.symbol
      state.rate = action.payload.rate
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencySymbol.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCurrencySymbol.fulfilled, (state, action) => {
        state.loading = false
        state.code = action.payload.code
        state.symbol = action.payload.symbol
        state.rate = action.payload.rate
      })
      .addCase(fetchCurrencySymbol.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { setCurrencySymbol } = symbolSlice.actions
export default symbolSlice.reducer
