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

// import '../assets/bootstrap.min.css'
import 'react-notifications/lib/notifications.css'
import '../assets/fontawesome/css/all.css'

import './App.css'

import Login from '../views/Auth/Login'
import Logout from '../views/Auth/Logout'

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
import Definition from '../views/ClientView/Definitions/Definition'
import Catalog from '../views/ClientView/Catalog/Catalog'
import Reports from '../views/ClientView/Reports/Reports'
import Tags from '../views/ClientView/Tags/Tags'

import useAuth from '../hooks/auth-hook'

export default () => {
  const { isAuth, login, logout } = useAuth()

  console.log(DB_TYPE)
  
  let authRoutes = []
  if (localStorage.getItem('clientId') === 'console')
    authRoutes.push(
      { path: '/', component: Monitoring },
      { path: '/machines', component: MachinesConsole },
      { path: '/machine/:machineId', component: FullMachineConsole },
      { path: '/terminals', component: Terminals },
      { path: '/clients', component: Clients },
      // { path: '/tasks', component: Tasks },
      { path: ['/products', '/products/:categoryId'], component: Products },
      { path: '/categories', component: Categories }
    )
  else
    authRoutes.push(
      { path: '/machines', component: Machines },
      { path: '/machine/:machineId', component: FullMachine },
      // { path: '/definitions', component: Definitions },
      // { path: '/definitions/:definition', component: Definition },
      { path: '/reports', component: Reports },
      { path: '/tags', component: Tags }
    )

  if (localStorage.getItem('clientId') === 'dev')
    authRoutes.push(
      { path: '/definitions/:definition', component: Definition },
      {
        path: [
          '/catalog-products',
          '/catalog-categories',
          '/catalog-products/:categoryId'
        ],
        component: Catalog
      }
    )
      
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
                      {localStorage.getItem('clientId') === 'console' ? (
                        <Redirect to="/" />
                      ) : (
                        <Redirect to="/machines" />
                      )}
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
