import React from 'react'

import useFetch from '../../hooks/fetchMSSQL-hook'
import FormSkel from './FormSkel'

export default ({ machineProduct, closeModal, getMachineProducts }) => {
  const { fetchApi } = useFetch()

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
    <FormSkel
      headerText={`Wybór nr ${machineProduct.MachineFeederNo}`}
      handleClose={closeModal}
    >
      <form onSubmit={handleSubmit} id="modal-form" autoComplete="off">
        <div>
          <input
            type="number"
            min={0}
            max={machineProduct.MaxItemCount}
            name="newQuantity"
            className="form-control"
            placeholder="Nowa ilość"
            required
          />
        </div>
      </form>
    </FormSkel>
  )
}
