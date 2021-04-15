import React, { useState, useEffect, useContext } from 'react'
import { LangContext } from '../../context/lang-context'

import useFetch from '../../hooks/fetchMSSQL-hook'
import FormSkel from './FormSkel'

export default ({ feederData, handleClose, MachineProducts, getMachineProducts, form, setMachineProducts }) => {
  const { fetchMssqlApi } = useFetch()
  const {
    TRL_Pack: { shelves }
  } = useContext(LangContext)
  const [maxItemCount, setMaxItemCount] = useState(feederData ? feederData.MaxItemCount : null)

  const [allProducts, setAllProducts] = useState([])

  const getAllProducts = () => {
    fetchMssqlApi('products', {}, data => setAllProducts(data))
  }

  const getEanByName = Name => {
    const searchedProduct = allProducts.find(product => product.Name === Name)
    if (searchedProduct) return searchedProduct.EAN
    else return null
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
    } = evt.target.elements

    const Ean = getEanByName(Name.value)
    if (!Ean) return

    const fetchBody = {
      MachineFeederNo: MachineFeederNo.value,
      Ean,
      Price: parseFloat(Price.value),
      DiscountedPrice: parseFloat(DiscountedPrice.value),
      Quantity: parseInt(Quantity.value),
      MaxItemCount: parseInt(MaxItemCount.value)
    }

    let path, method

    if (!feederData) {
      path = 'machine-product'
      method = 'POST'
    } else {
      path = `machine-product/${feederData.MachineProductId}`
      method = 'PUT'
    }

    fetchMssqlApi(path, { method, data: fetchBody }, () => {
      handleClose()
      getMachineProducts()
    })
  }

  const handleChangeCapacityValue = e => {
    setMaxItemCount(e.target.value)
  }
  useEffect(() => {
    getAllProducts()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <FormSkel
      headerText={feederData ? shelves.editShelfHeader : shelves.newShelfHeader}
      handleClose={handleClose}
    >
      <form onSubmit={handleSubmit} id="modal-form" autoComplete="off">
        <div className="form-group">
          <label className="h6">{shelves.props.shelf}</label>
          <input
            name="MachineFeederNo"
            className="form-control"
            defaultValue={feederData && feederData.MachineFeederNo}
            required
            disabled={form === 'new' ? "" : "disabled"}
          />
        </div>
        <div className="form-group">
          <label className="h6">{shelves.props.productName}</label>
          <input
            className="form-control"
            name="Name"
            defaultValue={feederData && feederData.Name}
            list="products"
          />
          <datalist id="products">
            {allProducts.map((product, idx) => (
              <option key={idx}>{product.Name}</option>
            ))}
          </datalist>
        </div>
        <div className="form-group">
          <label className="h6">{shelves.props.price}</label>
          <input
            type="number"
            name="Price"
            className="form-control"
            defaultValue={feederData && feederData.Price}
            min={0}
            step={0.01}
            required
          />
        </div>
        <div className="form-group">
          <label className="h6">{shelves.props.discountedPrice}</label>
          <input
            type="number"
            name="DiscountedPrice"
            className="form-control"
            defaultValue={feederData && feederData.DiscountedPrice}
            min={0}
            step={0.01}
          />
        </div>
        <div className="form-group">
          <label className="h6">{shelves.props.quantity}</label>
          <input
            type="number"
            name="Quantity"
            className="form-control"
            defaultValue={feederData ? feederData.Quantity : null}
            min={0}
            max={maxItemCount || 20}
          />
        </div>
        <div>
          <label className="h6">{shelves.props.capacity}</label>
          <input
            type="number"
            name="MaxItemCount"
            className="form-control"
            onChange={(e) => handleChangeCapacityValue(e)}
            defaultValue={feederData && feederData.MaxItemCount}
            min={1}
            max={20}
          />
        </div>
      </form>
    </FormSkel>
  )
}
