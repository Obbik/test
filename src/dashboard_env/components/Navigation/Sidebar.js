import React from 'react'
import { Link } from 'react-router-dom'

import logo from '../../assets/images/logo-vendim.png'
import logoSm from '../../assets/images/logo-vendim-sm.png'

import "./style.css"

export default ({ width, navlinks }) => {
  const currentPath = window.location.pathname.slice(10)
  const ListItem = ({ icon, text, path, onClick }) => (
    <>
      {width === 'md' ? (
        <li className="mb-3 mx-2">
          {path ? (
            <Link
              to={path}
              className="nav-link d-flex align-items-center text-center text-dark btn btn-link p-1"
            >
              <i className={`mr-3 ${icon}`}
                style={{ width: 25, fontSize: '1.125em' }} />
              <span className=
                {(currentPath === path) ?
                  "font-weight-bolder" :
                  "font-weight-normal"}
              >{text}</span>
            </Link>
          ) : (
            <div
              onClick={onClick}
              className="nav-link d-flex align-items-center text-center text-dark btn btn-link p-1"
            >

              <i className={`mr-3 ${icon}`} style={{ width: 25, fontSize: '1.125em' }} />
              <span className="font-weight-normal">{text}</span>
            </div>
          )}
        </li>
      ) : (
        <li className="py-2 text-center lista">
          {path ? (
            <Link
              to={path}
              className="nav-link d-flex flex-column text-dark btn btn-link p-1"
            >
              <i className={`${icon} mb-1`} style={{ fontSize: '1.25em' }} />
              <span className="mt-1 small">{text}</span>
            </Link>
          ) : (
            <div
              onClick={onClick}
              className="nav-link d-flex flex-column text-dark btn btn-link p-1"
            >
              <i className={`${icon} mb-1`} style={{ fontSize: '1.25em' }} />
              <span className="mt-1 small">{text}</span>
            </div>
          )}
        </li>
      )}
    </>
  )

  // const ListItem = ({ icon, text, path, onClick }) => (
  //   <>
  //     {width === 'md' ? (
  //       <li className="mb-3 px-3">
  //         <NavLink
  //           to={path}
  //           onClick={onClick}
  //           className="nav-link d-flex align-items-center text-center text-dark btn btn-link p-1"
  //         >
  //           <i className={`mr-3 ${icon}`} style={{ width: 25, fontSize: '1.125em' }} />
  //           <span className="font-weight-normal">{text}</span>
  //         </NavLink>
  //       </li>
  //     ) : (
  //       <li className="mb-3 px-2 text-center">
  //         <NavLink
  //           to={path}
  //           onClick={onClick}
  //           className="nav-link d-flex flex-column text-dark btn btn-link p-1"
  //         >
  //           <i className={icon} style={{ fontSize: '1.25em' }} />
  //           <span className="mt-1 small">{text}</span>
  //         </NavLink>
  //       </li>
  //     )}
  //   </>
  // )

  // const NavLink = ({ onClick, path, className, children }) =>
  //   onClick ? (
  //     <span onClick={onClick} className={className}>
  //       {children}
  //     </span>
  //   ) : (
  //     <Link to={path} className={className}>
  //       {children}
  //     </Link>
  //   )

  return (
    <div
      className="sidebar d-none d-lg-block bg-khaki sticky-top shadow"
      style={{
        width: width === 'md' ? 250 : 100,
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
        {width === 'md' ? (
          <img src={logo} alt="logo" height="40" />
        ) : (
          <img src={logoSm} alt="logo" height="25" />
        )}
      </div>
      <ul className="list-group list-group-flush pt-3 px-2 list-unstyled "  >
        {navlinks.map((navlink, idx) => (
          <ListItem key={idx} {...navlink} />
        ))}
      </ul>
    </div>
  )
}
