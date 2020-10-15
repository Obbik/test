import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'

export default ({ onClick, buttonText = 'Add' }) => {
  const { TRL_Pack } = useContext(LangContext)

  return (
    <div className="flex-grow-1 d-flex flex-column justify-content-center">
      <h5 className="text-center">{TRL_Pack.noResults}</h5>
      {onClick && (
        <button
          className="d-block mt-2 mx-auto btn btn-link text-decoration-none"
          onClick={onClick}
        >
          <i className="fas fa-plus mr-2" />
          {buttonText}
        </button>
      )}
    </div>
  )
}
