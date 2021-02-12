import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { LangContext } from '../../../context/lang-context'
import { SearchbarContext } from '../../../context/searchbar-context'
import useFetch from '../../../hooks/fetchMSSQL-hook'

import NoResults from '../../../components/NoResults/NoResults'
import sampleProduct from '../../../assets/images/sample-product.svg'

import { CONSOLE_CLOUD } from '../../../config/config'

export default ({ categories, getCategories }) => {
  const { TRL_Pack } = useContext(LangContext)
  const { fetchMssqlApi } = useFetch()
  const { Searchbar, compareText } = useContext(SearchbarContext)

  const [, setState] = useState()
  const handleUpdate = () => setState({})

  const filteredCategories = categories.filter(category => compareText(category.Name))

  const copyCategory = id => () => {
    fetchMssqlApi(`catalog-category/copy/${id}`, { method: 'POST' }, getCategories)
  }

  const subscribeCategory = id => () => {
    fetchMssqlApi(`catalog-category/subscribe/${id}`, { method: 'POST' }, getCategories)
  }

  const unsubscribeCategory = id => () => {
    if (window.confirm('Potwierdź odsubskrybowanie kategorii'))
      fetchMssqlApi(
        `/catalog-category/unsubscribe/${id}`,
        { method: 'DELETE' },
        getCategories
      )
  }

  return (
    <>
      {categories.length ? (
        <>
          <Searchbar callback={handleUpdate} />
          {filteredCategories.length ? (
            <div className="overflow-auto">
              <table className="table table-striped border">
                <thead>
                  <tr>
                    <th className="text-center" style={{ width: 75 }}>
                      #
                    </th>
                    <th>{TRL_Pack.categories.properties.categoryName}</th>
                    <th className="text-center" style={{ width: 100 }}>
                      {TRL_Pack.categories.properties.image}
                    </th>
                    <th style={{ width: '1%' }} colSpan={3} />
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category, idx) => (
                    <tr key={idx}>
                      <td className="font-weight-bold text-center">{idx + 1}</td>
                      <td>{category.Name}</td>
                      <td className="text-center">
                        <img
                          src={`${CONSOLE_CLOUD}/categories/${category.Image}`}
                          onError={evt => (evt.target.src = sampleProduct)}
                          alt={category.Name}
                          width="64"
                          height="64"
                        />
                      </td>
                      <td>
                        <Link
                          to={`/catalog-products/${category.CategoryId}`}
                          className="btn btn-link"
                        >
                          <i className="fas fa-cookie text-warning" />
                        </Link>
                      </td>
                      {category.IsSubscribed ? (
                        <td colSpan={2} className="text-center">
                          <button
                            onClick={unsubscribeCategory(category.CategoryId)}
                            className="btn btn-link"
                          >
                            <i className="fa fa-times text-muted" />
                          </button>
                        </td>
                      ) : (
                          <>
                            <td>
                              <button
                                className="btn btn-link"
                                onClick={copyCategory(category.CategoryId)}
                              >
                                <i className="fas fa-copy text-info" />
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn btn-link"
                                onClick={subscribeCategory(category.CategoryId)}
                              >
                                <i className="fas fa-save text-success" />
                              </button>
                            </td>
                          </>
                        )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
              <NoResults />
            )}
        </>
      ) : (
          <NoResults />
        )}
    </>
  )
}
