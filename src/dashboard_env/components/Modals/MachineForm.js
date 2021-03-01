import React, { useState, useEffect } from 'react'
import useFetch from '../../hooks/fetchMSSQL-hook'
// import { LangContext } from '../../context/lang-context'

import FormSkel from './FormSkel'

export default ({ postSubmit, machineData, handleClose }) => {
  // const { TRL_Pack } = useContext(LangContext)
  const { fetchMssqlApi } = useFetch()

  const [clients, setClients] = useState([])
  const getClients = () => {
    fetchMssqlApi('clients', {}, clients => setClients(clients))
  }

  const [terminals, setTerminals] = useState([])
  const getTerminals = () => {
    fetchMssqlApi('terminals', {}, terminals => setTerminals(terminals))
  }

  const machineTypes = ['V10', 'V10S', 'V11', 'LOCKER', 'SK3']

  const submitMachine = evt => {
    evt.preventDefault()

    const { name, serialNo, type, client, terminal } = evt.target.elements

    if (
      machineTypes.includes(type.value) &&
      clients.map(c => c.Name).includes(client.value) &&
      (!terminal.value || terminals.map(t => t.SerialNo).includes(terminal.value))
    ) {
      let path, method
      if (machineData) {
        path = `machine/${machineData.MachineId}`
        method = 'PUT'
      } else {
        path = 'machine'
        method = 'POST'
      }

      fetchMssqlApi(
        path,
        {
          method,
          data: {
            MachineName: name.value,
            SerialNo: serialNo.value,
            MachineType: type.value,
            ClientId: clients.find(c => c.Name === client.value).CustomerId,
            TerminalId: terminal.value
              ? terminals.find(t => t.SerialNo === terminal.value).TerminalId
              : null
          }
        },
        () => {
          handleClose()
          postSubmit()
        }
      )
    }
  }

  useEffect(() => {
    getClients()
    getTerminals()
  }, [])

  return (
    <FormSkel
      headerText={machineData ? 'Edycja maszyny' : 'Dodaj maszyne'}
      handleClose={handleClose}
    >
      <form onSubmit={submitMachine} id="modal-form" autoComplete="off">
        <div className="form-group">
          <label className="h6">Nazwa maszyny</label>
          <input
            name="name"
            className="form-control"
            defaultValue={machineData && machineData.MachineName}
            required
          />
        </div>
        <div className="form-group">
          <label className="h6">Nr Seryjny</label>
          <input
            name="serialNo"
            className="form-control"
            defaultValue={machineData ? machineData.SerialNo : 'VDM000000'}
            pattern="VDM[0-9]{8}"
            required
          />
        </div>
        <div className="form-group">
          <label className="h6">Typ maszyny</label>
          <input
            name="type"
            className="form-control"
            list="machineTypes"
            defaultValue={machineData && machineData.Type}
            required
          />
          <datalist id="machineTypes">
            {machineTypes.map((mt, idx) => (
              <option key={idx} value={mt} />
            ))}
          </datalist>
        </div>
        <div className="form-group">
          <label className="h6">Terminal</label>
          <input
            name="terminal"
            className="form-control"
            list="terminals"
            defaultValue={machineData && machineData.Terminal}
          />
          <datalist id="terminals">
            {terminals.map((t, idx) => (
              <option key={idx} value={t.SerialNo} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="h6">Klient</label>
          <input
            name="client"
            className="form-control"
            list="clients"
            defaultValue={machineData && machineData.ClientName}
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
