import React, { useState, useEffect, useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import { useParams, useHistory } from 'react-router-dom'

import fetchApi from '../../util/fetchApi'

import { API_URL } from '../../config/config'

import sampleProduct from '../../assets/images/sample-product.svg'

export default ({ setLoader, NotificationError, NotificationSuccess }) => {
  const {
    languagePack: { buttons, products }
  } = useContext(LangContext)

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

    fetchApi(`product/${id}`)
      .then(res => {
        if (res.status !== 200) throw new Error()

        setLoader(false)

        const { EAN, Name, Description, Image } = res.data

        setState({
          product: {
            ean: EAN,
            name: Name,
            description: Description,
            image: Image,
            initialImage: Image
          },
          addProduct: false
        })
      })
      .catch(() => {
        setLoader(false)
        throw new Error('Failed to fetch status.')
      })
  }

  const addProduct = product => {
    setLoader(true)

    const formData = new FormData()
    formData.append('Ean', product.Ean)
    formData.append('Name', product.Name)
    formData.append('Description', product.Description)
    formData.append('Image', product.Image)

    fetchApi('product', { method: 'POST', data: formData })
      .then(res => {
        if (res.status && res.status < 400) {
          setLoader(false)
          NotificationSuccess(res.data.message)
          history.push('/')
        } else throw new Error(res)
      })
      .catch(err => {
        setLoader(false)
        NotificationError(err)
      })
  }

  const editProduct = product => {
    setLoader(true)

    const formData = new FormData()
    formData.append('Ean', product.Ean)
    formData.append('Name', product.Name)
    formData.append('Description', product.Description)
    formData.append('Image', product.Image)

    fetchApi(`product/${id}`, { method: 'PUT', data: formData })
      .then(res => {
        if (res.status && res.status < 400) {
          setLoader(false)
          NotificationSuccess(res.data.message)
          history.push('/')
        } else throw new Error(res)
      })
      .catch(err => {
        setLoader(false)
        NotificationError(err)
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
          <button onClick={history.goBack} className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i>&nbsp; {buttons.return}
          </button>
        </div>
      </div>
      <div className="card card-body bg-light mt-3">
        <div className="text-center">
          <h2>
            {state.addProduct ? products.newProductHeader : products.editProductHeader}
          </h2>
          {state.product.initialImage ? (
            <img
              src={API_URL + state.product.initialImage}
              onError={e => {
                e.target.src = sampleProduct
              }}
              alt={state.product.name}
              width="256"
              height="256"
            />
          ) : null}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{products.properties.ean}</label>
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
            <label>{products.properties.image}</label>
            <input
              type="file"
              name="image"
              className="form-control form-control-lg"
              onChange={handleChange}
              onKeyUp={handleChange}
            />
          </div>
          <div className="form-group">
            <label>{products.properties.productName}</label>
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
            <label>{products.properties.description}</label>
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
          <button type="submit" className="btn btn-success">
            {buttons.save}
          </button>
        </form>
      </div>
    </>
  )
}