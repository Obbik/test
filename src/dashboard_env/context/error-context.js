import React, { useState, createContext } from 'react'

export const ErrorContext = createContext()

export default ({ children }) => {
  const [fatalError, setFatalError] = useState(false)

  const setError = err => setFatalError(err.toString())
  const clearError = () => setFatalError(false)

  return (
    <ErrorContext.Provider
      value={{
        fatalError,
        setError,
        clearError
      }}
    >
      {children}
    </ErrorContext.Provider>
  )
}
