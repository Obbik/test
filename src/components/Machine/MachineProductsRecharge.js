import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'

export default ({ machineProducts, onFillFeeder, onEmptyFeeder }) => {
  const {
    languagePack: { shelves }
  } = useContext(LangContext)

  return (
    <div className="row">
      <div className="col">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">{shelves.properties.shelf}</th>
              <th scope="col">{shelves.properties.productName}</th>
              <th scope="col">{shelves.properties.quantity}</th>
              <th scope="col">{shelves.properties.capacity}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {machineProducts.map(machineProduct => (
              <tr key={machineProduct.MachineProductId}>
                <td className="align-middle">{machineProduct.MachineFeederNo}</td>
                <td className="align-middle">{machineProduct.Name}</td>
                <td className="align-middle">{machineProduct.Quantity}</td>
                <td className="align-middle">{machineProduct.MaxItemCount}</td>
                <td className="align-middle">
                  <button
                    onClick={() => onFillFeeder(machineProduct)}
                    className="btn btn-success btn-lg btn-block"
                  >
                    <i className="fas fa-arrow-up"></i>
                  </button>
                  <button
                    onClick={() => onEmptyFeeder(machineProduct)}
                    className="btn btn-danger btn-lg btn-block"
                  >
                    <i className="fa fa-arrow-down"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
