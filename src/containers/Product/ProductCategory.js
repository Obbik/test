import React, { useState, useEffect, useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import fetchApi from '../../util/fetchApi'

export default ({
  ean,
  setLoader,
  NotificationError,
  NotificationSuccess,
  onHideProductCategoryModal,
  showProductCategoryModal
}) => {
  const {
    languagePack: { buttons, products }
  } = useContext(LangContext)

  const [state, setState] = useState({
    categories: [],
    inputs: {},
    initialCategories: [],
    productCategories: []
  })

  const getCategories = async () => {
    setLoader(true)

    await fetchApi(`category-product/${ean}`)
      .then(res => {
        if (res.status !== 200) throw new Error()

        setLoader(false)
        const initialCategories = []

        const categories = res.data

        categories.forEach(({ CategoryId }) => {
          initialCategories.push(`category${CategoryId}`)
        })

        setState(prev => ({
          ...prev,
          initialCategories,
          productCategories: categories
        }))
      })
      .catch(err => {
        setLoader(false)
        throw new Error('Failed to fetch status.')
      })

    setLoader(true)

    fetchApi('categories')
      .then(res => {
        if (res.status !== 200) throw new Error()

        setLoader(false)

        const categories = res.data
        setState(prev => {
          let inputs = prev.inputs
          categories.forEach(({ CategoryId }) => {
            if (prev.initialCategories.includes(`category${CategoryId}`))
              inputs = {
                ...inputs,
                [`category${CategoryId}`]: {
                  value: CategoryId,
                  checked: true
                }
              }
            else
              inputs = {
                ...inputs,
                [`category${CategoryId}`]: {
                  value: CategoryId,
                  checked: false
                }
              }
          })

          return {
            ...prev,
            categories,
            inputs
          }
        })
      })
      .catch(err => {
        setLoader(false)
        throw new Error('Failed to fetch status.')
      })
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

    Object.keys(state.inputs).forEach(category => {
      if (state.inputs[category].checked && !state.initialCategories.includes(category)) {
        const categoryId = state.inputs[category].value
        const productCategory = {
          CategoryId: categoryId,
          Ean: ean
        }
        addProductCategory(productCategory)
      } else if (
        !state.inputs[category].checked &&
        state.initialCategories.includes(category)
      ) {
        const productCategories = state.productCategories.find(
          p => p.CategoryId === Number(state.inputs[category].value)
        )

        deleteProductCategory(productCategories.CategoryProductId)
      }
    })

    getCategories()
    onHideProductCategoryModal()
  }

  const addProductCategory = productCategory => {
    fetchApi('category-product', { method: 'POST', data: productCategory })
      .then(res => {
        if (res.status && res.status < 400) {
          setLoader(false)
          NotificationSuccess(res.data.message)
        } else throw new Error(res)
      })
      .catch(err => {
        setLoader(false)
        NotificationError(err)
      })
  }

  const deleteProductCategory = id => {
    fetchApi(`category-product/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.status && res.status < 400) {
          setLoader(false)
          NotificationSuccess(res.data.message)
        } else throw new Error(res)
      })
      .catch(err => {
        setLoader(false)
        NotificationError(err)
      })
  }

  useEffect(() => {
    getCategories()
  }, [])

  if (Object.keys(state.inputs).length === 0) return <></>

  return (
    <div
      className={`modal fade ${showProductCategoryModal && 'show d-block'}`}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h6 className="modal-title">{products.productCategoryHeader}</h6>
            <button onClick={onHideProductCategoryModal} type="button" className="close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form id="category-form" onSubmit={handleSubmit}>
              {state.categories.map((category, idx) => (
                <div key={idx} className="form-group form-check">
                  <input
                    type="checkbox"
                    name={'category' + category.CategoryId}
                    checked={state.inputs[`category${category.CategoryId}`].checked}
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
            <button type="submit" className="btn btn-success" form="category-form">
              {buttons.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
