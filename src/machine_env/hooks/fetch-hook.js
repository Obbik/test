import { useContext } from 'react'
import axios from 'axios'
import { NotificationContext } from '../context/notification-context'
import { ErrorContext } from '../context/error-context'
import { LoaderContext } from '../context/loader-context'
import { API_URL } from '../config/config'

export default () => {
  const { setError } = useContext(ErrorContext)
  const { showLoader, hideLoader } = useContext(LoaderContext)
  const { ErrorNotification, SuccessNofication } = useContext(NotificationContext)

  const fetchApi = (path, { method = 'GET', data = null } = {}, onSuccess, onError) => {
    const token = sessionStorage.getItem('token')

    showLoader()

    axios({
      method,
      url: `${API_URL}api/${path}`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      data
    })
      .then(res => {
        if (res.status > 299) {
          console.log(0, res.data.message)

          throw new Error(res.data.message)
        }

        hideLoader()
        if (onSuccess) onSuccess(res.data)
        if (method !== 'GET') SuccessNofication(res.data.message)
      })
      .catch(err => {
        hideLoader()
        if (onError) onError(err)
        if (method === 'GET') setError(err.response ? err.response.data.message : err)
        if (method !== 'GET')
          ErrorNotification(err.response ? err.response.data.message : err)
      })
  }

  return { fetchApi }
}
