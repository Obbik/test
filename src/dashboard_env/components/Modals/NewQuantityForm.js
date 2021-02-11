import React from 'react'

import useFetch from '../../hooks/fetchMSSQL-hook'
import FormSkel from './FormSkel'

export default ({ machineProduct, handleClose, getMachineProducts }) => {
  const { fetchMssqlApi } = useFetch()

  const handleSubmit = evt => {
    evt.preventDefault()

    const { newQuantity } = evt.target.elements

    const fetchBody = {
      Quantity: parseInt(newQuantity.value)
    }

    fetchMssqlApi(
      `machine-product/${machineProduct.MachineProductId}`,
      { method: 'PATCH', data: fetchBody },
      () => {
        handleClose()
        getMachineProducts()
      }
    )
  }

  return (
    <FormSkel
      headerText={`Wybór nr ${machineProduct.MachineFeederNo}`}
      handleClose={handleClose}
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
