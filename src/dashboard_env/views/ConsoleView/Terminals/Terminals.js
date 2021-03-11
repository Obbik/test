import React, { useState, useEffect, useContext } from 'react'
import { NavigationContext } from '../../../context/navigation-context'
// import { LangContext } from '../../context/lang-context'
import useForm from '../../../hooks/form-hook'
import useFetch from '../../../hooks/fetchMSSQL-hook'
import useFilter from '../../../hooks/filter-hook'

import SearchInput from '../../../components/SearchInput/SearchInput'
import NoResults from '../../../components/NoResults/NoResults'
import TerminalForm from '../../../components/Modals/TerminalForm'
import filterItems from '../../../util/filterItems'

import { LangContext } from '../../../context/lang-context'

export default () => {
  const { TRL_Pack } = useContext(LangContext)
  const { fetchMssqlApi } = useFetch()
  const { setHeaderData } = useContext(NavigationContext)
  // const { TRL_Pack } = useContext(LangContext)
  const { searchedText, updateSearchedText } = useFilter()

  const { form, openForm, closeForm } = useForm()

  const [clients, setClients] = useState([])
  const getClients = () => {
    fetchMssqlApi('clients', {}, clients => setClients(clients))
  }

  const [terminals, setTerminals] = useState(null) // TODO CREATE API TERMINAL ENDPOINT
  const getTerminals = () => {
    fetchMssqlApi('terminals', {}, terminals => setTerminals(terminals))
  }

  const submitTerminal = evt => {
    evt.preventDefault()

    const { serialNo, client } = evt.target.elements
    if (clients.map(c => c.Name).includes(client.value)) {
      let path, method
      if (form !== 'new') {
        path = `terminal/${form}`
        method = 'PUT'
      } else {
        path = 'terminal'
        method = 'POST'
      }
      fetchMssqlApi(
        path,
        {
          method,
          data: {
            SerialNo: serialNo.value,
            ClientId: clients.find(c => c.Name === client.value).CustomerId
          }
        },
        () => {
          closeForm()
          getTerminals()
        }
      )
    }
  }
  const deleteTerminal = (id) => {
    if (window.confirm(TRL_Pack.terminals.terminalDelete))
      fetchMssqlApi(`terminal/${id}`, { method: 'DELETE' }, getTerminals)
  }
  useEffect(() => {
    setHeaderData({ text: TRL_Pack.navigation.terminals })

    getTerminals()
    getClients()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredTerminals =
    terminals &&
    terminals.filter(({ SerialNo, ClientName }) =>
      filterItems(searchedText, SerialNo, ClientName)
    )

  return (
    terminals && (
      <>
        {terminals.length ? (
          <>
            <SearchInput onSearch={updateSearchedText} />
            {!filteredTerminals.length ? (
              <NoResults buttonText={TRL_Pack.terminals.addTerminal} onClick={openForm()} />
            ) : (
              <>
                <div>
                  <button
                    className="d-block btn btn-link text-decoration-none ml-auto my-2 mr-1"
                    onClick={openForm()}
                  >
                    <i className="fas fa-plus mr-2" /> {TRL_Pack.terminals.addTerminal}
                  </button>
                </div>
                <div className="overflow-auto">
                  <table className="table table-striped border">
                    <thead>
                      <tr>
                        <th>{TRL_Pack.terminals.serialNo}</th>
                        <th>{TRL_Pack.terminals.client}</th>
                        <th>{TRL_Pack.terminals.addedDate}</th>
                        <th>{TRL_Pack.machines.properties.delete}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTerminals
                        .sort(
                          (a, b) =>
                            new Date(b.CreateDateTime) - new Date(a.CreateDateTime)
                        )
                        .map((terminal, idx) => (
                          <tr key={idx}>
                            <td>
                              <button
                                className="btn btn-link font-size-inherit text-reset text-decoration-none p-1"
                                onClick={openForm(terminal.TerminalId)}
                              >
                                {terminal.SerialNo}
                              </button>
                            </td>
                            <td>{terminal.ClientName}</td>
                            <td>{terminal.CreateDateTime}</td>
                            <td>
                              <button className="btn btn-link link-icon" onClick={() => deleteTerminal(terminal.TerminalId)}>
                                <i className="fas fa-trash text-danger" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        ) : (
          <NoResults buttonText={TRL_Pack.terminals.addTerminal} onClick={openForm()} />
        )}
        {form && (
          <TerminalForm
            terminalData={
              form !== 'new'
                ? filteredTerminals.find(terminal => terminal.TerminalId === form)
                : null
            }
            clients={clients}
            handleSubmit={submitTerminal}
            handleClose={closeForm}
          />
        )}
      </>
    )
  )
}
