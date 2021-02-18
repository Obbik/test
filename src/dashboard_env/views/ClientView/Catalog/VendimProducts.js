import React, { useState, useContext } from 'react'
import ReactTooltip from 'react-tooltip'
import { LangContext } from '../../../context/lang-context'
import { SearchbarContext } from '../../../context/searchbar-context'
import useFetch from '../../../hooks/fetchMSSQL-hook'

import NoResults from '../../../components/NoResults/NoResults'
import sampleProduct from '../../../assets/images/sample-product.svg'

import { CONSOLE_CLOUD } from '../../../config/config'

export default ({ products, categories, getProducts }) => {
  const { TRL_Pack } = useContext(LangContext)
  const { fetchMssqlApi } = useFetch()
  const {
    Searchbar,
    compareText,
    Pagination,
    currentPage,
    defaultItemsPerPage
  } = useContext(SearchbarContext)

  const [, setState] = useState()
  const handleUpdate = () => setState({})

  // const [products, setProducts] = useState([])
  const filteredProducts = products.filter(product =>
    compareText(product.Name, product.EAN)
  )

  const subscribeProduct = ean => async () => {
    fetchMssqlApi(
      `shared-product`,
      { method: 'POST', data: { 'Ean': ean } },
      getProducts,
    )
  }
  const saveProduct = (ean, name, desc, image) => async () => {
    fetchMssqlApi(
      `product`,
      { method: 'POST', data: { 'Ean': ean, "Name": name, "Description": desc, "Image": image } },
      getProducts,
    )
  }
  const unsubscribeProduct = ean => () => {
    if (window.confirm('Potwierdź odsubskrybowanie produktu'))
      fetchMssqlApi(
        `/shared-product/${ean}`,
        { method: 'DELETE' },
        getProducts
      )
  }

  return (
    <>
      {products.length ? (
        <>
          <Searchbar callback={handleUpdate} />
          <Pagination
            totalItems={filteredProducts.length}
            itemsPerPage={defaultItemsPerPage}
            callback={handleUpdate}
          />
          {filteredProducts.length ? (
            <div className="overflow-auto">
              <table className="table table-striped border">
                <thead>
                  <tr>
                    <th className="text-center" style={{ width: 125 }}>
                      {TRL_Pack.products.properties.ean}
                    </th>
                    <th>{TRL_Pack.products.properties.productName}</th>
                    <th className="text-center" style={{ width: 100 }}>
                      {TRL_Pack.products.properties.image}
                    </th>
                    <th style={{ width: '1%' }} colSpan={3} />
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts
                    .slice(
                      (currentPage - 1) * defaultItemsPerPage,
                      currentPage * defaultItemsPerPage
                    )
                    .map((product, idx) => (
                      <tr key={idx}>
                        <td className="font-weight-bold text-center">{product.EAN}</td>
                        <td>
                          <span title={product.Desctiption || '* Brak opisu *'}>
                            {product.Name}
                          </span>
                        </td>
                        <td className="text-center">
                          <img
                            src={`${CONSOLE_CLOUD}/products/${product.EAN}.png`}
                            onError={evt => (evt.target.src = sampleProduct)}
                            alt={product.Name}
                            width="64"
                            height="64"
                          />
                        </td>
                        <td>
                        </td>
                        {product.IsSubscribed ? (
                          <td colSpan={2} className="text-center">
                            <button
                              onClick={unsubscribeProduct(product.EAN)}
                              className="btn btn-link link-icon"
                            >
                              <i className="fa fa-times text-muted" />
                            </button>
                          </td>
                        ) : (
                            <>
                              {product.IsInProducts ? (
                                <>
                                  <td>
                                    <button
                                      className="btn btn-link"
                                      onClick={subscribeProduct(product.EAN)}
                                      disabled
                                    >
                                      <i className="fas fa-copy" style={{ color: "grey" }} />
                                    </button>
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
                                      <button
                                        className="btn btn-link"
                                        onClick={subscribeProduct(product.EAN)}
                                      >
                                        <i className="fas fa-copy text-info" />
                                      </button>
                                    </td>
                                    <td>
                                      <button
                                        className="btn btn-link"
                                        onClick={saveProduct(
                                          product.EAN,
                                          product.Name,
                                          product.Description,
                                          product.Image)}
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
        )}
      <ReactTooltip multiline border />
    </>
  )
}
