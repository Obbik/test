import React from 'react';
import { Link } from 'react-router-dom';

const product = (props) => {
    return (
        <div className="col-md-4 col-sm-6 mb-3">
            <div className="card">
                <img src="https://bulma.io/images/placeholders/256x256.png" className="card-img-top" alt={props.product.Name} />
                <div className="card-body">
                    <h4 className="card-title">{props.product.Name}</h4>
                    <p>{props.product.Ean}</p>
                    <div className="row">
                        <div className="col-md-6 mt-1">
                            <Link to={"/product/" + props.product.Ean} className="btn btn-secondary btn-block"><i className="fas fa-pencil-alt"></i></Link>
                        </div>
                        <div className="col-md-6 mt-1">
                            <button onClick={props.onDeleteProduct} className="btn btn-danger btn-block"><i className="fa fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default product;
