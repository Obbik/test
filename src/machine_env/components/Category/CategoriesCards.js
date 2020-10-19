import React from 'react'
import { Link } from 'react-router-dom'

import { API_URL } from '../../config/config'
import sampleProduct from '../../assets/images/sample-product.svg'

export default ({ categoryItems, openForm, handleDeleteCategory }) => (
  <div className="row mb-n4">
    {categoryItems.map((category, idx) => (
      <div key={idx} className="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div className="card">
          <h6 className="card-header text-truncate">{category.Name}</h6>
          <Link to={`products/${category.CategoryId}`}>
            <div className="card-img card-body">
              <img
                src={API_URL + category.Image}
                className="mw-100"
                onError={evt => (evt.target.src = sampleProduct)}
                alt={category.Name}
              />
            </div>
          </Link>
          <div className="card-footer">
            <div className="row">
              <div className="col-6 px-1">
                <button
                  className="btn btn-secondary btn-sm btn-block py-2"
                  onClick={openForm(category.CategoryId)}
                >
                  <i className="fas fa-pencil-alt" />
                </button>
              </div>
              <div className="col-6 px-1">
                <button
                  onClick={handleDeleteCategory(category.CategoryId)}
                  className="btn btn-danger btn-sm btn-block py-2"
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
