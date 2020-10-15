import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import FormSkel from './FormSkel'

export default ({ maintenanceData, handleSubmit, handleClose }) => {
  const { TRL_Pack } = useContext(LangContext)

  return (
    <FormSkel
      headerText={
        maintenanceData
          ? TRL_Pack.maintenances.editItemHeader
          : TRL_Pack.maintenances.newItemHeader
      }
      handleClose={handleClose}
    >
      <form onSubmit={handleSubmit} id="modal-form" autoComplete="off">
        <div>
          <label className="h6">{TRL_Pack.maintenances.properties.maintenanceName}</label>
          <input
            name="name"
            className="form-control"
            defaultValue={maintenanceData && maintenanceData.Name}
          />
        </div>
      </form>
    </FormSkel>
  )
}
