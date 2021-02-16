import React, { useState, useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import FormSkel from './FormSkel'

import sampleProduct from '../../assets/images/sample-product.svg'

import { CONSOLE_CLOUD } from '../../config/config'

export default ({ productData, categories, handleSubmit, handleClose }) => {
  const { TRL_Pack } = useContext(LangContext)

  const [image, setImage] = useState(null)
  const [categoriesSection, setCategoriesSection] = useState(false)
  const toggleCategoriesSection = () => setCategoriesSection(prev => !prev)

  const [productCategories, setProductCategories] = useState({
    initial: productData?.ProductCategories
      ? productData.ProductCategories.split(' , ')
      : [],
    added: [],
    deleted: []
  })

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

    if (!evt.target.files[0]) return

    const reader = new FileReader()
    reader.readAsDataURL(evt.target.files[0])
    reader.onloadend = () => setImage(reader.result)
  }

  return (
    <FormSkel
      headerText={
        productData ? TRL_Pack.products.editItemHeader : TRL_Pack.products.newItemHeader
      }
      handleClose={handleClose}
    >
      {(productData || image) && (
        <div className="text-center mb-2">
          <img
            src={image || `${CONSOLE_CLOUD}/products/${productData.EAN}.png`}
            onError={evt => (evt.target.src = sampleProduct)}
            alt={productData ? productData.Name : TRL_Pack.products.properties.image}
            height="256"
          />
        </div>
      )}
      <form onSubmit={handleSubmit(productCategories)} id="modal-form" autoComplete="off">
        <div className="form-group">
          <label className="h6">{TRL_Pack.products.properties.ean}</label>
          <input
            name="ean"
            className="form-control"
            defaultValue={productData && productData.EAN}
            required
            pattern="/d*"
          />
        </div>
        <div className="form-group">
          <label className="h6">{TRL_Pack.products.properties.image}</label>
          <div className="input-group">
            <div className="custom-file">
              <input
                type="file"
                accept="image/*"
                className="custom-file-input"
                name="image"
                onChange={handleChangeImage}
                id="image-upload"
                required={!productData}
              />
              <label className="custom-file-label" htmlFor="image-upload">
                {TRL_Pack.fileUploadPlaceholder}
              </label>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="h6">{TRL_Pack.products.properties.productName}</label>
          <input
            name="name"
            className="form-control"
            defaultValue={productData && productData.Name}
            required
          />
        </div>
        <div className="form-group">
          <label className="h6">{TRL_Pack.products.properties.description}</label>
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
            className={`fas ${categoriesSection ? 'fa-chevron-up' : 'fa-chevron-down'
              } text-muted`}
          />
        </button>
        {categoriesSection && (
          <div className="row mt-3 no-gutters categories-section">
            {categories.map((category, idx) => (
              <div
                key={idx}
                className={`col-6 pl-3 font-weight-bolder list-group-item ${productCategories.added.includes(category.CategoryId) ||
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
