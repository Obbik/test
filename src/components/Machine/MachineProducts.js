import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { LangContext } from '../../context/lang-context'

export default ({ machineProducts, onDeleteMachineProduct }) => {
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
              <th scope="col">{shelves.properties.price}</th>
              {/* <th scope="col">{shelves.properties.discountedPrice}</th> */}
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
                <td className="align-middle">{machineProduct.Price.toFixed(2)}</td>
                {/* <td className="align-middle">{machineProduct.DiscountedPrice.toFixed(2)}</td> */}
                <td className="align-middle">{machineProduct.Quantity}</td>
                <td className="align-middle">{machineProduct.MaxItemCount}</td>
                <td className="align-middle">
                  <Link
                    to={'/machine-product/' + machineProduct.MachineProductId}
                    className="btn btn-secondary btn-sm btn-block"
                  >
                    <i className="fas fa-pencil-alt"></i>
                  </Link>
                  <button
                    onClick={() =>
                      onDeleteMachineProduct(machineProduct.MachineProductId)
                    }
                    className="btn btn-danger btn-sm btn-block"
                  >
                    <i className="fa fa-trash"></i>
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
