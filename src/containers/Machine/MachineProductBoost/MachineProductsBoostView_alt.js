import React, { useState, useEffect } from 'react'

import Title from '../../../components/Title/Title_alt'
import SearchInput from '../../SearchInput/SearchInput_alt'
import MachineProductsBoost from './MachineProductsBoost'

import axios from 'axios'
import { api } from '../../../helpers/helpers'

export default ({
  url,
  token,
  setLoader,
  NotificationError,
  NotificationSuccess
}) => {
  const [state, setState] = useState({
    machineType: null,
    machineProducts: []
  })

  const getMachine = () => {
    const headers = {
      Authorization: `Bearer ${token}`
    }

    api(`${url}api/machines`, 'GET', headers, null, res => {
      if (res.status < 400) {
        setState(prev => ({
          ...prev,
          machineType: res.data[0].Type
        }))
      }
    })
  }

  const getMachineProducts = () => {
    const headers = {
      Authorization: `Bearer ${token}`
    }

    setLoader(true)
    api(`${url}api/machine-products`, 'GET', headers, null, res => {
      if (res.status < 400)
        setState(prev => ({
          ...prev,
          machineProducts: res.data,
          initialMachineProducts: res.data
        }))
      else NotificationError(res.data.message)

      setLoader(false)
    })
  }

  const search = value => {
    const suggestions = getSuggestions(value)
    let filtered = state.initialMachineProducts

    if (value !== '') {
      filtered = suggestions
    }

    setState(prev => ({
      ...prev,
      machineProducts: filtered
    }))
  }

  const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length

    return inputLength === 0
      ? []
      : state.initialMachineProducts.filter(
          machineProduct =>
            machineProduct.Name.toLowerCase().slice(0, inputLength) ===
            inputValue
        )
  }

  const openAll = () => {
    api(`${url}api/vend-all`, 'GET', null, null, res => {
      if (res.status < 400) NotificationSuccess(res.data.message)
      else NotificationError(res.data.message)

      setLoader(false)
    })
  }

  const fillAllFeeders = () => {
    const { machineProducts } = state
    let filledMachineProducts = [...machineProducts]

    filledMachineProducts.forEach((product, i) => {
      if (product.Quantity !== product.MaxItemCount) {
        setLoader(true)
        product.Quantity = product.MaxItemCount

        axios
          .put(
            `${url}api/machine-product/${product.MachineProductId}`,
            {
              Ean: product.EAN,
              MachineFeederNo: product.MachineFeederNo,
              Price: product.Price,
              DiscountedPrice: product.DiscountedPrice,
              Quantity: product.Quantity,
              MaxItemCount: product.MaxItemCount
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(res => {
            setLoader(false)
            if (i === filledMachineProducts.length - 1)
              NotificationSuccess(res.data.message)
          })
          .catch(err => {
            setLoader(false)
            if (i === filledMachineProducts.length - 1) NotificationError(err)
          })
      }
    })
  }

  const emptyAllFeeders = () => {
    const { machineProducts } = state
    let filledMachineProducts = [...machineProducts]

    filledMachineProducts.forEach((product, i) => {
      if (product.Quantity !== 0) {
        setLoader(true)
        product.Quantity = 0

        axios
          .put(
            `${url}api/machine-product/${product.MachineProductId}`,
            {
              Ean: product.EAN,
              MachineFeederNo: product.MachineFeederNo,
              Price: product.Price,
              DiscountedPrice: product.DiscountedPrice,
              Quantity: product.Quantity,
              MaxItemCount: product.MaxItemCount
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(res => {
            setLoader(false)
            if (i === filledMachineProducts.length - 1)
              NotificationSuccess(res.data.message)
          })
          .catch(err => {
            setLoader(false)
            if (i === filledMachineProducts.length - 1) NotificationError(err)
          })
      }
    })
  }

  const fillSingleFeeder = machineProduct => {
    if (machineProduct.Quantity !== machineProduct.MaxItemCount) {
      const newMachineProduct = {
        Ean: machineProduct.EAN,
        MachineFeederNo: machineProduct.MachineFeederNo,
        Price: machineProduct.Price,
        DiscountedPrice: machineProduct.DiscountedPrice,
        Quantity: machineProduct.Quantity,
        MaxItemCount: machineProduct.MaxItemCount
      }

      newMachineProduct.Quantity = newMachineProduct.MaxItemCount

      axios
        .put(
          `${url}api/machine-product/${machineProduct.MachineProductId}`,
          newMachineProduct,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(res => {
          setLoader(false)
          NotificationSuccess(res.data.message)
          getMachineProducts()
        })
        .catch(err => {
          setLoader(false)
          NotificationError(err)
        })
    }
  }

  const emptySingleFeeder = machineProduct => {
    if (machineProduct.Quantity !== 0) {
      const newMachineProduct = {
        Ean: machineProduct.EAN,
        MachineFeederNo: machineProduct.MachineFeederNo,
        Price: machineProduct.Price,
        DiscountedPrice: machineProduct.DiscountedPrice,
        Quantity: machineProduct.Quantity,
        MaxItemCount: machineProduct.MaxItemCount
      }

      newMachineProduct.Quantity = 0

      axios
        .put(
          `${url}api/machine-product/${machineProduct.MachineProductId}`,
          newMachineProduct,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(res => {
          setLoader(false)
          NotificationSuccess(res.data.message)
          getMachineProducts()
        })
        .catch(err => {
          setLoader(false)
          NotificationError(err)
        })
    }
  }

  useEffect(() => {
    getMachineProducts()
    getMachine()
  }, [])

  return (
    <>
      <Title title="Doładowanie" />
      <SearchInput onSearch={search} tableView={null} />
      <div className="row mb-2">
        <div className="col">
          <button
            onClick={fillAllFeeders}
            className="btn btn-success btn-lg btn-block"
          >
            <i className="fas fa-arrow-up"></i>
          </button>
        </div>
        <div className="col">
          <button
            onClick={emptyAllFeeders}
            className="btn btn-danger btn-lg btn-block"
          >
            <i className="fas fa-arrow-down"></i>
          </button>
        </div>
        <div className="col">
          {state.machineType === 'LOCKER' ? (
            <button
              onClick={openAll}
              className="btn btn-secondary btn-lg btn-block"
            >
              Otwórz
            </button>
          ) : null}
        </div>
      </div>
      <MachineProductsBoost
        machineProducts={state.machineProducts}
        onFillSingleFeeder={fillSingleFeeder}
        onEmptySingleFeeder={emptySingleFeeder}
      />
    </>
  )
}
