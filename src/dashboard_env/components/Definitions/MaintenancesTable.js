import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import NoResults from '../NoResults/NoResults'

export default ({ maintenances, handleAdd, handleEdit, handleDelete }) => {
  const { TRL_Pack } = useContext(LangContext)

  return maintenances.length ? (
    <div className="overflow-auto">
      <button
        className="d-block ml-auto btn btn-link text-decoration-none m-2"
        onClick={handleAdd}
      >
        <i className="fas fa-plus mr-2" /> {TRL_Pack.maintenances.addMaintenanceButton}
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ width: '1%' }}>#</th>
            <th>{TRL_Pack.maintenances.properties.maintenanceName}</th>
            <th style={{ width: '1%' }} colSpan={2} />
          </tr>
        </thead>
        <tbody>
          {maintenances.map((maintenance, idx) => (
            <tr key={idx}>
              <td className="small font-weight-bold">{idx + 1}</td>
              <td className="small">{maintenance.Name}</td>
              <td>
                <button
                  className="btn btn-link link-icon"
                  onClick={handleEdit(maintenance.MaintenanceTypeId)}
                >
                  <i className="far fa-edit" />
                </button>
              </td>
              <td>
                <button
                  className="btn btn-link link-icon"
                  onClick={handleDelete(maintenance.MaintenanceTypeId)}
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
    <NoResults
      onClick={handleAdd}
      buttonText={TRL_Pack.maintenances.addMaintenanceButton}
    />
  )
}
