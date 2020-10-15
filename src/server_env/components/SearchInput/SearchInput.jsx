import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'

export default ({ onSearch, defaultValue, handleSearch }) => {
  const { TRL_Pack } = useContext(LangContext)

  return (
    <div className="row mb-3">
      <div className="d-flex offset-sm-1 offset-md-2 offset-lg-3 col col-sm-10 col-md-8 col-lg-6">
        <div className="input-group">
          <input
            onChange={evt => onSearch(evt.target.value)}
            type="search"
            className="form-control rounded-left border-right-0"
            defaultValue={defaultValue}
            placeholder={TRL_Pack.searchbarPlaceholder}
            autoComplete="off"
          />
          <div className="input-group-append">
            <span className="input-group-text bg-white border-left-0">
              <i className="fas fa-search"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
