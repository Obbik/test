import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { LangContext } from '../../context/lang-context'

import sampleProduct from '../../assets/images/sample-product.svg'

import { API_URL } from '../../config/config'

export default ({ tableView, categoryItems, onDeleteCategory }) => {
  console.log(categoryItems)
  const {
    languagePack: { categories }
  } = useContext(LangContext)
  const view = tableView ? (
    <div className="col">
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">{categories.properties.categoryName}</th>
            <th scope="col">{categories.properties.image}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {categoryItems.map(category => (
            <tr key={category.CategoryId}>
              <td className="align-middle">{category.Name}</td>
              <td className="align-middle">
                <Link to={`products/${category.CategoryId}`}>
                  <img
                    src={API_URL + category.Image}
                    onError={e => {
                      e.preventDefault()
                      e.target.src = sampleProduct
                    }}
                    alt={category.Name}
                    width="64"
                    height="64"
                  />
                </Link>
              </td>
              <td className="align-middle">
                <Link
                  to={`/category/${category.CategoryId}`}
                  className="btn btn-secondary btn-sm btn-block"
                >
                  <i className="fas fa-pencil-alt"></i>
                </Link>
                <button
                  onClick={() => onDeleteCategory(category.CategoryId)}
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
  ) : (
    categoryItems.map((category, idx) => (
      <div key={idx} className="col-md-3 col-sm-6 mb-3">
        <div className="card">
          <h6 className="card-header text-truncate">{category.Name}</h6>
          <Link to={`products/${category.CategoryId}`}>
            <img
              src={API_URL + category.Image}
              onError={e => {
                e.preventDefault()
                e.target.src = sampleProduct
              }}
              className="card-img-top"
              alt={category.Name}
            />
          </Link>
          <div className="card-body py-2">
            <div className="row">
              <div className="col-md-6 col-custom-padding mt-1">
                <Link
                  to={`/category/${category.CategoryId}`}
                  className="btn btn-secondary btn-sm btn-block"
                >
                  <i className="fas fa-pencil-alt"></i>
                </Link>
              </div>
              <div className="col-md-6 col-custom-padding mt-1">
                <button
                  onClick={() => onDeleteCategory(category.CategoryId)}
                  className="btn btn-danger btn-sm btn-block"
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
