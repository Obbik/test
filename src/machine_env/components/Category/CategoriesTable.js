import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { LangContext } from '../../context/lang-context'

import sampleProduct from '../../assets/images/sample-product.svg'

import { API_URL } from '../../config/config'

export default ({ categoryItems, setModal, onDeleteCategory }) => {
  const {
    languagePack: { categories }
  } = useContext(LangContext)

  return (
    <div className="overflow-auto">
      <table className="table table-striped mb-0">
        <thead>
          <tr>
            <th className="text-center px-4" style={{ width: '1%' }}>
              #
            </th>
            <th>{categories.props.categoryName}</th>
            <th className="text-center">{categories.props.image}</th>
            <th style={{ width: '1%' }} colSpan={2} />
          </tr>
        </thead>
        <tbody>
          {categoryItems.map((category, idx) => (
            <tr key={idx}>
              <td className="text-center font-weight-bold">{idx + 1}</td>
              <td>{category.Name}</td>
              <td className="text-center">
                <Link to={`products/${category.CategoryId}`}>
                  <img
                    src={API_URL + category.Image}
                    onError={evt => (evt.target.src = sampleProduct)}
                    alt={category.Name}
                    width="48"
                    height="48"
                  />
                </Link>
              </td>
              <td>
                <button
                  className="btn btn-secondary btn-sm btn-block"
                  onClick={() => setModal(category.CategoryId)}
                >
                  <i className="fas fa-pencil-alt" />
                </button>
              </td>
              <td>
                <button
                  onClick={() => onDeleteCategory(category.CategoryId)}
                  className="btn btn-danger btn-sm btn-block"
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
