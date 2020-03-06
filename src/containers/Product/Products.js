import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Product from '../../components/Product/Product';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';

class Products extends Component {
    state = {
        products: [],
        error: null
    }

    componentDidMount() {
        this.getProducts();
    }

    deleteProduct = ean => {
        axios.delete(this.props.url + 'api/product/' + ean, {
            headers: {
                Authorization: 'Bearer ' + this.props.token
            }
        })
        .then(res => {
            console.log(res.data);
            this.getProducts();
        })
        .catch(err => {
            this.setState({ error: err });

            setTimeout(() => {
                this.setState({ error: null })
            }, 5000);
        });
    }

    getProducts = () => {
        axios.get(this.props.url + 'api/products', {
            headers: {
                Authorization: 'Bearer ' + this.props.token
            }
        })
        .then(res => {
            this.setState({ products: res.data })
        })
        .catch(err => {
            this.setState({ error: err });

            setTimeout(() => {
                this.setState({ error: null })
            }, 5000);
        });
    }

    errorHandler = () => {
        this.setState({ error: null });
    }

    render() {
        return(
            <Fragment>
                <ErrorHandler
                    error={this.state.error} 
                    onHandle={this.errorHandler} 
                />
                <div className="row mb-3">
                    <div className="col-sm">
                        <h1>Produkty</h1>
                    </div>
                    <div className="col-sm">
                        <Link to="/product/add" className="btn btn-success float-right">
                            <i className="fa fa-plus"></i> &nbsp; Dodaj produkt
                        </Link>
                    </div>
                </div>
                <div className="row">
                    {this.state.products.map(product => 
                        <Product 
                            key={product.Ean}
                            url={this.props.url}
                            product={product}
                            onDeleteProduct = {() => this.deleteProduct(product.Ean)}
                        />
                    )}
                </div>
            </Fragment>
        )
    }
}

export default Products;