import React, { useState, useEffect } from 'react'
import Title from '../../../components/Title/Title'
import SearchInput from '../../SearchInput/SearchInput_alt'
import MachineProducts from './MachineProducts'

import fetchApi from '../../../helpers/fetchApi'

export default ({ setLoader, NotificationError, NotificationSuccess }) => {
  const [state, setState] = useState({
    machineProducts: [],
    machineType: null
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

  const deleteMachineProduct = id => {
    const confirm = window.confirm('Czy na pewno chcesz usunąć sprężynę?')

    if (confirm) {
      setLoader(true)

      fetchApi(`machine-product/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.status && res.status < 400) {
            setLoader(false)
            NotificationSuccess(res.data.message)
            getMachineProducts()
          } else throw new Error(res)
        })
        .catch(err => {
          setLoader(false)
          NotificationError(res)
        })
    }
  }

  // Search bar
  const search = value => {
    const suggestions = getSuggestions(value)
    let filtered = state.initialMachineProducts

    if (value !== '') filtered = suggestions

    setState(prev => ({ ...prev, machineProducts: filtered }))
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

  useEffect(() => {
    getMachineProducts()
    getMachine()
  }, [])

  return (
    <>
      <Title
        title="Konfiguracja maszyny"
        buttonName="Dodaj sprężynę"
        buttonLink="/machine-product/add"
      />
      <SearchInput onSearch={search} tableView={null} />
      <MachineProducts
        machineProducts={state.machineProducts}
        onDeleteMachineProduct={deleteMachineProduct}
      />
    </>
  )
}
