import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'

import { Link } from 'react-router-dom'

export default ({ path, handleClick }) => {
  const { TRL_Pack } = useContext(LangContext)

  return (
    <div className="mb-3">
      {handleClick ? (
        <button onClick={handleClick} className="btn btn-link ml-1 text-decoration-none">
          <i className="fas fa-arrow-left mr-2" />
          {TRL_Pack.buttons.return}
        </button>
      ) : (
        <Link to={path} className="btn btn-link ml-1 text-decoration-none">
          <i className="fas fa-arrow-left mr-2" />
          {TRL_Pack.buttons.return}
        </Link>
      )}
    </div>
  )
}
