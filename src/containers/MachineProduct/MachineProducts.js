import React from 'react';
import { Link } from 'react-router-dom';

const machineProducts = props => {
    return <div className="row">
        <div className="col">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Sprężyna</th>
                        <th scope="col">Nazwa</th>
                        <th scope="col">Cena</th>
                        {/* <th scope="col">Cena promocyjna</th> */}
                        <th scope="col">Ilość</th>
                        <th scope="col">Pojemność</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {props.machineProducts.map(machineProduct =>
                        <tr key={machineProduct.MachineProductId}>
                            <td className="align-middle">{machineProduct.MachineFeederNo}</td>
                            <td className="align-middle">{machineProduct.Name}</td>
                            <td className="align-middle">{machineProduct.Price.toFixed(2)}</td>
                            {/* <td className="align-middle">{machineProduct.DiscountedPrice.toFixed(2)}</td> */}
                            <td className="align-middle">{machineProduct.Quantity}</td>
                            <td className="align-middle">{machineProduct.MaxItemCount}</td>
                            <td className="align-middle">
                                <Link to={"/machine-product/" + machineProduct.MachineProductId} className="btn btn-secondary btn-sm btn-block"><i className="fas fa-pencil-alt"></i></Link>
                                <button onClick={() => props.onDeleteMachineProduct(machineProduct.MachineProductId)} className="btn btn-danger btn-sm btn-block"><i className="fa fa-trash"></i></button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
    // props.machineProducts.map(machineProduct => <MachineProduct key={machineProduct.MachineProductId} machineProduct={machineProduct}/>)
}

export default machineProducts;