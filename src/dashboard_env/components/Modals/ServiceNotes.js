import React, { useRef, useEffect } from 'react'
// import { LangContext } from '../../context/lang-context'
import onClickAway from '../../util/onClickAway'

export default ({ handleSubmit, handleClose }) => {
  // const { TRL_Pack } = useContext(LangContext)
  const modalRef = useRef(null)

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
            <h6 className="modal-title">Serice Notes</h6>
            <button
              onClick={handleClose}
              className="btn fas fa-times text-secondary p-1"
            />
          </div>
          <div className="modal-body p-0">
            <form id="notes-form" onSubmit={handleSubmit} className="p-3">
              <textarea
                className="form-control"
                name="note"
                rows={4}
                required
                autoComplete="off"
              />
            </form>
          </div>
          <div className="modal-footer bg-light p-1">
            <button
              form="notes-form"
              className="mx-auto btn btn-outline-info"
              type="submit"
            >
              Zapisz
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
