import { useState, useCallback } from 'react'

export default () => {
  const setAutoLogout = useCallback(milliseconds => {
    setTimeout(logout, milliseconds)
  }, [])

  const logout = () => {
    setIsAuth(false)

    localStorage.removeItem('token')
    localStorage.removeItem('clientId')
    localStorage.removeItem('expirationDate')
  }

  const [isAuth, setIsAuth] = useState(() => {
    const token = localStorage.getItem('token')
    const clientId = localStorage.getItem('clientId')
    const expirationDate = localStorage.getItem('expirationDate')

    if (!token || !clientId || !expirationDate) return false

    if (new Date(expirationDate) <= new Date()) {
      localStorage.removeItem('token')
      localStorage.removeItem('clientId')
      localStorage.removeItem('expirationDate')

      return false
    }

    const remainingMilliseconds = new Date(expirationDate) - new Date()

    setAutoLogout(remainingMilliseconds)

    return true
  })

  const login = (token, clientId) => {
    localStorage.setItem('token', token)
    localStorage.setItem('clientId', clientId)

    const newExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60)

    localStorage.setItem('expirationDate', newExpirationDate.toISOString())

    const remainingMilliseconds = new Date(newExpirationDate) - new Date()

    setAutoLogout(remainingMilliseconds)

    setIsAuth(true)
  }

  return { isAuth, login, logout }
}
