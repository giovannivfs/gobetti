import axios from 'axios'

const api = axios.create({
  baseURL: 'https://provadev.xlab.digital/api/v1'
})

export default api