import React, { useState, useContext, createContext } from 'react'
import { ErrorContext } from './error-context'
import { LangContext } from './lang-context'
import { LoaderContext } from './loader-context'
import ErrorWrapper from '../components/ErrorWrapper/ErrorWrapper'
import Sidebar from '../components/Navigation/Sidebar'
import Header from '../components/Navigation/Header'
import Bottombar from '../components/Navigation/Bottombar'

import Loader from '../components/Loader/Loader'

export const NavigationContext = createContext()

export default ({ children }) => {
  const {
    languagePack: { navbar }
  } = useContext(LangContext)
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

  const routesConfig = [
    {
      permission: '{1}',
      icon: 'fas fa-cookie',
      text: navbar.products,
      path: '/products'
    },
    {
      permission: '{2}',
      icon: 'fas fa-th-large',
      text: navbar.categories,
      path: '/categories'
    },
    { permission: '{3}', icon: 'fas fa-cog', text: navbar.config, path: '/config' },
    { permission: '{4}', icon: 'fas fa-cart-plus', text: navbar.supply, path: '/supply' },
    { icon: 'fas fa-sign-out-alt', text: navbar.logout, path: '/logout' }
  ]

  const navLinks = []
  const permissions = sessionStorage.getItem('permissions')
  routesConfig.forEach(route => {
    if (!route.permission || permissions.includes(route.permission)) navLinks.push(route)
  })

  return (
    <NavigationContext.Provider value={{ setHeaderData }}>
      <Sidebar fullWidth={fullWidth} navLinks={navLinks} />
      <div className="w-100 d-flex flex-column" style={{ zIndex: 2 }}>
        {loader && <Loader />}
        <Header toggleSidebar={toggleSidebar} headerData={headerData} />
        {fatalError ? (
          <ErrorWrapper />
        ) : (
          <div className="container-lg py-4">{children}</div>
        )}
        <Bottombar navLinks={navLinks} />
      </div>
    </NavigationContext.Provider>
  )
}
