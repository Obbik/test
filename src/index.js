import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import LangProvider from './context/lang-context'
import ErrorProvider from './context/error-context'
import LoaderProvider from './context/loader-context'
import NotificationProvider from './context/notification-context'

import './assets/bootstrap.min.css'

import App from './app/App'
import * as serviceWorker from './serviceWorker'

render(
  <BrowserRouter basename="dashboard">
    <LangProvider>
      <ErrorProvider>
        <NotificationProvider>
          <LoaderProvider>
            <App />
          </LoaderProvider>
        </NotificationProvider>
      </ErrorProvider>
    </LangProvider>
  </BrowserRouter>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
