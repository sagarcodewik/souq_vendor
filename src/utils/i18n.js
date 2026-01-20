import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// English
import enLogin from '../locales/en/login.json'
import enCommon from '../locales/en/common.json'
import enDashboard from '../locales/en/dashboard.json'
import enOrders from '../locales/en/orders.json'
import enOrderRequests from '../locales/en/orderrequest.json'
import enOrdercard from '../locales/en/ordercard.json'
import enApprovedOrder from '../locales/en/approvedorder.json'
import enBoosts from '../locales/en/boosts.json'
import enChat from '../locales/en/chat.json'
import enProduct from '../locales/en/products.json'
import enProfile from '../locales/en/profile.json'
import enUpdateProfile from '../locales/en/updateProfile.json'
// Arabic
import arLogin from '../locales/ar/login.json'
import arBoosts from '../locales/ar/boosts.json'
import arCommon from '../locales/ar/common.json'
import arDashboard from '../locales/ar/dashboard.json'
import arOrders from '../locales/ar/orders.json'
import arProducts from '../locales/ar/products.json'
import arOrderRequests from '../locales/ar/orderrequest.json'
import arOrdercard from '../locales/ar/ordercard.json'
import arApprovedOrder from '../locales/ar/approvedorder.json'
import arPromotions from '../locales/ar/promotions.json'
import arSalesreport from '../locales/ar/salereport.json'
import arCustomerchats from '../locales/ar/customerchats.json'
import arOrderchats from '../locales/ar/orderchats.json'
import arFinance from '../locales/ar/finance.json'
import arChat from '../locales/ar/chat.json'
import arProduct from '../locales/ar/products.json'
import arProfile from '../locales/ar/profile.json'
import arUpdateProfile from '../locales/ar/updateProfile.json'

const savedLang = localStorage.getItem('lang') || 'en'
document.body.dir = savedLang === 'ar' ? 'rtl' : 'ltr'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      login: enLogin,
      common: enCommon,
       boosts: enBoosts,
       chat: enChat,
       product: enProduct,
      dashboard: enDashboard,
      orders: enOrders,
      orderrequest: enOrderRequests,
      ordercard: enOrdercard,
      approvedorder: enApprovedOrder,
      profile: enProfile,
      updateProfile: enUpdateProfile,
    },
    ar: {
      login: arLogin,
      common: arCommon,
      boosts: arBoosts,
      dashboard: arDashboard,
      orders: arOrders,
      products: arProducts,
      orderrequest: arOrderRequests,
      ordercard: arOrdercard,
      approvedorder: arApprovedOrder,
      promotions: arPromotions,
      salereport: arSalesreport,
      customerchats: arCustomerchats,
      orderchats: arOrderchats,
      finance: arFinance,
      chat: arChat,
      product: arProduct,
      profile: arProfile,
      updateProfile: arUpdateProfile

    },
  },
  lng: savedLang,
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
