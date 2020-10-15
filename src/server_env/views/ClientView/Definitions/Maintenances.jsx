import React, { useEffect, useContext } from 'react'
import { LangContext } from '../../../context/lang-context'
import { NavigationContext } from '../../../context/navigation-context'
import useFetch from '../../../hooks/fetch-hook'

import MaintenanceForm from '../../../components/Modals/MaintenanceForm'
import MaintenancesTable from '../../../components/Definitions/MaintenancesTable'
import NoResults from '../../../components/NoResults/NoResults'

export default ({
  formControllers: { formModal, openNewForm, openEditForm, closeForm },
  setItems,
  filteredItems
}) => {
  const { TRL_Pack } = useContext(LangContext)
  const { fetchMssqlApi } = useFetch()
  const { setHeaderData } = useContext(NavigationContext)

  const getMaintenances = () => {
    fetchMssqlApi('maintenances', {}, maintenances => setItems(maintenances))
  }

  const deleteMaintenances = id => () => {
    const confirm = window.confirm(TRL_Pack.maintenances.confirmDeletionText)

    if (confirm) fetchMssqlApi(`maintenance/${id}`, { method: 'DELETE' }, getMaintenances)
  }

  const submitMaintenance = evt => {}

  useEffect(() => {
    setHeaderData({ text: TRL_Pack.maintenances.header })

    getMaintenances()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {filteredItems.length ? (
        <MaintenancesTable
          maintenances={filteredItems}
          handleAdd={openNewForm}
          handleEdit={openEditForm}
          handleDelete={deleteMaintenances}
        />
      ) : (
        <NoResults
          onClick={openNewForm}
          buttonText={TRL_Pack.maintenances.addMaintenanceButton}
        />
      )}
      {formModal && (
        <MaintenanceForm
          maintenanceData={filteredItems.find(mt => mt.MaintenanceTypeId === formModal)}
          handleSubmit={submitMaintenance}
          handleClose={closeForm}
        />
      )}
    </>
  )
}
