import { useContext, useState } from 'react'
import axios from 'axios'
import { NotificationContext } from '../context/notification-context'
import { ErrorContext } from '../context/error-context'
import { LoaderContext } from '../context/loader-context'
import { API_URL } from '../config/config'

export default () => {
  const { setError } = useContext(ErrorContext)
  //   const { showLoader, hideLoader } = useContext(LoaderContext)
  const [loader, setLoader] = useState(false)
  const { ErrorNotification, SuccessNofication } = useContext(NotificationContext)


  const fetchApi = (
    path,
    { method = 'GET', data = null, withNotification = false } = {},
    onSuccess,
    onError
  ) => {
    const token = sessionStorage.getItem('token')

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

        setLoader(false)
        if (onSuccess) onSuccess(res.data)
        if (method !== 'GET' || withNotification) SuccessNofication(res.data.message)
      })
      .catch(err => {
        setLoader(false)
        if (onError) onError(err)
        if (method === 'GET' && !withNotification)
          setError(err.response ? err.response.data.message : err)
        if (method !== 'GET' || withNotification)
          ErrorNotification(err.response ? err.response.data.message : err)
      })
  }

  return { fetchApi }
}
