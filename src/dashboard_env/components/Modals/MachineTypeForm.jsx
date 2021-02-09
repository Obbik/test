import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import FormSkel from './FormSkel'

export default ({ machineTypeData, handleSubmit, handleClose }) => {
  const { TRL_Pack } = useContext(LangContext)

  return (
    <FormSkel
      headerText={
        machineTypeData
          ? TRL_Pack.machineTypes.editItemHeader
          : TRL_Pack.machineTypes.newItemHeader
      }
      handleClose={handleClose}
    >
      <form onSubmit={handleSubmit} id="modal-form" autoComplete="off">
        <div>
          <label className="h6">{TRL_Pack.machineTypes.properties.machineTypeName}</label>
          <input
            name="name"
            className="form-control"
            defaultValue={machineTypeData && machineTypeData.Name}
          />
        </div>
      </form>
    </FormSkel>
  )
}
