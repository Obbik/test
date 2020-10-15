import React, { useEffect, useContext } from 'react'
import { LangContext } from '../../../context/lang-context'
import { NavigationContext } from '../../../context/navigation-context'
import useFetch from '../../../hooks/fetch-hook'

import MachineTypeForm from '../../../components/Modals/MachineTypeForm'
import MachineTypesTable from '../../../components/Definitions/MachineTypesTable'
import NoResults from '../../../components/NoResults/NoResults'

export default ({
  formControllers: { formModal, openNewForm, openEditForm, closeForm },
  setItems,
  filteredItems
}) => {
  const { TRL_Pack } = useContext(LangContext)
  const { fetchMssqlApi } = useFetch()
  const { setHeaderData } = useContext(NavigationContext)

  const getMachineTypes = () => {
    fetchMssqlApi('machine-types', {}, machineTypes => setItems(machineTypes))
  }

  const deleteMachineType = id => () => {
    const confirm = window.confirm(TRL_Pack.machineTypes.confirmDeletionText)

    if (confirm) fetchMssqlApi(`machineType/${id}`, { method: 'DELETE' }, getMachineTypes)
  }

  const submitMachineType = evt => {}

  useEffect(() => {
    setHeaderData({ text: TRL_Pack.machineTypes.header })
    getMachineTypes()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {filteredItems.length ? (
        <MachineTypesTable
          machineTypes={filteredItems}
          handleAdd={openNewForm}
          handleEdit={openEditForm}
          handleDelete={deleteMachineType}
        />
      ) : (
        <NoResults
          onClick={openNewForm}
          buttonText={TRL_Pack.machineTypes.addMachineTypeButton}
        />
      )}
      {formModal && (
        <MachineTypeForm
          machineTypeData={filteredItems.find(mt => mt.MachineTypeId === formModal)}
          handleSubmit={submitMachineType}
          handleClose={closeForm}
        />
      )}
    </>
  )
}
