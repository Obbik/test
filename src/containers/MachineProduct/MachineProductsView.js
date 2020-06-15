import React, { Component, Fragment } from 'react';
import { NotificationManager } from 'react-notifications';

import Loader from '../../components/Loader/Loader';
import Title from '../../components/Title/Title';
import SearchInput from '../SearchInput/SearchInput';
import MachineProducts from './MachineProducts';

import axios from 'axios';
import { api } from '../../helpers/helpers';

class MachineProductsView extends Component {
    state = {
        title: "Konfiguracja maszyny",
        machineProducts: []
    };

    componentDidMount() {
        this.getMachineProducts();
    }

    getMachineProducts = () => {
        const url = this.props.url + 'api/machine-products';
        const headers = {
            Authorization: 'Bearer ' + this.props.token
        };

        this.setState({ loader: true });
        api(url, 'GET', headers, null, res => {
            if (res.status < 400) {
                this.setState({
                    machineProducts: res.data,
                    initialMachineProducts: res.data,
                    
                })
            } else {
                NotificationManager.error(res.data.message, null, 4000);
            }
            this.setState({ loader: false });
        });
    }

    deleteMachineProduct = id => {
        const confirm = window.confirm('Czy na pewno chcesz usunąć sprężynę?');

        if(confirm) {
            this.setState({ loader: true });

            const url = `${this.props.url}api/machine-product/${id}`;
            const headers = {
                Authorization: 'Bearer ' + this.props.token
            };

            api(url, 'DELETE', headers, null, res => {
                if (res.status < 400) {
                    NotificationManager.success(res.data.message, null, 4000);
                    this.getMachineProducts();
                } else {
                    NotificationManager.error(res.data.message, null, 4000);
                }
                this.setState({ loader: false });
            });
        }
    } 

    // Search bar
    search = value => {
        const suggestions = this.getSuggestions(value);
        let filtered = this.state.initialMachineProducts;

        if(value !== '') {
            filtered = suggestions;
        }

        this.setState({
            machineProducts: filtered
        });
    }

    getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        
        return inputLength === 0 ? [] : this.state.initialMachineProducts.filter(machineProduct =>
            machineProduct.Name.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

    fillAllFeeders = () => {
        this.setState({ loader: true });
        const { machineProducts } = this.state;
        let filledMachineProducts = [...machineProducts];

        filledMachineProducts.forEach(product => {
            if(product.Quantity !== product.MaxItemCount) {
                product.Quantity = product.MaxItemCount;

                axios.put(this.props.url + 'api/machine-product/' + product.MachineProductId, {
                    Ean: product.EAN,
                    MachineFeederNo: product.MachineFeederNo,
                    Price: product.Price,
                    DiscountedPrice: product.DiscountedPrice,
                    Quantity: product.Quantity,
                    MaxItemCount: product.MaxItemCount
                }, {
                    headers: {
                        Authorization: 'Bearer ' + this.props.token
                    }
                })
                .then(res => {
                    this.setState({ loader: false });
                    NotificationManager.success(res.data.message, null, 4000);
                    this.props.history.push('/machine-products');
                })
                .catch(err => {
                    this.setState({ loader: false });
                    NotificationManager.error(err.response.data.message, null, 4000);
                });
            }
        });

        console.log(filledMachineProducts);
    }

    render() {
        const { machineProducts } = this.state;
        
        return (
            <Fragment>
                <Loader active={this.state.loader} />
                <Title
                    title={this.state.title}
                    buttonName="Dodaj sprężynę"
                    buttonLink="/machine-product/add"
                />
                <SearchInput
                    onSearch={this.search}
                />
                <div className="row">
                    <div className="col">
                    <button onClick={this.fillAllFeeders} className="btn btn-success btn-sm">
                        <i className="fas fa-arrow-up"></i>
                    </button>
                    </div>
                </div>
                <MachineProducts
                    machineProducts={machineProducts}
                    onDeleteMachineProduct = {this.deleteMachineProduct}
                />
            </Fragment>
        );
    }
}

export default MachineProductsView;