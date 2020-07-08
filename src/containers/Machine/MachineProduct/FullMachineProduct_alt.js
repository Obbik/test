import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import axios from 'axios'

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
    machineProduct: {
      machineFeederNo: '',
      name: '',
      price: '',
      discountedPrice: '',
      quantity: '',
      maxItemCount: ''
    },
    products: null,
    addMachineProduct: false,
    suggestions: []
  })

  const handleChange = e => {
    e.preventDefault()
    const inputName = e.target.name
    let inputValue = e.target.value

    if (inputName === 'image') {
      inputValue = e.target.files[0]
    } else if (inputName === 'name') {
      handleSuggestionBox(inputValue)
    }

    setState(prev => ({
      ...prev,
      machineProduct: {
        ...prev.machineProduct,
        [inputName]: inputValue
      }
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()

    const ean = getEanByName(state.machineProduct.name)
    const machineProduct = {
      MachineFeederNo: state.machineProduct.machineFeederNo,
      Ean: ean,
      Price: parseFloat(state.machineProduct.price),
      DiscountedPrice: parseFloat(state.machineProduct.discountedPrice),
      Quantity: parseInt(state.machineProduct.quantity),
      MaxItemCount: parseInt(state.machineProduct.maxItemCount)
    }

    if (state.addMachineProduct) addMachineProduct(machineProduct)
    else editMachineProduct(machineProduct)
  }

  const changeNameInput = name => {
    setState(prev => ({
      ...prev,
      machineProduct: {
        ...prev.machineProduct,
        name: name
      },
      isSuggestionVisible: false
    }))
  }

  const addMachineProduct = machineProduct => {
    setLoader(true)

    axios
      .post(`${url}api/machine-product/`, machineProduct, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setLoader(false)
        NotificationSuccess(res.data.message)
        history.push('/machine-products')
      })
      .catch(err => {
        setLoader(false)
        NotificationError(err)
      })
  }

  const editMachineProduct = machineProduct => {
    setLoader(true)

    axios
      .put(`${url}api/machine-product/${id}`, machineProduct, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setLoader(false)
        NotificationSuccess(res.data.message)
        history.push('/machine-products')
      })
      .catch(err => {
        setLoader(false)
        NotificationError(err)
      })
  }

  const getEanByName = name => {
    const { products } = state
    const product = products.filter(product => product.Name === name)

    return product[0].EAN
  }

  const handleSuggestionBox = inputValue => {
    const suggestions =
      inputValue.length === 0
        ? []
        : state.products.filter(product =>
            product.Name.toLowerCase().includes(inputValue.trim().toLowerCase())
          )

    const isSuggestionVisible = suggestions.length > 0 ? true : false

    setState(prev => ({
      ...prev,
      suggestions: suggestions,
      isSuggestionVisible: isSuggestionVisible
    }))
  }

  useEffect(() => {
    if (id !== 'add') {
      setLoader(true)
      axios
        .get(`${url}api/machine-product/${id}`, {
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
          const discountedPrice = res.DiscountedPrice
            ? res.DiscountedPrice.toFixed(2)
            : ''
          setState(prev => ({
            ...prev,
            machineProduct: {
              machineFeederNo: res.MachineFeederNo,
              name: res.Name,
              price: res.Price.toFixed(2),
              discountedPrice: discountedPrice,
              quantity: res.Quantity,
              maxItemCount: res.MaxItemCount
            },
            addMachineProduct: false
          }))
          setLoader(false)

          return axios.get(`${url}api/all-products`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        })
        .then(res => {
          setState(prev => ({ ...prev, products: res.data }))
        })
        .catch(err => {
          setLoader(false)
          NotificationError(err)
        })
    } else {
      axios
        .get(`${url}api/all-products`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          setState(prev => ({
            ...prev,
            addMachineProduct: true,
            products: res.data
          }))
        })
        .catch(err => {
          setLoader(false)
          NotificationError(err)
        })
    }
  }, [])

  const suggestionClass = state.isSuggestionVisible
    ? 'suggestions-container active'
    : 'suggestions-container'

  return (
    <>
      <div className="row mb-3">
        <div className="col">
          <button onClick={history.goBack} className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i>&nbsp; Wróć
          </button>
        </div>
      </div>
      <div className="card card-body bg-light mt-3">
        <div className="text-center">
          <h2>
            {state.addMachineProduct ? 'Dodaj sprężynę' : 'Edytuj sprężynę'}
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Sprężyna</label>
            <input
              type="text"
              name="machineFeederNo"
              className="form-control form-control-lg"
              value={state.machineProduct.machineFeederNo}
              onChange={handleChange}
              onKeyUp={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Nazwa produktu</label>
            <input
              type="text"
              autoComplete="off"
              name="name"
              className="form-control form-control-lg"
              value={state.machineProduct.name}
              onChange={handleChange}
              onKeyUp={handleChange}
            />
          </div>
          <div className="form-group">
            <div className={suggestionClass}>
              {state.suggestions.map(suggestion => (
                <div
                  key={suggestion.EAN}
                  onClick={() => changeNameInput(suggestion.Name)}
                >
                  {suggestion.Name}
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Cena</label>
            <input
              type="number"
              name="price"
              className="form-control form-control-lg"
              value={state.machineProduct.price}
              onChange={handleChange}
              onKeyUp={handleChange}
              min={0}
              step={0.01}
            />
          </div>
          <div className="form-group">
            <label>Cena promocyjna</label>
            <input
              type="number"
              name="discountedPrice"
              className="form-control form-control-lg"
              value={state.machineProduct.discountedPrice}
              onChange={handleChange}
              onKeyUp={handleChange}
              min={0}
              step={0.01}
            />
          </div>
          <div className="form-group">
            <label>Ilość</label>
            <input
              type="number"
              name="quantity"
              className="form-control form-control-lg"
              value={state.machineProduct.quantity}
              onChange={handleChange}
              onKeyUp={handleChange}
              min={0}
              max={state.machineProduct.maxItemCount}
            />
          </div>
          <div className="form-group">
            <label>Pojemność</label>
            <input
              type="number"
              name="maxItemCount"
              className="form-control form-control-lg"
              value={state.machineProduct.maxItemCount}
              onChange={handleChange}
              onKeyUp={handleChange}
              min={0}
              max={40}
            />
          </div>
          <input type="submit" className="btn btn-success" value="Zapisz" />
        </form>
      </div>
    </>
  )
}
