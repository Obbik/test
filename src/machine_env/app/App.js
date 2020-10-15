import React from 'react'

import LangProvider from '../context/lang-context'
import ErrorProvider from '../context/error-context'
import LoaderProvider from '../context/loader-context'
import NotificationProvider from '../context/notification-context'
import NavigationProvider from '../context/navigation-context'
import { Route, Switch, Redirect } from 'react-router-dom'
import { NotificationContainer } from 'react-notifications'

import 'react-notifications/lib/notifications.css'
import '../assets/fontawesome/css/all.css'
import '../assets/bootstrap.min.css'
import './App.css'

// import ScrollToTop from '../components/ScrollToTopButton/ScrollToTop'

import Login from '../views/Auth/Login'
import Logout from '../views/Auth/Logout'
import Products from '../views/Product/Products'
import Categories from '../views/Category/Categories'
import Config from '../views/Config/Config'
import Supply from '../views/Supply/Supply'

import useAuth from '../hooks/auth-hook'

export default () => {
  const { permissions, login, logout } = useAuth()

  let authRoutes = [{ path: '/logout', render: () => <Logout logout={logout} /> }]

  if (permissions) {
    if (permissions.includes('{1}'))
      authRoutes.push({
        path: ['/products', '/products/:categoryId'],
        component: Products
      })
    if (permissions.includes('{2}'))
      authRoutes.push({ path: '/categories', component: Categories })
    if (permissions.includes('{3}'))
      authRoutes.push({ path: '/config', component: Config })
    if (permissions.includes('{4}'))
      authRoutes.push({ path: '/supply', render: () => <Supply logout={logout} /> })
  }

  return (
    <LangProvider>
      <ErrorProvider>
        <NotificationProvider>
          <LoaderProvider>
            <div className="d-flex min-vh-100 bg-light">
              {permissions ? (
                <NavigationProvider>
                  <Switch>
                    {authRoutes.map((route, idx) => (
                      <Route key={idx} exact {...route} />
                    ))}
                    <Redirect to="/supply" />
                  </Switch>
                  {/* <ScrollToTop /> */}
                </NavigationProvider>
              ) : (
                <Switch>
                  <Route exact path="/" render={() => <Login login={login} />} />
                  <Redirect to="/" />
                </Switch>
              )}
              <NotificationContainer />
            </div>
          </LoaderProvider>
        </NotificationProvider>
      </ErrorProvider>
    </LangProvider>
  )
}
