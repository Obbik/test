import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '../../hooks/fetchMSSQL-hook'
import sampleProduct from '../../assets/images/sample-product.svg'
import { CONSOLE_CLOUD } from '../../config/config'
import { LangContext } from '../../context/lang-context'


export default () => {
  const { fetchMssqlApi } = useFetch()
  const { machineId } = useParams()
  const [machineProducts, setMachineProducts] = useState({
    local: null,
    global: null
  })

  const { TRL_Pack } = useContext(LangContext)

  const [currentView, setCurrentView] = useState(null)
  const toggleView = () => setCurrentView(prev => (prev === 'local' ? 'global' : 'local'))

  const getMachineProducts = () => {
    fetchMssqlApi(`machine/${machineId}/products`, {}, machineProducts => {
      setMachineProducts(machineProducts)
      if (machineProducts.local) setCurrentView('local')
      else if (machineProducts.global) setCurrentView('global')
    })
  }

  useEffect(() => {
    getMachineProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if ((!machineProducts.local && !machineProducts.global) || !currentView) return <></>

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center">
        <h5 className="mb-0 flex-grow-1">
          {TRL_Pack.fullMachine.listOfProduct}
          <span className="ml-2 badge badge-info">
            {console.log(machineProducts, currentView, machineProducts[currentView])}
            {machineProducts[currentView].feeders.length}
          </span>
        </h5>
        <span className="font-weight-bolder mb-0 mr-2">
          {currentView === 'local' ? 'Lokalnie' : 'Serwer'}
          {machineProducts[currentView].date && ` | ${machineProducts[currentView].date}`}
        </span>
        {machineProducts.local && machineProducts.global && (
          <button
            className="btn btn-sm btn-link text-decoration-none"
            onClick={toggleView}
          >
            {currentView === 'local' ? (
              <i className="fas fa-database icon-large" />
            ) : (
                <i className="fas fa-server icon-large" />
              )}
          </button>
        )}
      </div>
      <div className="card-body overflow-auto" style={{ maxHeight: 550 }}>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>No</th>
              <th colSpan={2}>Produkt</th>
              <th>Cena (zł)</th>
              <th>Stan</th>
            </tr>
          </thead>
          <tbody>
            {machineProducts[currentView].feeders
              .sort((a, b) => a.MachineFeederNo - b.MachineFeederNo)
              .map((machineProduct, idx) => (
                <tr key={idx}>
                  <td>{machineProduct.MachineFeederNo}</td>
                  <td>
                    <img
                      src={`${CONSOLE_CLOUD}/products/${machineProduct.EAN}.png`}
                      onError={evt => (evt.target.src = sampleProduct)}
                      alt={machineProduct.Name}
                      width="48"
                      height="48"
                    />
                  </td>
                  <td>{machineProduct.Name}</td>
                  <td>{machineProduct.Price.toFixed(2)}</td>
                  <td>
                    {machineProduct.Quantity} / {machineProduct.MaxItemCount}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
