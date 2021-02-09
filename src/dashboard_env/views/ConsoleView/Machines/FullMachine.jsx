import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { LangContext } from '../../../context/lang-context'
import { NavigationContext } from '../../../context/navigation-context'
import useFetch from '../../../hooks/fetchSQL-hook'

import ReturnLink from '../../../components/Return/ReturnLink'

import MachineProducts from '../../../components/Machine/MachineProductsConsole'
import MachineDetailsCard from '../../../components/Machine/MachineDetailsCard'
import MachineNotesCard from '../../../components/Machine/MachineNotesCard'
// import MachineReports from '../../../components/Machine/MachineReports'

export default () => {
  const { machineId } = useParams()
  const { fetchMssqlApi } = useFetch()
  const { setHeaderData } = useContext(NavigationContext)
  const { TRL_Pack } = useContext(LangContext)

  const [machineData, setMachineData] = useState({})

  const getMachine = () => {
    fetchMssqlApi(`machine/${machineId}`, {}, machineData =>
      setMachineData({ ...machineData })
    )
  }

  useEffect(() => {
    setHeaderData({ text: TRL_Pack.machines.header })
    getMachine()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <ReturnLink path="/machines" />
      <div className="row mb-4">
        <div className="col-12 col-md-6 mb-4 mb-md-0">
          <MachineDetailsCard machineData={machineData} getMachine={getMachine} />
        </div>
        <div className="col-12 col-md-6">
          <MachineNotesCard />
        </div>
      </div>
      <MachineProducts />
    </>
  )
}
