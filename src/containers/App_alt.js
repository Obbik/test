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
import ProductCategory from './Product/ProductCategory_alt'
import FullCategory from './Category/FullCategory_alt'
import Loader from '../components/Loader/Loader_alt'
import Sidebar from '../containers/Sidebar/Sidebar_alt'
import MachineProductsView from './Machine/MachineProduct/MachineProductsView_alt'
import FullMachineProduct from './Machine/MachineProduct/FullMachineProduct_alt'
import MachineProductBoostView from './Machine/MachineProductBoost/MachineProductsBoostView_alt'
import Settings from './Settings/Settings_alt'

export default () => {
  const url = 'http://localhost:3000/'
  // http://46.41.150.192/vendim-rest-api/
  // https://vendim-rest-api.herokuapp.com/

  const [loader, setLoader] = useState(false)

  const setAutoLogout = useCallback(milliseconds => {
    setTimeout(() => {
      logout()
    }, milliseconds)
  }, [])

  const logout = () => {
    setState({
      token: null,
      isAuth: false
    })

    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
  }

  const [state, setState] = useState(() => {
    const token = localStorage.getItem('token'),
      userId = localStorage.getItem('userId'),
      userName = localStorage.getItem('userName'),
      expiryDate = localStorage.getItem('expiryDate')

    if (!token || !expiryDate)
      return {
        token: null,
        userId: null,
        isAuth: false
      }

    if (new Date(expiryDate) <= new Date()) {
      return {
        token: null,
        isAuth: false
      }
    }

    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime()

    setAutoLogout(remainingMilliseconds)

    return {
      token,
      userId,
      userName,
      isAuth: true
    }
  })

  const NotificationError = message => {
    NotificationManager.error(message.toString(), null, 4000)
  }

  const NotificationSuccess = message => {
    NotificationManager.success(message, null, 4000)
  }

  const [sidebar, setSidebar] = useState(true)

  const login = user => {
    setLoader(true)

    axios
      .put(`${url}api/auth/login`, user)
      .then(res => {
        if (res.status === 422) throw new Error('Validation failed.')

        if (res.status !== 200 && res.status !== 201)
          throw new Error('Could not authenticate.')

        return res.data
      })
      .then(res => {
        const token = res.token
        const userId = res.userId
        const userName = res.userName

        setState({
          token,
          userId,
          userName,
          isAuth: true
        })
        setLoader(false)

        localStorage.setItem('token', token)
        localStorage.setItem('userId', userId)
        localStorage.setItem('userName', userName)

        const remainingMilliseconds = 60 * 60 * 1000
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        )

        localStorage.setItem('expiryDate', expiryDate.toISOString())

        setAutoLogout(remainingMilliseconds)
      })
      .catch(err => {
        setState({
          isAuth: false
        })
        setLoader(false)
        NotificationManager.error(err.toString(), null, 4000)
      })
  }

  // Sidebar
  const toggleSidebar = () => {
    setSidebar(prev => !prev)
  }

  let routes
  if (!state.isAuth)
    routes = (
      <Switch>
        <Route exact path="/" render={() => <Login onLogin={login} />} />
        <Redirect to="/" />
      </Switch>
    )
  else {
    const payload = {
      url,
      token: state.token,
      setLoader,
      NotificationError,
      NotificationSuccess
    }

    const routes_obj = [
      {
        path: ['/', '/products/:categoryId'],
        render: () => <Products {...payload} sharedProducts={false} />
      },
      {
        path: '/product/:id',
        render: () => <FullProduct {...payload} />
      },
      {
        path: '/product-category/:id',
        render: () => <ProductCategory {...payload} />
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

    routes = (
      <Switch>
        {routes_obj.map((route, idx) => (
          <Route key={idx} exact {...route} />
        ))}
        <Redirect to="/" />
      </Switch>
    )
  }

  return (
    <>
      <Loader active={loader} />
      <NotificationContainer />
      <div className="row body-row">
        {state.isAuth ? (
          <Sidebar
            showSidebar={sidebar}
            url={url}
            token={state.token}
            userName={state.userName}
          />
        ) : null}
        <div className="col body-col">
          {state.isAuth ? (
            <Navbar
              onLogout={logout}
              onToggleSidebar={toggleSidebar}
              showSidebar={sidebar}
            />
          ) : null}
          <div className="container navbar-margin">
            {/* container-fluid */}
            {routes}
          </div>
        </div>
      </div>
    </>
  )
}
