import React, { useState, useEffect, useContext } from 'react'
import { LangContext } from '../../../context/lang-context'
import { NavigationContext } from '../../../context/navigation-context'
import useForm from '../../../hooks/form-hook'
import useFetch from '../../../hooks/fetchMSSQL-hook'
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
          <NoResults buttonText={TRL_Pack.machine.addMachine} onClick={openForm()} />
        ) : (
          <>
            <div>
              <button
                className="d-block btn btn-link text-decoration-none ml-auto my-2 mr-1"
                onClick={openForm()}
              >
                <i className="fas fa-plus mr-2" /> {TRL_Pack.machine.addMachine}
              </button>
            </div>
            <div className="overflow-auto">
              <table className="table table-striped border">
                <thead>
                  <tr>
                    <th>{TRL_Pack.machines.properties.machineName}</th>
                    <th>{TRL_Pack.machines.properties.machineType}</th>
                    <th>{TRL_Pack.machines.properties.serialNo}</th>
                    <th>{TRL_Pack.machines.properties.terminal}</th>
                    <th>{TRL_Pack.machines.properties.client}</th>
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
        { form && <MachineForm postSubmit={getMachines} handleClose={closeForm} />}
      </>
    )
  )
}
