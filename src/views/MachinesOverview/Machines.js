import React, { useState, useEffect } from 'react'

import Title from '../../components/Title/Title'
import MachinesMap from '../../components/MachinesOverview/MachinesMap'
import MachinesTable from '../../components/MachinesOverview/MachinesTable'
import SearchInput from '../../components/SearchInput/SearchInput'

import { machines } from './mock.json'

export default () => {
  const [mapView, setMapView] = useState(false)
  const toggleView = () => setMapView(prev => !prev)

  const [searchedValue, setSearchedValue] = useState('')

  const search = value => {
    setSearchedValue(value)
  }

  const filter = arr =>
    arr.filter(m => m.name.toLowerCase().includes(searchedValue.toLowerCase()))

  return (
    <>
      <Title title="Maszyny" />
      <SearchInput tableView={mapView} onSearch={search} onToggleView={toggleView} />
      <div className="row">
        {mapView ? (
          <MachinesMap machines={filter(machines)} />
        ) : (
          <MachinesTable machines={filter(machines)} />
        )}
      </div>
    </>
  )
}
