import React, { Component, Fragment } from 'react';
import { NotificationManager } from 'react-notifications';
import axios from 'axios';

import Product from '../../components/Product/Product';
import Title from '../../components/Title/Title';
import SearchInput from '../SearchInput/SearchInput';
import Loader from '../../components/Loader/Loader';
import Pagination from '../../components/Pagination/Pagination';

class Products extends Component {
    state = {
        products: [],
        tableView: false,
        loader: false,
        page: 1,
        totalItems: 0,
        searchedValue: '',
        shared: ''
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
                this.setState({ loader: false });
                NotificationManager.success(res.data.message, null, 4000);
                this.getProducts();
            })
            .catch(err => {
                this.setState({ loader: false });
                NotificationManager.error(err.response.data.message, null, 4000);
            });
        }
    }

    getProducts = (page = 1, search = this.state.searchedValue, shared = this.state.shared) => {
        this.setState({ loader: true });
        const categoryId = this.props.match.params.categoryId || '';
        const url = this.props.url + 'api/products?search=' + search + '&shared=' + shared + '&categoryId=' + categoryId + '&page=' + page;

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
            this.setState({ loader: false });
            NotificationManager.error(err.response.data.message, null, 4000);
        });
    }

    // Method for changing the view (table or cards)
    toggleView = () => {
        this.setState({
            tableView: !this.state.tableView
        })
    }

    // Search bar
    search = value => {
        this.setState({ 
            searchedValue: value,
            page: 1 
        });

        this.getProducts(1, value);
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

    // Handle shared input
    handleSharedInputChange = (e) => {
        const checked = e.target.checked;
        const shared = checked ? '1' : '';
        this.setState({ shared: shared });
        this.getProducts(1, this.state.searchedValue, shared);
    }

    render() {
        return(
            <Fragment>
                <Loader active={this.state.loader}/>
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
                <div className="row">
                    <div className="col">
                        <div className="custom-control custom-checkbox float-right">
                            <input onChange={this.handleSharedInputChange} type="checkbox" className="custom-control-input" id="shared-checkbox"/>
                            <label className="custom-control-label" htmlFor="shared-checkbox">Współdzielone</label>
                        </div>
                    </div>
                </div>
                <Pagination 
                    onSwitchPage={this.switchPage}
                    page={this.state.page}
                    totalItems={this.state.totalItems}  
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