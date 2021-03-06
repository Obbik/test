import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import JavascriptTimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import pl from 'javascript-time-ago/locale/pl'

import Dashboard from './dashboard_env/app/App'
import * as serviceWorker from './serviceWorker'
import { DB_TYPE } from './env'

import 'react-notifications/lib/notifications.css'

JavascriptTimeAgo.addLocale(en)
JavascriptTimeAgo.addLocale(pl)

const environment = process.env.CLIENT_ENVIRONMENT || DB_TYPE

if (process.env.NODE_ENV === 'development') console.log(`Environment: ${environment}`)

render(
  <BrowserRouter basename="dashboard">
    <Dashboard />
  </BrowserRouter>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
