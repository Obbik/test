import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'

import { CONSOLE_CLOUD, LOCAL_CLOUD } from '../../config/config'
import NoResults from '../NoResults/NoResults'

import sampleProduct from '../../assets/images/sample-product.svg'

export default ({
  products,
  handleAdd,
  handleEdit,
  handleEditCategories,
  handleDelete,
  handleUnsubscribe
}) => {
  const { TRL_Pack } = useContext(LangContext)

  return products.length ? (
    <div className="overflow-auto">
      <button
        className="d-block ml-auto btn btn-link text-decoration-none m-2"
        onClick={handleAdd}
      >
        <i className="fas fa-plus mr-2" /> {TRL_Pack.products.addProductButton}
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="text-center" style={{ width: '1%' }}>
              {TRL_Pack.products.properties.ean}
            </th>
            <th>{TRL_Pack.products.properties.productName}</th>
            <th className="text-center">{TRL_Pack.products.properties.image}</th>
            <th style={{ width: '1%' }} colSpan={2} />
          </tr>
        </thead>
        <tbody>
          {products.map((product, idx) => (
            <tr key={idx}>
              <td className="small font-weight-bold text-center">
                {product.EAN !== '0' ? product.EAN : <i className="fas fa-ban" />}
              </td>
              <td className="small">
                {product.ProductId ? (
                  <button
                    style={{ wordBreak: 'break-word' }}
                    className="btn btn-link font-size-inherit text-reset text-decoration-none p-1"
                    onClick={handleEdit(
                      localStorage.getItem('clientId') === 'console'
                        ? product.EAN
                        : product.ProductId
                    )}
                    title={product.Description || 'brak opisu'}
                  >
                    {product.Name}
                  </button>
                ) : (
                  <span
                    style={{ wordBreak: 'break-word' }}
                    className="p-1"
                    title={product.Description || 'brak opisu'}
                  >
                    {product.Name}
                  </span>
                )}
              </td>
              <td className="text-center">
                {product.EAN !== '0' ? (
                  <img
                    src={`${product.ProductId ? LOCAL_CLOUD : CONSOLE_CLOUD}/products/${
                      product.EAN
                    }.png`}
                    onError={evt => (evt.target.src = sampleProduct)}
                    alt={product.Name}
                    width="48"
                    height="48"
                  />
                ) : (
                  <i className="fas fa-ban" />
                )}
              </td>
              {product.ProductId ? (
                <>
                  <td>
                    <button
                      className="btn btn-link link-icon"
                      onClick={handleEditCategories({
                        productId: product.ProductId,
                        productCategories: product.ProductCategories
                      })}
                    >
                      <i className="fas fa-th-large text-info" />
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={handleDelete(product.ProductId)}
                      className="btn btn-link link-icon"
                    >
                      <i className="fa fa-trash text-danger" />
                    </button>
                  </td>
                </>
              ) : (
                <td colSpan={2} className="text-center">
                  <button
                    onClick={handleUnsubscribe(product.EAN)}
                    className="btn btn-link link-icon"
                  >
                    <i className="fa fa-times text-muted" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <NoResults onClick={handleAdd} buttonText={TRL_Pack.products.addProductButton} />
  )
}
