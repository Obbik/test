import React, { Component, Fragment } from 'react';
import axios from 'axios';

import Product from '../../components/Product/Product';

class Products extends Component {
    state = {
        products: []
    }

    componentDidMount() {
        console.log('componentDidMount');
        axios.get(this.props.url + 'api/products', {
            headers: {
                Authorization: 'Bearer ' + this.props.token
            }
        })
        .then(res => {
            this.setState({ products: res.data })
        })
        .catch(err => {
            console.log('err.response.data', err.response.data);
        });
    }

    render() {
        return(
            <Fragment>
                <div className="row mb-3">
                    <div className="col-sm">
                        <h1>Produkty</h1>
                    </div>
                    <div className="col-sm">
                        <button className="btn btn-success float-right">
                            <i className="fa fa-plus"></i> &nbsp; Dodaj produkt
                        </button>
                    </div>
                </div>
                <div className="row">
                    {this.state.products.map(product => <Product key={product.Ean} product={product}/>)}
                </div>
            </Fragment>
        )
    }
}

export default Products;