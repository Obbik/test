import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import { Link } from 'react-router-dom'

export default ({ navLinks }) => {
  const {
    languagePack: { navbar }
  } = useContext(LangContext)

  const permissions = sessionStorage.getItem('permissions')

  const ListItem = ({ icon, text, path }) => (
    <li className="px-2 text-center">
      <Link to={path} className="nav-link d-flex flex-column text-dark btn btn-link p-1">
        <i className={icon} style={{ fontSize: '1.5em' }} />
        <span className="mt-2 small" style={{ fontSize: 16 }}>
          {text}
        </span>
      </Link>
    </li>
  )

  return (
    <>
      <div className="d-lg-none w-100" style={{ height: 65 }} />
      <div
        className="d-lg-none bg-khaki position-fixed shadow w-100"
        style={{
          zIndex: 1,
          bottom: 0,
          left: 0
        }}
      >
        <ul className="list-group list-group-flush list-unstyled list-group-horizontal justify-content-around align-items-center py-2">
          {navLinks.map((navLink, idx) => (
            <ListItem key={idx} {...navLink} />
          ))}
        </ul>
      </div>
    </>
  )
}
