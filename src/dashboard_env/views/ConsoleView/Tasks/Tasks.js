import React, { useState, useEffect, useContext } from 'react'
import { NavigationContext } from '../../../context/navigation-context'
// import { LangContext } from '../../context/lang-context'
import useFetch from '../../hooks/fetchMSSQL-hook'

import SearchInput from '../../../components/SearchInput/SearchInput'
import NoResults from '../../../components/NoResults/NoResults'

export default () => {
  const { fetchMssqlApi } = useFetch()
  const { setHeaderData } = useContext(NavigationContext)
  // const { TRL_Pack } = useContext(LangContext)

  const [search, setSearch] = useState('')
  const handleSearch = value => setSearch(value)

  const [tasks, setTasks] = useState([])

  const getTasks = () => {
    fetchMssqlApi('tasks', {}, tasks => setTasks(tasks))
  }

  useEffect(() => {
    setHeaderData({ text: 'Zadania' })

    getTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredTasks = tasks.filter(
    t => t.MachineName && t.MachineName.toLowerCase().includes(search.toLowerCase())
  )

  return tasks.length ? (
    <>
      <SearchInput onSearch={handleSearch} />
      {!filteredTasks.length ? (
        <NoResults />
      ) : (
          <div className="overflow-auto">
            <table className="table table-striped border">
              <thead>
                <tr>
                  {/* <th>ID</th> */}
                  <th>Maszyna</th>
                  <th>Klient</th>
                  <th>Typ</th>
                  <th>Ostatnie uruchomienie</th>
                  <th>Ostatnie zakończenie</th>
                  <th>Ostatni bląd</th>
                  <th>Powtarzane co</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task, idx) => (
                  <tr key={idx}>
                    {/* <td className="font-weight-bold">{task.TaskId}</td> */}
                    <td>{task.MachineName}</td>
                    <td>{task.ClientName}</td>
                    <td>{task.Type}</td>
                    <td>{task.LastStart}</td>
                    <td>{task.LastEnd}</td>
                    <td>{task.LastError}</td>
                    <td>{task.RecurringEvery}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </>
  ) : (
      <NoResults />
    )
}
