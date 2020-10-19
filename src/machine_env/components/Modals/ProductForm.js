import React, { useState, useRef, useEffect, useContext } from 'react'
import { LangContext } from '../../context/lang-context'

import sampleProduct from '../../assets/images/sample-product.svg'

import useFetch from '../../hooks/fetch-hook'

import { API_URL } from '../../config/config'
import FormSkel from './FormSkel'

export default ({ productData, getProducts, categories, closeModal }) => {
  const { fetchApi } = useFetch()

  const {
    languagePack: { products }
  } = useContext(LangContext)

  const [image, setImage] = useState(null)
  const [categoriesSection, setCategoriesSection] = useState(false)
  const toggleCategoriesSection = () => setCategoriesSection(prev => !prev)
  const initialProductCategoriesDetailed = useRef([])
  const [productCategories, setProductCategories] = useState({
    initial: [],
    added: [],
    deleted: []
  })

  const getProductCategories = () => {
    fetchApi(`category-product/${productData.EAN}`, {}, productCategories => {
      initialProductCategoriesDetailed.current = productCategories
      setProductCategories(prev => ({
        ...prev,
        initial: productCategories.map(category => category.CategoryId)
      }))
    })
  }

  const toggleProductCategory = id => () => {
    setProductCategories(prev => {
      if (prev.deleted.includes(id))
        return { ...prev, deleted: prev.deleted.filter(cId => cId !== id) }
      else if (prev.added.includes(id))
        return { ...prev, added: prev.added.filter(cId => cId !== id) }
      else if (prev.initial.includes(id))
        return { ...prev, deleted: prev.deleted.concat(id) }
      else return { ...prev, added: prev.added.concat(id) }
    })
  }

  const handleChangeImage = evt => {
    evt.preventDefault()

    if (evt.target.files[0]) {
      const reader = new FileReader()
      reader.readAsDataURL(evt.target.files[0])
      reader.onloadend = () => setImage(reader.result)
    } else setImage(null)
  }

  const handleSubmit = evt => {
    evt.preventDefault()

    const { ean, name, image, description } = evt.target.elements

    const formData = new FormData()
    formData.append('Ean', ean.value)
    formData.append('Name', name.value)
    formData.append('Description', description.value)

    if (image.files[0]) formData.append('Image', image.files[0])

    let path, method
    if (!productData) {
      path = 'product'
      method = 'POST'
    } else {
      path = `product/${productData.EAN}`
      method = 'PUT'
    }

    fetchApi(path, { method, data: formData }, () => {
      if (ean.value !== '0') {
        productCategories.added.forEach(categoryId =>
          fetchApi('category-product', {
            method: 'POST',
            data: { CategoryId: categoryId, Ean: ean.value }
          })
        )

        productCategories.deleted.forEach(categoryId =>
          fetchApi(
            `category-product/${
              initialProductCategoriesDetailed.current.find(
                pc => (pc.CategoryId = categoryId)
              ).CategoryProductId
            }`,
            {
              method: 'DELETE'
            }
          )
        )

        closeModal()
        getProducts()
      }
    })
  }

  useEffect(() => {
    if (productData) getProductCategories()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <FormSkel
      headerText={productData ? products.editProductHeader : products.newProductHeader}
      handleClose={closeModal}
    >
      <div className="text-center">
        {(productData || image) && (
          <img
            src={image || API_URL + productData.Image}
            onError={evt => (evt.target.src = sampleProduct)}
            width="256"
            height="256"
          />
        )}
      </div>
      <form onSubmit={handleSubmit} id="modal-form" autoComplete="off">
        <div className="form-group">
          <label className="h6">{products.props.ean}</label>
          <input
            type="number"
            name="ean"
            className="form-control"
            defaultValue={productData && productData.EAN}
            required
          />
        </div>
        <div className="form-group">
          <label className="h6">{products.props.image}</label>
          <div className="input-group">
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                name="image"
                onChange={handleChangeImage}
                id="image-upload"
                accept="image/x-png"
              />
              <label className="custom-file-label" htmlFor="image-upload">
                Choose file
              </label>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="h6">{products.props.productName}</label>
          <input
            name="name"
            className="form-control"
            defaultValue={productData && productData.Name}
            required
          />
        </div>
        <div className="form-group">
          <label className="h6">{products.props.description}</label>
          <textarea
            name="description"
            className="form-control"
            rows="4"
            defaultValue={productData && productData.Description}
          />
        </div>
        <button
          type="button"
          className="btn btn-light btn-block border"
          onClick={toggleCategoriesSection}
        >
          <i
            className={`fas ${
              categoriesSection ? 'fa-chevron-up' : 'fa-chevron-down'
            } text-muted`}
          />
        </button>
        {categoriesSection && (
          <div className="row mt-3 no-gutters categories-section">
            {categories.map((category, idx) => (
              <div
                key={idx}
                className={`col-6 pl-3 font-weight-bolder list-group-item ${
                  productCategories.added.includes(category.CategoryId) ||
                  (productCategories.initial.includes(category.CategoryId) &&
                    !productCategories.deleted.includes(category.CategoryId))
                    ? 'list-group-item-success'
                    : ''
                }`}
                onClick={toggleProductCategory(category.CategoryId)}
              >
                {category.Name}
              </div>
            ))}
          </div>
        )}
      </form>
    </FormSkel>
  )
}
