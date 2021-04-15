import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import FormSkel from './FormSkel'

export default ({ locationData, handleSubmit, handleClose }) => {
  const { TRL_Pack } = useContext(LangContext)

  return (
    <FormSkel
      headerText={
        locationData
          ? TRL_Pack.locations.editItemHeader
          : TRL_Pack.locations.newItemHeader
      }
      handleClose={handleClose}
    >
      <form onSubmit={handleSubmit} id="modal-form" autoComplete="off">
        <div className="form-group">
          <label className="h6">{TRL_Pack.categories.properties.locationName}</label>
          <input
            name="name"
            className="form-control"
            defaultValue={locationData && locationData.Name}
          />
        </div>
        <div className="form-group row">
          <div className="col-6">
            <label className="h6">{TRL_Pack.categories.properties.long}</label>
            <input
              name="long"
              type="number"
              min={-180}
              max={180}
              step="any"
              className="form-control"
              defaultValue={locationData && locationData.Long}
            />
          </div>
          <div className="col-6">
            <label className="h6">{TRL_Pack.categories.properties.lat}</label>
            <input
              name="lat"
              type="number"
              min={-180}
              max={180}
              step="any"
              className="form-control"
              defaultValue={locationData && locationData.Lat}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="h6">{TRL_Pack.categories.properties.rent}</label>
          <input
            name="rent"
            type="number"
            min={0}
            className="form-control"
            defaultValue={locationData && locationData.MonthlyRentBrutto}
          />
        </div>
        <div>
          <label className="h6">{TRL_Pack.categories.properties.coment}</label>
          <textarea
            name="comment"
            min={0}
            className="form-control"
            defaultValue={(locationData && locationData.Comment) || ''}
          />
        </div>
      </form>
    </FormSkel>
  )
}
