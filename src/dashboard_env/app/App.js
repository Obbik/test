import React from 'react'
import { DB_TYPE } from "../../env"

import LangProvider from '../context/lang-context'
import ErrorProvider from '../context/error-context'
import LoaderProvider from '../context/loader-context'
import NotificationProvider from '../context/notification-context'
import NavigationProvider from '../context/navigation-context'
import SearchbarProvider from '../context/searchbar-context'
import { Route, Switch, Redirect } from 'react-router-dom'
import { NotificationContainer } from 'react-notifications'

import '../assets/bootstrap.min.css'
import 'react-notifications/lib/notifications.css'
import '../assets/fontawesome/css/all.css'

import './App.css'

import Login from '../views/Auth/login'
import Logout from '../views/Auth/Logout'
// import Products from '../views/Product/Products'
// import Categories from '../views/Category/Categories'
// import Settings from '../views/Settings/Settings'
import Config from '../views/Config/Config'
import Supply from '../views/Supply/Supply'
import Monitoring from '../views/ConsoleView/Monitoring/Monitoring'
import MachinesConsole from '../views/ConsoleView/Machines/Machines'
import FullMachineConsole from '../views/ConsoleView/Machines/FullMachine'
import Terminals from '../views/ConsoleView/Terminals/Terminals'
import Clients from '../views/ConsoleView/Clients/Clients'
// import Tasks from '../views/ConsoleView/Tasks/Tasks'
import Products from '../views/ConsoleView/Products/Products'
import Categories from '../views/ConsoleView/Categories/Categories'

import Machines from '../views/ClientView/Machines/Machines'
import FullMachine from '../views/ClientView/Machines/FullMachine'
// import Definition from '../views/ClientView/Definitions/Definition'
import Catalog from '../views/ClientView/Catalog/Catalog'
import Reports from '../views/ClientView/Reports/Reports'
import Tags from '../views/ClientView/Tags/Tags'

import useAuth from '../hooks/auth-hook'

export default () => {
  const { isAuth, login, logout } = useAuth()


  sessionStorage.setItem("DB_TYPE", DB_TYPE)
  let authRoutes = []

  const getInitialRoutes = () => {
    if (sessionStorage.getItem('DB_TYPE') === "mysql") {
      return ('/config')
    }
    else if (localStorage.getItem('clientId') === 'console') {
      return ('/')
    }
    else {
      return ('/machines')
    }
  }

  if (sessionStorage.getItem('DB_TYPE') === "mysql") // MACHINE Routes
  {
    console.log("MACHINE")
    authRoutes.push(
      { path: ['/products', '/products/:categoryId'], component: Products },
      { path: '/config', component: Config },
      { path: '/supply', component: Supply },
      { path: '/categories', component: Categories }
    )
  }

  else if (localStorage.getItem('clientId') === 'console') {
    authRoutes.push(
      { path: '/', component: Monitoring },
      { path: '/supply', component: Config },
      { path: '/machines', component: MachinesConsole },
      { path: '/machine/:machineId', component: FullMachineConsole },
      { path: '/terminals', component: Terminals },
      { path: '/clients', component: Clients },
      { path: '/categories', component: Categories },
      // { path: '/tasks', component: Tasks },
      { path: ['/products', '/products/:categoryId'], component: Products },
      {
        path: [
          '/catalog-products',
          '/catalog-categories',
          '/catalog-products'
        ],
        component: Catalog
      }
    )
  }

  else {
    console.log("SERVER")
    authRoutes.push(
      { path: ['/products', '/products/:categoryId'], component: Products },
      { path: '/machines', component: Machines },
      { path: '/categories', component: Categories },
      { path: '/machine/:machineId', component: FullMachine },
      { path: '/reports', component: Reports },
      { path: '/tags', component: Tags },
      {
        path: [
          '/catalog-products',
          '/catalog-categories',
          '/catalog-products'
        ],
        component: Catalog
      }
    )
  }


  return (
    <LangProvider>
      <ErrorProvider>
        <NotificationProvider>
          <LoaderProvider>
            <div className="d-flex min-vh-100 bg-light">
              {isAuth ? (
                <NavigationProvider>
                  <SearchbarProvider>
                    <Switch>

                      {authRoutes.map((route, idx) => (
                        <Route key={idx} exact {...route} />
                      ))}
                      <Route
                        exact
                        path="/logout"
                        render={() => <Logout logout={logout} />}
                      />
                      {<Redirect to={getInitialRoutes()} />}
                    </Switch>
                  </SearchbarProvider>
                </NavigationProvider>
              ) : (
                  <Switch>
                    <Route exact path="/login" render={() => <Login login={login} />} />
                    <Redirect to="/login" />
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
