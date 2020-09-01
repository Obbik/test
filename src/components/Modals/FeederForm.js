import React, { useState, useEffect, useContext } from 'react'
import { LangContext } from '../../context/lang-context'

import useFetch from '../../hooks/fetch-hook'

export default ({ feederNo, closeModal, getMachineProducts }) => {
  const { fetchApi } = useFetch()

  const {
    languagePack: { buttons, shelves }
  } = useContext(LangContext)

  const [machineProduct, setMachineProduct] = useState({
    machineFeederNo: '',
    Name: '',
    price: '',
    discountedPrice: '',
    quantity: '',
    maxItemCount: ''
  })

  const [allProducts, setAllProducts] = useState([])

  const getAllProducts = () => {
    fetchApi('all-products', {}, data => setAllProducts(data))
  }

  const getMachineProduct = () => {
    fetchApi(`machine-product/${feederNo}`, {}, data => {
      const {
        DiscountedPrice,
        MachineFeederNo,
        Name,
        Price,
        Quantity,
        MaxItemCount
      } = data

      setMachineProduct({
        MachineFeederNo,
        Name,
        Price: Price.toFixed(2),
        DiscountedPrice: DiscountedPrice ? DiscountedPrice.toFixed(2) : '',
        Quantity,
        MaxItemCount
      })
    })
  }

  const getEanByName = Name => allProducts.find(product => product.Name === Name).EAN

  const handleChange = evt => {
    evt.preventDefault()
    const { name, value } = evt.target

    setMachineProduct(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = evt => {
    evt.preventDefault()

    const {
      MachineFeederNo,
      Name,
      Price,
      DiscountedPrice,
      Quantity,
      MaxItemCount
    } = machineProduct

    const Ean = getEanByName(Name)

    const fetchBody = {
      MachineFeederNo,
      Ean,
      Price: parseFloat(Price),
      DiscountedPrice: parseFloat(DiscountedPrice),
      Quantity: parseInt(Quantity),
      MaxItemCount: parseInt(MaxItemCount)
    }

    let path, method
    if (feederNo === 'add') {
      path = 'machine-product'
      method = 'POST'
    } else {
      path = `machine-product/${feederNo}`
      method = 'PUT'
    }

    fetchApi(path, { method, data: fetchBody }, () => {
      closeModal()
      getMachineProducts()
    })
  }

  useEffect(() => {
    if (feederNo !== 'add') getMachineProduct(feederNo)
    getAllProducts()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="modal fade'show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-light align-items-center">
            <h6 className="modal-title">
              {feederNo === 'add' ? shelves.newShelfHeader : shelves.editShelfHeader}
            </h6>
            <button
              onClick={closeModal}
              className="btn text-secondary px-2 py-0"
              style={{ cursor: 'pointer' }}
            >
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit} id="feeder-form">
              <div className="form-group">
                <label>{shelves.props.shelf}</label>
                <input
                  type="text"
                  name="MachineFeederNo"
                  className="form-control"
                  value={machineProduct.MachineFeederNo}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>{shelves.props.productName}</label>
                <input
                  className="form-control"
                  name="Name"
                  value={machineProduct.Name}
                  onChange={handleChange}
                  list="products"
                />
                <datalist id="products">
                  {allProducts.map((product, idx) => (
                    <option key={idx}>{product.Name}</option>
                  ))}
                </datalist>
              </div>
              <div className="form-group">
                <label>{shelves.props.price}</label>
                <input
                  type="number"
                  name="Price"
                  className="form-control"
                  value={machineProduct.Price}
                  onChange={handleChange}
                  min={0}
                  step={0.01}
                />
              </div>
              <div className="form-group">
                <label>{shelves.props.discountedPrice}</label>
                <input
                  type="number"
                  name="DiscountedPrice"
                  className="form-control"
                  value={machineProduct.DiscountedPrice}
                  onChange={handleChange}
                  min={0}
                  step={0.01}
                />
              </div>
              {machineProduct.quantity !== false &&
                machineProduct.MaxItemCount !== false && (
                  <>
                    <div className="form-group">
                      <label>{shelves.props.quantity}</label>
                      <input
                        type="number"
                        name="Quantity"
                        className="form-control"
                        value={machineProduct.Quantity}
                        onChange={handleChange}
                        min={0}
                        max={machineProduct.maxItemCount}
                      />
                    </div>
                    <div>
                      <label>{shelves.props.capacity}</label>
                      <input
                        type="number"
                        name="MaxItemCount"
                        className="form-control"
                        value={machineProduct.MaxItemCount}
                        onChange={handleChange}
                        min={1}
                        max={40}
                      />
                    </div>
                  </>
                )}
            </form>
          </div>
          <div className="modal-footer bg-light">
            <button type="submit" className="btn btn-success btn-sm" form="feeder-form">
              {buttons.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
