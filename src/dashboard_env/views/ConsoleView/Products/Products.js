import React, { useState, useEffect, useContext } from 'react'
import { NavigationContext } from '../../../context/navigation-context'
import { LangContext } from '../../../context/lang-context'
import { useHistory, useParams } from 'react-router'
import useFetch from '../../../hooks/fetchMSSQL-hook'
import useForm from '../../../hooks/form-hook'
import useFilter from '../../../hooks/filter-hook'

import SearchInput from '../../../components/SearchInput/SearchInput'
import NoResults from '../../../components/NoResults/NoResults'
import Pagination from '../../../components/Pagination/Pagination'

import sampleProduct from '../../../assets/images/sample-product.svg'

import { CONSOLE_CLOUD } from '../../../config/config'
import filterItems from '../../../util/filterItems'
import ProductForm from '../../../components/Modals/ProductForm'

export default () => {
  const { fetchMssqlApi } = useFetch()
  const { setHeaderData } = useContext(NavigationContext)
  const { TRL_Pack } = useContext(LangContext)
  const { searchedText, updateSearchedText, page, updateCurrentPage } = useFilter()
  const { categoryId } = useParams()
  const history = useHistory()

  const { form, openForm, closeForm } = useForm()

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])

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


  const getProducts = () => {
    if (categoryId) {
      fetchMssqlApi(`products/${categoryId}`, {}, (products) => setProducts(products))
    }
    else fetchMssqlApi('products', {}, (products) => setProducts(products))
  }
  const submitProduct = productCategories => evt => {
    evt.preventDefault()

    const { ean, name, description, image } = evt.target.elements

    const formData = new FormData()
    formData.append('Ean', ean.value)
    formData.append('Name', name.value)
    formData.append('Description', description.value)

    if (image.files[0]) formData.append('Image', image.files[0])

    let path, method
    if (form !== 'new') {
      path = `product/${form}`
      method = 'PUT'
    } else {
      path = ''
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
        console.log(formData)
        productCategories.deleted.forEach(categoryId =>
          console.log(formData),
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
  const deleteProduct = ean => () => {
    if (window.confirm('Potwierdź usunięcie produktu'))
      fetchMssqlApi(`product/${ean}`, { method: 'DELETE' }, getProducts)
  }

  useEffect(() => {
    setHeaderData({ text: 'Produkty' })

    getCategories()
    getProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId])


  const filteredProducts = products.filter(({ Name }) => filterItems(searchedText, Name))

  return (
    <>

      {products.length ? (
        <>
          <SearchInput onSearch={updateSearchedText} />
          <Pagination
            totalItems={filteredProducts.length}
            page={page}
            rowsPerPage={25}
            handleSwitchPage={updateCurrentPage}
          />
          {!filteredProducts.length ? (
            <NoResults buttonText="Dodaj produkt" onClick={() => { }} />
          ) : (
              <>
                <div>
                  <button
                    className="d-block btn btn-link text-decoration-none ml-auto my-2 mr-1"
                    onClick={openForm()}
                  >
                    <i className="fas fa-plus mr-2" /> Dodaj produkt
                </button>
                </div>
                <div className="overflow-auto">
                  <table className="table table-striped border">
                    <thead>
                      <tr>
                        <th>Ean</th>
                        <th>Nazwa</th>
                        <th>Zdjęcie</th>
                        <th style={{ width: '1%' }} />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts
                        .slice((page - 1) * 25, page * 25)
                        .map((product, idx) => (
                          <tr key={idx}>
                            <td className="font-weight-bold">{product.EAN}</td>
                            <td>
                              <button
                                style={{ wordBreak: 'break-word' }}
                                className="btn btn-link font-size-inherit text-reset text-decoration-none p-1"
                                onClick={openForm(product.EAN)}
                                title={product.Description || 'brak opisu'}
                              >
                                {product.Name}
                              </button>
                            </td>
                            <td>
                              {/* {console.log(product.Image)} */}
                              <img
                                src={product.Image}
                                onError={evt => (evt.target.src = sampleProduct)}
                                alt={product.Name}
                                width="48"
                                height="48"
                              />
                            </td>
                            <td>
                              <button
                                className="btn btn-link"
                                onClick={deleteProduct(product.EAN)}
                              >
                                <i className="fas fa-trash text-danger" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
        </>
      ) : (
          <NoResults buttonText="Dodaj produkt" onClick={openForm()} />
        )}
      {form && (
        <ProductForm
          productData={
            form !== 'new' ? filteredProducts.find(product => product.EAN === form) : null
          }
          getProducts={getProducts}
          categories={categories}
          handleSubmit={submitProduct}
          handleClose={closeForm}
        />
      )}
    </>
  )
}
