import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'

export default ({ openForm, machineProducts, onFillFeeder, onEmptyFeeder }) => {
  const {
    languagePack: { shelves }
  } = useContext(LangContext)

  return (
    <div className="overflow-auto">
      <table className="table table-striped mb-0">
        <thead>
          <tr>
            <th className="text-center px-4" style={{ width: '1%' }}>
              {shelves.props.shelf}
            </th>
            <th>{shelves.props.productName}</th>
            <th className="text-center">{shelves.props.quantity}</th>
            <th style={{ width: '1%' }} colSpan={2} />
          </tr>
        </thead>
        <tbody>
          {machineProducts.map(machineProduct => (
            <tr key={machineProduct.MachineProductId}>
              <td className="text-center font-weight-bold">
                {machineProduct.MachineFeederNo}
              </td>
              <td>
                <button
                  onClick={openForm(machineProduct)}
                  className="btn btn-link text-decoration-none text-reset p-1"
                  style={{ height: 'unset', width: 'auto' }}
                >
                  {machineProduct.Name}
                </button>
              </td>
              <td className="text-center">{`${machineProduct.Quantity}/${machineProduct.MaxItemCount}`}</td>
              <td>
                <button
                  onClick={onFillFeeder(machineProduct.MachineProductId)}
                  className="btn btn-success btn-sm btn-block icon-button"
                  disabled={machineProduct.Quantity === machineProduct.MaxItemCount}
                >
                  <i className="fas fa-arrow-up icon-large" />
                </button>
              </td>
              <td>
                <button
                  onClick={onEmptyFeeder(machineProduct.MachineProductId)}
                  className="btn btn-danger btn-sm btn-block icon-button"
                  disabled={machineProduct.Quantity === 0}
                >
                  <i className="fa fa-arrow-down icon-large" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
