import React, { useEffect, useContext } from 'react'
import { LangContext } from '../../../context/lang-context'
import { NavigationContext } from '../../../context/navigation-context'
import useFetch from '../../../hooks/fetchSQL-hook'

import LocationForm from '../../../components/Modals/LocationForm'
import LocationsTable from '../../../components/Definitions/LocationsTable'
import NoResults from '../../../components/NoResults/NoResults'

export default ({
  formControllers: { formModal, openNewForm, openEditForm, closeForm },
  setItems,
  filteredItems
}) => {
  const { TRL_Pack } = useContext(LangContext)
  const { fetchMssqlApi } = useFetch()
  const { setHeaderData } = useContext(NavigationContext)

  const getLocations = () => {
    fetchMssqlApi('locations', {}, locations => setItems(locations))
  }

  const deleteLocation = id => () => {
    const confirm = window.confirm(TRL_Pack.locations.confirmDeletionText)

    if (confirm) fetchMssqlApi(`location/${id}`, { method: 'DELETE' }, getLocations)
  }

  const submitLocation = evt => {
    evt.preventDefault()

    let path, method
    if (filteredItems.find(l => l.LocationId === formModal)) {
      path = `location/${formModal}`
      method = 'PUT'
    } else {
      path = 'locations'
      method = 'POST'
    }

    const { name, long, lat, rent, comment } = evt.target.elements

    const payload = {
      name: name.value,
      long: long.value,
      lat: lat.value,
      rent: rent.value,
      comment: comment.value
    }

    fetchMssqlApi(path, { method, data: payload }, () => {
      closeForm()
      getLocations()
    })
  }

  useEffect(() => {
    setHeaderData({ text: TRL_Pack.locations.header })
    getLocations()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {filteredItems.length ? (
        <LocationsTable
          locations={filteredItems}
          handleAdd={openNewForm}
          handleEdit={openEditForm}
          handleDelete={deleteLocation}
        />
      ) : (
        <NoResults
          onClick={openNewForm}
          buttonText={TRL_Pack.locations.addLocationButton}
        />
      )}
      {formModal && (
        <LocationForm
          locationData={filteredItems.find(l => l.LocationId === formModal)}
          handleSubmit={submitLocation}
          handleClose={closeForm}
        />
      )}
    </>
  )
}
