import React, { useState, useRef, useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import { Link } from 'react-router-dom'

import onClickAway from '../../util/onClickAway'

export default ({ onLogout, onToggleSidebar, showSidebar }) => {
  const {
    languagePack: { navbar }
  } = useContext(LangContext)

  const [mobileNavbar, setMobileNavbar] = useState(false)
  const toggleMobileNavbar = () => setMobileNavbar(prev => !prev)
  const closeMobileNavbar = () => setMobileNavbar(false)

  const [userDropdown, setUserDropdown] = useState(false)
  const userDropdownRef = useRef(null)
  const toggleUserDropdown = () => setUserDropdown(prev => !prev)
  const closeUserDropdown = () => setTimeout(setUserDropdown(false), 75)

  onClickAway(userDropdownRef, closeUserDropdown)

  const [machineDropdown, setMachineDropdown] = useState(false)
  const machineDropdownRef = useRef(null)
  const toggleMachineDropdown = () => setMachineDropdown(prev => !prev)
  const closeMachineDropdown = () => setTimeout(setMachineDropdown(false), 75)

  onClickAway(machineDropdownRef, closeMachineDropdown)

  const navbarClass = showSidebar
    ? 'navbar navbar-expand-lg navbar-dark bg-dark fixed-top'
    : 'navbar navbar-expand-lg navbar-dark navbar-full-width bg-dark fixed-top'
  const mobileNavbarClass = mobileNavbar
    ? 'collapse navbar-collapse show'
    : 'collapse navbar-collapse'

  return (
    <nav className={navbarClass}>
      <div className="container-fluid">
        <button onClick={onToggleSidebar} className="btn btn-dark">
          <span className="navbar-toggler-icon d-none d-lg-block"></span>
        </button>
        <button onClick={toggleMobileNavbar} className="navbar-toggler" type="button">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={mobileNavbarClass} id="navbarNav">
          <ul className="navbar-nav mr-auto"></ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item mx-1">
              <Link to="/" onClick={closeMobileNavbar} className="nav-link">
                {navbar.products}
              </Link>
            </li>
            <li className="nav-item mx-1">
              <Link to="/categories" onClick={closeMobileNavbar} className="nav-link">
                {navbar.categories}
              </Link>
            </li>
            <li ref={machineDropdownRef} className="nav-item dropdown mx-1">
              <Link
                to="#"
                onClick={toggleMachineDropdown}
                className="nav-link dropdown-toggle"
              >
                {navbar.machine}
              </Link>
              {machineDropdown && (
                <div className="dropdown-menu">
                  <Link
                    to="/machine-products"
                    className="dropdown-item"
                    onClick={() => {
                      closeMobileNavbar()
                      closeMachineDropdown()
                    }}
                  >
                    {navbar.config}
                  </Link>
                  <Link
                    to="/machine-boost"
                    className="dropdown-item"
                    onClick={() => {
                      closeMobileNavbar()
                      closeMachineDropdown()
                    }}
                  >
                    {navbar.recharge}
                  </Link>
                </div>
              )}
            </li>
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
                  {/* <Link
                    to="/settings"
                    className="dropdown-item"
                    onClick={() => {
                      closeMobileNavbar()
                      closeUserDropdown()
                    }}
                  >
                    {navbar.settings}
                  </Link> */}
                  <Link to="#" onClick={onLogout} className="dropdown-item">
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
