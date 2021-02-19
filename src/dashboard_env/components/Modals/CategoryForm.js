import React, { useState, useContext, useEffect } from 'react'
import { LangContext } from '../../context/lang-context'

import sampleProduct from '../../assets/images/sample-product.svg'

import useFetch from '../../hooks/fetchMSSQL-hook'

import { API_URL } from '../../config/config'
import FormSkel from './FormSkel'

export default ({ categoryData, getCategories, handleClose }) => {
  const { fetchMssqlApi } = useFetch()
  const {
    TRL_Pack: { categories }
  } = useContext(LangContext)

  const initialValue = (categoryData) => {
    if (categoryData) { return `${API_URL}/${categoryData.Image}` }
    else {
      return null
    }
  }
  const [image, setImage] = useState(initialValue(categoryData))

  const handleChangeImage = evt => {
    evt.preventDefault()
    if (evt.target.files[0]) {
      const reader = new FileReader()
      reader.readAsDataURL(evt.target.files[0])
      reader.onloadend = () => setImage(reader.result)
    } else setImage(null)
  }

  let IsShared
  const disableShared = () => {
    if (categoryData) {
      IsShared = categoryData.IsShared
    }
    if (IsShared) {
      return "disabled"
    }
    else {
      return null
    }
  }
  const handleSubmit = evt => {
    evt.preventDefault()

    const { name, image } = evt.target.elements
    const formData = new FormData()
    formData.append('Name', name.value)
    if (image.files[0]) {
      formData.append('Image', image.files[0])
    }
    else if (categoryData) {
      formData.append('Image', categoryData.Image)
    }
    let path, method
    if (!categoryData) {
      path = 'category'
      method = 'POST'
    } else {
      path = `category/${categoryData.CategoryId}`
      method = 'PUT'
    }
    fetchMssqlApi(path, { method, data: formData }, () => {
      handleClose()
      getCategories()
    })
  }


  return (
    <FormSkel
      noFooter={disableShared()}
      headerText={
        categoryData ? categories.editCategoryHeader : categories.newCategoryHeader
      }
      handleClose={handleClose}
    >
      {console.log(categoryData)}
      <div className="text-center">
        {(categoryData || image) && (
          <img
            src={image || API_URL + categoryData.Image}
            alt=""
            onError={evt => (evt.target.src = sampleProduct)}
            width="256"
            height="256"
          />
        )}
      </div>
      <form onSubmit={handleSubmit} id="modal-form" autoComplete="off">
        <div className="form-group">
          <label className="h6">{categories.props.image}</label>
          <div className="input-group">
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                name="image"
                onChange={handleChangeImage}
                accept="image/x-png,image/svg+xml"
                id="image-upload"
                disabled={disableShared()}
              />
              <label className="custom-file-label" htmlFor="image-upload">
                Choose file
              </label>
            </div>
          </div>
        </div>
        <div>
          <label className="h6">{categories.props.categoryName}</label>
          <input
            name="name"
            className="form-control"
            defaultValue={categoryData && categoryData.Name}
            disabled={disableShared()}
            required
          />
        </div>
      </form>
    </FormSkel>
  )
}
