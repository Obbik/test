import { useState, useCallback } from 'react'
import { SHOP_URL } from '../config/config'

export default () => {
  const setAutoLogout = useCallback(milliseconds => setTimeout(logout, milliseconds), [])

  const logout = () => {
    setPermissions(null)

    sessionStorage.removeItem('token')
    sessionStorage.removeItem('expirationDate')
    sessionStorage.removeItem('permissions')

    window.location.href = SHOP_URL
  }

  const [permissions, setPermissions] = useState(() => {
    const token = sessionStorage.getItem('token')
    const permissions = sessionStorage.getItem('permissions')
    const expirationDate = sessionStorage.getItem('expirationDate')

    if (!token || !expirationDate) return null

    if (new Date(expirationDate) <= new Date()) {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('expirationDate')

      return null
    }

    const remainingMilliseconds = new Date(expirationDate) - new Date()

    setAutoLogout(remainingMilliseconds)

    return permissions
  })

  const login = (token, permissions) => {
    sessionStorage.setItem('token', token)
    const permissionString = permissions.map(p => `{${p.PermissionId}}`).join(', ')
    sessionStorage.setItem('permissions', permissionString)

    const newExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60)

    sessionStorage.setItem('expirationDate', newExpirationDate.toISOString())

    const remainingMilliseconds = new Date(newExpirationDate) - new Date()

    setAutoLogout(remainingMilliseconds)

    setPermissions(permissionString)
  }

  return { permissions, login, logout }
}
