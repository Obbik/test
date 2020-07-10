import axios from 'axios'
import url from './url'

export default (path, { method = 'GET', data = null } = {}) => {
  const token = localStorage.getItem('token')

  return axios({
    method,
    url: `${url}api/${path}`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    data
  })
}
