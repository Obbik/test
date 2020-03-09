import React, { Component, Fragment } from 'react';
import axios from 'axios';

import Product from '../../components/Product/Product';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import Title from '../../components/Title/Title';
import SearchInput from '../SearchInput/SearchInput';

class Products extends Component {
    state = {
        products: [],
        error: null,
        tableView: false
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
            this.setState({ 
                products: res.data,
                initialProducts: res.data
            })
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

    // Method for changing the view (table or cards)
    toggleView = () => {
        this.setState({
            tableView: !this.state.tableView
        })
    }

    // Search bar
    search = value => {
        const suggestions = this.getSuggestions(value);
        let filteredProducts = this.state.initialProducts;

        if(value !== '') {
            filteredProducts = suggestions;
        }

        this.setState({
            products: filteredProducts
        });
    }

    getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        
        return inputLength === 0 ? [] : this.state.initialProducts.filter(product =>
            product.Name.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

    render() {
        return(
            <Fragment>
                <ErrorHandler
                    error={this.state.error} 
                    onHandle={this.errorHandler} 
                />
                <Title
                    title="Produkty"
                    buttonName="Dodaj produkt"
                />
                <SearchInput 
                    tableView={this.state.tableView}
                    onSearch={this.search}
                    onToggleView={this.toggleView}
                />
                <Product
                    url={this.props.url}
                    products={this.state.products}
                    onDeleteProduct={this.deleteProduct}
                    tableView={this.state.tableView}
                />
            </Fragment>
        )
    }
}

export default Products;