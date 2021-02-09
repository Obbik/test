import React, { useState, useRef, useEffect, useContext } from 'react'
import { NavigationContext } from '../../../context/navigation-context'
import { LangContext } from '../../../context/lang-context'
import useFetch from '../../../hooks/fetchSQL-hook'
import useFilter from '../../../hooks/filter-hook'

import MachinesMap from '../../../components/Monitoring/MachinesMap'
import MachinesTable from '../../../components/Monitoring/MachinesTable'
import SearchInput from '../../../components/SearchInput/SearchInput'
import filterItems from '../../../util/filterItems'
import NoResults from '../../../components/NoResults/NoResults'
import MachineStatus from '../../../components/Monitoring/MachineStatus'
import MachineNotifications from '../../../components/Monitoring/MachineNotifications'
import MachineTransactions from '../../../components/Monitoring/MachineTransactions'

export default () => {
  const { fetchMssqlApi } = useFetch()
  const { setHeaderData } = useContext(NavigationContext)
  const { TRL_Pack } = useContext(LangContext)

  const [mapView, setMapView] = useState(false)
  const toggleView = () => setMapView(prev => !prev)

  const { searchedText, updateSearchedText } = useFilter()
  const [sortType, setSortType] = useState('1')
  const updateSortType = id => setSortType(id)
  const sortingOptions = ['Najw. transakcji', 'Ost. transakcja']

  const [machines, setMachines] = useState(null)
  const machineIndex = useRef(null)
  const [currentMachine, setCurrentMachine] = useState(null)

  const [currentMachineSection, setCurrentMachineSection] = useState(1)
  const changeSection = id => () => setCurrentMachineSection(id)

  const handleSelectMachine = idx => () => {
    if (idx === 'prev') {
      if (machineIndex.current === 0) machineIndex.current = filteredMachines.length - 1
      else machineIndex.current--
    } else if (idx === 'next') {
      if (machineIndex.current === filteredMachines.length - 1) machineIndex.current = 0
      else machineIndex.current++
    } else {
      machineIndex.current = idx
    }

    const selectedMachine = filteredMachines.sort(sortMachines)[machineIndex.current]
    setHeaderData({
      text: `${selectedMachine.name} (${selectedMachine.type})`,
      subtext: selectedMachine.customer_name
    })
    setCurrentMachine(selectedMachine)
  }
  const clearSelectedMachine = () => {
    setHeaderData({ text: TRL_Pack.monitoring.header })
    setCurrentMachine(null)
  }

  const getMachines = () => {
    fetchMssqlApi('monitoring', {}, machines => setMachines(machines))
  }

  useEffect(() => {
    setHeaderData({ text: TRL_Pack.monitoring.header })

    const interval = setInterval(() => {
      if (new Date().getMinutes() % 10 <= 5) getMachines()
    }, 60000)

    getMachines()

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const eventWrapper = evt => {
    if (evt.key === 'ArrowLeft') handleSelectMachine('prev')()
    else if (evt.key === 'ArrowRight') handleSelectMachine('next')()
  }

  useEffect(() => {
    if (currentMachine) document.addEventListener('keydown', eventWrapper)
    return () => document.removeEventListener('keydown', eventWrapper)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMachine])

  const sortMachines = (a, b) => {
    if (sortType === '0') {
      return b.trx_count - a.trx_count
    } else if (sortType === '1') {
      return (
        new Date(b.transactions[0].create_date_time) -
        new Date(a.transactions[0].create_date_time)
      )
    } else {
      return 0
    }
  }

  const filteredMachines =
    machines &&
    machines
      .filter(({ name, type, customer_name, serialNo, terminal, ip }) =>
        filterItems(searchedText, name, type, customer_name, serialNo, terminal, ip)
      )
      .sort(sortMachines)

  return currentMachine ? (
    <>
      <div className="mb-3 d-flex justify-content-between">
        <div>
          <button
            onClick={clearSelectedMachine}
            className="btn btn-link ml-1 text-decoration-none"
          >
            <i className="fas fa-arrow-left mr-2" />
            {TRL_Pack.buttons.return}
          </button>
        </div>
        <div>
          <button
            onClick={handleSelectMachine('prev')}
            className="btn btn-link text-decoration-none"
          >
            <i className="fas fa-chevron-left" />
            <span className="d-none d-md-inline ml-2">Poprzednia</span>
          </button>
          <button
            onClick={handleSelectMachine('next')}
            className="btn btn-link text-decoration-none"
          >
            <span className="d-none d-md-inline mr-2">Następna</span>
            <i className="fas fa-chevron-right" />
          </button>
        </div>
      </div>
      <ul className="nav nav-tabs machine-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link btn ${currentMachineSection === 0 ? 'active' : ''}`}
            onClick={changeSection(0)}
            tabIndex="0"
          >
            {TRL_Pack.monitoring.info}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn ${currentMachineSection === 1 ? 'active' : ''}`}
            onClick={changeSection(1)}
            tabIndex="0"
          >
            {TRL_Pack.monitoring.transactions}
            {/* <span className="ml-2 badge badge-info">
              {currentMachine.transactions.length}
            </span> */}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn ${currentMachineSection === 2 ? 'active' : ''}`}
            onClick={changeSection(2)}
            tabIndex="0"
          >
            {TRL_Pack.monitoring.notifications}
            {/* <span className="ml-2 badge badge-warning">
              {currentMachine.events.length}
            </span> */}
          </button>
        </li>
      </ul>
      <div>
        {currentMachineSection === 0 && <MachineStatus machine={currentMachine} />}
        {currentMachineSection === 1 && (
          <MachineTransactions transactions={currentMachine.transactions} />
        )}
        {currentMachineSection === 2 && (
          <MachineNotifications events={currentMachine.events} />
        )}
      </div>
    </>
  ) : (
    machines && (
      <>
        <SearchInput
          tableView={mapView}
          onSearch={updateSearchedText}
          sortingOptions={sortingOptions}
          onSortChange={updateSortType}
          currentSorting={sortType}
          onToggleView={toggleView}
          defaultValue={searchedText}
        />
        {!filteredMachines.length ? (
          <NoResults />
        ) : mapView ? (
          <MachinesMap machines={filteredMachines} />
        ) : (
          <MachinesTable
            machines={filteredMachines}
            handleSelectMachine={handleSelectMachine}
          />
        )}
      </>
    )
  )
}
