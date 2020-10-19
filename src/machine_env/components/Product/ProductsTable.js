import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'

import { API_URL } from '../../config/config'

import sampleProduct from '../../assets/images/sample-product.svg'

export default ({ productItems, openForm, handleDeleteProduct }) => {
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
            <th style={{ width: '1%' }} colSpan={2} />
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
              {product.IsShared ? (
                <td colSpan={2} />
              ) : (
                <>
                  <td>
                    <button
                      onClick={openForm(product.EAN)}
                      className="btn btn-secondary btn-sm btn-block icon-button"
                    >
                      <i className="fas fa-pencil-alt icon-large" />
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={handleDeleteProduct(product.EAN)}
                      className="btn btn-danger btn-sm btn-block icon-button"
                    >
                      <i className="fa fa-trash icon-large" />
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
