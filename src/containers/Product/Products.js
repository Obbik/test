import React, { Component } from 'react';
import axios from 'axios';

import Product from '../../components/Product/Product';

class Products extends Component {
    state = {
        products: []
    }

    componentDidMount() {
        const token = localStorage.getItem('token');

        axios.get(this.props.url + 'api/products', {
            headers: {
                Authorization: 'Bearer ' + token
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
        console.log(this.props);
        return(
            <div className="row">
                {this.state.products.map(product => <Product key={product.Ean} product={product}/>)}
            </div>
        )
    }
}

export default Products;