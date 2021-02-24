import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { LangContext } from '../../../context/lang-context'
import { SearchbarContext } from '../../../context/searchbar-context'
import useFetch from '../../../hooks/fetchMSSQL-hook'

import NoResults from '../../../components/NoResults/NoResults'
import sampleProduct from '../../../assets/images/sample-product.svg'

import { API_URL, CONSOLE_CLOUD } from '../../../config/config'

export default ({ categories, getCategories }) => {
  const { TRL_Pack } = useContext(LangContext)
  const { fetchMssqlApi } = useFetch()
  const { Searchbar, compareText } = useContext(SearchbarContext)

  const [, setState] = useState()
  const handleUpdate = () => setState({})

  const filteredCategories = categories.filter(category => compareText(category.Name))

  const saveProduct = (name, image) => async () => {
    fetchMssqlApi(
      `category`,
      { method: 'POST', data: { 'Name': name, 'Image': image } },
      getCategories,
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
                          src={`${API_URL}/${category.Image}`}
                          onError={evt => (evt.target.src = sampleProduct)}
                          alt={category.Name}
                          width="64"
                          height="64"
                        />
                      </td>
                      {(
                        <>
                          {category.IsInCategories ? (
                            <>
                              <td>
                                {/* <button

                                    className="btn btn-link"
                                    onClick={subscribeCategory(category.CategoryId)}
                                    disabled
                                  >

                                    <i className="fas fa-copy" style={{ color: "grey" }} />
                                  </button> */}
                              </td>
                              <td>
                                <button
                                  className="btn btn-link"
                                  disabled
                                >
                                  <i className="fas fa-save" style={{ color: "grey" }} />
                                </button>
                              </td>
                            </>
                          ) : (
                              <>
                                <td>

                                </td>
                                <td>
                                  <button
                                    title="Zapisz produkt"
                                    data-toggle="popover"
                                    data-placement="top"
                                    data-trigger="hover"
                                    data-content="Click anywhere in the document to close this popover"
                                    data-container="body"
                                    className="btn btn-link"
                                    onClick={saveProduct(category.Name, category.Image)}

                                  >
                                    <i className="fas fa-save text-success" />
                                  </button>
                                </td>
                              </>
                            )}
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
        )
      }
    </>
  )
}
