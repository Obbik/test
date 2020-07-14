import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import axios from 'axios'

import url from '../../util/url'

import gbFlag from '../../assets/flags/gb.png'
import plFlag from '../../assets/flags/pl.png'

import logo from '../../assets/images/logo-vendim.png'

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
          const { token, userName, permissions } = res.data

          login(userName, permissions, token)
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
    <div className="container">
      <button onClick={returnToShop} className="btn btn-secondary mt-4">
        <i className="fas fa-arrow-left mr-2"></i> {buttons.goToShop}
      </button>
      <div className="card card-body bg-light my-4">
        <div className="text-center mt-2 mb-3">
          <img src={logo} alt="logo" height="70" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">{auth.email}</label>
            <input
              type="email"
              name="email"
              defaultValue="service@gmail.com"
              className="form-control form-control-lg"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{auth.password}</label>
            <input
              type="password"
              name="password"
              defaultValue="123456"
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
          <button type="submit" className="btn btn-success btn-block">
            {buttons.login}
          </button>
        </form>
      </div>
      <div className="text-center mb-4">
        <img
          className="flag mx-3"
          src={gbFlag}
          alt="en_flag"
          width="64"
          height="64"
          onClick={() => changeLanguage('en')}
        />
        <img
          className="flag mx-3"
          src={plFlag}
          alt="pl_flag"
          width="64"
          height="64"
          onClick={() => changeLanguage('pl')}
        />
      </div>
    </div>
  )
}
