import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { LangContext } from '../../../context/lang-context'
import { NavigationContext } from '../../../context/navigation-context'
import useFetch from '../../../hooks/fetchMSSQL-hook'

import ReturnLink from '../../../components/Return/ReturnLink'

import MachineInfo from '../../../components/Machine/MachineInfo'
import MachineProducts from '../../../components/Machine/MachineProducts'
import MachineProductsNew from '../../../components/Machine/MachineProductsNew'
import MachineRecipes from '../../../components/Machine/MachineRecipes'
// import MachineReports from '../../../components/Machine/MachineReports'

export default () => {
  const { machineId } = useParams()
  const { fetchMssqlApi } = useFetch()
  const { setHeaderData } = useContext(NavigationContext)
  const { TRL_Pack } = useContext(LangContext)

  const [machineData, setMachineData] = useState(null)

  const getMachineItemsType = () => {
    fetchMssqlApi(`machine/${machineId}`, {}, machineData =>
      setMachineData({ ...machineData })
    )
  }

  useEffect(() => {
    setHeaderData({ text: TRL_Pack.machine.header })
    getMachineItemsType()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <ReturnLink path="/machines" />
      {machineData && (
        <>
          <MachineInfo machineData={machineData} updateMachine={setMachineData} />
          {machineData.MaintenanceType === 'SNACK' ? (
            <MachineProductsNew machineId={machineId} />
            // <MachineProducts machineId={machineId} />
          ) : (
              machineData.MaintenanceType === 'COFFEE' && (
                <MachineRecipes machineId={machineId} />
              )
            )}
          {/* <div className="row">
            <MachineReports serialNo={serialNo} />
          </div> */}
        </>
      )}
    </>
  )
}
