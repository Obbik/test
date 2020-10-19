import React, { useState, Fragment, useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import useForm from '../../hooks/form-hook'
import FormSkel from '../Modals/FormSkel'

export default ({ filter, setFilter, columns, data, resetPage, tags, resetFilter }) => {
  const { TRL_Pack } = useContext(LangContext)
  const handleChange = evt => {
    const { name, value, type, checked } = evt.target

    if (type === 'checkbox') setFilter(prev => ({ ...prev, [name]: checked }))
    else setFilter(prev => ({ ...prev, [name]: value }))

    if (resetPage) resetPage()
  }

  const toggleColumn = evt => {
    const { name } = evt.target

    setFilter(prev => ({
      ...prev,
      columns: prev.columns.map(col => {
        if (col.name === name) col.hidden = !col.hidden
        return col
      })
    }))
  }

  const toggleSearchbar = name => {
    setFilter(prev => ({
      ...prev,
      columns: prev.columns.map(col => {
        if (col.name === name) {
          if (col.searchbar === undefined) col.searchbar = ''
          else col.searchbar = undefined
        }
        return col
      })
    }))
  }

  const handleChangeSearchbar = evt => {
    const { name, value } = evt.target

    resetPage()

    setFilter(prev => ({
      ...prev,
      columns: prev.columns.map(col => {
        if (col.name === name) col.searchbar = value

        return col
      })
    }))
  }

  const { form, openForm, closeForm } = useForm()

  const [activeLabel, setActiveLabel] = useState(null)

  const handleChangeLabel = labelIdx => () => {
    if (labelIdx === activeLabel) {
      setActiveLabel(null)
    } else if (tags[labelIdx].options.length > 0) {
      setActiveLabel(labelIdx)
    } else {
      toggleTag(tags[labelIdx].tagId)()
      setActiveLabel(null)
    }
  }

  const toggleTag = tagId => () => {
    if (filter.activeTags.includes(tagId))
      setFilter(prev => ({
        ...prev,
        activeTags: prev.activeTags.filter(tag => tag !== tagId)
      }))
    else setFilter(prev => ({ ...prev, activeTags: prev.activeTags.concat(tagId) }))
  }

  return (
    <div className="mb-4 rounded border bg-fade p-3 user-select-none">
      <button
        className="d-block mx-auto btn btn-secondary badge badge-pill px-2 py-1 mb-1"
        onClick={resetFilter}
      >
        Reset Filter
      </button>
      <hr className="my-2" />
      <div className="row justify-content-center mb-n3">
        {filter.rowsPerPageOptions && (
          <div className="col-12 col-md-6 col-lg-4 mb-3 d-flex align-items-center justify-content-center">
            <h6 className="mb-0">{TRL_Pack.filter.rowsPerPage}</h6>
            <select
              className="form-control form-control-sm ml-2"
              style={{ maxWidth: 100 }}
              name="rowsPerPage"
              value={filter.rowsPerPage}
              onChange={handleChange}
            >
              {filter.rowsPerPageOptions.map((num, idx) => (
                <option key={idx}>{num}</option>
              ))}
            </select>
          </div>
        )}
        {filter.sortByColumns && (
          <div className="col-12 col-md-6 col-lg-4 mb-3 d-flex align-items-center justify-content-center">
            <h6 className="mb-0">{TRL_Pack.filter.sortBy}</h6>
            <select
              className="form-control form-control-sm ml-2"
              style={{ maxWidth: 175 }}
              name="sortBy"
              value={filter.sortBy}
              onChange={handleChange}
            >
              {columns
                .filter(col => col.sortable)
                .map((col, idx) => (
                  <Fragment key={idx}>
                    <option value={`${col.id} | asc | ${col.type}`}>
                      {col.name} &nbsp; &#8681;
                    </option>
                    <option value={`${col.id} | desc | ${col.type}`}>
                      {col.name} &nbsp; &#8679;
                    </option>
                  </Fragment>
                ))}
            </select>
          </div>
        )}
        {!filter.disableIndexes && (
          <div className="col-12 col-md-6 col-lg-4 mb-3 custom-control custom-switch d-flex align-items-center justify-content-center">
            <input
              type="checkbox"
              className="custom-control-input"
              name="showIndexes"
              value={filter.showIndexes}
              id="show-indexes"
              defaultChecked={true}
              onChange={handleChange}
            />
            <label className="h6 custom-control-label" htmlFor="show-indexes">
              {TRL_Pack.filter.showIndexes}
            </label>
          </div>
        )}
      </div>
      <hr className="my-2" />
      <div className="row px-3">
        {filter.columns
          .filter(col => !col.disabled)
          .map((col, idx) => (
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3 border px-2 py-3 position-relative d-flex flex-column justify-content-center"
              key={idx}
            >
              <h6 className="text-center mb-0">{col.name}</h6>
              {!col.solid && (
                <label
                  className="position-absolute mb-0 mx-1"
                  style={{ fontSize: '1.125em', top: 3, left: 5 }}
                >
                  <i
                    className={`fas ${
                      col.hidden ? 'fa-eye-slash' : 'fa-eye text-primary'
                    }`}
                  />
                  <input
                    type="checkbox"
                    className="d-none"
                    name={col.name}
                    onChange={toggleColumn}
                    checked={!col.hidden}
                  />
                </label>
              )}
              {col.searchable && (
                <i
                  className={`fas fa-search mx-1 position-absolute ${
                    col.searchbar === undefined ? '' : 'text-primary'
                  }`}
                  onClick={() => toggleSearchbar(col.name)}
                  style={{ fontSize: '1.125em', top: 8, right: 5 }}
                />
              )}
              {col.searchbar !== undefined && (
                <>
                  <input
                    className="mt-2 form-control form-control-sm"
                    placeholder={TRL_Pack.searchbarPlaceholder}
                    defaultValue={col.searchbar}
                    list={col.name}
                    name={col.name}
                    onChange={handleChangeSearchbar}
                  />
                  <datalist id={col.name}>
                    {[...new Set(data.map(d => d[Object.keys(d)[col.id - 1]]))].map(
                      (entry, idx) => (
                        <option key={idx} value={entry} />
                      )
                    )}
                  </datalist>
                </>
              )}
            </div>
          ))}
      </div>
      {tags && (
        <>
          <hr className="my-2" />
          <div className="mb-n1">
            {tags.map(tag =>
              filter.activeTags.includes(tag.tagId) ? (
                <button className="btn btn-info badge badge-pill px-2 py-1 mx-2 mb-1">
                  {tag.label}
                </button>
              ) : (
                tag.options
                  .filter(opt => filter.activeTags.includes(opt.tagId))
                  .map(opt => (
                    <button className="btn btn-info badge badge-pill px-2 py-1 mx-2 mb-1">
                      {`${tag.label} - ${opt.name}`}
                    </button>
                  ))
              )
            )}
            <button
              className="btn btn-info badge badge-pill px-2 py-1 mx-2 mb-1"
              onClick={openForm()}
            >
              <i className="fas fa-pen" />
            </button>
          </div>
          {form && (
            <FormSkel
              headerText="Tagi"
              noFooter
              handleClose={closeForm}
              classes="d-flex p-0"
            >
              <div className="w-50 overflow-auto" style={{ maxHeight: 250 }}>
                {tags.map((tag, idx) => (
                  <div
                    key={idx}
                    className={`font-weight-bolder list-group-item cursor-pointer ${
                      idx === activeLabel
                        ? 'active'
                        : filter.activeTags.includes(tag.tagId)
                        ? 'list-group-item-success'
                        : ''
                    }`}
                    onClick={handleChangeLabel(idx)}
                  >
                    {tag.label}
                  </div>
                ))}
              </div>
              {activeLabel !== null && (
                <div className="w-50 overflow-auto" style={{ maxHeight: 250 }}>
                  {tags[activeLabel].options.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`font-weight-bolder list-group-item cursor-pointer ${
                        filter.activeTags.includes(opt.tagId)
                          ? 'list-group-item-success'
                          : ''
                      }`}
                      onClick={toggleTag(opt.tagId)}
                    >
                      {opt.name}
                    </div>
                  ))}
                </div>
              )}
            </FormSkel>
          )}
        </>
      )}
    </div>
  )
}
