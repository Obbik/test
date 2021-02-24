import React, { useState, useRef, useEffect, useContext } from 'react'
import { LangContext } from '../../context/lang-context'

import sampleProduct from '../../assets/images/sample-product.svg'

import useFetch from '../../hooks/fetchMSSQL-hook'

import { API_URL } from '../../config/config'
import FormSkel from './FormSkel'

export default ({ form, productData, getProducts, categories, handleClose }) => {
  const { fetchMssqlApi } = useFetch()
  const {
    TRL_Pack: { products }
  } = useContext(LangContext)
  const initialValue = (productData) => {
    if (productData) { return `${API_URL}/${productData.Image}` }
    else {
      return null
    }
  }
  let IsShared
  const isShared = () => {
    if (productData) {
      IsShared = productData.IsShared
    }
    if (IsShared) {
      return "disabled"
    }
    else {
      return null
    }
  }


  const [image, setImage] = useState(initialValue(productData))
  const [categoriesSection, setCategoriesSection] = useState(false)
  const toggleCategoriesSection = () => setCategoriesSection(prev => !prev)
  const initialProductCategoriesDetailed = useRef([])
  const [productCategories, setProductCategories] = useState({
    initial: [],
    added: [],
    deleted: [],
    data: []
  })

  const getProductCategories = () => {
    fetchMssqlApi(`categories/${productData.EAN}`, {}, productCategories => {
      setProductCategories(prev => ({
        ...prev,
        data: productCategories,
        initial: productCategories.map(category => category.CategoryProductId)
      }))
    })
  }
  // const getSharedProductCategories = () => {
  //   fetchMssqlApi(`shared-category-products/${productData.EAN}`, {}, productSharedCategories => {
  //     initialProductCategoriesDetailed.current = productCategories
  //     setProductCategories(prev => ({
  //       ...prev,
  //       initial: [...prev.initial, ...productSharedCategories.map(category => category.CategoryId)],
  //       shared: productSharedCategories.map(category => category.CategoryId)
  //     }))
  //   })
  // }
  const toggleProductCategory = (id, categoryId) => () => {
    setProductCategories(prev => {
      if (prev.deleted.includes(id))
        return { ...prev, deleted: prev.deleted.filter(cId => cId !== id) }
      else if (prev.added.includes(id))
        return { ...prev, added: prev.added.filter(cId => cId !== id) }
      else if (categoryId != null)
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
    else if (productData) {
      formData.append('Image', productData.Image)
    }
    let path, method
    if (!productData) {
      path = 'product'
      method = 'POST'
    } else {
      path = `product/${productData.EAN}`
      method = 'PUT'
    }

    fetchMssqlApi(path, { method, data: formData }, () => {
      if (ean.value !== '0') {
        productCategories.added.forEach(categoryId => {
          fetchMssqlApi('category-product', {
            method: 'POST',
            data: { CategoryId: categoryId, Ean: ean.value },
          })
        })

        productCategories.deleted.forEach(categoryId => {
          const { CategoryProductId } = (productCategories.data.find(pc => { if (pc.CategoryId === categoryId) return pc.CategoryProductId }))
          fetchMssqlApi(
            `category-product/${CategoryProductId}`,
            {
              method: 'DELETE'
            }
          )
        })

        handleClose()
        getProducts()
      }
    }
    )
  }




  const selectCategories = (category) => {
    if ((category.CategoryProductId == null) && productCategories.added.includes(category.categoryId)) return "list-group-item-success"
    else if ((category.CategoryProductId != null) && (!productCategories.deleted.includes(category.CategoryId))) return "list-group-item-success"
    else if (productCategories.added.includes(category.CategoryId)) return "list-group-item-success"
    else return ""
  }

  useEffect(() => {
    if (productData) { getProductCategories() }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (

    < FormSkel
      noFooter={isShared()}
      headerText={productData ? (productData.IsShared === 1 ? products.editProductDisabledHeader : products.editProductHeader) : products.newProductHeader}
      handleClose={handleClose}
    >
      <div className="text-center">
        {(productData || image) && (
          <img alt="#"
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
            disabled={form === "new" ? "" : 1}
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
                disabled={isShared()}
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
            disabled={isShared()}
          />
        </div>
        <div className="form-group">
          <label className="h6">{products.props.description}</label>
          <textarea
            name="description"
            className="form-control"
            rows="4"
            defaultValue={productData && productData.Description}
            disabled={isShared()}

          />
        </div>
        <button
          type="button"
          className="btn btn-light btn-block border"
          onClick={toggleCategoriesSection}

        >
          <i
            className={`fas ${categoriesSection ? 'fa-chevron-up' : 'fa-chevron-down'
              } text-muted`}
          />
        </button>
        {categoriesSection && (
          <div className="row mt-3 no-gutters categories-section">
            {productCategories.data.map((category, idx) => (

              <div
                key={idx}
                className={`col-6 pl-3 font-weight-bolder list-group-item selectCategories ${selectCategories(category)}`}
                onClick={toggleProductCategory(category.CategoryId, category.CategoryProductId)}
              >
                {category.Name}
              </div>
            ))}
          </div>
        )}
      </form>
    </FormSkel >
  )
}
