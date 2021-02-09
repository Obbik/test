import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import NoResults from '../NoResults/NoResults'

export default ({ locations, handleAdd, handleEdit, handleDelete }) => {
  const { TRL_Pack } = useContext(LangContext)

  return locations.length ? (
    <div className="overflow-auto">
      <button
        className="d-block ml-auto btn btn-link text-decoration-none m-2"
        onClick={handleAdd}
      >
        <i className="fas fa-plus mr-2" /> {TRL_Pack.locations.addLocationButton}
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ width: '1%' }}>#</th>
            <th>{TRL_Pack.locations.properties.locationName}</th>
            <th>{TRL_Pack.locations.properties.geolocation}</th>
            <th>{TRL_Pack.locations.properties.rent}</th>
            <th style={{ width: '1%' }} colSpan={2} />
          </tr>
        </thead>
        <tbody>
          {locations.map((location, idx) => (
            <tr key={idx}>
              <td className="small font-weight-bold">{idx + 1}</td>
              <td className="small">{location.Name}</td>
              <td className="small">
                {location.Long && location.Lat && `${location.Long}, ${location.Lat}`}
              </td>
              <td className="small">{location.MonthlyRentBrutto}</td>
              <td>
                <button
                  className="btn btn-link link-icon"
                  onClick={handleEdit(location.LocationId)}
                >
                  <i className="far fa-edit" />
                </button>
              </td>
              <td>
                <button
                  className="btn btn-link link-icon"
                  onClick={handleDelete(location.LocationId)}
                >
                  <i className="fa fa-trash" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <NoResults onClick={handleAdd} buttonText={TRL_Pack.locations.addLocationButton} />
  )
}
