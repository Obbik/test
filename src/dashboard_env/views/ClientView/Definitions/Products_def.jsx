import React, { useState, useRef, useEffect, useContext } from 'react'
import { LangContext } from '../../../context/lang-context'
import { NavigationContext } from '../../../context/navigation-context'
import useFetch from '../../../hooks/fetchSQL-hook'
import { useParams } from 'react-router-dom'

import ProductForm from '../../../components/Modals/ProductForm'
import ProductsTable from '../../../components/Definitions/ProductsTable'
import NoResults from '../../../components/NoResults/NoResults'
import FormSkel from '../../../components/Modals/FormSkel'

export default ({
  formControllers: { formModal, openNewForm, openEditForm, closeForm },
  setItems,
  filteredItems
}) => {
  const { TRL_Pack } = useContext(LangContext)
  const { fetchMssqlApi } = useFetch()
  const { setHeaderData } = useContext(NavigationContext)
  const { categoryId } = useParams()

  const initialProductCategories = useRef([])
  const [productCategoriesData, setProductCategoriesData] = useState([])

  const [productCategoriesForm, setProductCategoriesForm] = useState(false)
  const openEditProductCategoriesForm = ({ productId, productCategories }) => () => {
    initialProductCategories.current = {
      productId,
      data: productCategories ? productCategories.split(' , ') : []
    }
    setProductCategoriesData(productCategories ? productCategories.split(' , ') : [])
    setProductCategoriesForm(true)
  }
  const closeProductCategoriesForm = () => {
    setProductCategoriesData(null)
    setProductCategoriesForm(null)
  }

  const [categories, setCategories] = useState([])
  const getCategories = () => {
    fetchMssqlApi('categories', {}, categories => setCategories(categories))
  }

  const getProducts = () => {
    fetchMssqlApi('products', {}, products => setItems(products))
  }

  const deleteProduct = id => () => {
    const confirm = window.confirm(TRL_Pack.products.confirmDeletionText)

    if (confirm) fetchMssqlApi(`product/${id}`, { method: 'DELETE' }, getProducts)
  }

  const unsubscribeProduct = ean => () => {
    if (window.confirm('Potwierdź odsubskrybowanie produktu'))
      fetchMssqlApi(
        `/catalog-product/unsubscribe/${ean}`,
        { method: 'DELETE' },
        getProducts
      )
  }

  const submitProduct = evt => {
    evt.preventDefault()

    const { ean, name, description, image } = evt.target.elements

    const formData = new FormData()
    formData.append('Ean', ean.value)
    formData.append('Name', name.value)
    formData.append('Description', description.value)
    formData.append('Image', image.files[0])

    let path, method
    if (filteredItems.find(p => p.ProductId === formModal)) {
      path = `product/${formModal}`
      method = 'PUT'
    } else {
      path = 'product'
      method = 'POST'
    }

    fetchMssqlApi(path, { method, data: formData }, () => {
      closeForm()
      getProducts()
    })
  }

  const handleChange = id => () => {
    if (productCategoriesData.includes(id))
      setProductCategoriesData(prev => prev.filter(cId => cId !== id))
    else setProductCategoriesData(prev => prev.concat(id))
  }

  const handleSubmit = evt => {
    evt.preventDefault()

    productCategoriesData.forEach(categoryId => {
      if (!initialProductCategories.current.data.includes(categoryId))
        fetchMssqlApi(`product-category/${initialProductCategories.current.productId}`, {
          method: 'POST',
          data: { categoryId }
        })
    })

    initialProductCategories.current.data.forEach(categoryId => {
      if (!productCategoriesData.includes(categoryId))
        fetchMssqlApi(`product-category/${initialProductCategories.current.productId}`, {
          method: 'DELETE',
          data: { categoryId }
        })
    })

    closeProductCategoriesForm()
    getProducts()
  }

  useEffect(() => {
    setHeaderData({ text: TRL_Pack.products.header })

    getCategories()
    getProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId])

  return (
    <>
      {filteredItems.length ? (
        <>
          <ProductsTable
            products={filteredItems}
            handleAdd={openNewForm}
            handleEdit={openEditForm}
            handleEditCategories={openEditProductCategoriesForm}
            handleDelete={deleteProduct}
            handleUnsubscribe={unsubscribeProduct}
          />
          {productCategoriesForm && (
            <FormSkel
              headerText={TRL_Pack.products.productCategoriesHeader}
              handleClose={closeProductCategoriesForm}
            >
              <form className="mb-n3" id="modal-form" onSubmit={handleSubmit}>
                {categories.map((category, idx) => (
                  <div key={idx} className="form-group form-check">
                    <label className="form-check-label">
                      <input
                        type="checkbox"
                        checked={productCategoriesData.includes(category.CategoryId)}
                        onChange={handleChange(category.CategoryId)}
                        className="form-check-input mr-2"
                      />
                      <h6 className="mb-0">{category.Name}</h6>
                    </label>
                  </div>
                ))}
              </form>
            </FormSkel>
          )}
        </>
      ) : (
        <NoResults
          onClick={openNewForm}
          buttonText={TRL_Pack.products.addProductButton}
        />
      )}
      {formModal && (
        <ProductForm
          productData={filteredItems.find(p => p.ProductId === formModal)}
          handleSubmit={submitProduct}
          handleClose={closeForm}
        />
      )}
    </>
  )
}
