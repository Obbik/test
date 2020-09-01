import React, { useState, useEffect, useContext } from 'react'
import { LangContext } from '../../context/lang-context'

import sampleProduct from '../../assets/images/sample-product.svg'

import useFetch from '../../hooks/fetch-hook'

import { API_URL } from '../../config/config'

export default ({ categoryId, getCategories, closeModal }) => {
  const { fetchApi } = useFetch()

  const {
    languagePack: { buttons, categories }
  } = useContext(LangContext)

  const [category, setCategory] = useState({
    name: '',
    image: ''
  })

  const getCategory = () => {
    fetchApi(`category/${categoryId}`, {}, data => {
      const { Name, Image } = data

      setCategory({
        name: Name,
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

    setCategory(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = evt => {
    evt.preventDefault()

    const formData = new FormData()
    formData.append('Name', category.name)
    formData.append('Image', category.image)

    let path, method
    if (categoryId === 'add') {
      path = 'category'
      method = 'POST'
    } else {
      path = `category/${categoryId}`
      method = 'PUT'
    }

    fetchApi(path, { method, data: formData }, () => {
      closeModal()
      getCategories()
    })
  }

  useEffect(() => {
    if (categoryId !== 'add') getCategory(categoryId)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-light align-items-center">
            <h6 className="modal-title">
              {categoryId === 'add'
                ? categories.newCategoryHeader
                : categories.editCategoryHeader}
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
              {category.initialImage && (
                <img
                  src={API_URL + category.initialImage}
                  onError={e => {
                    e.target.src = sampleProduct
                  }}
                  alt={category.name}
                  width="256"
                  height="256"
                />
              )}
            </div>
            <form onSubmit={handleSubmit} id="category-form">
              <div className="form-group">
                <label>{categories.props.image}</label>
                <div className="input-group">
                  {category.image && category.image !== category.initialImage && (
                    <div className="input-group-prepend">
                      <span className="input-group-text" style={{ maxWidth: 125 }}>
                        {category.image.name}
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
              <div>
                <label>{categories.props.categoryName}</label>
                <input
                  name="name"
                  className="form-control"
                  value={category.name}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
            </form>
          </div>
          <div className="modal-footer bg-light">
            <button type="submit" className="btn btn-success btn-sm" form="category-form">
              {buttons.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
