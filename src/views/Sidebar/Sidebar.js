import React, { useState, useEffect, useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import { Link } from 'react-router-dom'

const logo = require('../../assets/images/logo-vendim.png')

export default ({ logout }) => {
  const {
    languagePack: { navbar }
  } = useContext(LangContext)

  const permissions = localStorage.getItem('permissions')

  const ListItem = ({ icon, text, link }) => (
    <li className="h6 my-2 list-group-item sidebar-list-group-item bg-light">
      <Link to={link} className="link">
        <i className={`mr-1 ${icon}`}></i> &nbsp; {text}
      </Link>
    </li>
  )

  return (
    <div className="sidebar d-none d-lg-block bg-light sticky-top">
      <div className="sidebar-img py-4 text-center">
        <img src={logo} alt="logo" height="50" />
      </div>
      <ul className="list-group list-group-flush m-2 mt-4">
        {permissions.includes('{1}') && (
          <ListItem icon="far fa-list-alt" text={navbar.products} link="/" />
        )}
        {permissions.includes('{2}') && (
          <ListItem icon="fas fa-th-large" text={navbar.categories} link="/categories" />
        )}
        {permissions.includes('{3}') && (
          <ListItem icon="fas fa-cog" text="Config" link="/config" />
        )}
        {permissions.includes('{4}') && (
          <ListItem icon="fas fa-plus" text="Supply" link="/supply" />
        )}
        <li className="h6 my-2 list-group-item sidebar-list-group-item bg-light">
          <Link to="/" className="link" onClick={logout}>
            <i className="mr-1 fas fa-user"></i> &nbsp; {navbar.logout}
          </Link>
        </li>
      </ul>
    </div>
  )
}
