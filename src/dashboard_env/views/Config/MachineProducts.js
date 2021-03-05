import React, { useState, useEffect, useContext } from 'react'
import { NavigationContext } from '../../context/navigation-context'
import { LangContext } from '../../context/lang-context'
import SearchInput from '../../components/SearchInput/SearchInput'
import MachineProducts from '../../components/Machine/Feeders'

import FeederForm from '../../components/Modals/FeederForm'

import useFetch from '../../hooks/fetchMSSQL-hook'
import useForm from '../../hooks/form-hook'

export default () => {
  const { fetchMssqlApi } = useFetch()
  const { form, openForm, closeForm } = useForm()

  const {
    TRL_Pack: { shelves }
  } = useContext(LangContext)

  const [searchedValue, setSearchedValue] = useState('')
  const handleSearch = value => setSearchedValue(value)

  const [machineProducts, setMachineProducts] = useState([])
  const getMachineProducts = () => {
    fetchMssqlApi('machine-products', {}, data => {
      if (data.map(product => product.MachineFeederNo).every(No => !isNaN(No)))
        data.sort((a, b) => Number(a.MachineFeederNo) - Number(b.MachineFeederNo))

      setMachineProducts(data)
    })
  }
  console.log(machineProducts)
  const deliverMachineProduct = feederNo => () => {
    fetchMssqlApi(
      'shop/test-feeder',
      { method: 'POST', data: { MachineFeederNo: feederNo } },
      getMachineProducts
    )
  }

  const deleteMachineProduct = id => () => {
    if (window.confirm(shelves.confirmDeletion))
      fetchMssqlApi(`machine-product/${id}`, { method: 'DELETE' }, getMachineProducts)
  }

  const filteredMachines = machineProducts.filter(machineProduct =>
    machineProduct.Name.toLowerCase().includes(searchedValue.toLowerCase())
  )
  useEffect(() => {
    getMachineProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <SearchInput onSearch={handleSearch} />
      <div>
        <button
          className="d-block btn btn-link text-decoration-none ml-auto my-2 mr-1"
          onClick={openForm()}
        >
          <i className="fas fa-plus mr-2" /> Dodaj wybór
        </button>
      </div>
      <MachineProducts
        openForm={openForm}
        machineProducts={filteredMachines}
        handleDeliverMachineProduct={deliverMachineProduct}
        handleDeleteMachineProduct={deleteMachineProduct}
      />
      {form && (
        <FeederForm
          form={form}
          feederData={
            form !== 'new'
              ? (machineProducts.find(mp => mp.MachineProductId === form))
              : null
          }
          machineProducts={machineProducts}
          handleClose={closeForm}
          MachineProducts={machineProducts}
          setMachineProducts={setMachineProducts}
          getMachineProducts={getMachineProducts}
        />
      )}
    </>
  )
}
