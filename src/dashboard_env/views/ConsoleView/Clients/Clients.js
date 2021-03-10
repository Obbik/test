import React, { useState, useEffect, useContext } from 'react'
import { NavigationContext } from '../../../context/navigation-context'
// import { LangContext } from '../../../context/lang-context'
import useForm from '../../../hooks/form-hook'
import useFetch from '../../../hooks/fetchMSSQL-hook'
import useFilter from '../../../hooks/filter-hook'

import SearchInput from '../../../components/SearchInput/SearchInput'
import NoResults from '../../../components/NoResults/NoResults'
import ClientForm from '../../../components/Modals/ClientForm'
import filterItems from '../../../util/filterItems'
import { LangContext } from '../../../context/lang-context'

export default () => {
  const { fetchMssqlApi } = useFetch()
  const { TRL_Pack } = useContext(LangContext)
  const { setHeaderData } = useContext(NavigationContext)
  // const { TRL_Pack } = useContext(LangContext)
  const { searchedText, updateSearchedText } = useFilter()

  const { form, openForm, closeForm } = useForm()

  const [clients, setClients] = useState(null)
  const getClients = () => {
    fetchMssqlApi('clients', {}, clients => setClients(clients))
  }

  const submitClient = evt => {
    evt.preventDefault()

    const { name, abbreviation } = evt.target.elements

    let path, method
    if (form !== 'new') {
      path = `client/${form}`
      method = 'PUT'
    } else {
      path = 'client'
      method = 'POST'
    }

    fetchMssqlApi(
      path,
      { method, data: { Name: name.value, Abbreviation: abbreviation.value || 'brak' } },
      () => {
        closeForm()
        getClients()
      }
    )
  }

  useEffect(() => {
    setHeaderData({ text: TRL_Pack.navigation.clients })

    getClients()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredClients =
    clients && clients.filter(({ Name }) => filterItems(searchedText, Name))

  return (
    clients && (
      <>
        {clients.length ? (
          <>
            <SearchInput onSearch={updateSearchedText} />
            {!filteredClients.length ? (
              <NoResults buttonText="Dodaj klienta" onClick={openForm()} />
            ) : (
                <>
                  <div>
                    <button
                      className="d-block btn btn-link text-decoration-none ml-auto my-2 mr-1"
                      onClick={openForm()}
                    >
                      <i className="fas fa-plus mr-2" /> {TRL_Pack.clients.addClient}
                    </button>
                  </div>
                  <div className="overflow-auto">
                    <table className="table table-striped border">
                      <thead>
                        <tr>
                          <th>{TRL_Pack.clients.name}</th>
                          <th>{TRL_Pack.clients.base}</th>
                          <th>{TRL_Pack.machines.properties.delete}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredClients.map((client, idx) => (
                          <tr key={idx}>
                            <td>
                              <button
                                className="btn btn-link font-size-inherit text-reset text-decoration-none p-1"
                                onClick={openForm(client.CustomerId)}
                              >
                                {client.Name}
                              </button>
                            </td>
                            <td>{client.Abbreviation}</td>
                            <td>
                              <button className="btn btn-link link-icon" onClick={() => 0}>
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
            <NoResults buttonText="Dodaj klienta" onClick={openForm()} />
          )}
        {form && (
          <ClientForm
            clientData={
              form !== 'new'
                ? filteredClients.find(client => client.CustomerId === form)
                : null
            }
            handleSubmit={submitClient}
            handleClose={closeForm}
          />
        )}
      </>
    )
  )
}
