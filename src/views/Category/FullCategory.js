import React, { useState, useEffect, useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import { useParams, useHistory } from 'react-router-dom'

import fetchApi from '../../util/fetchApi'

import sampleProduct from '../../assets/images/sample-product.svg'

import { API_URL } from '../../config/config'

export default ({ setLoader, NotificationError, NotificationSuccess }) => {
  const {
    languagePack: { buttons, categories }
  } = useContext(LangContext)

  const { id } = useParams()
  const history = useHistory()

  const [state, setState] = useState({
    category: {
      name: '',
      image: ''
    },
    addCategory: false
  })

  const getCategory = id => {
    setLoader(true)

    fetchApi(`category/${id}`)
      .then(res => {
        if (res.status !== 200) throw new Error()

        setLoader(false)
        setState({
          category: {
            name: res.data.Name,
            image: res.data.Image,
            initialImage: res.data.Image
          },
          addCategory: false
        })
      })
      .catch(() => {
        setLoader(false)
        new Error('Failed to fetch status.')
      })
  }

  const handleChange = e => {
    e.preventDefault()
    const inputName = e.target.name
    let inputValue = e.target.value

    if (inputName === 'image') {
      inputValue = e.target.files[0]
    }

    setState(prev => ({
      ...prev,
      category: {
        ...prev.category,
        [inputName]: inputValue
      }
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()

    const category = {
      Name: state.category.name,
      Image: state.category.image
    }

    if (state.addCategory) addCategory(category)
    else editCategory(category)
  }

  const addCategory = category => {
    setLoader(true)

    const formData = new FormData()
    formData.append('Name', category.Name)
    formData.append('Image', category.Image)

    fetchApi('category', { method: 'POST', data: formData })
      .then(res => {
        if (res.status && res.status < 400) {
          setLoader(false)
          NotificationSuccess(res.data.message)
          history.push('/categories')
        } else throw new Error(res)
      })
      .catch(err => {
        setLoader(false)
        NotificationError(err)
      })
  }

  const editCategory = category => {
    setLoader(true)

    const formData = new FormData()
    formData.append('Name', category.Name)
    formData.append('Image', category.Image)

    fetchApi(`category/${id}`, { method: 'PUT', data: formData })
      .then(res => {
        if (res.status && res.status < 400) {
          setLoader(false)
          NotificationSuccess(res.data.message)
          history.push('/categories')
        } else throw new Error(res)
      })
      .catch(err => {
        setLoader(false)
        NotificationError(err)
      })
  }

  useEffect(() => {
    if (id !== 'add') getCategory(id)
    else
      setState(prev => ({
        ...prev,
        addCategory: true
      }))
  }, [])

  return (
    <>
      <div className="row mb-3">
        <div className="col">
          <button onClick={history.goBack} className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i>&nbsp; {buttons.return}
          </button>
        </div>
      </div>
      <div className="card card-body bg-light mt-3">
        <div className="text-center">
          <h2>
            {state.addCategory
              ? categories.newCategoryHeader
              : categories.editCategoryHeader}
          </h2>
          {state.category.initialImage ? (
            <img
              src={API_URL + state.category.initialImage}
              onError={e => {
                e.target.src = sampleProduct
              }}
              alt={state.category.name}
              width="256"
              height="256"
            />
          ) : null}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{categories.properties.image}</label>
            <input
              type="file"
              name="image"
              className="form-control form-control-lg"
              onChange={handleChange}
              onKeyUp={handleChange}
            />
          </div>
          <div className="form-group">
            <label>{categories.properties.categoryName}</label>
            <input
              type="text"
              name="name"
              className="form-control form-control-lg"
              value={state.category.name}
              onChange={handleChange}
              onKeyUp={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-success">
            {buttons.save}
          </button>
        </form>
      </div>
    </>
  )
}
