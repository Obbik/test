import React, { useState, useContext } from 'react'
import { LangContext } from '../../context/lang-context'

import sampleProduct from '../../assets/images/sample-product.svg'
import FormSkel from './FormSkel'

import { CONSOLE_CLOUD } from '../../config/config'

export default ({ categoryData, handleSubmit, handleClose }) => {
  const { TRL_Pack } = useContext(LangContext)

  const [image, setImage] = useState(null)

  const handleChangeImage = evt => {
    evt.preventDefault()

    if (!evt.target.files[0]) return

    const reader = new FileReader()
    reader.readAsDataURL(evt.target.files[0])
    reader.onloadend = () => setImage(reader.result)
  }

  return (
    <FormSkel
      headerText={
        categoryData
          ? TRL_Pack.categories.editItemHeader
          : TRL_Pack.categories.newItemHeader
      }
      handleClose={handleClose}
    >
      <div className="text-center">
        {(categoryData || image) && (
          <img
            src={image || `${CONSOLE_CLOUD}/categories/${categoryData.Image}`}
            onError={evt => (evt.target.src = sampleProduct)}
            alt={categoryData ? categoryData.Name : TRL_Pack.categories.properties.image}
            width="256"
            height="256"
          />
        )}
      </div>
      <form onSubmit={handleSubmit} id="modal-form" autoComplete="off">
        <div className="form-group">
          <label className="h6">{TRL_Pack.categories.properties.image}</label>
          <div className="input-group">
            <div className="custom-file">
              <input
                type="file"
                accept="image/*"
                className="custom-file-input"
                name="image"
                onChange={handleChangeImage}
                id="image-upload"
              />
              <label className="custom-file-label" htmlFor="image-upload">
                {TRL_Pack.fileUploadPlaceholder}
              </label>
            </div>
          </div>
        </div>
        <div>
          <label className="h6">{TRL_Pack.categories.properties.categoryName}</label>
          <input
            name="name"
            className="form-control"
            defaultValue={categoryData && categoryData.Name}
          />
        </div>
      </form>
    </FormSkel>
  )
}
