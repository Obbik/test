import React, { Component, Fragment } from 'react';
import axios from 'axios';

import Product from '../../components/Product/Product';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import Title from '../../components/Title/Title';
import SearchInput from '../SearchInput/SearchInput';
import Loader from '../../components/Loader/Loader';
import Pagination from '../../components/Pagination/Pagination';

class Products extends Component {
    state = {
        products: [],
        error: null,
        tableView: false,
        showModal: false,
        delete: false,
        loader: false,
        page: 1,
        totalItems: 0,
        searchedValue: ''
    }

    componentDidMount() {
        this.getProducts();
    }

    deleteProduct = ean => {
        const confirm = window.confirm('Czy na pewno chcesz usunąć produkt?');

        if(confirm) {
            this.setState({ loader: true });
            axios.delete(this.props.url + 'api/product/' + ean, {
                headers: {
                    Authorization: 'Bearer ' + this.props.token
                }
            })
            .then(res => {
                this.getProducts();
            })
            .catch(err => {
                this.setState({ 
                    error: err,
                    loader: false 
                });
    
                setTimeout(() => {
                    this.setState({ error: null })
                }, 5000);
            });
        }
    }

    getProducts = (page = 1, search = this.state.searchedValue) => {
        this.setState({ loader: true });
        let url = this.props.sharedProducts ? this.props.url + 'api/products-shared?search=' + search + '&page=' + page : this.props.url + 'api/products';

        axios.get(url, {
            headers: {
                Authorization: 'Bearer ' + this.props.token
            }
        })
        .then(res => {
            this.setState({ 
                products: res.data.products,
                totalItems: res.data.totalItems,
                initialProducts: res.data.products,
                loader: false
            })
        })
        .catch(err => {
            this.setState({ 
                error: err,
                loader: false 
            });

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
        this.setState({ searchedValue: value });
        console.log('value', value);
        this.getProducts(1, value);

        // const suggestions = this.getSuggestions(value);
        // let filteredProducts = this.state.initialProducts;

        // if(value !== '') {
        //     filteredProducts = suggestions;
        // }

        // this.setState({
        //     products: filteredProducts
        // });
    }

    getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        
        return inputLength === 0 ? [] : this.state.initialProducts.filter(product =>
            product.Name.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

    // Pagination
    switchPage = (pageNo) => {
        this.setState({ page: pageNo });
        this.getProducts(pageNo);
    }

    render() {
        console.log(this.state);
        const pagination = this.props.sharedProducts ? 
            <Pagination 
                onSwitchPage={this.switchPage}
                page={this.state.page}
                totalItems={this.state.totalItems}  
            /> : null

        return(
            <Fragment>
                <Loader active={this.state.loader}/>
                <ErrorHandler
                    error={this.state.error} 
                    onHandle={this.errorHandler} 
                />
                <Title
                    title="Produkty"
                    buttonName="Dodaj produkt"
                    buttonLink="/product/add"
                />
                <SearchInput 
                    tableView={this.state.tableView}
                    onSearch={this.search}
                    onToggleView={this.toggleView}
                />
                {pagination}
                <Product
                    url={this.props.url}
                    products={this.state.products}
                    onDeleteProduct={this.deleteProduct}
                    onShowModal={this.showModal}
                    tableView={this.state.tableView}
                    sharedProducts={this.props.sharedProducts}
                />
            </Fragment>
        )
    }
}

export default Products;