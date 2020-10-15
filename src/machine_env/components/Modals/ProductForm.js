import React, { useState, useEffect, useContext } from 'react'
import { LangContext } from '../../context/lang-context'

import sampleProduct from '../../assets/images/sample-product.svg'

import useFetch from '../../hooks/fetch-hook'

import { API_URL } from '../../config/config'

export default ({ productEAN, getProducts, closeModal }) => {
  const { fetchApi } = useFetch()

  const {
    languagePack: { buttons, products }
  } = useContext(LangContext)

  const [product, setProduct] = useState({
    ean: '',
    name: '',
    description: '',
    image: ''
  })

  const getProduct = () => {
    fetchApi(`product/${productEAN}`, {}, data => {
      const { EAN, Name, Description, Image } = data

      setProduct({
        ean: EAN,
        name: Name,
        description: Description,
        image: Image,
        initialImage: Image
      })
    })
  }

  const handleChange = evt => {
    evt.preventDefault()

    const { name } = evt.target
    let { value } = evt.target

    if (name === 'image') value = evt.target.files[0]

    setProduct(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = evt => {
    evt.preventDefault()

    const formData = new FormData()
    formData.append('Ean', product.ean)
    formData.append('Name', product.name)
    formData.append('Description', product.description)
    formData.append('Image', product.image)

    let path, method
    if (productEAN === 'add') {
      path = 'product'
      method = 'POST'
    } else {
      path = `product/${productEAN}`
      method = 'PUT'
    }

    fetchApi(path, { method, data: formData }, () => {
      closeModal()
      getProducts()
    })
  }

  useEffect(() => {
    if (productEAN !== 'add') getProduct(productEAN)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-light align-items-center">
            <h6 className="modal-title">
              {productEAN === 'add'
                ? products.newProductHeader
                : products.editProductHeader}
            </h6>
            <button
              onClick={closeModal}
              className="btn text-secondary px-2 py-0"
              style={{ cursor: 'pointer' }}
            >
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="modal-body">
            <div className="text-center">
              {product.initialImage && (
                <img
                  src={API_URL + product.initialImage}
                  onError={e => (e.target.src = sampleProduct)}
                  alt={product.name}
                  width="256"
                  height="256"
                />
              )}
            </div>
            <form onSubmit={handleSubmit} id="product-form">
              <div className="form-group">
                <label>{products.props.ean}</label>

                <input
                  type="number"
                  name="ean"
                  className="form-control"
                  value={product.ean}
                  onChange={handleChange}
                  readOnly={productEAN !== 'add'}
                />
              </div>
              <div className="form-group">
                <label>{products.props.image}</label>
                <div className="input-group">
                  {product.image && product.image !== product.initialImage && (
                    <div className="input-group-prepend">
                      <span className="input-group-text" style={{ maxWidth: 125 }}>
                        {product.image.name}
                      </span>
                    </div>
                  )}
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      name="image"
                      onChange={handleChange}
                      id="image-upload"
                    />
                    <label className="custom-file-label" htmlFor="image-upload">
                      Choose file
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>{products.props.productName}</label>
                <input
                  name="name"
                  className="form-control"
                  value={product.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>{products.props.description}</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  value={product.description}
                  onChange={handleChange}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer bg-light">
            <button type="submit" className="btn btn-success btn-sm" form="product-form">
              {buttons.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
