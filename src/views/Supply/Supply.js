import React, { useState, useEffect, useContext } from 'react'
import { NavigationContext } from '../../context/navigation-context'
import { LangContext } from '../../context/lang-context'
// import { NotificationContext } from '../../context/notification-context'
import SearchInput from '../../components/SearchInput/SearchInput'
import MachineSupply from '../../components/Machine/Supply'

import NewQuantityForm from '../../components/Modals/NewQuantityForm'

import useFetch from '../../hooks/fetch-hook'

export default ({ logout }) => {
  const { fetchApi } = useFetch()

  // const { ErrorNotification, SuccessNofication } = useContext(NotificationContext)
  const { setHeaderData } = useContext(NavigationContext)
  const {
    languagePack: { buttons, shelves }
  } = useContext(LangContext)

  const [newQuantityModal, setNewQuantityModal] = useState(null)
  const [machineType, setMachineType] = useState(null)
  const [machineProducts, setMachineProducts] = useState([])

  const getMachineProducts = () => {
    fetchApi('machine-products', {}, data => {
      if (data.map(product => product.MachineFeederNo).every(No => !isNaN(No)))
        data.sort((a, b) => Number(a.MachineFeederNo) - Number(b.MachineFeederNo))

      setMachineProducts(data)
    })
  }

  const getMachine = () => {
    fetchApi('machines', {}, data => setMachineType(data[0].Type))
  }

  const openAll = () => {
    fetchApi('vend-all')
  }

  const fillAllFeeders = () => {
    fetchApi(`machine-products/fill`, { method: 'PATCH' }, getMachineProducts)
  }

  const fillSingleFeeder = machineProductId => () => {
    fetchApi(
      `machine-product/fill/${machineProductId}`,
      { method: 'PATCH' },
      getMachineProducts
    )
  }

  const emptyAllFeeders = () => {
    fetchApi(`machine-products/empty`, { method: 'PATCH' }, getMachineProducts)
  }

  const emptySingleFeeder = machineProductId => () => {
    fetchApi(
      `machine-product/empty/${machineProductId}`,
      { method: 'PATCH' },
      getMachineProducts
    )
  }

  const saveFeeders = () => {
    fetchApi('visit', {}, logout)
  }

  const [searchValue, setSearchValue] = useState('')
  const handleSearch = value => setSearchValue(value)
  const filteredMachines = machineProducts.filter(machineProduct =>
    machineProduct.Name.toLowerCase().includes(searchValue.toLowerCase())
  )

  useEffect(() => {
    getMachineProducts()
    getMachine()
    setHeaderData({ text: shelves.rechargeHeader })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <SearchInput onSearch={handleSearch} />
      <div className="row mb-4">
        <div className="col">
          <button
            onClick={fillAllFeeders}
            className="h-100 btn btn-success btn-lg btn-block"
            disabled={machineProducts.every(
              machineProduct => machineProduct.Quantity === machineProduct.MaxItemCount
            )}
          >
            <i className="fas fa-arrow-up" />
          </button>
        </div>
        <div className="col">
          <button
            onClick={emptyAllFeeders}
            className="h-100 btn btn-danger btn-lg btn-block"
            disabled={machineProducts.every(
              machineProduct => machineProduct.Quantity === 0
            )}
          >
            <i className="fas fa-arrow-down" />
          </button>
        </div>
        {machineType === 'LOCKER' && (
          <div className="col">
            <button
              onClick={openAll}
              className="h-100 btn btn-secondary btn-lg btn-block"
            >
              {buttons.open}
            </button>
          </div>
        )}
        <div className="col">
          <button
            onClick={saveFeeders}
            className="h-100 btn btn-secondary btn-lg btn-block"
          >
            {buttons.saveVisit}
          </button>
        </div>
      </div>
      <MachineSupply
        setModal={setNewQuantityModal}
        machineProducts={filteredMachines}
        onFillFeeder={fillSingleFeeder}
        onEmptyFeeder={emptySingleFeeder}
      />
      {newQuantityModal && (
        <NewQuantityForm
          machineProduct={newQuantityModal}
          closeModal={() => setNewQuantityModal(null)}
          getMachineProducts={getMachineProducts}
        />
      )}
    </>
  )
}
