import React, { useState, useEffect } from 'react'
import fetchApi from '../../helpers/fetchApi'

export default ({
  ean,
  setLoader,
  NotificationError,
  NotificationSuccess,
  onHideProductCategoryModal,
  showProductCategoryModal
}) => {
  const [state, setState] = useState({
    categories: [],
    productCategories: [],
    inputs: {},
    initialInputs: {}
  })

  const getCategories = async () => {
    setLoader(true)

    let inputs
    let checked = false

    console.time('test')

    await fetchApi({ path: 'categories' }, async res => {
      if (res.status !== 200) {
        NotificationError(res)
        return
      }

      const categories = res.data
      categories.forEach(category => {
        inputs = {
          ...inputs,
          [`category${category.CategoryId}`]: {
            value: category.CategoryId,
            checked
          }
        }
      })
      console.timeLog('test')
      await setState(prev => ({
        ...prev,
        categories,
        inputs,
        initialInputs: { ...inputs }
      }))
      console.log(state)
    })

    console.timeLog('test')

    await fetchApi({ path: `category-product/${ean}` }, res => {
      if (res.status !== 200) {
        NotificationError(res)
        return
      }

      const categories = state.categories
      const productCategories = res.data

      console.log(state.categories)

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
            checked
          }
        }
      })

      console.log(inputs)
      console.timeLog('test')
      setState(prev => ({
        ...prev,
        inputs,
        initialInputs: { ...inputs },
        productCategories
      }))
    })

    console.timeLog('test')

    setLoader(false)
  }

  const handleChange = e => {
    const { name, value, checked } = e.target

    setState(prev => ({
      ...prev,
      inputs: {
        ...prev.inputs,
        [name]: {
          value,
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
    fetchApi(
      { path: 'category-product', method: 'POST', data: productCategory },
      res => {
        if (res.status && res.status < 400)
          NotificationSuccess(res.data.message)
        else NotificationError(res)
      }
    )
  }

  const deleteProductCategory = id => {
    fetchApi({ path: `category-product/${id}`, method: 'DELETE' }, res => {
      if (res.status && res.status < 400) NotificationSuccess(res.data.message)
      else NotificationError(res)
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
  }, [])

  if (Object.keys(state.inputs).length === 0) return <></>
  else console.log(state)

  return (
    <div
      className={`modal fade ${showProductCategoryModal && 'show d-block'}`}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h6 className="modal-title">Kategorie produktu</h6>
            <button
              onClick={onHideProductCategoryModal}
              type="button"
              className="close"
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
  )
}
