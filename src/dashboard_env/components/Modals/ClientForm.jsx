import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'

import FormSkel from './FormSkel'

export default ({ clientData, handleSubmit, handleClose }) => {
  const { TRL_Pack } = useContext(LangContext)

  return (
    <FormSkel
      headerText={clientData ? 'Edycja klienta' : 'Dodaj klienta'}
      handleClose={handleClose}
    >
      <form onSubmit={handleSubmit} id="modal-form" autoComplete="off">
        <div className="form-group">
          <label className="h6">Nazwa klienta</label>
          <input
            name="name"
            className="form-control"
            defaultValue={clientData && clientData.Name}
            required
          />
        </div>
        <div>
          <label className="h6">Skrót</label>
          <input
            name="abbreviation"
            className="form-control"
            defaultValue={clientData && clientData.Abbreviation}
          />
        </div>
      </form>
    </FormSkel>
  )
}
