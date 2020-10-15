import React, { useState, useEffect, useRef, useContext } from 'react'
import { LangContext } from '../../context/lang-context'

import useFetch from '../../hooks/fetch-hook'

export default ({ productEAN, closeModal }) => {
  const { fetchApi } = useFetch()

  const {
    languagePack: { buttons, products }
  } = useContext(LangContext)

  const [categories, setCategories] = useState([])
  const [productCategories, setProductCategories] = useState([])
  const initialProductCategories = useRef([])

  const getCategories = () => {
    fetchApi('categories', {}, categories => setCategories(categories))
  }

  const getProductCategories = () => {
    fetchApi(`category-product/${productEAN}`, {}, productCategories => {
      initialProductCategories.current = productCategories
      setProductCategories(productCategories.map(pc => pc.CategoryId))
    })
  }

  const handleChange = id => () => {
    if (productCategories.includes(id))
      setProductCategories(prev => prev.filter(cId => cId !== id))
    else setProductCategories(prev => prev.concat(id))
  }

  const handleSubmit = evt => {
    evt.preventDefault()

    productCategories.forEach(categoryId => {
      if (
        !initialProductCategories.current.map(iPC => iPC.CategoryId).includes(categoryId)
      )
        fetchApi(`category-product`, {
          method: 'POST',
          data: {
            CategoryId: categoryId,
            Ean: productEAN
          }
        })
    })

    initialProductCategories.current.forEach(iPC => {
      if (!productCategories.includes(iPC.CategoryId)) {
        fetchApi(`category-product/${iPC.CategoryProductId}`, {
          method: 'DELETE'
        })
      }
    })

    closeModal()
  }

  useEffect(() => {
    getCategories()
    getProductCategories()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="modal fade'show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-light align-items-center">
            <h6 className="modal-title">{products.productCategoryHeader}</h6>
            <button
              onClick={closeModal}
              className="btn text-secondary px-2 py-0"
              style={{ cursor: 'pointer' }}
            >
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="modal-body">
            <form className="mb-n3" id="product-categories-form" onSubmit={handleSubmit}>
              {categories.map((category, idx) => (
                <div key={idx} className="form-group form-check">
                  <label className="form-check-label">
                    <input
                      type="checkbox"
                      checked={productCategories.includes(category.CategoryId)}
                      onChange={handleChange(category.CategoryId)}
                      className="form-check-input mr-2"
                    />
                    <h6 className="mb-0">{category.Name}</h6>
                  </label>
                </div>
              ))}
            </form>
            {/* <form className="mb-n3" id="product-categories-form" onSubmit={handleSubmit}>
              {state.categories.map((category, idx) => (
                <div key={idx} className="form-group form-check">
                  <label className="form-check-label">
                    <input
                      type="checkbox"
                      name={'category' + category.CategoryId}
                      checked={state.inputs[`category${category.CategoryId}`].checked}
                      value={category.CategoryId}
                      onChange={handleChange}
                      className="form-check-input mr-2"
                    />
                    {category.Name}
                  </label>
                </div>
              ))}
            </form> */}
          </div>
          <div className="modal-footer bg-light">
            <button
              type="submit"
              className="btn btn-success btn-sm"
              form="product-categories-form"
            >
              {buttons.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
