import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import axios from 'axios'

const sampleProduct = require('../../assets/images/sample-product.svg')

export default ({
  url,
  token,
  setLoader,
  NotificationError,
  NotificationSuccess
}) => {
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
    axios
      .get(`${url}api/category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setLoader(false)
        if (res.status !== 200) {
          throw new Error('Failed to fetch status.')
        }
        return res.data
      })
      .then(res => {
        setState({
          category: {
            name: res.Name,
            image: res.Image,
            initialImage: res.Image
          },
          addCategory: false
        })
      })
      .catch(err => {
        setLoader(false)
        NotificationError(err.toString())
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

    axios
      .post(`${url}api/category/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setLoader(false)
        NotificationSuccess(res.data.message)
        history.push('/categories')
      })
      .catch(err => {
        setLoader(false)
        NotificationError(err.toString())
      })
  }

  const editCategory = category => {
    setLoader(true)

    const formData = new FormData()
    formData.append('Name', category.Name)
    formData.append('Image', category.Image)

    axios
      .put(`${url}api/category/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setLoader(false)
        NotificationSuccess(res.data.message)
        history.push('/categories')
      })
      .catch(err => {
        setLoader(false)
        NotificationError(err.toString())
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
          <button onClick={history.goBack()} className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i>&nbsp; Wróć
          </button>
        </div>
      </div>
      <div className="card card-body bg-light mt-3">
        <div className="text-center">
          <h2>{state.addCategory ? 'Dodaj kategorię' : state.category.name}</h2>
          {state.category.initialImage ? (
            <img
              src={url + state.category.initialImage}
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
            <label>Zdjęcie</label>
            <input
              type="file"
              name="image"
              className="form-control form-control-lg"
              onChange={handleChange}
              onKeyUp={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Nazwa kategorii</label>
            <input
              type="text"
              name="name"
              className="form-control form-control-lg"
              value={state.category.name}
              onChange={handleChange}
              onKeyUp={handleChange}
            />
          </div>
          <input type="submit" className="btn btn-success" value="Zapisz" />
        </form>
      </div>
    </>
  )
}
