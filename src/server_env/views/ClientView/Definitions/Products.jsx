import React, { useState, useEffect, useContext } from 'react'
import { LangContext } from '../../../context/lang-context'
import { NavigationContext } from '../../../context/navigation-context'
import { useHistory, useParams } from 'react-router'
import useFetch from '../../../hooks/fetch-hook'

import ProductForm from '../../../components/Modals/ProductForm'
import NoResults from '../../../components/NoResults/NoResults'

import sampleProduct from '../../../assets/images/sample-product.svg'
import { LOCAL_CLOUD, CONSOLE_CLOUD } from '../../../config/config'
import filterItems from '../../../util/filterItems'

export default ({
  formControllers: { form, openForm, closeForm },
  setItemsCount,
  searchedText,
  page
}) => {
  const { TRL_Pack } = useContext(LangContext)
  const { fetchMssqlApi } = useFetch()
  const { setHeaderData } = useContext(NavigationContext)
  const { categoryId } = useParams()
  const history = useHistory()

  const [products, setProducts] = useState([])
  const filteredProducts = products.filter(({ Name, EAN }) =>
    filterItems(searchedText, Name, EAN)
  )

  const [categories, setCategories] = useState([])
  const getCategories = () => {
    fetchMssqlApi('categories', {}, categories => {
      setCategories(categories)
      if (categoryId) {
        const currentCategory = categories.find(c => c.CategoryId === categoryId)
        if (currentCategory)
          setHeaderData({
            text: 'Produkty',
            subtext: currentCategory.Name
          })
        else history.replace('/products')
      }
    })
  }

  useEffect(() => {
    setItemsCount(prev => ({ ...prev, filtered: filteredProducts.length }))
  }, [searchedText])

  const getProducts = () => {
    fetchMssqlApi('products', {}, products => {
      setItemsCount({ total: products.length, filtered: products.length })
      setProducts(products)
    })
  }

  const deleteProduct = id => () => {
    if (window.confirm(TRL_Pack.products.confirmDeletionText))
      fetchMssqlApi(`product/${id}`, { method: 'DELETE' }, getProducts)
  }

  const unsubscribeProduct = ean => () => {
    if (window.confirm('Potwierdź odsubskrybowanie produktu'))
      fetchMssqlApi(
        `/catalog-product/unsubscribe/${ean}`,
        { method: 'DELETE' },
        getProducts
      )
  }

  const submitProduct = productCategories => evt => {
    evt.preventDefault()

    const { ean, name, description, image } = evt.target.elements

    const formData = new FormData()
    formData.append('Ean', ean.value)
    formData.append('Name', name.value)
    formData.append('Description', description.value)
    formData.append('Image', image.files[0])

    let path, method
    if (form !== 'new') {
      path = `product/${form}`
      method = 'PUT'
    } else {
      path = 'product'
      method = 'POST'
    }

    fetchMssqlApi(path, { method, data: formData }, () => {
      if (ean.value !== '0') {
        productCategories.added.forEach(categoryId =>
          fetchMssqlApi(`product-category/${ean.value}`, {
            method: 'POST',
            data: { categoryId }
          })
        )

        productCategories.deleted.forEach(categoryId =>
          fetchMssqlApi(`product-category/${ean.value}`, {
            method: 'DELETE',
            data: { categoryId }
          })
        )
      }

      closeForm()
      getProducts()
    })
  }

  useEffect(() => {
    setHeaderData({ text: TRL_Pack.products.header })

    getCategories()
    getProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId])

  return (
    <>
      {filteredProducts.length ? (
        <>
          <div className="overflow-auto">
            <button
              className="d-block ml-auto btn btn-link text-decoration-none m-2"
              onClick={openForm()}
            >
              <i className="fas fa-plus mr-2" /> {TRL_Pack.products.addProductButton}
            </button>
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
                  <th style={{ width: '1%' }} />
                </tr>
              </thead>
              <tbody>
                {filteredProducts
                  .slice((page - 1) * 25, page * 25)
                  .map((product, idx) => (
                    <tr key={idx}>
                      <td className="font-weight-bold text-center">
                        {product.EAN !== '0' ? (
                          product.EAN
                        ) : (
                          <i className="fas fa-ban text-muted" />
                        )}
                      </td>
                      <td className="small">
                        {product.ProductId ? (
                          <button
                            style={{ wordBreak: 'break-word' }}
                            className="btn btn-link font-size-inherit text-reset text-decoration-none p-1"
                            onClick={openForm(product.ProductId)}
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
                            src={`${
                              product.ProductId ? LOCAL_CLOUD : CONSOLE_CLOUD
                            }/products/${product.EAN}.png`}
                            onError={evt => (evt.target.src = sampleProduct)}
                            alt={product.Name}
                            width="48"
                            height="48"
                          />
                        ) : (
                          <i className="fas fa-ban text-muted" />
                        )}
                      </td>
                      {product.ProductId ? (
                        <td>
                          <button
                            onClick={deleteProduct(product.ProductId)}
                            className="btn btn-link"
                          >
                            <i className="fa fa-trash text-danger" />
                          </button>
                        </td>
                      ) : (
                        <td className="text-center">
                          <button
                            onClick={unsubscribeProduct(product.EAN)}
                            className="btn btn-link"
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
        </>
      ) : (
        <NoResults onClick={openForm()} buttonText={TRL_Pack.products.addProductButton} />
      )}
      {form && (
        <ProductForm
          productData={
            form !== 'new' ? filteredProducts.find(p => p.ProductId === form) : null
          }
          categories={categories.filter(c => c.CategoryId)}
          handleSubmit={submitProduct}
          handleClose={closeForm}
        />
      )}
    </>
  )
}
