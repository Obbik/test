import React, { useState, useEffect } from 'react'

import Title from '../../../components/Title/Title_alt'
import SearchInput from '../../SearchInput/SearchInput_alt'
import MachineProductsBoost from './MachineProductsBoost'

import fetchApi from '../../../helpers/fetchApi'

export default ({ setLoader, NotificationError, NotificationSuccess }) => {
  const [state, setState] = useState({
    machineType: null,
    machineProducts: []
  })

  const getMachineProducts = () => {
    setLoader(true)

    fetchApi('machine-products')
      .then(res => {
        if (res.status && res.status < 400) {
          setLoader(false)
          if (
            res.data
              .map(product => product.MachineFeederNo)
              .every(No => !isNaN(No))
          )
            res.data.sort(
              (a, b) => Number(a.MachineFeederNo) - Number(b.MachineFeederNo)
            )

          setState(prev => ({
            ...prev,
            machineProducts: res.data,
            initialMachineProducts: res.data
          }))
        } else throw new Error(res)
      })
      .catch(() => {
        setLoader(false)
        throw new Error('Failed to fetch status.')
      })
  }

  const getMachine = () => {
    setLoader(true)

    fetchApi('machines')
      .then(res => {
        if (res.status !== 200) throw new Error()

        setLoader(false)
        setState(prev => ({ ...prev, machineType: res.data[0].Type }))
      })
      .catch(() => {
        setLoader(false)
        throw new Error('Failed to fetch status.')
      })
  }

  const openAll = () => {
    setLoader(true)

    fetchApi('vend-all')
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

  const saveFeeders = () => {
    setLoader(true)

    fetchApi(
      {
        path: `visit`
      },
      res => {
        setLoader(false)

        if (res.status && res.status < 400)
          NotificationSuccess(res.data.message)
        else NotificationError(res)
      }
    )
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
            onClick={saveFeeders}
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
