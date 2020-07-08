import React, { useState, useEffect } from 'react'
import Title from '../../../components/Title/Title'
import SearchInput from '../../SearchInput/SearchInput_alt'
import MachineProducts from './MachineProducts'

import { api } from '../../../helpers/helpers'

export default ({
  url,
  token,
  setLoader,
  NotificationError,
  NotificationSuccess
}) => {
  const [state, setState] = useState({
    title: 'Konfiguracja maszyny',
    machineProducts: [],
    machineType: null
  })

  const getMachineProducts = () => {
    const reqUrl = `${url}api/machine-products`
    const headers = {
      Authorization: `Bearer ${token}`
    }

    setLoader(true)
    api(reqUrl, 'GET', headers, null, res => {
      if (res.status < 400)
        setState({
          machineProducts: res.data,
          initialMachineProducts: res.data
        })
      else NotificationError(res.data.message)

      setLoader(false)
    })
  }

  const getMachine = () => {
    const headers = {
      Authorization: `Bearer ${token}`
    }

    api(`${url}api/machines`, 'GET', headers, null, res => {
      if (res.status < 400)
        setState(prev => ({ ...prev, machineType: res.data[0].Type }))
    })
  }

  const deleteMachineProduct = id => {
    const confirm = window.confirm('Czy na pewno chcesz usunąć sprężynę?')

    if (confirm) {
      setLoader(true)

      const headers = {
        Authorization: `Bearer ${token}`
      }

      api(`${url}api/machine-product/${id}`, 'DELETE', headers, null, res => {
        if (res.status < 400) {
          NotificationSuccess(res.data.message)
          getMachineProducts()
        } else NotificationError(res.data.message.toString())

        setLoader(false)
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
        title={state.title}
        buttonName="Dodaj sprężynę"
        buttonLink="/machine-product/add"
      />
      <SearchInput onSearch={search} />
      <MachineProducts
        machineProducts={state.machineProducts}
        onDeleteMachineProduct={deleteMachineProduct}
      />
    </>
  )
}
