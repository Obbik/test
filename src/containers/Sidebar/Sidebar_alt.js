import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import fetchApi from '../../helpers/fetchApi'

const logo = require('../../assets/images/logo-vendim.png')
const profile = require('../../assets/images/blank-profile.png')

export default ({ showSidebar }) => {
  const userName = localStorage.getItem('userName')

  const [state, setState] = useState({
    categories: [],
    showProductMenu: false
  })

  useEffect(() => {
    fetchApi({ path: 'categories' }, res => {
      if (res.status !== 200) console.log(res)

      setState(prev => ({ ...prev, categories: res.data }))
    })
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
            <i className="far fa-list-alt"></i> &nbsp; Produkty
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
            <i className="fas fa-th-large"></i> &nbsp; Kategorie
          </Link>
        </li>
      </ul>
    </div>
  )
}
