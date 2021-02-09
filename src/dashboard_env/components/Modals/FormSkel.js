import React, { useRef, useEffect, useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import onClickAway from '../../util/onClickAway'

export default ({ headerText, noFooter, classes, handleClose, children, style }) => {
  const {
    TRL_Pack: { buttons }
  } = useContext(LangContext)
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
            <h6 className="modal-title">{headerText}</h6>
            <button onClick={handleClose} className="btn text-secondary px-2 py-0">
              <i className="fas fa-times" />
            </button>
          </div>
          <div className={`modal-body ${classes}`} style={style}>
            {children}
          </div>
          {!noFooter && (
            <div className="modal-footer bg-light">
              <button type="submit" className="btn btn-success btn-sm" form="modal-form">
                {buttons.save}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
