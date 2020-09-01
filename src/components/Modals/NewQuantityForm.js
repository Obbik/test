import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'

import useFetch from '../../hooks/fetch-hook'

export default ({ machineProduct, closeModal, getMachineProducts }) => {
  const { fetchApi } = useFetch()

  const {
    languagePack: { buttons }
  } = useContext(LangContext)

  const handleSubmit = evt => {
    evt.preventDefault()

    const { newQuantity } = evt.target.elements

    const fetchBody = {
      Quantity: parseInt(newQuantity.value)
    }

    fetchApi(
      `machine-product/${machineProduct.MachineProductId}`,
      { method: 'PATCH', data: fetchBody },
      () => {
        closeModal()
        getMachineProducts()
      }
    )
  }

  return (
    <div className="modal fade'show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-light align-items-center">
            <h6 className="modal-title">{`Wybór nr ${machineProduct.MachineFeederNo}`}</h6>
            <button
              onClick={closeModal}
              className="btn text-secondary px-2 py-0"
              style={{ cursor: 'pointer' }}
            >
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit} id="quantity-form">
              <div>
                <input
                  type="number"
                  min={0}
                  max={machineProduct.MaxItemCount}
                  name="newQuantity"
                  className="form-control"
                  placeholder="Nowa ilość"
                  autoComplete="off"
                />
              </div>
            </form>
          </div>
          <div className="modal-footer bg-light">
            <button type="submit" className="btn btn-success btn-sm" form="quantity-form">
              {buttons.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
