import React, { useState, createContext } from 'react'

export const LoaderContext = createContext()

export default ({ children }) => {
  const [activeRequests, setActiveRequests] = useState(0)

  const incrementRequests = () => setActiveRequests(prev => prev + 1)
  const decrementRequests = () => setActiveRequests(prev => prev - 1)

  return (
    <LoaderContext.Provider
      value={{
        loader: activeRequests > 0,
        incrementRequests,
        decrementRequests
      }}
    >
      {children}
    </LoaderContext.Provider>
  )
}