import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'

import { Link } from 'react-router-dom'

export default ({ path = '#', handleClick }) => {
  const {
    languagePack: { buttons }
  } = useContext(LangContext)

  return (
    <div className="mb-3">
      <Link to={path} onClick={handleClick} className="btn btn-link text-decoration-none">
        <i className="fas fa-arrow-left mr-2" />
        {buttons.return}
      </Link>
    </div>
  )
}
