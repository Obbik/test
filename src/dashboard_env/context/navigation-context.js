import React, { useState, createContext, useContext } from 'react'
import Sidebar from '../components/Navigation/Sidebar'
import Header from '../components/Navigation/Header'
import { LoaderContext } from '../context/loader-context'
import { ErrorContext } from './error-context'
import ErrorWrapper from '../components/ErrorWrapper/ErrorWrapper'
import Loader from '../components/Loader/Loader'


export const NavigationContext = createContext()

export default ({ children }) => {
  const { fatalError } = useContext(ErrorContext)
  const { loader } = useContext(LoaderContext)
  const sidebarWidth = localStorage.getItem('sidebarWidth')

  const [sectionModal, setSectionModal] = useState(null)


  const [width, setWidth] = useState(sidebarWidth)
  const toggleSidebarWidth = () =>
    setWidth(prev => {
      if (prev === 'md') {
        localStorage.setItem('sidebarWidth', 'sm')
        return 'sm'
      } else {
        localStorage.setItem('sidebarWidth', 'md')
        return 'md'
      }
    })

  const [headerData, setHeaderData] = useState({})

  let navlinks = []

  if (sessionStorage.getItem('DB_TYPE') === "mysql") // MACHINE Routes
  {
    navlinks.push(
      ...[
        // { text: 'Zadania', path: '/tasks', icon: 'fas fa-tasks' },
        { text: 'Produkty', path: '/products', icon: 'fas fa-cookie-bite' },
        { text: 'Kategorie', path: '/categories', icon: 'fas fa-th-large' },
        { text: "supply", path: '/supply', icon: 'fas fa-cart-plus' },
        { text: 'konfiguracja', path: '/config', icon: 'fas fa-cog' },
      ])
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

  else //SERVER Routes
  {
    navlinks.push(
      ...[
        { text: 'Produkty', path: '/products', icon: 'fas fa-cookie-bite' },
        { text: 'Kategorie', path: '/categories', icon: 'fas fa-th-large' },
        { text: 'Maszyny', path: '/machines', icon: 'fas fa-tablet-alt' },
        // { text: 'Zadania', path: '/tasks', icon: 'fas fa-tasks' },
        { text: 'Katalog', path: '/catalog-products', icon: 'fas fa-th-list' },
        { text: 'Tagi', path: '/tags', icon: 'fas fa-tags' },
        { text: 'Raporty', path: '/reports', icon: 'far fa-file-alt' },
      ])
  }
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
              className={`d-flex flex-column flex-grow-1 ${loader ? 'position-relative' : ''
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
