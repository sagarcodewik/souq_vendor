import axios from 'axios'

// Create an Axios instance
const HttpClient = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}/api/v1`,
  timeout: 10000,
})

// Request interceptor – adds Bearer token if present
HttpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor – redirect to "/" on 401 Unauthorized
// HttpClient.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response && error.response.status === 401) {
//       // Redirecting user to home page instead of login
//       window.location.href = '/';
//     }
//     return Promise.reject(error);
//   }
// );

export default HttpClient
