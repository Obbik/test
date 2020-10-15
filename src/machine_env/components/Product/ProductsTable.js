import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'

import { API_URL } from '../../config/config'

import sampleProduct from '../../assets/images/sample-product.svg'

export default ({
  productItems,
  setProductModal,
  setProductCategoriesModal,
  handleDeleteProduct
}) => {
  const {
    languagePack: { products }
  } = useContext(LangContext)

  return (
    <div className="overflow-auto">
      <table className="table table-striped mb-0">
        <thead>
          <tr>
            <th className="text-center px-4" style={{ width: '1%' }}>
              {products.props.ean}
            </th>
            <th>{products.props.productName}</th>
            <th className="text-center">{products.props.image}</th>
            <th style={{ width: '1%' }} colSpan={3} />
          </tr>
        </thead>
        <tbody>
          {productItems.map(product => (
            <tr key={product.EAN}>
              <td className="text-center font-weight-bold">{product.EAN}</td>
              <td>{product.Name}</td>
              <td className="text-center">
                <img
                  src={API_URL + product.Image}
                  onError={evt => (evt.target.src = sampleProduct)}
                  alt={product.Name}
                  width="48"
                  height="48"
                />
              </td>
              <td>
                <button
                  onClick={() => setProductModal(product.EAN)}
                  className={`btn btn-secondary btn-sm btn-block ${
                    product.IsShared && 'disabled'
                  }`}
                >
                  <i className="fas fa-pencil-alt" />
                </button>
              </td>
              <td>
                <button
                  onClick={() => setProductCategoriesModal(product.EAN)}
                  className="btn btn-secondary btn-sm btn-block"
                >
                  <i className="fas fa-th-large" />
                </button>
              </td>
              <td>
                <button
                  onClick={() => handleDeleteProduct(product.EAN)}
                  className={`btn btn-danger btn-sm btn-block ${
                    product.IsShared && 'disabled'
                  }`}
                >
                  <i className="fa fa-trash" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
