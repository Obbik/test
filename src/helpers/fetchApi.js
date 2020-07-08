import axios from 'axios'
import url from './url'

const token = localStorage.getItem('token')

export default ({ path, method = 'GET', data = null }, cb) =>
  axios({
    method,
    url: `${url}api/${path}`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    data
  })
    .then(res => {
      cb(res)
    })
    .catch(err => {
      cb(err)
    })
