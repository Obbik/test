import React, { useState, useCallback } from 'react'
import LangProvider from '../context/lang-context'
import { useHistory } from 'react-router-dom'
import { Route, Switch, Redirect } from 'react-router-dom'
import { NotificationContainer, NotificationManager } from 'react-notifications'

import 'react-notifications/lib/notifications.css'
import '../components/Sidebar/Sidebar.css'
import '../assets/fontawesome/css/all.css'
import './App.css'

import Navbar from '../components/Navbar/Navbar'
import Auth from './Auth/Auth'
import Products from './Product/Products'
import Categories from './Category/Categories'
import FullProduct from './Product/FullProduct'
import FullCategory from './Category/FullCategory'
import Loader from '../components/Loader/Loader'
import Sidebar from '../components/Sidebar/Sidebar'
// import Machines from './MachinesOverview/Machines'
// import MachineStatus from './Machine/MachineStatus'
import MachineConfig from './Machine/MachineConfig'
import MachineSupply from './Machine/MachineSupply'
import FullMachineProduct from './Machine/FullMachineProduct'
// import Settings from './Settings/Settings'

// import { CLIENT_TYPE } from '../config/config'

export default () => {
  const history = useHistory()

  const [loader, setLoader] = useState(false)

  const setAutoLogout = useCallback(milliseconds => {
    setTimeout(() => logout, milliseconds)
  }, [])

  const logout = () => {
    setPermissions(null)
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('expirationDate')
    localStorage.removeItem('permissions')
  }

  const [permissions, setPermissions] = useState(() => {
    const token = localStorage.getItem('token')
    const permissions = localStorage.getItem('permissions')
    const expirationDate = localStorage.getItem('expirationDate')

    if (!token || !expirationDate) return null

    if (new Date(expirationDate) <= new Date()) {
      localStorage.removeItem('token')
      localStorage.removeItem('userName')
      localStorage.removeItem('expirationDate')

      return null
    }

    const remainingMilliseconds =
      new Date(expirationDate).getTime() - new Date().getTime()

    setAutoLogout(remainingMilliseconds)

    return permissions
  })

  const login = (userName, permissions, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userName', userName)
    const permissionString = permissions.map(p => `{${p.PermissionId}}`).join(',')
    localStorage.setItem('permissions', permissionString)

    const newExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60)

    localStorage.setItem('expirationDate', newExpirationDate.toISOString())
    setAutoLogout(newExpirationDate)

    setPermissions(permissionString)
    history.push('/machine-boost')
  }

  const NotificationError = message =>
    NotificationManager.error(message.toString(), null, 4000)

  const NotificationSuccess = message => NotificationManager.success(message, null, 4000)

  let content

  if (permissions) {
    const payload = {
      setLoader,
      NotificationError,
      NotificationSuccess
    }

    let routes = []

    if (permissions.includes('{1}'))
      routes.push(
        {
          path: ['/', '/products/:categoryId'],
          render: () => <Products {...payload} sharedProducts={false} />
        },
        {
          path: '/product/:id',
          render: () => <FullProduct {...payload} />
        }
      )

    if (permissions.includes('{2}'))
      routes.push(
        {
          path: '/categories',
          render: () => <Categories {...payload} />
        },
        {
          path: '/category/:id',
          render: () => <FullCategory {...payload} />
        }
      )

    if (permissions.includes('{3}'))
      routes.push(
        {
          path: '/config',
          render: () => <MachineConfig {...payload} />
        },
        {
          path: '/machine-product/:id',
          render: () => <FullMachineProduct {...payload} />
        }
      )

    if (permissions.includes('{4}'))
      routes.push({
        path: '/supply',
        render: () => <MachineSupply {...payload} />
      })

    // {
    //   path: '/machines',
    //   render: () => <Machines />
    // },
    // {
    //   path: '/status',
    //   render: () => <MachineStatus />
    // },
    // {
    //   path: '/settings',
    //   render: () => <Settings {...payload} />
    // }

    content = (
      <>
        <Sidebar logout={logout} />
        <div className="col body-col">
          <Navbar logout={logout} />
          <div className="d-block d-lg-none navbar-margin"></div>
          <div className="container mt-4">
            <Switch>
              {routes.map((route, idx) => (
                <Route key={idx} exact {...route} />
              ))}
              <Redirect to="/supply" />
            </Switch>
          </div>
        </div>
      </>
    )
  } else {
    content = (
      <div className="col col-md-6 col-lg-5 mx-auto d-flex align-items-center">
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
    )
  }

  return (
    <LangProvider>
      {loader && <Loader />}
      <NotificationContainer />
      <div className="row body-row min-vh-100">{content}</div>
    </LangProvider>
  )
}
