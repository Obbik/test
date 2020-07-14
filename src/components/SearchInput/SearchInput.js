import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'

export default ({ onSearch, tableView, onToggleView }) => {
  const {
    languagePack: { searchbarPlaceholder }
  } = useContext(LangContext)

  const handleChange = e => {
    e.preventDefault()
    const inputValue = e.target.value
    onSearch(inputValue)
  }

  return (
    <div className="row mb-4">
      <div className="col">
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text border-0">
              <i className="fas fa-search"></i>
            </span>
          </div>
          <input
            onChange={handleChange}
            name="search"
            type="text"
            className="form-control border-top-0 border-left-0 border-right-0 rounded-0 shadow-none"
            placeholder={searchbarPlaceholder}
            autoComplete="off"
          />
        </div>
      </div>
      {tableView !== null && (
        <div className="col-auto">
          <div className="btn-group float-right" role="group">
            <button onClick={onToggleView} type="button" className="btn btn-light">
              <i className={tableView ? 'fas fa-border-all' : 'fas fa-list'}></i>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}