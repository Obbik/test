import React, { useState, useCallback } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import axios from 'axios'

import 'react-notifications/lib/notifications.css'
import '../containers/Sidebar/Sidebar.css'
import '../assets/fontawesome/css/all.css'
import './App.css'

import Navbar from './Navbar/Navbar_alt'
import Login from './User/Login_alt'
import Products from './Product/Products_alt'
import Categories from './Category/Categories_alt'
import FullProduct from './Product/FullProduct_alt'
import FullCategory from './Category/FullCategory_alt'
import Loader from '../components/Loader/Loader_alt'
import Sidebar from '../containers/Sidebar/Sidebar_alt'
import MachineProductsView from './Machine/MachineProduct/MachineProductsView_alt'
import FullMachineProduct from './Machine/MachineProduct/FullMachineProduct_alt'
import MachineProductBoostView from './Machine/MachineProductBoost/MachineProductsBoostView_alt'
import Settings from './Settings/Settings_alt'

import url from '../helpers/url'

export default () => {
  const [loader, setLoader] = useState(false)

  const setAutoLogout = useCallback(milliseconds => {
    setTimeout(() => logout(), milliseconds)
  }, [])

  const logout = () => {
    setIsAuth(false)

    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('expiryDate')
  }

  const [isAuth, setIsAuth] = useState(() => {
    const token = localStorage.getItem('token')
    const expiryDate = localStorage.getItem('expiryDate')

    if (!token || !expiryDate) return false

    if (new Date(expiryDate) <= new Date()) return false

    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime()

    setAutoLogout(remainingMilliseconds)

    return true
  })

  const NotificationError = message =>
    NotificationManager.error(message.toString(), null, 4000)

  const NotificationSuccess = message =>
    NotificationManager.success(message, null, 4000)

  const [sidebar, setSidebar] = useState(true)

  const login = user => {
    setLoader(true)

    axios
      .put(`${url}api/auth/login`, user)
      .then(res => {
        setLoader(false)
        if (res.status === 422) throw new Error('Validation failed.')

        if (res.status !== 200 && res.status !== 201)
          throw new Error('Could not authenticate.')

        return res.data
      })
      .then(res => {
        const { token, userName } = res

        localStorage.setItem('token', token)
        localStorage.setItem('userName', userName)

        const remainingMilliseconds = 60 * 60 * 1000
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        )

        localStorage.setItem('expiryDate', expiryDate.toISOString())

        setIsAuth(true)
        setAutoLogout(remainingMilliseconds)
      })
      .catch(err => {
        setLoader(false)
        setIsAuth(false)
        NotificationError(err)
      })
  }

  // Sidebar
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
        path: ['/', '/products/:categoryId'],
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
        render: () => <MachineProductsView {...payload} />
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
            <Route exact path="/" render={() => <Login onLogin={login} />} />
            <Redirect to="/" />
          </Switch>
        </div>
      </div>
    )
  }

  return (
    <>
      <Loader active={loader} />
      <NotificationContainer />
      <div className="row body-row">{content}</div>
    </>
  )
}
