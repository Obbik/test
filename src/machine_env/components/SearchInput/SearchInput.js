import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'

export default ({ onSearch, tableView, onToggleView }) => {
  const {
    languagePack: { searchbarPlaceholder }
  } = useContext(LangContext)

  return (
    <div className="row mb-4">
      <div className="d-flex offset-sm-1 offset-md-2 offset-lg-3 col col-sm-10 col-md-8 col-lg-6">
        <div className="input-group">
          <input
            onChange={evt => onSearch(evt.target.value)}
            onKeyUp={evt => onSearch(evt.target.value)}
            type="search"
            className="searchbar form-control rounded-left border-right-0"
            placeholder={searchbarPlaceholder}
            autoComplete="off"
          />
          <div className="input-group-append">
            <span className="input-group-text bg-white border-left-0">
              <i className="fas fa-search"></i>
            </span>
          </div>
        </div>
        {tableView !== undefined && (
          <div className="pl-3">
            <div className="btn-group float-right h-100">
              <button onClick={onToggleView} className="btn border">
                <i className={`fas ${tableView ? 'fa-border-all' : 'fa-list'}`}></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
