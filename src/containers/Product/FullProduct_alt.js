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
    product: {
      ean: '',
      name: '',
      description: '',
      image: '',
      initialImage: ''
    },
    addProduct: false
  })

  const handleChange = e => {
    e.preventDefault()
    const { name: inputName } = e.target
    let inputValue = e.target.value

    if (inputName === 'image') inputValue = e.target.files[0]

    setState(prev => ({
      ...prev,
      product: {
        ...prev.product,
        [inputName]: inputValue
      }
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()

    const product = {
      Ean: state.product.ean,
      Image: state.product.image,
      Name: state.product.name,
      Description: state.product.description
    }

    if (state.addProduct) addProduct(product)
    else editProduct(product)
  }

  const getProduct = id => {
    setLoader(true)
    axios
      .get(`${url}api/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setLoader(false)
        if (res.status !== 200) throw new Error('Failed to fetch status.')

        return res.data
      })
      .then(res => {
        setState({
          product: {
            ean: res.EAN,
            name: res.Name,
            description: res.Description,
            image: res.Image,
            initialImage: res.Image
          },
          addProduct: false
        })
      })
      .catch(err => {
        setLoader(false)
        NotificationError(err.toString())
      })
  }

  const addProduct = product => {
    setLoader(true)
    const formData = new FormData()
    formData.append('Ean', product.Ean)
    formData.append('Name', product.Name)
    formData.append('Description', product.Description)
    formData.append('Image', product.Image)

    axios
      .post(`${url}api/product/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setLoader(false)
        NotificationSuccess(res.data.message)
        history.push('/')
      })
      .catch(err => {
        setLoader(false)
        NotificationError(err.toString())
      })
  }

  const editProduct = product => {
    setLoader(true)

    const formData = new FormData()
    formData.append('Ean', product.Ean)
    formData.append('Name', product.Name)
    formData.append('Description', product.Description)
    formData.append('Image', product.Image)

    axios
      .put(`${url}api/product/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setLoader(false)
        NotificationSuccess(res.data.message)
        history.push('/')
      })
      .catch(err => {
        setLoader(false)
        NotificationError(err.toString())
      })
  }

  useEffect(() => {
    if (id !== 'add') getProduct(id)
    else
      setState(prev => ({
        ...prev,
        addProduct: true
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
      {/* <div className="card mt-4"> */}
      {/* <div className="card-header">
        <ProductNav 
                      id={id} 
                      active={1}
                      addProduct={this.state.addProduct}
                  />
              </div> */}
      <div className="card card-body bg-light mt-3">
        <div className="text-center">
          <h2>{state.addProduct ? 'Dodaj produkt' : state.product.name}</h2>
          {state.product.initialImage ? (
            <img
              src={url + state.product.initialImage}
              onError={e => {
                e.target.src = sampleProduct
              }}
              alt={state.product.name}
              width="256"
              height="256"
            />
          ) : null}
          {/* + '?n=' + new Date().getTime() */}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ean</label>
            <input
              type="number"
              name="ean"
              className="form-control form-control-lg"
              value={state.product.ean}
              onChange={handleChange}
              onKeyUp={handleChange}
              readOnly={!state.addProduct}
            />
          </div>
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
            <label>Nazwa produktu</label>
            <input
              type="text"
              name="name"
              className="form-control form-control-lg"
              value={state.product.name}
              onChange={handleChange}
              onKeyUp={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Opis</label>
            <textarea
              type="text"
              name="description"
              className="form-control"
              rows="4"
              value={state.product.description}
              onChange={handleChange}
              onKeyUp={handleChange}
            />
          </div>
          <input type="submit" className="btn btn-success" value="Zapisz" />
        </form>
      </div>
      {/* </div> */}
    </>
  )
}
