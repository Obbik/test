import React, { useState, useEffect } from 'react'

import Title from '../../../components/Title/Title_alt'
import SearchInput from '../../SearchInput/SearchInput_alt'
import MachineProductsBoost from './MachineProductsBoost'

import fetchApi from '../../../helpers/fetchApi'

export default ({ url, setLoader, NotificationError, NotificationSuccess }) => {
  const [state, setState] = useState({
    machineType: null,
    machineProducts: []
  })

  const getMachine = () => {
    setLoader(true)

    fetchApi({ path: 'machines' }, res => {
      setLoader(false)

      if (res.status !== 200) throw new Error('Failed to fetch status.')

      setState(prev => ({
        ...prev,
        machineType: res.data[0].Type
      }))
    })
  }

  const getMachineProducts = () => {
    setLoader(true)

    fetchApi({ path: 'machine-products' }, res => {
      setLoader(false)

      if (res.status !== 200) throw new Error('Failed to fetch status.')

      if (
        res.data.map(product => product.MachineFeederNo).every(No => !isNaN(No))
      )
        res.data.sort(
          (a, b) => Number(a.MachineFeederNo) - Number(b.MachineFeederNo)
        )

      setState(prev => ({
        ...prev,
        machineProducts: res.data,
        initialMachineProducts: res.data
      }))
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
    setLoader(true)

    fetchApi({ path: 'vend-all' }, res => {
      setLoader(false)

      if (res.status < 400) NotificationSuccess(res.data.message)
      else NotificationError(res)
    })
  }

  const fillAllFeeders = () => {
    const { machineProducts } = state
    let filledMachineProducts = [...machineProducts]

    filledMachineProducts.forEach((product, i) => {
      if (product.Quantity !== product.MaxItemCount) {
        product.Quantity = product.MaxItemCount
        const dataBody = {
          Ean: product.EAN,
          MachineFeederNo: product.MachineFeederNo,
          Price: product.Price,
          DiscountedPrice: product.DiscountedPrice,
          Quantity: product.Quantity,
          MaxItemCount: product.MaxItemCount
        }
        setLoader(true)

        fetchApi(
          {
            path: `machine-product/${product.MachineProductId}`,
            method: 'PUT',
            data: dataBody
          },
          res => {
            setLoader(false)

            if (res.status && res.status < 400) {
              if (i === filledMachineProducts.length - 1)
                NotificationSuccess(res.data.message)
            } else {
              if (i === filledMachineProducts.length - 1) NotificationError(res)
            }
          }
        )
      }
    })
  }

  const emptyAllFeeders = () => {
    const { machineProducts } = state
    let filledMachineProducts = [...machineProducts]

    filledMachineProducts.forEach((product, i) => {
      if (product.Quantity !== 0) {
        product.Quantity = 0
        const dataBody = {
          Ean: product.EAN,
          MachineFeederNo: product.MachineFeederNo,
          Price: product.Price,
          DiscountedPrice: product.DiscountedPrice,
          Quantity: product.Quantity,
          MaxItemCount: product.MaxItemCount
        }
        setLoader(true)

        fetchApi(
          {
            path: `machine-product/${product.MachineProductId}`,
            method: 'PUT',
            data: dataBody
          },
          res => {
            setLoader(false)

            if (res.status && res.status < 400) {
              if (i === filledMachineProducts.length - 1)
                NotificationSuccess(res.data.message)
            } else {
              if (i === filledMachineProducts.length - 1) NotificationError(res)
            }
          }
        )
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
      setLoader(true)

      fetchApi(
        {
          path: `machine-product/${machineProduct.MachineProductId}`,
          method: 'PUT',
          data: newMachineProduct
        },
        res => {
          setLoader(false)

          if (res.status && res.status < 400) {
            NotificationSuccess(res.data.message)
            getMachineProducts()
          } else NotificationError(res)
        }
      )
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

      setLoader(true)

      fetchApi(
        {
          path: `machine-product/${machineProduct.MachineProductId}`,
          method: 'PUT',
          data: newMachineProduct
        },
        res => {
          setLoader(false)

          if (res.status && res.status < 400) {
            NotificationSuccess(res.data.message)
            getMachineProducts()
          } else NotificationError(res)
        }
      )
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
      <div className="row mb-3">
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
        {state.machineType === 'LOCKER' && (
          <div className="col">
            <button
              onClick={openAll}
              className="btn btn-secondary btn-lg btn-block"
            >
              Otwórz
            </button>
          </div>
        )}
        <div className="col">
          <button
            onClick={() => {}}
            className="btn btn-secondary btn-lg btn-block"
          >
            Zapisz
          </button>
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
