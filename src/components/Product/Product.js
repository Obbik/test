import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { LangContext } from '../../context/lang-context'

import { API_URL } from '../../config/config'

const sampleProduct = require('../../assets/images/sample-product.svg')

export default ({
  productItems,
  onDeleteProduct,
  tableView,
  onShowProductCategoryModal
}) => {
  const {
    languagePack: { products }
  } = useContext(LangContext)
  const view = tableView ? (
    <div className="col">
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">{products.properties.ean}</th>
            <th scope="col">{products.properties.productName}</th>
            <th scope="col">{products.properties.image}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {productItems.map(product => (
            <tr key={product.EAN}>
              <th className="align-middle">{product.EAN}</th>
              <td className="align-middle">{product.Name}</td>
              <td className="align-middle">
                <img
                  src={API_URL + product.Image}
                  onError={e => {
                    e.preventDefault()
                    e.target.src = sampleProduct
                  }}
                  alt={product.Name}
                  width="64"
                  height="64"
                />
                {/* + '?n=' + new Date().getTime() */}
              </td>
              <td className="align-middle">
                <Link
                  to={`/product/${product.EAN}`}
                  className={`btn btn-secondary btn-sm btn-block ${
                    product.IsShared ? 'disabled' : ''
                  }`}
                >
                  <i className="fas fa-pencil-alt"></i>
                </Link>
                <button
                  onClick={() => onShowProductCategoryModal(product.EAN)}
                  className="btn btn-secondary btn-sm btn-block"
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button
                  onClick={() => onDeleteProduct(product.EAN)}
                  className={`btn btn-danger btn-sm btn-block ${
                    product.IsShared ? 'disabled' : ''
                  }`}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    productItems.map(product => (
      <div key={product.EAN} className="col-md-3 col-sm-6 mb-3">
        {/* col-lg-2  */}
        <div className="card">
          <h6 className="card-header text-truncate">{product.Name}</h6>
          <div className="card-body">
            <img
              src={API_URL + product.Image}
              onError={e => {
                e.preventDefault()
                e.target.src = sampleProduct
              }}
              className="card-img-top"
              alt={product.Name}
            />
            {/* + '?n=' + new Date().getTime() */}
            <p className="text-center text-truncate">{product.EAN}</p>
            <div className="row">
              <div className="col-lg-4 col-md-6 col-custom-padding mt-1">
                <Link
                  to={`/product/${product.EAN}`}
                  className={`btn btn-secondary btn-sm btn-block ${
                    product.IsShared ? 'disabled' : ''
                  }`}
                >
                  <i className="fas fa-pencil-alt"></i>
                </Link>
              </div>
              <div className="col-lg-4 col-md-6 col-custom-padding mt-1">
                <button
                  onClick={() => onShowProductCategoryModal(product.EAN)}
                  className="btn btn-secondary btn-sm btn-block"
                >
                  <i className="fas fa-th-large"></i>
                </button>
              </div>
              <div className="col-lg-4 col-md-12 col-custom-padding mt-1">
                <button
                  onClick={() => onDeleteProduct(product.EAN)}
                  className={`btn btn-danger btn-sm btn-block ${
                    product.IsShared ? 'disabled' : ''
                  }`}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))
  )

  return <div className="row">{view}</div>
}
