import React, { useState, useRef, useEffect, useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import onClickAway from '../../util/onClickAway'
import useFetch from '../../hooks/fetch-hook'

export default ({ tagData, handleClose, getTags, section }) => {
  const { fetchMssqlApi } = useFetch()
  const { TRL_Pack } = useContext(LangContext)
  const modalRef = useRef(null)

  const initialTagData = useRef(tagData)

  const [options, setOptions] = useState(tagData?.options || [])
  const removeOption = idx => () =>
    setOptions(prev => prev.filter((option, optionIdx) => optionIdx !== idx))

  const saveOption = () => {
    if (!input) return
    if (editedOption === 'new') setOptions(prev => prev.concat({ name: input }))
    else
      setOptions(prev =>
        prev.map((option, optionIdx) =>
          optionIdx === editedOption ? { ...prev[optionIdx], name: input } : option
        )
      )
    setEditedOption(null)
  }

  const [input, setInput] = useState('')
  const handleChange = evt => setInput(evt.target.value)

  const [editedOption, setEditedOption] = useState(null)
  const editOption = idx => () => {
    setInput(idx === 'new' ? '' : options[idx].name)
    setEditedOption(idx)
  }

  const handleSubmit = evt => {
    evt.preventDefault()

    const { label } = evt.target.elements
    console.log(initialTagData.current, label.value, options, tagData)

    const promises = []

    const pushRequest = (path, method, data) => {
      promises.push(
        new Promise((resolve, reject) => {
          fetchMssqlApi(path, { method, data }, resolve)
        })
      )
    }

    if (tagData) {
      if (initialTagData.current.options)
        initialTagData.current.options
          .map(opt => opt.tagId)
          .filter(tagId => !options.map(otp => otp.tagId).includes(tagId))
          .forEach(tagId => pushRequest(`tag/${tagId}`, { method: 'DELETE' }))

      options.forEach(({ tagId, name }) => {
        if (tagId) {
          if (
            name !== initialTagData.current.options.find(opt => opt.tagId === tagId).name
          )
            pushRequest(`tag/${tagId}`, 'PUT', {
              Name: `${initialTagData.current.label} - ${name}`
            })
        } else {
          pushRequest('tags', 'POST', {
            Name: `${initialTagData.current.label} - ${name}`,
            Type: section
          })
        }
      })
    } else {
      pushRequest('tags', 'POST', {
        Name: `${label.value} - `,
        Type: section
      })

      if (options.length > 0)
        options.forEach(({ name }) => {
          pushRequest('tags', 'POST', {
            Name: `${label.value} - ${name}`,
            Type: section
          })
        })
    }

    if (tagData && initialTagData.current.label !== label.value)
      pushRequest('tags', 'PUT', {
        PrevLabel: initialTagData.current.label,
        NewLabel: label.value
      })

    Promise.all(promises).then(() => {
      getTags()
      handleClose()
    })
  }

  useEffect(
    () => onClickAway(modalRef, handleClose),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div ref={modalRef} className="modal-content border-0">
          <div className="modal-header bg-light align-items-center">
            <h6 className="modal-title">Tagi</h6>
            <button onClick={handleClose} className="btn p-1">
              <i className="fas fa-times" style={{ width: 15, height: 15 }} />
            </button>
          </div>
          <div className="modal-body p-0">
            <form id="notes-form" onSubmit={handleSubmit} className="p-3">
              <input
                className="form-control"
                name="label"
                defaultValue={tagData?.label}
                required
                autoComplete="off"
              />
              <hr />
              {options.length > 0 && (
                <div
                  className="overflow-auto user-select-none mt-n1 mb-1"
                  style={{ maxHeight: 250 }}
                >
                  {options.map((opt, idx) =>
                    editedOption === idx ? (
                      <div key={idx} className="position-relative cursor-pointer mt-1">
                        <li className="list-group-item list-group-item-action pl-3 pr-5">
                          <input
                            className="form-control"
                            onChange={handleChange}
                            value={input}
                            autoFocus
                          />
                        </li>
                        <button
                          type="button"
                          className="btn btn-light position-absolute"
                          onClick={saveOption}
                          style={{
                            top: '50%',
                            right: 5,
                            transform: 'translateY(-50%)',
                            zIndex: 25
                          }}
                        >
                          <i className="fas fa-save text-success" />
                        </button>
                      </div>
                    ) : (
                      <div key={idx} className="position-relative cursor-pointer mt-1">
                        <li
                          className="list-group-item list-group-item-action pr-5"
                          onClick={editOption(idx)}
                        >
                          {opt.name}
                        </li>
                        <button
                          type="button"
                          className="btn btn-light position-absolute"
                          onClick={removeOption(idx)}
                          style={{
                            top: '50%',
                            right: 5,
                            transform: 'translateY(-50%)',
                            zIndex: 25
                          }}
                        >
                          <i className="fas fa-times text-danger" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
              {editedOption === 'new' ? (
                <div className="position-relative cursor-pointer mb-1">
                  <li className="list-group-item list-group-item-action pr-5">
                    <input
                      className="form-control"
                      onChange={handleChange}
                      value={input}
                      autoFocus
                    />
                  </li>
                  <button
                    type="button"
                    className="btn btn-light position-absolute"
                    onClick={saveOption}
                    style={{
                      top: '50%',
                      right: 5,
                      transform: 'translateY(-50%)',
                      zIndex: 25
                    }}
                  >
                    <i className="fas fa-plus text-success" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={editOption('new')}
                  className="mt-1 list-group-item list-group-item-action cursor-pointer text-center"
                  style={{ zIndex: 30 }}
                >
                  <i className="fas fa-plus text-muted" />
                </div>
              )}
            </form>
          </div>
          <div className="modal-footer bg-light">
            <button type="submit" className="btn btn-success btn-sm" form="notes-form">
              {TRL_Pack.buttons.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
