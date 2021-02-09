import React, { useState, createContext, useContext } from 'react'
import Sidebar from '../components/Navigation/Sidebar'
import Header from '../components/Navigation/Header'
import { LoaderContext } from '../context/loader-context'
import { ErrorContext } from './error-context'
import ErrorWrapper from '../components/ErrorWrapper/ErrorWrapper'
import Loader from '../components/Loader/Loader'
import Definitions from '../components/Modals/Definitions'

export const NavigationContext = createContext()

export default ({ children }) => {
  const { fatalError } = useContext(ErrorContext)
  const { loader } = useContext(LoaderContext)
  const sidebarWidth = localStorage.getItem('sidebarWidth')

  const [sectionModal, setSectionModal] = useState(null)
  const closeModal = () => setSectionModal(null)

  const [width, setWidth] = useState(sidebarWidth)
  const toggleSidebarWidth = () =>
    setWidth(prev => {
      console.log(prev)
      if (prev === 'md') {
        localStorage.setItem('sidebarWidth', 'sm')
        return 'sm'
      } else {
        localStorage.setItem('sidebarWidth', 'md')
        return 'md'
      }
    })

  const [headerData, setHeaderData] = useState({})

  let navlinks=[]

    if (sessionStorage.getItem('DB_TYPE') === "mssql")
    {
      navlinks.push(
    ...[
        { text: 'Monitoring', path: '/', icon: 'fa fa-desktop' },
                { text: 'Maszyny', path: '/machines', icon: 'fas fa-tablet-alt' },
                { text: 'Terminale', path: '/terminals', icon: 'fas fa-credit-card' },
                { text: 'Klienci', path: '/clients', icon: 'fas fa-users-cog' },
                // { text: 'Zadania', path: '/tasks', icon: 'fas fa-tasks' },
                { text: 'Produkty', path: '/products', icon: 'fas fa-cookie-bite' },
                { text: 'Kategorie', path: '/categories', icon: 'fas fa-th-large' }
      ])
    }
    else if (localStorage.getItem('clientId') === 'console')
    {
      navlinks.push (
        ...[
          { text: 'Monitoring', path: '/', icon: 'fa fa-desktop' },
          { text: 'Maszyny', path: '/machines', icon: 'fas fa-tablet-alt' },
          { text: 'Terminale', path: '/terminals', icon: 'fas fa-credit-card' },
          { text: 'Klienci', path: '/clients', icon: 'fas fa-users-cog' },
          // { text: 'Zadania', path: '/tasks', icon: 'fas fa-tasks' },
          { text: 'Produkty', path: '/products', icon: 'fas fa-cookie-bite' },
          { text: 'Kategorie', path: '/categories', icon: 'fas fa-th-large' }
        ])
      }

  else if (sessionStorage.getItem('DB_TYPE') === 'sql')
  {
    navlinks.push(
  ...[
      // { text: 'Monitoring', path: '/', icon: 'fa fa-desktop' },
      { text: 'Maszyny', path: '/machines', icon: 'fas fa-tablet-alt' },
      { text: 'Kategorie', path: '/categories', icon: 'fas fa-th-large' },
              { text: 'Terminale', path: '/terminals', icon: 'fas fa-credit-card' },
              { text: 'Klienci', path: '/clients', icon: 'fas fa-users-cog' },
              // { text: 'Zadania', path: '/tasks', icon: 'fas fa-tasks' },
              { text: 'Produkty', path: '/products', icon: 'fas fa-cookie-bite' },
    ])
  }
console.log(navlinks)
console.log(sessionStorage.getItem('DB_TYPE'))
  navlinks.push({ text: 'Wyloguj się', path: '/logout', icon: 'fas fa-sign-out-alt' })

  return (
    <NavigationContext.Provider value={{ setHeaderData }}>
      <Sidebar width={width} navlinks={navlinks} />
      <div className="w-100 d-flex flex-column">
        <Header
          toggleSidebar={toggleSidebarWidth}
          headerData={headerData}
          navlinks={navlinks}
        />
        {fatalError ? (
          <ErrorWrapper />
        ) : (
          <div
            className={`d-flex flex-column flex-grow-1 ${
              loader ? 'position-relative' : ''
            }`}
          >
            {sectionModal}
            {loader && <Loader />}
            <div className="container-lg p-3 h-100 d-flex flex-column">{children}</div>
          </div>
        )}
      </div>
    </NavigationContext.Provider>
  )
}
