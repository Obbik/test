import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import JavascriptTimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import pl from 'javascript-time-ago/locale/pl'

import ServerApp from './server_env/app/App'
import MachineApp from './machine_env/app/App'
import * as serviceWorker from './serviceWorker'
import { ENV } from './env'

import 'react-notifications/lib/notifications.css'

JavascriptTimeAgo.addLocale(en)
JavascriptTimeAgo.addLocale(pl)

const environment = process.env.CLIENT_ENVIRONMENT || ENV

if (process.env.NODE_ENV === 'development') console.log(`Environment: ${environment}`)

render(
  <BrowserRouter basename="dashboard">
    {environment === 'SERVER' ? <ServerApp /> : <MachineApp />}
  </BrowserRouter>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
