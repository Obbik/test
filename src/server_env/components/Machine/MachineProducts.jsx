import React, { useState, useRef, useEffect, useContext } from 'react'
import useFetch from '../../hooks/fetch-hook'
import { NotificationContext } from '../../context/notification-context'
import DatalistInput from '../FormElements/DatalistInput'
import TextInput from '../FormElements/TextInput'
import { API_URL } from '../../config/config'
import { Prompt } from 'react-router'

export default ({ machineId }) => {
  const { fetchMssqlApi } = useFetch()
  const { ErrorNotification } = useContext(NotificationContext)

  const initialMachineProducts = useRef(null)
  const [machineProductsData, setMachineProductsData] = useState([])

  const feedersCounter = useRef(0)

  const [productsData, setProductsData] = useState([])

  const [isUnsavedData, setIsUnsavedData] = useState(false)
  useEffect(
    () =>
      setIsUnsavedData(
        machineProductsData.some(machineProduct => {
          const initialProduct = initialMachineProducts.current.find(
            product => product.id === machineProduct.id
          )

          return (
            machineProduct.added ||
            machineProduct.toDelete ||
            machineProduct.FeederNo !== initialProduct.FeederNo ||
            Number(machineProduct.PriceBrutto) !== initialProduct.PriceBrutto ||
            machineProduct.MaxItemCount !== initialProduct.MaxItemCount ||
            machineProduct.ProductName !== initialProduct.ProductName
          )
        })
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [machineProductsData]
  )

  const getMachineProducts = () => {
    fetchMssqlApi(`machine/${machineId}/products`, {}, machineProducts => {
      machineProducts.forEach(
        machineProduct => (machineProduct.id = feedersCounter.current++)
      )
      initialMachineProducts.current = machineProducts
      setMachineProductsData(machineProducts)
    })
  }

  const getProducts = () => {
    fetchMssqlApi('products', {}, products => setProductsData(products))
  }

  useEffect(() => {
    getMachineProducts()
    getProducts()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = id => evt => {
    const { name, value } = evt.target
    setMachineProductsData(prev =>
      prev.map(machineProduct =>
        machineProduct.id === id ? { ...machineProduct, [name]: value } : machineProduct
      )
    )
  }

  const handleAddFeeder = () =>
    setMachineProductsData(prev => [
      ...prev,
      {
        added: true,
        FeederNo: '',
        PriceBrutto: 3,
        MaxItemCount: 10,
        ProductName: '',
        id: feedersCounter.current++
      }
    ])

  const handleRemoveNewFeeder = id => () =>
    setMachineProductsData(prev =>
      prev.filter(machineProduct => id !== machineProduct.id)
    )

  const handleToggleOldFeeder = id => () => {
    setMachineProductsData(prev =>
      prev.map(machineProduct =>
        machineProduct.id === id
          ? { ...machineProduct, toDelete: !machineProduct.toDelete }
          : machineProduct
      )
    )
  }

  const productNameToId = name =>
    Number(productsData.find(product => product.Name === name)?.ProductId)

  const addFeeder = feeder => {
    fetchMssqlApi(
      `machine/${machineId}/products`,
      { method: 'POST', data: feeder },
      () => {
        initialMachineProducts.current = initialMachineProducts.current.concat({
          FeederNo: feeder.feederNo,
          PriceBrutto: feeder.price,
          MaxItemCount: feeder.maxQuantity,
          ProductName: feeder.productName,
          id: feeder.id
        })
        setMachineProductsData(prev =>
          prev.map(machineProduct =>
            machineProduct.id === feeder.id
              ? {
                  FeederNo: feeder.feederNo,
                  PriceBrutto: feeder.price,
                  MaxItemCount: feeder.maxQuantity,
                  ProductName: feeder.productName,
                  id: feeder.id
                }
              : machineProduct
          )
        )
      }
    )
  }

  const modifyFeeder = feeder => {
    fetchMssqlApi(
      `machine/${machineId}/products/${feeder.feederNo}`,
      { method: 'PUT', data: feeder },
      () => {
        initialMachineProducts.current = initialMachineProducts.current.map(
          machineProduct =>
            machineProduct.id === feeder.id
              ? {
                  FeederNo: feeder.feederNo,
                  PriceBrutto: feeder.price,
                  MaxItemCount: feeder.maxQuantity,
                  ProductName: feeder.productName,
                  id: feeder.id
                }
              : machineProduct
        )
        setMachineProductsData(prev =>
          prev.map(machineProduct =>
            machineProduct.id === feeder.id
              ? {
                  FeederNo: feeder.feederNo,
                  PriceBrutto: feeder.price,
                  MaxItemCount: feeder.maxQuantity,
                  ProductName: feeder.productName,
                  id: feeder.id
                }
              : machineProduct
          )
        )
      }
    )
  }

  const deleteFeeder = feeder => {
    fetchMssqlApi(
      `machine/${machineId}/products/${feeder.feederNo}`,
      { method: 'DELETE' },
      () => {
        initialMachineProducts.current = initialMachineProducts.current.filter(
          machineProduct => machineProduct.id !== feeder.id
        )
        setMachineProductsData(prev =>
          prev.filter(machineProduct => machineProduct.id !== feeder.id)
        )
      }
    )
  }

  const submitChanges = () => {
    const changedFeeders = {
      added: [],
      deleted: [],
      modified: []
    }

    if (
      !machineProductsData.every(machineProduct => {
        if (machineProduct.added) {
          const { FeederNo, ProductName, PriceBrutto, MaxItemCount } = machineProduct
          const ProductId = productNameToId(ProductName)

          if (!FeederNo || isNaN(ProductId) || isNaN(PriceBrutto) || isNaN(MaxItemCount))
            return false

          changedFeeders.added.push({
            id: machineProduct.id,
            feederNo: FeederNo,
            productId: ProductId,
            productName: ProductName,
            price: parseFloat(PriceBrutto),
            maxQuantity: parseInt(MaxItemCount)
          })
        } else if (machineProduct.toDelete) {
          const { FeederNo } = machineProduct

          changedFeeders.deleted.push({ id: machineProduct.id, feederNo: FeederNo })
        } else {
          const initialProduct = initialMachineProducts.current.find(
            product => product.id === machineProduct.id
          )

          if (
            initialProduct.FeederNo !== machineProduct.FeederNo ||
            initialProduct.PriceBrutto !== machineProduct.PriceBrutto ||
            initialProduct.MaxItemCount !== machineProduct.MaxItemCount ||
            initialProduct.ProductName !== machineProduct.ProductName
          ) {
            const { FeederNo, ProductName, PriceBrutto, MaxItemCount } = machineProduct
            const ProductId = productNameToId(ProductName)

            if (
              !FeederNo ||
              isNaN(ProductId) ||
              isNaN(PriceBrutto) ||
              isNaN(MaxItemCount)
            )
              return false

            changedFeeders.modified.push({
              id: machineProduct.id,
              feederNo: FeederNo,
              productId: ProductId,
              price: parseFloat(PriceBrutto),
              maxQuantity: parseInt(MaxItemCount)
            })
          }
        }
        return true
      })
    ) {
      ErrorNotification('Invalid inputs.')
      return
    }

    if (changedFeeders.added.length)
      changedFeeders.added.forEach(feeder => addFeeder(feeder))
    if (changedFeeders.deleted.length)
      changedFeeders.deleted.forEach(feederNo => deleteFeeder(feederNo))
    if (changedFeeders.modified.length)
      changedFeeders.modified.forEach(feeder => modifyFeeder(feeder))
  }

  const discardChanges = () => setMachineProductsData(initialMachineProducts.current)

  const handleDownload = () => {
    fetchMssqlApi(
      `/machine-products/${machineId}`,
      { method: 'POST', hideNotification: true },
      path => window.open(`${API_URL}/${path}`, '_blank')
    )
  }

  const handleResetLastSales = () => {
    const confirmReset = window.confirm('Potwierdź reset sprzedaży')

    if (confirmReset)
      fetchMssqlApi(`/machine/${machineId}/reset-sales`, { method: 'POST' }, () => {
        initialMachineProducts.current = initialMachineProducts.current.map(
          machineProduct => ({ ...machineProduct, LastSalesTotal: 0 })
        )
        setMachineProductsData(prev =>
          prev.map(machineProduct => ({ ...machineProduct, LastSalesTotal: 0 }))
        )
      })
  }

  return machineProductsData.length ? (
    <div className="card">
      <h5 className="card-header">
        Wybory
        <span className="ml-2 badge badge-info">{machineProductsData.length}</span>
        <button
          className="float-right btn btn-sm btn-link text-decoration-none"
          onClick={handleAddFeeder}
        >
          <i className="fas fa-plus mr-2" />
          Nowy
        </button>
        {initialMachineProducts.current.length > 0 && (
          <>
            <button
              className="float-right btn btn-sm btn-link text-decoration-none mr-2"
              onClick={handleDownload}
            >
              <i className="fas fa-file-download mr-2" />
              Pobierz
            </button>
            <button
              className="float-right btn btn-sm btn-link text-decoration-none mr-2"
              onClick={handleResetLastSales}
            >
              <i className="fas fa-eraser mr-2" />
              Reset sprzedaży
            </button>
          </>
        )}
      </h5>
      <datalist id="ProductName">
        {productsData.map((product, idx) => (
          <option key={idx}>{product.Name}</option>
        ))}
      </datalist>
      <div className="card-body overflow-auto" style={{ maxHeight: 550 }}>
        <Prompt
          when={isUnsavedData}
          message="Wykryto niezapisane zmiany, czy na pewno chcesz opuścić stronę?"
        />
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nr</th>
              <th>Produkt</th>
              <th>Cena (zł)</th>
              <th>Pojemność</th>
              <th className="text-center">Ostatnia sprzedaż</th>
              <th style={{ width: '1%' }} />
            </tr>
          </thead>
          <tbody>
            {machineProductsData
              .filter(machineProduct => machineProduct.added)
              .map((machineProduct, idx) => (
                <tr key={idx}>
                  <td>
                    <TextInput
                      style={{ maxWidth: 75 }}
                      name="FeederNo"
                      value={machineProduct.FeederNo}
                      handleChange={handleChange(machineProduct.id)}
                      required
                    />
                  </td>
                  <td>
                    <DatalistInput
                      name="ProductName"
                      value={machineProduct.ProductName}
                      handleChange={handleChange(machineProduct.id)}
                      list={productsData.map(product => product.Name)}
                    />
                  </td>
                  <td>
                    <TextInput
                      style={{ maxWidth: 100 }}
                      name="PriceBrutto"
                      value={machineProduct.PriceBrutto}
                      handleChange={handleChange(machineProduct.id)}
                      type="number"
                      min={0}
                      max={1000}
                      required
                    />
                  </td>
                  <td>
                    <TextInput
                      style={{ maxWidth: 100 }}
                      name="MaxItemCount"
                      value={machineProduct.MaxItemCount}
                      handleChange={handleChange(machineProduct.id)}
                      type="number"
                      min={1}
                      max={1000}
                      required
                    />
                  </td>
                  <td />
                  <td className="text-center">
                    <button
                      className="btn btn-link btn-sm"
                      onClick={handleRemoveNewFeeder(machineProduct.id)}
                    >
                      <i className="fas fa-times" />
                    </button>
                  </td>
                </tr>
              ))}
            {machineProductsData
              .filter(machineProduct => !machineProduct.added)
              .map((machineProduct, idx) => (
                <tr key={idx}>
                  <td>
                    <TextInput
                      style={{ maxWidth: 75 }}
                      name="FeederNo"
                      value={machineProduct.FeederNo}
                      handleChange={handleChange(machineProduct.id)}
                      required
                    />
                  </td>
                  <td>
                    <DatalistInput
                      name="ProductName"
                      value={machineProduct.ProductName}
                      handleChange={handleChange(machineProduct.id)}
                      list={productsData.map(product => product.Name)}
                    />
                  </td>
                  <td>
                    <TextInput
                      style={{ maxWidth: 100 }}
                      name="PriceBrutto"
                      value={machineProduct.PriceBrutto}
                      handleChange={handleChange(machineProduct.id)}
                      type="number"
                      min={0}
                      max={1000}
                      required
                    />
                  </td>
                  <td>
                    <TextInput
                      style={{ maxWidth: 100 }}
                      name="MaxItemCount"
                      value={machineProduct.MaxItemCount}
                      handleChange={handleChange(machineProduct.id)}
                      type="number"
                      min={1}
                      max={1000}
                      required
                    />
                  </td>
                  <td className="text-center">{machineProduct.LastSalesTotal || 0}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-link btn-sm"
                      onClick={handleToggleOldFeeder(machineProduct.id)}
                    >
                      {machineProduct.toDelete ? (
                        <i className="fas fa-trash-restore" />
                      ) : (
                        <i className="fas fa-trash" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="card-footer text-center">
        <button
          className="btn btn-secondary btn-sm mr-3"
          onClick={discardChanges}
          disabled={!isUnsavedData}
        >
          Anuluj
        </button>
        <button
          className="btn btn-success btn-sm"
          onClick={submitChanges}
          disabled={!isUnsavedData}
        >
          Zapisz
        </button>
      </div>
    </div>
  ) : (
    <div className="text-center py-2">
      <button className="btn btn-link text-decoration-none" onClick={handleAddFeeder}>
        <i className="fas fa-plus mr-2" /> Dodaj wybór
      </button>
    </div>
  )
}
