import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { LangContext } from '../../context/lang-context'

import { CONSOLE_CLOUD, LOCAL_CLOUD } from '../../config/config'
import NoResults from '../NoResults/NoResults'

import sampleProduct from '../../assets/images/sample-product.svg'

export default ({ categories, handleAdd, handleEdit, handleDelete }) => {
  const { TRL_Pack } = useContext(LangContext)

  return categories.length ? (
    <div className="overflow-auto">
      <button
        className="d-block ml-auto btn btn-link text-decoration-none my-2"
        onClick={handleAdd}
      >
        <i className="fas fa-plus mr-2" /> {TRL_Pack.categories.addCategoryButton}
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="text-center" style={{ width: 50 }}>
              #
            </th>
            <th>{TRL_Pack.categories.properties.categoryName}</th>
            <th>{TRL_Pack.categories.properties.image}</th>
            <th style={{ width: '1%' }} />
          </tr>
        </thead>
        <tbody>
          {categories.map((category, idx) => (
            <tr key={idx}>
              <td className="font-weight-bold text-center">{idx + 1}</td>
              <td>
                {category.IsShared ? (
                  <span style={{ wordBreak: 'break-word' }} className="p-1">
                    {category.Name}
                  </span>
                ) : (
                  <button
                    style={{ wordBreak: 'break-word' }}
                    className="btn btn-link font-size-inherit text-reset text-decoration-none p-1"
                    onClick={handleEdit(category.CategoryId)}
                  >
                    {category.Name}
                  </button>
                )}
              </td>
              <td>
                <Link to={`products/${category.CategoryId}`} className="btn btn-link p-0">
                  <img
                    src={`${category.IsShared ? CONSOLE_CLOUD : LOCAL_CLOUD}/categories/${
                      category.Image
                    }`}
                    onError={evt => (evt.target.src = sampleProduct)}
                    alt={category.Name}
                    width="48"
                    height="48"
                  />
                </Link>
              </td>
              <td>
                <button
                  className="btn btn-link"
                  onClick={handleDelete(category.CategoryId)}
                >
                  <i className="fa fa-trash text-danger" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <NoResults onClick={handleAdd} buttonText={TRL_Pack.categories.addCategoryButton} />
  )
}
