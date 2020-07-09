import axios from 'axios'
import url from './url'

const token = localStorage.getItem('token')

export default (path, { method = 'GET', data = null } = {}) => {
  //console.log(token)
  return axios({
    method,
    url: `${url}api/${path}`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    data
  })
}
