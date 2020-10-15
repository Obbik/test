import React, { useState, useEffect, useContext } from 'react'
import { NavigationContext } from '../../context/navigation-context'
import { LangContext } from '../../context/lang-context'
import Fab from '../../components/FloatingActionButton/Fab'
import SearchInput from '../../components/SearchInput/SearchInput'
import MachineProducts from '../../components/Machine/Feeders'

import FeederForm from '../../components/Modals/FeederForm'

import useFetch from '../../hooks/fetch-hook'

export default () => {
  const { fetchApi } = useFetch()

  const { setHeaderData } = useContext(NavigationContext)
  const {
    languagePack: { shelves }
  } = useContext(LangContext)

  const [searchValue, setSearchValue] = useState('')
  const [machineProducts, setMachineProducts] = useState([])

  const [feederFormModal, setFeederFormModal] = useState(null)

  const getMachineProducts = () => {
    fetchApi('machine-products', {}, data => {
      if (data.map(product => product.MachineFeederNo).every(No => !isNaN(No)))
        data.sort((a, b) => Number(a.MachineFeederNo) - Number(b.MachineFeederNo))

      setMachineProducts(data)
    })
  }

  const deleteMachineProduct = id => {
    if (window.confirm(shelves.confirmDeletion))
      fetchApi(`machine-product/${id}`, { method: 'DELETE' }, getMachineProducts)
  }

  const filteredMachines = machineProducts.filter(machineProduct =>
    machineProduct.Name.toLowerCase().includes(searchValue.toLowerCase())
  )

  const handleSearch = value => setSearchValue(value)

  useEffect(() => {
    getMachineProducts()

    setHeaderData({ text: shelves.configHeader })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Fab action={() => setFeederFormModal('add')} />
      <SearchInput onSearch={handleSearch} />
      <MachineProducts
        setModal={setFeederFormModal}
        machineProducts={filteredMachines}
        handleDeleteMachineProduct={deleteMachineProduct}
      />
      {feederFormModal && (
        <FeederForm
          feederNo={feederFormModal}
          closeModal={() => setFeederFormModal(null)}
          getMachineProducts={getMachineProducts}
        />
      )}
    </>
  )
}
