import React, { useState, useContext, createContext } from 'react'
import { ErrorContext } from './error-context'
import { LoaderContext } from './/loader-context'
import ErrorWrapper from '../components/ErrorWrapper/ErrorWrapper'
import Sidebar from '../components/Navigation/Sidebar'
import Header from '../components/Navigation/Header'
import Bottombar from '../components/Navigation/Bottombar'

import Loader from '../components/Loader/Loader'

export const NavigationContext = createContext()

export default ({ children }) => {
  const { fatalError } = useContext(ErrorContext)
  const { loader } = useContext(LoaderContext)

  const sidebarWidth = localStorage.getItem('sidebarWidth')
  const [fullWidth, setFullWidth] = useState(sidebarWidth)
  const toggleSidebar = () =>
    setFullWidth(prev => {
      if (prev === 'md') localStorage.setItem('sidebarWidth', 'sm')
      else localStorage.setItem('sidebarWidth', 'md')

      return !prev
    })

  const [headerData, setHeaderData] = useState({})

  return (
    <NavigationContext.Provider value={{ setHeaderData }}>
      <Sidebar fullWidth={fullWidth} />
      <div className="w-100 d-flex flex-column" style={{ zIndex: 2 }}>
        {loader && <Loader />}
        <Header toggleSidebar={toggleSidebar} headerData={headerData} />
        {fatalError ? (
          <ErrorWrapper />
        ) : (
          <div className="container-lg py-4">{children}</div>
        )}
        <Bottombar />
      </div>
    </NavigationContext.Provider>
  )
}
