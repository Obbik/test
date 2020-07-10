import React, { useState, useCallback } from 'react'
import LangProvider from '../context/lang-context'
import { Route, Switch, Redirect } from 'react-router-dom'
import { NotificationContainer, NotificationManager } from 'react-notifications'

import 'react-notifications/lib/notifications.css'
import '../containers/Sidebar/Sidebar.css'
import '../assets/fontawesome/css/all.css'
import './App.css'

import Navbar from './Navbar/Navbar'
import Auth from './User/Auth'
import Products from './Product/Products'
import Categories from './Category/Categories'
import FullProduct from './Product/FullProduct'
import FullCategory from './Category/FullCategory'
import Loader from '../components/Loader/Loader'
import Sidebar from './Sidebar/Sidebar'
import MachineProducts from './Machine/MachineProducts'
import FullMachineProduct from './Machine/FullMachineProduct'
import MachineProductBoostView from './Machine/MachineProductsRecharge'
import Settings from './Settings/Settings'

import url from '../util/url'

export default () => {
  const [loader, setLoader] = useState(false)

  const setAutoLogout = useCallback(milliseconds => {
    setTimeout(() => logout(), milliseconds)
  }, [])

  const logout = () => {
    setIsAuth(false)
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('expirationDate')
  }

  const [isAuth, setIsAuth] = useState(() => {
    const token = localStorage.getItem('token')
    const expirationDate = localStorage.getItem('expirationDate')

    if (!token || !expirationDate) return false

    if (new Date(expirationDate) <= new Date()) {
      localStorage.removeItem('token')
      localStorage.removeItem('userName')
      localStorage.removeItem('expirationDate')

      return false
    }

    const remainingMilliseconds =
      new Date(expirationDate).getTime() - new Date().getTime()

    setAutoLogout(remainingMilliseconds)

    return true
  })

  const login = (userName, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userName', userName)

    const newExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60)

    localStorage.setItem('expirationDate', newExpirationDate.toISOString())
    setAutoLogout(newExpirationDate)

    setIsAuth(true)
  }

  const NotificationError = message =>
    NotificationManager.error(message.toString(), null, 4000)

  const NotificationSuccess = message => NotificationManager.success(message, null, 4000)

  const [sidebar, setSidebar] = useState(true)
  const toggleSidebar = () => setSidebar(prev => !prev)

  let content
  if (isAuth) {
    const payload = {
      url,
      setLoader,
      NotificationError,
      NotificationSuccess
    }

    const routes = [
      {
        path: '/',
        render: () => <Products {...payload} sharedProducts={false} />
      },
      {
        path: '/products/:categoryId',
        render: () => <Products {...payload} sharedProducts={false} />
      },
      {
        path: '/product/:id',
        render: () => <FullProduct {...payload} />
      },
      {
        path: '/categories',
        render: () => <Categories {...payload} />
      },
      {
        path: '/category/:id',
        render: () => <FullCategory {...payload} />
      },
      {
        path: '/machine-products',
        render: () => <MachineProducts {...payload} />
      },
      {
        path: '/machine-product/:id',
        render: () => <FullMachineProduct {...payload} />
      },
      {
        path: '/machine-boost',
        render: () => <MachineProductBoostView {...payload} />
      },
      {
        path: '/settings',
        render: () => <Settings {...payload} />
      }
    ]

    content = (
      <>
        <Sidebar showSidebar={sidebar} />
        <div className="col body-col">
          <Navbar
            onLogout={logout}
            onToggleSidebar={toggleSidebar}
            showSidebar={sidebar}
          />
          <div className="container navbar-margin">
            <Switch>
              {routes.map((route, idx) => (
                <Route key={idx} exact {...route} />
              ))}
              <Redirect to="/" />
            </Switch>
          </div>
        </div>
      </>
    )
  } else {
    content = (
      <div className="col body-col">
        {isAuth && (
          <Navbar
            onLogout={logout}
            onToggleSidebar={toggleSidebar}
            showSidebar={sidebar}
          />
        )}
        <div className="container navbar-margin">
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <Auth
                  login={login}
                  setLoader={setLoader}
                  NotificationError={NotificationError}
                />
              )}
            />
            <Redirect to="/" />
          </Switch>
        </div>
      </div>
    )
  }

  return (
    <LangProvider>
      {loader && <Loader />}
      <NotificationContainer />
      <div className="row body-row">{content}</div>
    </LangProvider>
  )
}
