import React, { useState, useEffect } from 'react'
import { DB_TYPE } from "../../env"
import { API_URL } from "../config/config"

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
import axios from "axios"

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

import { useLocation, useHistory } from "react-router-dom";
import useAuth from '../hooks/auth-hook'


export default () => {
  const { isAuth, login, logout } = useAuth()

  const [permission, setPermission] = useState([])


  sessionStorage.setItem("DB_TYPE", DB_TYPE)
  let authRoutes = []



  if (sessionStorage.getItem('DB_TYPE') === "mysql") // MACHINE Routes
  {
    permission.forEach((permission) => {
      console.log("MACHINE")
      switch (permission.Name) {
        case "VD_MACHINE_CONFIG":
          authRoutes.push({ path: '/machines', component: Machines }, { path: '/machine/:machineId', component: FullMachine },)
          break;
        case "VD_PRODUCTS":
          authRoutes.push({ path: ['/products', '/products/:categoryId'], component: Products })
          break;
        case "VD_CATEGORIES":
          authRoutes.push({ path: '/categories', component: Categories },)
          break;
        case "VD_MACHINE_RECHARGE":
          authRoutes.push({ path: ['/catalog-products', '/catalog-categories', '/catalog-products'], component: Catalog })
          break;
        default:
          break;
      }
    })
  }

  else if (localStorage.getItem('clientId') === 'console') {
    permission.forEach((permission) => {
      switch (permission.Name) {
        case "VD_MONITORING":
          authRoutes.push({ path: '/', component: Monitoring })
          break;
        case "VD_MACHINES":
          authRoutes.push({ path: '/machines', component: MachinesConsole },)
          break;
        case "VD_TERMINALS":
          authRoutes.push({ path: '/terminals', component: Terminals },)
          break;
        case "VD_CUSTOMERS":
          authRoutes.push({ path: '/clients', component: Clients },)
          break;
        case "VD_PRODUCTS":
          authRoutes.push({ path: ['/products', '/products/:categoryId'], component: Products },)
          break;
        case "VD_CATEGORIES":
          authRoutes.push({ path: '/categories', component: Categories })
          break;
        default:
          break;
      }
    }
    )
  }
  else {
    console.log("SERVER")
    permission.forEach((permission) => {
      switch (permission.Name) {
        case "VD_PRODUCTS":
          authRoutes.push({ path: ['/products', '/products/:categoryId'], component: Products })

          break;
        case "VD_CATEGORIES":
          authRoutes.push({ path: '/categories', component: Categories },)
          break;
        case "VD_MACHINES":
          authRoutes.push({ path: '/machines', component: Machines }, { path: '/machine/:machineId', component: FullMachine },)
          break;
        case "VD_PRODUCT_CATALOG":
          authRoutes.push({ path: ['/catalog-products', '/catalog-categories'], component: Catalog })
          break;
        case "VD_TAGS":
          authRoutes.push({ path: '/tags', component: Tags },)
          break;
        case "VD_REPORTS":
          authRoutes.push({ path: '/reports', component: Reports },)
          break;
        default:
          break;
      }
    })
  }

  const getInitialRoutes = () => {
    if (authRoutes.length > 0) {
      if (typeof (authRoutes[0].path) == "object")
        return <Redirect to={authRoutes[0].path[0]} />

      else {
        return <Redirect to={authRoutes[0].path} />
      }
    }
  }
  useEffect(() => {
    axios
      .get(`${API_URL}/api/permissions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      }).then(({ data }) => setPermission(data))

  }, [])
  return (
    <LangProvider>
      <ErrorProvider>
        <NotificationProvider>
          <LoaderProvider>
            <div className="d-flex min-vh-100 bg-light">
              {isAuth ? (
                <NavigationProvider>
                  <SearchbarProvider>
                    {authRoutes.length > 0 ? <Switch>
                      {authRoutes.map((route, idx) => (
                        <Route key={idx} exact {...route} />
                      ))}

                      <Route
                        exact
                        path="/logout"
                        render={() => (<Logout logout={logout} />)}
                      />
                      {getInitialRoutes()}
                    </Switch> :
                      null
                    }

                  </SearchbarProvider>
                </NavigationProvider>
              ) : (
                  <Switch>
                    <Route exact path="/login" render={() => (<Login login={login} setPermission={setPermission} />)} />
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
