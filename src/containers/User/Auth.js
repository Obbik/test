import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import axios from 'axios'

import url from '../../util/url'

const logo = require('../../assets/images/logo-vendim.png')

export default ({ login, setLoader, NotificationError }) => {
  const {
    changeLanguage,
    languagePack: { buttons, auth }
  } = useContext(LangContext)

  const handleSubmit = e => {
    e.preventDefault()

    const Email = e.target.elements.email.value
    const Password = e.target.elements.password.value
    const ClientId = e.target.elements.clientId.value

    if (Email && Password && ClientId) {
      setLoader(true)

      axios
        .put(`${url}api/auth/login`, { Email, Password, ClientId })
        .then(res => {
          if (res.status === 422) throw new Error('Validation failed.')
          if (res.status !== 200 && res.status !== 201)
            throw new Error('Could not authenticate.')

          setLoader(false)
          const { token, userName } = res.data

          login(userName, token)
        })
        .catch(err => {
          setLoader(false)
          NotificationError(err)
        })
    }
  }

  const returnToShop = () => {
    window.location.href = 'http://localhost:8080/shop'
  }

  return (
    <div className="row">
      <div className="col-md-6 mx-auto">
        <button onClick={returnToShop} className="btn btn-secondary">
          <i className="fas fa-arrow-left mr-2"></i> {buttons.goToShop}
        </button>
        <div className="card card-body bg-light my-4">
          <div className="text-center">
            <div className="mt-2 mb-4">
              <img src={logo} alt="logo" height="80" />
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">{auth.email}</label>
              <input
                type="email"
                name="email"
                //defaultValue="test@gmail.com"
                className="form-control form-control-lg"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">{auth.password}</label>
              <input
                type="password"
                name="password"
                //defaultValue="123456!@#$%^"
                autoComplete="off"
                className="form-control form-control-lg"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">{auth.clientId}</label>
              <input
                type="text"
                name="clientId"
                className="form-control form-control-lg"
                defaultValue="multivend"
                required
              />
            </div>
            <div className="row">
              <div className="col">
                <button type="submit" className="btn btn-success btn-block">
                  {buttons.login}
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="text-center">
          <img
            className="flag mx-3"
            src={url + 'images/multivend/flags/en.png'}
            alt="en_flag"
            width="64"
            height="64"
            onClick={() => changeLanguage('en')}
          />
          <img
            className="flag mx-3"
            src={url + 'images/multivend/flags/pl.png'}
            alt="pl_flag"
            width="64"
            height="64"
            onClick={() => changeLanguage('pl')}
          />
        </div>
      </div>
    </div>
  )
}
