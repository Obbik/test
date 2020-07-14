import React from 'react'
import { Link } from 'react-router-dom'

export default ({ machines }) => {
  return (
    <div className="col">
      <table className="table table-striped text-center">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Nazwa maszyny</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {machines.length > 0 ? (
            machines.map((machine, idx) => (
              <tr key={idx}>
                <td>
                  {machine.summary_status === 2 ? (
                    <i className="fa fa-check text-success"></i>
                  ) : machine.summary_status === 1 ? (
                    <i className="fa fa-exclamation-triangle text-warning"></i>
                  ) : (
                    <i className="fa fa-exclamation-circle text-danger"></i>
                  )}
                </td>
                <td>{machine.name}</td>
                <td>
                  <Link to={`/machine/${machine.machineId}`}>
                    <i className="fa fa-info-circle text-primary"></i>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <th colspan="6">Brak maszyn</th>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
