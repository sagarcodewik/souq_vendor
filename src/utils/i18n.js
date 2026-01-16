import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// English
import enLogin from '../locales/en/login.json'
import enCommon from '../locales/en/common.json'
import enDashboard from '../locales/en/dashboard.json'
import enOrders from '../locales/en/orders.json'

// Arabic
import arLogin from '../locales/ar/login.json'
import arCommon from '../locales/ar/common.json'
import arDashboard from '../locales/ar/dashboard.json'
import arOrders from '../locales/ar/orders.json'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      login: enLogin,
      common: enCommon,
      dashboard: enDashboard,
      orders: enOrders,
    },
    ar: {
      login: arLogin,
      common: arCommon,
      dashboard: arDashboard,
      orders: arOrders,
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
