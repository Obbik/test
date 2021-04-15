import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

import onClickAway from '../../util/onClickAway'

import "./style.css"

export default ({ toggleSidebar, navlinks, headerData: { text, subtext } = {} }) => {
  const navbarRef = useRef(null)

  const [mobileNavbar, setMobileNavbar] = useState(false)
  const openMobileNavbar = () => {
    setMobileNavbar(true)
    onClickAway(navbarRef, closeMobileNavbar)
  }
  const closeMobileNavbar = () => setMobileNavbar(false)

  const ListItem = ({ text, path }) => (
    <li className="nav-item">
      <Link
        to={path}
        onClick={closeMobileNavbar}
        className="nav-link py-2 text-muted btn btn-link font-weight-normal"
      >
        {text}
      </Link>
    </li>
  )

  return (
    <header
      ref={navbarRef}
      className="shadow d-flex flex-column justify-content-center p-0"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="d-flex align-items-center w-100">
        <button
          className="mr-2 d-none d-lg-flex btn p-2"
          style={{ fontSize: '1.25rem' }}
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars text-muted" />
        </button>
        <p className="mb-0 font-weight-bolder">{text}</p>
        {subtext && (
          <span className="ml-2 font-weight-bolder align-self-end">{subtext}</span>
        )}
        <button
          className="ml-auto d-flex d-lg-none btn"
          onClick={mobileNavbar ? closeMobileNavbar : openMobileNavbar}
        >
          <i className="fas fa-bars text-muted" />
        </button>
      </div>
      {mobileNavbar && (
        <nav className="d-lg-none collapse navbar-collapse px-3 pb-2 show">
          <ul className="navbar-nav ml-auto">
            {navlinks.map((navlink, idx) => (
              < ListItem key={idx} {...navlink} />
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
