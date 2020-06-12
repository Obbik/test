import React, { Component, Fragment } from 'react';
import { NotificationManager } from 'react-notifications';

import Loader from '../../components/Loader/Loader';
import Title from '../../components/Title/Title';
import SearchInput from '../SearchInput/SearchInput';
import MachineProducts from './MachineProducts';

import { api } from '../../helpers/helpers';

class MachineProductsView extends Component {
    state = {
        title: "Konfiguracja maszyny",
        machineProducts: []
    };

    componentDidMount() {
        const url = this.props.url + 'api/machine-products';
        const headers = {
            Authorization: 'Bearer ' + this.props.token
        };

        api(url, 'GET', headers, null, res => {
            if (res.status < 400) {
                this.setState({
                    machineProducts: res.data,
                    initialMachineProducts: res.data,
                    
                })
            } else {
                NotificationManager.error(res.data.message, null, 4000);
            }
        })
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
                <MachineProducts
                    machineProducts={machineProducts}
                />
            </Fragment>
        );
    }
}

export default MachineProductsView;