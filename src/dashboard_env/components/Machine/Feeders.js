import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'

export default ({
  openForm,
  machineProducts,
  handleDeliverMachineProduct,
  handleDeleteMachineProduct
}) => {
  const {
    TRL_Pack: { shelves }
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
            <th className="text-center">{shelves.props.price}</th>
            {/* <th >{shelves.props.discountedPrice}</th> */}
            <th className="text-center">{shelves.props.quantity}</th>
            <th style={{ width: '1%' }} colSpan={3} />
          </tr>
        </thead>
        <tbody>
          {machineProducts.map((product, idx) => (
            <tr key={idx}>
              <td className="text-center font-weight-bold">{product.MachineFeederNo}</td>
              <td>{product.Name}</td>
              <td className="text-center">{product.Price.toFixed(2)}</td>
              {/* <td>{product.DiscountedPrice.toFixed(2)}</td> */}
              <td className="text-center">{`${product.Quantity}/${product.MaxItemCount}`}</td>
              <td>
                <button
                  className="btn btn-info btn-sm btn-block icon-button"
                  onClick={handleDeliverMachineProduct(product.MachineFeederNo)}
                >
                  <i className="fas fa-cart-arrow-down icon-large" />
                </button>
              </td>
              <td>
                <button
                  className="btn btn-secondary btn-sm btn-block icon-button"
                  onClick={openForm(product.MachineProductId)}
                >
                  <i className="fas fa-pencil-alt icon-large" />
                </button>
              </td>
              <td>
                <button
                  onClick={handleDeleteMachineProduct(product.MachineProductId)}
                  className="btn btn-danger btn-sm btn-block icon-button"
                >
                  <i className="fa fa-trash icon-large" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
