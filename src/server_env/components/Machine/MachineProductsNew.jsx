import React, { useState, useEffect } from 'react';

import useFetch from '../../hooks/fetch-hook';

import TextInput from '../FormElements/TextInput'
import DatalistInput from '../FormElements/DatalistInput'

let tableRowId = 0;

const MachineProductsNew = (props) => {
    const { fetchMssqlApi } = useFetch();
    const [machineProducts, setMachineProducts] = useState([]);
    const [initialMachineProducts, setInitialMachineProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [isTableModified, setIsTableModified] = useState(false);

    useEffect(() => {
        fetchMssqlApi(`machine/${props.machineId}/products`, {}, machineProducts => {
            const newMachineProducts = machineProducts.map(machineProduct => ({ ...machineProduct, RequestMethod: null }))
            setInitialMachineProducts(newMachineProducts);
            setMachineProducts(newMachineProducts);
        });

        fetchMssqlApi('products', {}, products => setProducts(products))
    }, [])

    useEffect(() => {
        setIsTableModified(false);
        machineProducts.some(machineProduct => {
            if(machineProduct.RequestMethod) {
                setIsTableModified(true);
                return true;
            }
        });
    }, [machineProducts])

    useEffect(() => console.log('machineProducts', machineProducts, 'isTableModified', isTableModified));

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

    const handleSubmit = () => {
        // TO DO: handle http requests, get ProductId by name
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
            RequestMethod: 'POST'
        });

        setMachineProducts(newMachineProducts);
    }

    const removeTableRow = tableRowId => {
        console.log('tableRowId', tableRowId);
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

    return (
        <div className="card">
            <h5 className="card-header">
                Wybory
                <span className="ml-2 badge badge-info">{machineProducts.length}</span>
                <button className="float-right btn btn-sm btn-link text-decoration-none" onClick={addTableRow}>
                    <i className="fas fa-plus mr-2" />
                    Nowy
                </button>
                {/* {initialMachineProducts.current.length > 0 && (
                    <Fragment>
                        <button
                            className="float-right btn btn-sm btn-link text-decoration-none mr-2"
                            onClick={handleDownload}
                        >
                        <i className="fas fa-file-download mr-2" />
                            Pobierz
                        </button>
                        <button className="float-right btn btn-sm btn-link text-decoration-none mr-2">
                            <i className="fas fa-eraser mr-2" />
                            Reset sprzedaży
                        </button>
                    </Fragment>
                )} */}
            </h5>
            <datalist id="Name">
                {products.map((product, idx) => (
                <option key={idx}>{product.Name}</option>
                ))}
            </datalist>
            <div className="card-body overflow-auto" style={{ maxHeight: 550 }}>
                {/* <Prompt
                when={isUnsavedData}
                message="Wykryto niezapisane zmiany, czy na pewno chcesz opuścić stronę?"
            /> */}
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Nr</th>
                            <th>Produkt</th>
                            <th>Cena (zł)</th>
                            <th>Ilość</th>
                            <th>Pojemność</th>
                            <th className="text-center">Ostatnia sprzedaż</th>
                            <th style={{ width: '1%' }} />
                        </tr>
                    </thead>
                    <tbody>
                        {machineProducts.map((machineProduct, id) => (
                            <tr key={id}>
                                <td>
                                    <TextInput
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
                                        list={products.map(product => product.Name)}
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
                                        min={1}
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
                                        min={1}
                                        max={1000}
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
                <button className="btn btn-secondary btn-sm mr-3" onClick={cancelSubmit} disabled={!isTableModified}>Anuluj</button>
                <button className="btn btn-success btn-sm" onClick={(e) => handleSubmit()} disabled={!isTableModified}>Zapisz</button>
            </div>
        </div>
    )
}

export default MachineProductsNew;