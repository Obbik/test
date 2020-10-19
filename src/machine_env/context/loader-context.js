import React, { useState, createContext } from 'react'

export const LoaderContext = createContext()

export default ({ children }) => {
  const [loader, setLoader] = useState(false)

  const showLoader = () => setLoader(true)
  const hideLoader = () => setLoader(false)

  return (
    <LoaderContext.Provider
      value={{
        loader,
        showLoader,
        hideLoader
      }}
    >
      {children}
    </LoaderContext.Provider>
  )
}
