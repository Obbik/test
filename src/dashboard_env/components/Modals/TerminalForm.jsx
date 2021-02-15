import React, { useContext } from 'react'
// import { LangContext } from '../../context/lang-context'

import FormSkel from './FormSkel'

export default ({ terminalData, clients, handleSubmit, handleClose }) => {
  // const { TRL_Pack } = useContext(LangContext)

  return (
    <FormSkel
      headerText={terminalData ? 'Edycja klienta' : 'Dodaj klienta'}
      handleClose={handleClose}
    >
      <form onSubmit={handleSubmit} id="modal-form" autoComplete="off">
        <div className="form-group">
          <label className="h6">Nr seryjny</label>
          <input
            name="serialNo"
            className="form-control"
            defaultValue={terminalData && terminalData.SerialNo}
            required
          />
        </div>
        <div>
          <label className="h6">Klient</label>
          <input
            name="client"
            className="form-control"
            defaultValue={terminalData && terminalData.ClientName}
            list="clients"
            required
          />
          <datalist id="clients">
            {clients.map((c, idx) => (
              <option key={idx} value={c.Name} />
            ))}
          </datalist>
        </div>
      </form>
    </FormSkel>
  )
}
