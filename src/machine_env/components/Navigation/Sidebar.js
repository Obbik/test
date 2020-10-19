import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import { Link } from 'react-router-dom'

import logo from '../../assets/images/logo-vendim.png'
import logoSm from '../../assets/images/logo-vendim-sm.png'

export default ({ fullWidth, navLinks }) => {
  const {
    languagePack: { navbar }
  } = useContext(LangContext)

  const ListItem = ({ icon, text, path }) => (
    <>
      {fullWidth ? (
        <li className="mb-3 px-3">
          <Link
            to={path}
            className="nav-link d-flex align-items-center text-center text-dark btn btn-link p-1"
          >
            <i className={`mr-3 ${icon}`} style={{ width: 25, fontSize: '1.125em' }} />
            <span className="font-weight-normal">{text}</span>
          </Link>
        </li>
      ) : (
        <li className="mb-3 px-2 text-center">
          <Link
            to={path}
            className="nav-link d-flex flex-column text-dark btn btn-link p-1"
          >
            <i className={icon} style={{ fontSize: '1.25em' }} />
            <span className="mt-1 small">{text}</span>
          </Link>
        </li>
      )}
    </>
  )

  return (
    <div
      className="sidebar d-none d-lg-block bg-khaki sticky-top shadow"
      style={{
        width: fullWidth ? 250 : 100,
        zIndex: 1
      }}
    >
      <div
        className="sidebar-img d-flex align-items-center justify-content-center bg-aqua-dark"
        style={{
          height: 75,
          backgroundColor: 'rgba(0, 0, 0, 0.05)'
        }}
      >
        {fullWidth ? (
          <img src={logo} alt="logo" height="40" />
        ) : (
          <img src={logoSm} alt="logo" height="25" />
        )}
      </div>
      <ul className="list-group list-group-flush pt-4 list-unstyled">
        {navLinks.map((navLink, idx) => (
          <ListItem key={idx} {...navLink} />
        ))}
      </ul>
    </div>
  )
}
