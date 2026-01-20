import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'
import App from './App'
import { store } from './redux/store'
import { ToastContainer } from 'react-toastify'
import './utils/i18n'
const root = createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnHover
      draggable
      theme="colored" 
    />
  </Provider>,
)
