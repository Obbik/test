import React from 'react';

const machineProductsBoost = props => {
    return <div className="row">
        <div className="col">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Sprężyna</th>
                        <th scope="col">Nazwa</th>
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
                            <td className="align-middle">{machineProduct.Quantity}</td>
                            <td className="align-middle">{machineProduct.MaxItemCount}</td>
                            <td className="align-middle">
                                <button onClick={() => props.onFillSingleFeeder(machineProduct)} className="btn btn-success btn-lg btn-block"><i className="fas fa-arrow-up"></i></button>
                                <button onClick={() => props.onEmptySingleFeeder(machineProduct)} className="btn btn-danger btn-lg btn-block"><i className="fa fa-arrow-down"></i></button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
    };

export default machineProductsBoost;