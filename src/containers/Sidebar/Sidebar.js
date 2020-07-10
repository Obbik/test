import React, { useState, useEffect, useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import { Link } from 'react-router-dom'

// import url from '../../helpers/url'

import fetchApi from '../../util/fetchApi'

const logo = require('../../assets/images/logo-vendim.png')
const profile = require('../../assets/images/blank-profile.png')

export default ({ showSidebar }) => {
  const {
    changeLanguage,
    languagePack: { navbar }
  } = useContext(LangContext)

  const userName = localStorage.getItem('userName')

  const [state, setState] = useState({
    categories: [],
    showProductMenu: false
  })

  useEffect(() => {
    fetchApi('categories')
      .then(res => {
        if (res.status !== 200) throw new Error(res)

        setState(prev => ({ ...prev, categories: res.data }))
      })
      .catch(err => console.log(err))
  }, [])

  const toggleProductMenu = () => {
    setState(prev => ({ ...prev, showProductMenu: !prev.showProductMenu }))
  }

  const sidebarClass = showSidebar
    ? 'sidebar d-none d-lg-block bg-light sticky-top'
    : 'sidebar d-none'
  const productMenuClass = state.showProductMenu
    ? 'list-group-item sidebar-list-group-item bg-light ml-3'
    : 'list-group-item sidebar-list-group-item bg-light ml-3 d-none'

  return (
    <div className={sidebarClass}>
      <div className="sidebar-img">
        <div className="text-center mt-2 mb-2">
          <img src={logo} alt="logo" height="39" />
        </div>
      </div>
      <ul className="list-group list-group-flush mt-2 ml-2 mr-2">
        <li className="list-group-item sidebar-list-group-item bg-light">
          <div className="text-center mt-2 mb-2">
            <img src={profile} alt="logo" height="80" className="rounded" />
            <p className="mt-1 text-truncate">{userName}</p>
          </div>
        </li>
        <li className="list-group-item sidebar-list-group-item bg-light">
          <Link to="/" onClick={toggleProductMenu} className="link">
            <i className="far fa-list-alt"></i> &nbsp; {navbar.products}
          </Link>
        </li>
        {state.categories.map(category => (
          <li key={category.CategoryId} className={productMenuClass}>
            <Link to={`/products/${category.CategoryId}`} className="link">
              {category.Name}
            </Link>
          </li>
        ))}
        <li className="list-group-item sidebar-list-group-item bg-light">
          <Link to="/categories" className="link">
            <i className="fas fa-th-large"></i> &nbsp; {navbar.categories}
          </Link>
        </li>
      </ul>
      {/* <div className="text-center mt-3">
        <img
          className="flag mx-3"
          src={url + 'images/multivend/flags/en.png'}
          alt="en_flag"
          width="48"
          height="48"
          onClick={() => changeLanguage('en')}
        />
        <img
          className="flag mx-3"
          src={url + 'images/multivend/flags/pl.png'}
          alt="pl_flag"
          width="48"
          height="48"
          onClick={() => changeLanguage('pl')}
        />
      </div> */}
    </div>
  )
}
