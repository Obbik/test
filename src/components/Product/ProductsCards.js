import React from 'react'

import { API_URL } from '../../config/config'
import sampleProduct from '../../assets/images/sample-product.svg'

export default ({
  productItems,
  setProductModal,
  setProductCategoriesModal,
  handleDeleteProduct
}) => (
  <div className="row mb-n4">
    {productItems.map(product => (
      <div key={product.EAN} className="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div className="card h-100">
          <h6 className="card-header">{product.Name}</h6>
          <div className="card-body p-3 d-flex flex-column justify-content-center">
            <div className="card-img">
              <img
                src={API_URL + product.Image}
                onError={evt => (evt.target.src = sampleProduct)}
                alt={product.Name}
              />
            </div>
            <strong className="d-block text-center mt-2">{product.EAN}</strong>
          </div>
          <div className="card-footer">
            <div className="row">
              <div className="col-sm-6 col-4 px-1">
                <button
                  onClick={() => setProductModal(product.EAN)}
                  className={`btn btn-secondary btn-sm btn-block py-2 ${
                    product.IsShared ? 'disabled' : ''
                  }`}
                >
                  <i className="fas fa-pencil-alt" />
                </button>
              </div>
              <div className="col-sm-6 col-4 px-1">
                <button
                  onClick={() => setProductCategoriesModal(product.EAN)}
                  className="btn btn-secondary btn-sm btn-block py-2 "
                >
                  <i className="fas fa-th-large" />
                </button>
              </div>
              <div className="col-sm-12 col-4 px-1 mt-sm-2">
                <button
                  onClick={() => handleDeleteProduct(product.EAN)}
                  className={`btn btn-danger btn-sm btn-block py-2 ${
                    product.IsShared && 'disabled'
                  }`}
                >
                  <i className="fa fa-trash" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
)
