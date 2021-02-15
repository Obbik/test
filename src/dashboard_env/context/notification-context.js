import React, { createContext } from 'react'
import { NotificationManager } from 'react-notifications'

export const NotificationContext = createContext()

export default ({ children }) => {
  const ErrorNotification = (message) =>
    console.log(message)
  // NotificationManager.error(message.toString(), null, 4000)

  const SuccessNofication = (message = 'Success.') =>
    NotificationManager.success(message, null, 4000)

  return (
    <NotificationContext.Provider value={{ ErrorNotification, SuccessNofication }}>
      {children}
    </NotificationContext.Provider>
  )
}
