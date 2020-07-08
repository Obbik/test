import React, { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom';
import axios from 'axios'

// import ProductNav from '../../components/Product/ProductNav';

export default ({
  url,
  token,
  setLoader,
  NotificationError,
  NotificationSuccess,
  ean,
  onHideProductCategoryModal,
  showProductCategoryModal
}) => {
  const [state, setState] = useState({
    categories: [],
    productCategories: [],
    inputs: null,
    initialInputs: null
  })

  const getCategories = () => {
    const id = ean

    if (id) {
      setLoader(true)
      let inputs
      let checked = false

      axios
        .get(`${url}api/categories`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          const categories = res.data
          categories.forEach(category => {
            inputs = {
              ...inputs,
              ['category' + category.CategoryId]: {
                value: category.CategoryId,
                checked: checked
              }
            }
          })

          setState(prev => ({
            ...prev,
            categories,
            inputs,
            initialInputs: { ...inputs }
          }))

          return axios.get(`${url}api/category-product/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        })
        .then(res => {
          const categories = state.categories
          const productCategories = res.data

          categories.forEach(category => {
            const checked = productCategories.some(productCategory => {
              let _checked = false
              if (category.CategoryId === productCategory.CategoryId) {
                _checked = true
              }
              return _checked
            })

            inputs = {
              ...inputs,
              ['category' + category.CategoryId]: {
                value: category.CategoryId,
                checked: checked
              }
            }
          })

          setState(prev => ({
            ...prev,
            inputs,
            initialInputs: { ...inputs },
            productCategories: productCategories
          }))
          setLoader(false)
        })
        .catch(err => {
          setLoader(false)
          NotificationError(err)
        })
    }
  }

  const handleChange = e => {
    const inputName = e.target.name
    const inputValue = e.target.value
    const checked = e.target.checked

    setState(prev => ({
      ...prev,
      inputs: {
        ...prev.inputs,
        [inputName]: {
          value: inputValue,
          checked
        }
      }
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    const productId = ean

    const inputArray = state.categories.map(
      category => state.inputs[`category${category.CategoryId}`]
    )
    const initialInputArray = state.categories.map(
      category => state.initialInputs[`category${category.CategoryId}`]
    )

    initialInputArray.forEach((input, index) => {
      // Check if inputs changed on submit
      if (input.checked !== inputArray[index].checked) {
        const categoryId = inputArray[index].value
        const productCategory = {
          CategoryId: categoryId,
          Ean: productId
        }

        // Add category product
        if (!input.checked) {
          addProductCategory(productCategory)
        }
        // Delete category product
        else {
          const id = getProductCategoryId(productCategory)
          deleteProductCategory(id)
        }
      }
    })

    getCategories()
    onHideProductCategoryModal()
  }

  const addProductCategory = productCategory => {
    axios
      .post(`${url}api/category-product`, productCategory, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        NotificationSuccess(res.data.message)
      })
      .catch(err => {
        NotificationError(err)
      })
  }

  const deleteProductCategory = id => {
    axios
      .delete(`${url}api/category-product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        NotificationSuccess(res.data.message)
      })
      .catch(err => {
        NotificationError(err)
      })
  }

  const getProductCategoryId = productCategory => {
    const category = state.productCategories.filter(
      category =>
        category.CategoryId === productCategory.CategoryId &&
        category.EAN === productCategory.Ean
    )
    return category[0].CategoryProductId
  }

  useEffect(() => {
    getCategories()
  })

  const modalClass = showProductCategoryModal
    ? 'modal fade show d-block'
    : 'modal fade'

  return (
    <>
      <div
        className={modalClass}
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="exampleModalLabel">
                Kategorie produktu
              </h6>
              <button
                onClick={onHideProductCategoryModal}
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form id="category-form" onSubmit={handleSubmit}>
                {state.categories.map(category => (
                  <div
                    key={category.CategoryId}
                    className="form-group form-check"
                  >
                    <input
                      type="checkbox"
                      name={'category' + category.CategoryId}
                      checked={
                        state.inputs[`category${category.CategoryId}`].checked
                      }
                      value={category.CategoryId}
                      onChange={handleChange}
                      className="form-check-input"
                    />
                    <label className="form-check-label">{category.Name}</label>
                  </div>
                ))}
                {/* <input type="submit" className="btn btn-success" value="Zapisz"/> */}
              </form>
            </div>
            <div className="modal-footer">
              <input
                type="submit"
                className="btn btn-success"
                value="Zapisz"
                form="category-form"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
