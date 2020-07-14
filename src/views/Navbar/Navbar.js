import React, { useState, useRef, useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import { Link } from 'react-router-dom'

import onClickAway from '../../util/onClickAway'

export default ({ logout }) => {
  const {
    languagePack: { navbar }
  } = useContext(LangContext)

  const permissions = localStorage.getItem('permissions')

  const [mobileNavbar, setMobileNavbar] = useState(false)
  const toggleMobileNavbar = () => setMobileNavbar(prev => !prev)
  const closeMobileNavbar = () => setMobileNavbar(false)

  const [userDropdown, setUserDropdown] = useState(false)
  const userDropdownRef = useRef(null)
  const toggleUserDropdown = () => setUserDropdown(prev => !prev)
  const closeUserDropdown = () => setTimeout(setUserDropdown(false), 75)

  onClickAway(userDropdownRef, closeUserDropdown)

  return (
    <nav className="d-lg-none navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <button onClick={toggleMobileNavbar} className="navbar-toggler" type="button">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse ${mobileNavbar && 'show'}`}
          id="navbarNav"
        >
          <ul className="navbar-nav mr-auto"></ul>
          <ul className="navbar-nav ml-auto">
            {permissions.includes('{1}') && (
              <li className="nav-item mx-1">
                <Link to="/" onClick={closeMobileNavbar} className="nav-link">
                  {navbar.products}
                </Link>
              </li>
            )}
            {permissions.includes('{2}') && (
              <li className="nav-item mx-1">
                <Link to="/categories" onClick={closeMobileNavbar} className="nav-link">
                  {navbar.categories}
                </Link>
              </li>
            )}
            {permissions.includes('{3}') && (
              <li className="nav-item mx-1">
                <Link to="/config" onClick={closeMobileNavbar} className="nav-link">
                  {navbar.config}
                </Link>
              </li>
            )}
            {permissions.includes('{4}') && (
              <li className="nav-item mx-1">
                <Link to="/supply" onClick={closeMobileNavbar} className="nav-link">
                  {navbar.recharge}
                </Link>
              </li>
            )}
            <li ref={userDropdownRef} className="nav-item dropdown mx-1">
              <Link
                to="#"
                onClick={toggleUserDropdown}
                className="nav-link dropdown-toggle"
              >
                <i className="far fa-user"></i>
              </Link>
              {userDropdown && (
                <div className="dropdown-menu dropdown-menu-right">
                  <Link to="#" onClick={logout} className="dropdown-item">
                    {navbar.logout}
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
