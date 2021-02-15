import { useContext } from 'react'
import axios from 'axios'
import notificationContext, { NotificationContext } from '../context/notification-context'
import { LoaderContext } from '../context/loader-context'
import { ErrorContext } from '../context/error-context'
import { API_URL } from '../config/config'

export default () => {
  const { incrementRequests, decrementRequests } = useContext(LoaderContext)
  const { ErrorNotification, SuccessNofication } = useContext(NotificationContext)
  const { setError } = useContext(ErrorContext)

  const fetchMssqlApi = (
    path,
    { method = 'GET', data = null, hideNotification, params = null } = {},
    onSuccess = () => { },
    onError = () => { }
  ) => {
    const token = localStorage.getItem('token')

    if (!token) setError('No token provided')

    incrementRequests()

    return axios({
      method,
      url: `${API_URL}/api/${path}`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      data,
      params
    })
      .then(res => {
        if (res.status > 299) throw new Error()

        decrementRequests()
        onSuccess(res.data)
        if (method !== 'GET') {
          console.log(res)
          if (!hideNotification) SuccessNofication(res.data.message)
        }
      })
      .catch(err => {
        decrementRequests()
        if (onError) onError(err)

        if (method === 'GET') setError(err.response?.data || 'Failed to fetch data.')
        else ErrorNotification(err.response?.data || err.toString())

        console.log(err.response?.data || err)
      })
  }

  return { fetchMssqlApi }
}
