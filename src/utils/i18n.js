import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import enCommon from '../locales/en/common.json'
import enDashboard from '../locales/en/dashboard.json'
import enOrders from '../locales/en/orders.json'
import arCommon from '../locales/ar/common.json'
import arDashboard from '../locales/ar/dashboard.json'
import arOrders from '../locales/ar/orders.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        dashboard: enDashboard,
        orders: enOrders,
      },
      ar: {
        common: arCommon,
        dashboard: arDashboard,
        orders: arOrders,
      },
    },
    fallbackLng: 'en',
    ns: ['common', 'dashboard', 'orders'], // define namespaces
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
