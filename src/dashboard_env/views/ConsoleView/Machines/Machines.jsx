import React, { useState, useEffect, useContext } from 'react'
import { LangContext } from '../../../context/lang-context'
import { NavigationContext } from '../../../context/navigation-context'
import useForm from '../../../hooks/form-hook'
import useFetch from '../../../hooks/fetchSQL-hook'
import useFilter from '../../../hooks/filter-hook'
import NoResults from '../../../components/NoResults/NoResults'
import MachineForm from '../../../components/Modals/MachineForm'
import { Link } from 'react-router-dom'

import SearchInput from '../../../components/SearchInput/SearchInput'
import filterItems from '../../../util/filterItems'

export default () => {
  const { TRL_Pack } = useContext(LangContext)
  const { fetchMssqlApi } = useFetch()
  const { setHeaderData } = useContext(NavigationContext)
  const { searchedText, updateSearchedText } = useFilter()

  const { form, openForm, closeForm } = useForm()

  const [machines, setMachines] = useState(null)
  const getMachines = () => {
    fetchMssqlApi('machines', {}, machines => setMachines(machines))
  }

  // const deleteMachine = id => () => {
  //   if (window.confirm('Potwierdź usunięcie maszyny'))
  //     fetchMssqlApi(`machine/${id}`, { method: 'DELETE' }, getMachines)
  // }

  useEffect(() => {
    setHeaderData({ text: TRL_Pack.machines.header })

    getMachines()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredMachines =
    machines &&
    machines.filter(({ MachineName, Type, SerialNo, Terminal, ClientName }) =>
      filterItems(searchedText, MachineName, Type, SerialNo, Terminal, ClientName)
    )

  return (
    machines && (
      <>
        <SearchInput onSearch={updateSearchedText} />
        {!filteredMachines.length ? (
          <NoResults buttonText="Dodaj maszyne" onClick={openForm()} />
        ) : (
          <>
            <div>
              <button
                className="d-block btn btn-link text-decoration-none ml-auto my-2 mr-1"
                onClick={openForm()}
              >
                <i className="fas fa-plus mr-2" /> Dodaj maszyne
              </button>
            </div>
            <div className="overflow-auto">
              <table className="table table-striped border">
                <thead>
                  <tr>
                    <th>Maszyna</th>
                    <th>Typ</th>
                    <th>Nr seryjny</th>
                    <th>Terminal</th>
                    <th>Klient</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMachines
                    .filter(machine => machine.MachineName)
                    .sort((a, b) => {
                      if (a.SerialNo.toLowerCase() > b.SerialNo.toLowerCase()) return -1
                      else if (a.SerialNo.toLowerCase() < b.SerialNo.toLowerCase())
                        return 1
                      else return 0
                    })
                    .map((machine, idx) => (
                      <tr key={idx}>
                        <td>
                          <Link
                            to={`/machine/${machine.MachineId}`}
                            className="btn btn-link font-size-inherit text-reset text-decoration-none p-1"
                          >
                            {machine.MachineName}
                          </Link>
                        </td>
                        <td>{machine.Type}</td>
                        <td>{machine.SerialNo}</td>
                        <td>{machine.Terminal}</td>
                        <td>{machine.ClientName}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {form && <MachineForm postSubmit={getMachines} handleClose={closeForm} />}
      </>
    )
  )
}
