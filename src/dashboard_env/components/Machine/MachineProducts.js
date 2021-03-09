import React, { Fragment, useState, useEffect, useContext } from 'react';
import { Prompt } from 'react-router';
import { LangContext } from '../../context/lang-context'

import useFetch from '../../hooks/fetchMSSQL-hook';
import { NotificationContext } from '../../context/notification-context';
import { API_URL } from '../../config/config';

import TextInput from '../FormElements/TextInput';
import DatalistInput from '../FormElements/DatalistInput';
import { NotificationManager } from 'react-notifications';
let tableRowId = 0;

const MachineProducts = (props) => {
  const { fetchMssqlApi } = useFetch();
  const { ErrorNotification } = useContext(NotificationContext);

  const { TRL_Pack } = useContext(LangContext)

  const [machineProducts, setMachineProducts] = useState([]);
  const [initialMachineProducts, setInitialMachineProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [isTableModified, setIsTableModified] = useState(false);
  const [product, setProduct] = useState([])

  useEffect(() => {
    getMachineProducts();
    fetchMssqlApi(`products`, {}, product => setProduct(product));
  }, [])

  useEffect(() => {
    getMachineProducts();
    fetchMssqlApi(`machine-products?machineId=${props.machineId}`, {}, products => setProducts(products));
  }, [])

  useEffect(() => {
    setIsTableModified(false);
    machineProducts.some(machineProduct => {
      if (machineProduct.RequestMethod) {
        setIsTableModified(true);
        return true;
      }
    });
  }, [machineProducts])


  const getMachineProducts = () => {
    const params = {
      machineId: props.machineId
    };

    fetchMssqlApi(`machine-products`, { method: 'GET', data: null, hideNotification: false, params }, machineProducts => {
      const newMachineProducts = machineProducts.map(machineProduct => ({ ...machineProduct, RequestMethod: null }))
      setInitialMachineProducts(newMachineProducts);
      setMachineProducts(newMachineProducts);
    });
  }

  const handleChange = (machineProductId, e) => {
    const name = e.target.name;
    const value = name === 'PriceBrutto' ? parseFloat(e.target.value) : e.target.value;

    const index = machineProducts.findIndex(machineProduct => machineProduct.MachineProductId === machineProductId);
    const initialMachineProductIndex = initialMachineProducts.findIndex(initialMachineProduct => initialMachineProduct.MachineProductId === machineProductId);
    let newMachineProducts = [...machineProducts];

    let requestMethod = !newMachineProducts[index].RequestMethod || newMachineProducts[index].RequestMethod === 'DELETE' ? 'PUT' : newMachineProducts[index].RequestMethod;
    newMachineProducts[index] = { ...newMachineProducts[index], [name]: value };

    if (equalMachineProduct(initialMachineProducts[initialMachineProductIndex], newMachineProducts[index])) // Check if initial machine product is equal to current machine product status
      requestMethod = null;

    newMachineProducts[index] = { ...newMachineProducts[index], RequestMethod: requestMethod };

    setMachineProducts(newMachineProducts);
  }

  const toggleDeleteMachineProduct = machineProductId => {
    const index = machineProducts.findIndex(machineProduct => machineProduct.MachineProductId === machineProductId);
    const initialMachineProductIndex = initialMachineProducts.findIndex(initialMachineProduct => initialMachineProduct.MachineProductId === machineProductId);

    let newMachineProducts = [...machineProducts];

    let requestMethod = 'DELETE'; // Request method is DELETE by default

    if (newMachineProducts[index].RequestMethod === 'DELETE') { // Check if selected machine product request method is DELETE
      requestMethod = null; // Request method is null if it was DELETE previously

      if (!equalMachineProduct(initialMachineProducts[initialMachineProductIndex], newMachineProducts[index])) // Check if initial machine product is different than current machine product status
        requestMethod = 'PUT';
    }

    newMachineProducts[index] = { ...newMachineProducts[index], RequestMethod: requestMethod };

    setMachineProducts(newMachineProducts);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let productId;

    const modifiedMachineProducts = machineProducts.filter(machineProduct => machineProduct.RequestMethod !== null);
    modifiedMachineProducts.forEach((machineProduct, i) => {
      let _getMachineProducts = false;

      if (i === modifiedMachineProducts.length - 1) {
        _getMachineProducts = true;
      }

      const { DiscountedPrice, MachineProductId, MachineInventoryItemId, MachineFeederNo, Name, PriceBrutto, Quantity, MaxItemCount, RequestMethod } = machineProduct;
      // Check if a request method is assigned to machine product
      if (RequestMethod) {
        productId = getProductId(Name); // Get product id
        // Validate inputs
        console.log(MachineFeederNo === true && Name === true && PriceBrutto === true && PriceBrutto >= 0 && Quantity && parseInt(Quantity) >= 0 && MaxItemCount && parseInt(MaxItemCount) >= 0 && parseInt(MaxItemCount) >= parseInt(Quantity))
        // if (parseInt(MaxItemCount) < parseInt(Quantity)) {
        //   NotificationManager.error('Please select higher quantity than Capacity value');
        // }
        if (MachineFeederNo === true && Name === true && PriceBrutto === true && PriceBrutto >= 0 && Quantity && parseInt(Quantity) >= 0 && MaxItemCount && parseInt(MaxItemCount) >= 0 && parseInt(MaxItemCount) >= parseInt(Quantity)) {
          // HTTP requests here
          const data = {
            MachineId: props.machineId,
            MachineFeederNo: parseInt(MachineFeederNo),
            MachineProductId: parseInt(MachineProductId),
            Ean: parseInt(productId),
            Price: parseFloat(PriceBrutto),
            DiscountedPrice: parseInt(DiscountedPrice),
            Quantity: parseInt(Quantity),
            MaxItemCount: parseInt(MaxItemCount)
          }
          if (RequestMethod === 'POST') {
            fetchMssqlApi(`machine-product`, { method: RequestMethod, data: data }, res => {
              if (_getMachineProducts) {
                getMachineProducts();
                _getMachineProducts = false;
              }
            });
          } else if (RequestMethod === 'PUT') {
            if (MachineInventoryItemId) {
              fetchMssqlApi(`machine-product/${MachineProductId}/${MachineInventoryItemId}`, { method: RequestMethod, data: data }, res => {
                if (_getMachineProducts) {
                  getMachineProducts();
                  _getMachineProducts = false;
                }
              });
            }
            else {
              fetchMssqlApi(`machine-product/${MachineProductId}`, { method: RequestMethod, data: data }, res => {
                if (_getMachineProducts) {
                  getMachineProducts();
                  _getMachineProducts = false;
                }
              });
            }
          } else if (RequestMethod === 'DELETE') {
            if (MachineInventoryItemId) {
              fetchMssqlApi(`machine-product/${MachineProductId}/${MachineInventoryItemId}`, { method: RequestMethod }, res => {
                if (_getMachineProducts) {
                  getMachineProducts();
                  _getMachineProducts = false;
                }
              })
            }
            else {
              fetchMssqlApi(`machine-product/${MachineProductId}`, { method: RequestMethod }, res => {
                if (_getMachineProducts) {
                  getMachineProducts();
                  _getMachineProducts = false;
                }
              })
            }
          }
        } else {
          NotificationManager.error(TRL_Pack.errors.correctData);
        }
      }
    });
  }
  const cancelSubmit = () => {
    setMachineProducts(initialMachineProducts);
  }
  const addTableRow = () => {
    const newMachineProducts = [...machineProducts];
    newMachineProducts.unshift({
      TableRowId: ++tableRowId,
      MachineFeederNo: '',
      Name: '',
      PriceBrutto: '',
      Quantity: '',
      MaxItemCount: '',
      notDisabled: true,
      RequestMethod: 'POST'
    });

    setMachineProducts(newMachineProducts);
  }

  const removeTableRow = tableRowId => {
    const newMachineProducts = [...machineProducts];

    const filteredMachineproducts = newMachineProducts.filter(newMachineProduct => newMachineProduct.TableRowId !== tableRowId);

    setMachineProducts(filteredMachineproducts);
  }

  const equalMachineProduct = (initialMachineProduct, machineProduct) => {
    if (initialMachineProduct && machineProduct)
      if (initialMachineProduct.MachineFeederNo === machineProduct.MachineFeederNo && initialMachineProduct.Name === machineProduct.Name && initialMachineProduct.MaxItemCount === machineProduct.MaxItemCount && machineProduct.PriceBrutto === initialMachineProduct.PriceBrutto && machineProduct.Quantity === initialMachineProduct.Quantity)
        return true;

    return false;
  }

  const getProductId = name => {
    const foundProduct = product.find(product => product.Name === name);
    if (foundProduct)
      return foundProduct.EAN;
    else
      return null;
  }

  const handleDownload = () => {
    fetchMssqlApi(
      `report/machine-products/${props.machineId}`,
      { method: 'POST', hideNotification: true },
      path => {
        window.open(`${API_URL}/${path}`, '_blank')
      }
    )
  }

  const handleResetLastSales = () => {
    const confirmReset = window.confirm('Potwierdź reset sprzedaży');

    if (confirmReset)
      fetchMssqlApi(`machine/${props.machineId}/reset-sales`, { method: 'POST' }, () => {
        getMachineProducts();
      });
  }

  return (
    <div className="card">
      <h5 className="card-header">
        {TRL_Pack.fullMachine.listOfProduct}
        <span className="ml-2 badge badge-info">{machineProducts.length}</span>
        <button className="float-right btn btn-sm btn-link text-decoration-none" onClick={addTableRow}>
          <i className="fas fa-plus mr-2" />
          {TRL_Pack.fullMachine.new}
        </button>
        {initialMachineProducts.length > 0 && (
          <Fragment>
            {/* <button
              className="float-right btn btn-sm btn-link text-decoration-none mr-2"
              onClick={handleDownload}
            >
              <i className="fas fa-file-download mr-2" />
              {TRL_Pack.fullMachine.download}
            </button> */}
            {/* <button
              className="float-right btn btn-sm btn-link text-decoration-none mr-2"
              onClick={handleResetLastSales}>
              <i className="fas fa-eraser mr-2" />
              {TRL_Pack.fullMachine.salesReset}
            </button> */}
          </Fragment>
        )}
      </h5>
      <datalist id="Name">
        {product.map((product, idx) => (
          <option key={idx}>{product.Name}</option>
        ))}
      </datalist>
      <div className="card-body overflow-auto" style={{ maxHeight: 550 }}>
        <Prompt
          when={isTableModified}
          message="Wykryto niezapisane zmiany, czy na pewno chcesz opuścić stronę?"
        />
        <table className="table table-striped">
          <thead>
            <tr>
              <th>{TRL_Pack.machineRecipies.number}</th>
              <th>{TRL_Pack.machineRecipies.recipies}</th>
              <th>{TRL_Pack.machineRecipies.price}</th>
              <th>{TRL_Pack.machineRecipies.quantity}</th>
              <th>{TRL_Pack.machineRecipies.capacity}</th>
              <th className="text-center">{TRL_Pack.machineRecipies.lastSales}</th>
              <th style={{ width: '1%' }} />
            </tr>
          </thead>
          <tbody>
            {machineProducts.map((machineProduct, id) => (
              <tr key={id}>
                <td>
                  <TextInput
                    disabled={machineProducts[id].notDisabled ? null : true}
                    style={{ maxWidth: 75 }}
                    name="MachineFeederNo"
                    value={machineProduct.MachineFeederNo}
                    handleChange={(e => handleChange(machineProduct.MachineProductId, e))}
                    required
                  />
                </td>
                <td>
                  <DatalistInput
                    name="Name"
                    value={machineProduct.Name}
                    handleChange={(e => handleChange(machineProduct.MachineProductId, e))}
                    list={product.map(product => product.Name)}
                  />
                </td>
                <td>
                  <TextInput
                    style={{ maxWidth: 100 }}
                    name="PriceBrutto"
                    value={machineProduct.PriceBrutto}
                    handleChange={(e => handleChange(machineProduct.MachineProductId, e))}
                    type="number"
                    min={0}
                    step={0.1}
                    max={1000}
                    required
                  />
                </td>
                <td>
                  <TextInput
                    style={{ maxWidth: 100 }}
                    name="Quantity"
                    value={machineProduct.Quantity}
                    handleChange={(e => handleChange(machineProduct.MachineProductId, e))}
                    type="number"
                    min={0}
                    max={machineProduct.MaxItemCount}
                    required
                  />
                </td>

                <td>
                  <TextInput
                    style={{ maxWidth: 100 }}
                    name="MaxItemCount"
                    value={machineProduct.MaxItemCount}
                    handleChange={(e => handleChange(machineProduct.MachineProductId, e))}
                    type="number"
                    min={0}
                    required
                  />
                </td>
                <td className="text-center">{machineProduct.LastSalesTotal || 0}</td>
                <td className="text-center">
                  <button
                    className="btn btn-link btn-sm"
                    onClick={machineProduct.RequestMethod === 'POST' ? () => removeTableRow(machineProduct.TableRowId) : () => toggleDeleteMachineProduct(machineProduct.MachineProductId)}
                  >
                    {machineProduct.RequestMethod === 'DELETE' ? (
                      <i className="fas fa-trash-restore" />
                    ) : (
                        machineProduct.RequestMethod === 'POST' ? (
                          <i className="fas fa-times" />
                        ) : (
                            <i className="fas fa-trash" />
                          )

                      )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card-footer text-center">
        <button className="btn btn-secondary btn-sm mr-3" onClick={cancelSubmit} disabled={!isTableModified}>{TRL_Pack.buttons.cancel}</button>
        <button className="btn btn-success btn-sm" onClick={(e) => handleSubmit(e)} disabled={!isTableModified}>{TRL_Pack.buttons.save}</button>
      </div>
    </div>
  )
}

export default MachineProducts;