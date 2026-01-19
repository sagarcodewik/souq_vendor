// store/index.js
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slice/auth'
import vendorReducer from './slice/registration'
import productReducer from './slice/productSlice'
import profileReducer from './slice/profile'
import uiReducer from './slice/uiSlice'
import dashboardReducer from './slice/dashboard'
import orderReducer from './slice/order'
import symbolReducer from './slice/symbolSlice'
import reviewReducer from './slice/review'
import promotionReducer from './slice/promotion'
import chatReducer from './slice/chat'
import languageReducer from './slice/languageSlice'
import reportReducer from './slice/report'
import categoryReducer from './slice/category'
import financeReducer from './slice/finance'
import notificationReducer from './slice/notificationSlice'
import boostReducer from './slice/boosts'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    vendor: vendorReducer,
    products: productReducer,
    vendorProfile: profileReducer,
    dashboard: dashboardReducer,
    orders: orderReducer,
    symbol: symbolReducer,
    ui: uiReducer,
    review: reviewReducer,
    promotion: promotionReducer,
    chat: chatReducer,
    language: languageReducer,
    report: reportReducer,
    categories: categoryReducer,
    finance: financeReducer,
    notifications: notificationReducer,
    boosts: boostReducer,
  },
})
