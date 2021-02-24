import React, { useState, createContext, useContext, useEffect } from 'react'
import Sidebar from '../components/Navigation/Sidebar'
import Header from '../components/Navigation/Header'
import { LoaderContext } from '../context/loader-context'
import { ErrorContext } from './error-context'
import ErrorWrapper from '../components/ErrorWrapper/ErrorWrapper'
import Loader from '../components/Loader/Loader'

import { API_URL } from "../config/config"

import axios from "axios"
export const NavigationContext = createContext()

export default ({ children }) => {
  const { fatalError } = useContext(ErrorContext)
  const { loader } = useContext(LoaderContext)
  const sidebarWidth = localStorage.getItem('sidebarWidth')
  const [sectionModal, setSectionModal] = useState(null)
  const [permission, setPermission] = useState([])

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
    permission.forEach((permission) => {
      switch (permission.Name) {
        case "VD_PRODUCTS":
          navlinks.push({ text: 'Produkty', path: '/products', icon: 'fas fa-cookie-bite' },)
          break;
        case "VD_CATEGORIES":
          navlinks.push({ text: 'Kategorie', path: '/categories', icon: 'fas fa-th-large' },)
          break;
        case "VD_MACHINE_CONFIG":
          navlinks.push({ text: "supply", path: '/supply', icon: 'fas fa-cart-plus' },)
          break;
        case "VD_MACHINE_RECHARGE":
          navlinks.push({ text: 'konfiguracja', path: '/config', icon: 'fas fa-cog' },)
          break;
        default:
          break;
      }
    })

  }
  else if (localStorage.getItem('clientId') === 'console')
    permission.forEach((permission) => {
      switch (permission.Name) {
        case "VD_MONITORING":
          navlinks.push({ text: 'Monitoring', path: '/', icon: 'fa fa-desktop' },)
          break;
        case "VD_MACHINES":
          navlinks.push({ text: 'Maszyny', path: '/machines', icon: 'fas fa-tablet-alt' },)
          break;
        case "VD_TERMINALS":
          navlinks.push({ text: 'Terminale', path: '/terminals', icon: 'fas fa-credit-card' },)
          break;
        case "VD_CUSTOMERS":
          navlinks.push({ text: 'Klienci', path: '/clients', icon: 'fas fa-users-cog' },)
          break;
        case "VD_PRODUCTS":
          navlinks.push({ text: 'Produkty', path: '/products', icon: 'fas fa-cookie-bite' },)
          break;
        case "VD_CATEGORIES":
          navlinks.push({ text: 'Kategorie', path: '/categories', icon: 'fas fa-th-large' })
          break;
        default:
          break;
      }
    }
    )
  else //SERVER Routes
  {

    permission.forEach((permission) => {
      switch (permission.Name) {
        case "VD_PRODUCTS":
          navlinks.push({ text: 'Produkty', path: '/products', icon: 'fas fa-cookie-bite' })
          break;
        case "VD_CATEGORIES":
          navlinks.push({ text: 'Kategorie', path: '/categories', icon: 'fas fa-th-large' })
          break;
        case "VD_MACHINES":
          navlinks.push({ text: 'Maszyny', path: '/machines', icon: 'fas fa-tablet-alt' },)
          break;
        case "VD_PRODUCT_CATALOG":
          navlinks.push({ text: 'Katalog', path: '/catalog-products', icon: 'fas fa-th-list' },)
          break;
        case "VD_TAGS":
          navlinks.push({ text: 'Tagi', path: '/tags', icon: 'fas fa-tags' },)
          break;
        case "VD_REPORTS":
          navlinks.push({ text: 'Raporty', path: '/reports', icon: 'far fa-file-alt' },)
          break;
        default:
          break;
      }
    })

  }
  navlinks.push({ text: 'Wyloguj się', path: '/logout', icon: 'fas fa-sign-out-alt' })

  useEffect(() => {
    axios
      .get(`${API_URL}/api/permissions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      }).then(({ data }) => setPermission(data))

  }, [])

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
