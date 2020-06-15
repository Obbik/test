import React, { Component, Fragment } from 'react';
import { NotificationManager } from 'react-notifications';
import axios from 'axios';

import Loader from '../../components/Loader/Loader';

class FullMachiineProduct extends Component {
    state = {
        machineProduct: {
            machineFeederNo: '',
            name: '',
            price: '',
            discountedPrice: '',
            quantity: '',
            maxItemCount: ''
        },
        products: null,
        addMachineProduct: false,
        error: null,
        loader: false,
        suggestions: []
    }

    componentDidMount() {
        const id = this.props.match.params.id;

        if (id !== 'add') {
            this.setState({ loader: true });
            axios.get(this.props.url + 'api/machine-product/' + id, {
                headers: {
                    Authorization: 'Bearer ' + this.props.token
                }
            })
                .then(res => {
                    this.setState({ loader: false });
                    if (res.status !== 200) {
                        throw new Error('Failed to fetch status.');
                    }
                    return res.data;
                })
                .then(res => {
                    const discountedPrice = res.DiscountedPrice ? res.DiscountedPrice.toFixed(2) : ''
                    this.setState({
                        machineProduct: {
                            machineFeederNo: res.MachineFeederNo,
                            name: res.Name,
                            price: res.Price.toFixed(2),
                            discountedPrice: discountedPrice,
                            quantity: res.Quantity,
                            maxItemCount: res.MaxItemCount
                        },
                        addMachineProduct: false,
                        loader: false
                    });

                    return axios.get(this.props.url + 'api/all-products', {
                        headers: {
                            Authorization: 'Bearer ' + this.props.token
                        }
                    })
                })
                .then(res => {
                    this.setState({
                        products: res.data
                    });
                })
                .catch(err => {
                    this.setState({ loader: false });
                    NotificationManager.error(err.response.data.message, null, 4000);
                });
        } else {
            axios.get(this.props.url + 'api/all-products', {
                headers: {
                    Authorization: 'Bearer ' + this.props.token
                }
            })
                .then(res => {
                    this.setState({
                        addMachineProduct: true,
                        products: res.data
                    });
                })
                .catch(err => {
                    this.setState({ loader: false });
                    NotificationManager.error(err.response.data.message, null, 4000);
                });
        }
    }

    handleChange = (e) => {
        e.preventDefault();
        const inputName = e.target.name;
        let inputValue = e.target.value;

        if (inputName === 'image') {
            inputValue = e.target.files[0];
        } else if (inputName === 'name') {
            this.handleSuggestionBox(inputValue);
        }

        this.setState(prevState => ({
            ...prevState,
            machineProduct: {
                ...prevState.machineProduct,
                [inputName]: inputValue
            },
        }));
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const ean = this.getEanByName(this.state.machineProduct.name);
        const machineProduct = {
            MachineFeederNo: this.state.machineProduct.machineFeederNo,
            Ean: ean,
            Price: parseFloat(this.state.machineProduct.price),
            DiscountedPrice: parseFloat(this.state.machineProduct.discountedPrice),
            Quantity: parseInt(this.state.machineProduct.quantity),
            MaxItemCount: parseInt(this.state.machineProduct.maxItemCount)
        };

        if (this.state.addMachineProduct) {
            this.addMachineProduct(machineProduct);
        } else {
            this.editMachineProduct(machineProduct);
        }
    }

    changeNameInput = name => {
        this.setState(prevState => ({
            ...prevState,
            machineProduct: {
                ...prevState.machineProduct,
                name: name
            },
            isSuggestionVisible: false
        }));
    }

    addMachineProduct = machineProduct => {
        this.setState({ loader: true });

        axios.post(this.props.url + 'api/machine-product/', machineProduct, {
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

    editMachineProduct = machineProduct => {
        this.setState({ loader: true });
        const id = this.props.match.params.id;

        axios.put(this.props.url + 'api/machine-product/' + id, machineProduct, {
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

    getEanByName = name => {
        const { products } = this.state;
        const product = products.filter(product => product.Name === name);

        return product[0].EAN;
    }

    handleSuggestionBox = inputValue => {
        const suggestions = inputValue.length === 0 ? [] : this.state.products.filter(product =>
            product.Name.toLowerCase().includes(inputValue.trim().toLowerCase())
        );

        const isSuggestionVisible = suggestions.length > 0 ? true : false;

        this.setState({
            suggestions: suggestions,
            isSuggestionVisible: isSuggestionVisible
        });
    }

    render() {
        const { suggestions, isSuggestionVisible } = this.state;
        const suggestionClass = isSuggestionVisible ? "suggestions-container active" : "suggestions-container";

        return (
            <Fragment>
                <Loader active={this.state.loader} />
                <div className="row mb-3">
                    <div className="col">
                        <button onClick={this.props.history.goBack} className="btn btn-secondary">
                            <i className="fas fa-arrow-left"></i>&nbsp; Wróć
                        </button>
                    </div>
                </div>
                <div className="card card-body bg-light mt-3">
                    <div className="text-center">
                        <h2>{this.state.addMachineProduct ? 'Dodaj sprężynę' : 'Edytuj sprężynę'}</h2>
                    </div>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label>Sprężyna</label>
                            <input type="text" name="machineFeederNo" className="form-control form-control-lg" value={this.state.machineProduct.machineFeederNo} onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Nazwa produktu</label>
                            <input type="text" autoComplete="off" name="name" className="form-control form-control-lg" value={this.state.machineProduct.name} onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                            <div className={suggestionClass}>
                                {suggestions.map(suggestion => (
                                    <div
                                        key={suggestion.EAN}
                                        onClick={() => this.changeNameInput(suggestion.Name)}
                                    >
                                        {suggestion.Name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Cena</label>
                            <input type="number" name="price" className="form-control form-control-lg" value={this.state.machineProduct.price} onChange={this.handleChange} min={0} step={0.01} />
                        </div>
                        <div className="form-group">
                            <label>Cena promocyjna</label>
                            <input type="number" name="discountedPrice" className="form-control form-control-lg" value={this.state.machineProduct.discountedPrice} onChange={this.handleChange} min={0} step={0.01} />
                        </div>
                        <div className="form-group">
                            <label>Ilość</label>
                            <input type="number" name="quantity" className="form-control form-control-lg" value={this.state.machineProduct.quantity} onChange={this.handleChange} min={0} max={this.state.machineProduct.maxItemCount} />
                        </div>
                        <div className="form-group">
                            <label>Pojemność</label>
                            <input type="number" name="maxItemCount" className="form-control form-control-lg" value={this.state.machineProduct.maxItemCount} onChange={this.handleChange} min={0} max={40} />
                        </div>
                        <input type="submit" className="btn btn-success" value="Zapisz" />
                    </form>
                </div>
            </Fragment>
        );
    }
}

export default FullMachiineProduct;