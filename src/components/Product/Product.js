import React from 'react';
import { Link } from 'react-router-dom';

const sampleProduct = require('../../assets/images/sample-product.svg');

const product = (props) => {
    const view = props.tableView ? 
        <div className="col">
            <table className="table table-striped">
                <thead>
                    <tr>
                    <th scope="col">Ean</th>
                    <th scope="col">Nazwa</th>
                    <th scope="col">Zdjęcie</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    {props.products.map(product => 
                        <tr key={product.EAN}>
                            <th className="align-middle">{product.EAN}</th>
                            <td className="align-middle">{product.Name}</td>
                            <td className="align-middle">
                                <img src={props.url + product.Image + '?n=' + new Date().getTime()} onError={(e)=>{e.preventDefault(); e.target.src = sampleProduct}} alt={product.Name} width="64" height="64"/>
                            </td>
                            <td className="align-middle">
                                <Link to={"/product/" + product.EAN} className={`btn btn-secondary btn-block ${product.IsShared ? 'disabled' : ''}`}><i className="fas fa-pencil-alt"></i></Link>
                                <button onClick={() => props.onDeleteProduct(product.EAN)} className={`btn btn-danger btn-block ${product.IsShared ? 'disabled' : ''}`}><i className="fa fa-trash"></i></button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div> : 
        props.products.map(product =>
            <div key={product.EAN} className="col-md-3 col-sm-6 mb-3">
                <div className="card">
                    <h5 className="card-header text-truncate">{product.Name}</h5>
                    <img src={props.url + product.Image + '?n=' + new Date().getTime()} onError={(e)=>{e.preventDefault(); e.target.src = sampleProduct}} className="card-img-top mt-2" alt={product.Name} />
                    <div className="card-body">
                        <p className="text-center text-truncate">{product.EAN}</p>
                        <div className="row">
                            <div className="col-md-4 mt-1">
                                <Link to={"/product/" + product.EAN} className={`btn btn-secondary btn-block ${product.IsShared ? 'disabled' : ''}`}><i className="fas fa-pencil-alt"></i></Link>
                            </div>
                            <div className="col-md-4 mt-1">
                                <button /* onClick={() => props.onDeleteProduct(product.EAN)} */ className="btn btn-secondary btn-block"><i className="fas fa-th-large"></i></button>
                            </div>
                            <div className="col-md-4 mt-1">
                                <button onClick={() => props.onDeleteProduct(product.EAN)} className={`btn btn-danger btn-block ${product.IsShared ? 'disabled' : ''}`}><i className="fa fa-trash"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        )

        return <div className="row">{view}</div>;

}

export default product;
