import React, { useEffect, useContext } from 'react'
import { ErrorContext } from '../../context/error-context'
import { LangContext } from '../../context/lang-context'
import { NotificationContext } from '../../context/notification-context'
import { LoaderContext } from '../../context/loader-context'
import axios from 'axios'

import { SHOP_URL, API_URL } from '../../config/config'

import gbFlag from '../../assets/flags/gb.png'
import plFlag from '../../assets/flags/pl.png'

import logo from '../../assets/images/logo-vendim.png'
import Loader from '../../components/Loader/Loader'

export default ({ login }) => {
  const { setError } = useContext(ErrorContext)
  const { ErrorNotification } = useContext(NotificationContext)
  const { loader, showLoader, hideLoader } = useContext(LoaderContext)
  const {
    changeLanguage,
    languagePack: { buttons, auth }
  } = useContext(LangContext)

  const handleSubmit = evt => {
    evt.preventDefault()

    const { email, password } = evt.target.elements

    if (email.value && password.value) {
      showLoader()

      axios
        .put(`${API_URL}api/auth/login`, {
          Email: email.value,
          Password: password.value,
          ClientId: 'multivend'
        })
        .then(res => {
          if (res.status === 422) setError('Validation failed.')
          if (res.status !== 200 && res.status !== 201)
            setError('Could not authenticate.')

          hideLoader()
          const { token, permissions } = res.data

          login(token, permissions)
        })
        .catch(err => {
          hideLoader()
          ErrorNotification(err)
        })
    }
  }

  const returnToShop = () => (window.location.href = SHOP_URL)

  useEffect(() => {
    const returnToShopTimeout = setTimeout(returnToShop, 60000)
    return () => clearTimeout(returnToShopTimeout)
  }, [])

  return (
    <>
      {loader && <Loader />}
      <div className="col col-md-8 col-lg-6 mx-auto d-flex align-items-center">
        <div className="container">
          <div className="mt-4">
            <button onClick={returnToShop} className="btn btn-link text-decoration-none">
              <i className="fas fa-arrow-left mr-2" />
              {buttons.goToShop}
            </button>
          </div>
          <div className="card card-body bg-fade my-3 p-4">
            <div className="text-center mt-2 mb-4">
              <img src={logo} alt="logo" height="70" />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-2 mb-md-3 mb-lg-4">
                <label className="small">{auth.email}</label>
                <input
                  type="email"
                  name="email"
                  defaultValue="service@gmail.com"
                  className="form-control py-md-3 py-lg-4"
                  required
                />
              </div>
              <div className="mb-3 mb-md-4 mb-lg-5">
                <label className="small">{auth.password}</label>
                <input
                  type="password"
                  name="password"
                  // defaultValue="123456"
                  autoComplete="off"
                  className="form-control py-md-3 py-lg-4"
                  required
                  autoFocus
                />
              </div>
              <button type="submit" className="btn btn-success btn-block py-md-1 py-lg-2">
                {buttons.login}
              </button>
            </form>
          </div>
          <div className="text-center mb-4">
            <button
              className="btn btn-link p-0 mx-3 rounded-circle"
              onClick={() => changeLanguage('en')}
            >
              <img className="flag" src={gbFlag} alt="en_flag" />
            </button>
            <button
              className="btn btn-link p-0 mx-3 rounded-circle"
              onClick={() => changeLanguage('pl')}
            >
              <img className="flag" src={plFlag} alt="pl_flag" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
