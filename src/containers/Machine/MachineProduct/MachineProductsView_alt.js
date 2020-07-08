import React, { useState, useEffect } from 'react'
import Title from '../../../components/Title/Title'
import SearchInput from '../../SearchInput/SearchInput_alt'
import MachineProducts from './MachineProducts'

import fetchApi from '../../../helpers/fetchApi'

export default ({ url, setLoader, NotificationError, NotificationSuccess }) => {
  const [state, setState] = useState({
    title: 'Konfiguracja maszyny',
    machineProducts: [],
    machineType: null
  })

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

  const getMachine = () => {
    setLoader(true)

    fetchApi({ path: 'machines' }, res => {
      if (res.status !== 200) throw new Error('Failed to fetch status.')

      setState(prev => ({ ...prev, machineType: res.data[0].Type }))
    })
  }

  const deleteMachineProduct = id => {
    const confirm = window.confirm('Czy na pewno chcesz usunąć sprężynę?')

    if (confirm) {
      setLoader(true)

      fetchApi({ path: `machine-product/${id}`, method: 'DELETE' }, res => {
        setLoader(false)

        if (res.status && res.status < 400) {
          NotificationSuccess(res.data.message)
          getMachineProducts()
        } else NotificationError(res)
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
      <SearchInput onSearch={search} tableView={null} />
      <MachineProducts
        machineProducts={state.machineProducts}
        onDeleteMachineProduct={deleteMachineProduct}
      />
    </>
  )
}
