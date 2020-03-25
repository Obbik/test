import React, { Component, Fragment } from 'react';
import { NotificationManager } from 'react-notifications';
import axios from 'axios';
import { Link } from 'react-router-dom';

import ProductNav from '../../components/Product/ProductNav';
import Loader from '../../components/Loader/Loader';

class FullProduct extends Component {
    state = {
        product: {
            ean: '',
            name: '',
            description: '',
            image: '',
            initialImage: ''
        },
        addProduct: false,
        error: null,
        loader: false
    }

    componentDidMount() {
        const id = this.props.match.params.id;

        if(id !== 'add') {
            this.setState({ loader: true });
            axios.get(this.props.url + 'api/product/' + id, {
                headers: {
                    Authorization: 'Bearer ' + this.props.token
                }
            })
            .then(res => {
                this.setState({ loader: false });
                if(res.status !== 200) {
                    throw new Error('Failed to fetch status.');
                }
                return res.data;
            })
            .then(res => {
                this.setState({
                    product: {
                        ean: res.EAN,
                        name: res.Name,
                        description: res.Description,
                        image: res.Image,
                        initialImage: res.Image
                    },
                    addProduct: false,
                    loader: false
                });
            })
            .catch(err => {
                this.setState({ loader: false });
                NotificationManager.error(err.response.data.message, null, 4000);
            });
        } else {
            this.setState({
                addProduct: true
            })
        }
    }

    handleChange = e => {
        e.preventDefault();
		const inputName = e.target.name;
        let inputValue = e.target.value;

        if(inputName === 'image') {
            inputValue = e.target.files[0];
        }
        
        this.setState(prevState => ({
			...prevState,
			product: {
				...prevState.product,
				[inputName]: inputValue
			},
        }));
    }

    handleSubmit = e => {
        e.preventDefault();

        const product = {
            Ean: this.state.product.ean,
            Image: this.state.product.image,
            Name: this.state.product.name,
            Description: this.state.product.description
        };

        if(this.state.addProduct) {
            this.addProduct(product);
        } else {
            this.editProduct(product);
        }
    }

    addProduct = product => {
        this.setState({ loader: true });
        const formData = new FormData();
        formData.append('Ean', product.Ean);
        formData.append('Name', product.Name);
        formData.append('Description', product.Description);
        formData.append('Image', product.Image);

        axios.post(this.props.url + 'api/product/', formData, {
            headers: {
                Authorization: 'Bearer ' + this.props.token
            }
        })
        .then(res => {
            this.setState({ loader: false });
            NotificationManager.success(res.data.message, null, 4000);
            this.props.history.push('/');
        })
        .catch(err => {
            this.setState({ loader: false });
            NotificationManager.error(err.response.data.message, null, 4000);
        });
    }

    editProduct = product => {
        this.setState({ loader: true });
        const id = this.props.match.params.id;

        const formData = new FormData();
        formData.append('Ean', product.Ean);
        formData.append('Name', product.Name);
        formData.append('Description', product.Description);
        formData.append('Image', product.Image);
        
        axios.put(this.props.url + 'api/product/' + id, formData, {
            headers: {
                Authorization: 'Bearer ' + this.props.token
            }
        })
        .then(res => {
            this.setState({ loader: false });
            NotificationManager.success(res.data.message, null, 4000);
            this.props.history.push('/');
        })
        .catch(err => {
            this.setState({ loader: false });
            NotificationManager.error(err.response.data.message, null, 4000);
        });
    }
     
    render() {
        const id = this.props.match.params.id;
        return(
            <Fragment>
                <Loader active={this.state.loader}/>
                <div className="row">
                    <div className="col">
                        <Link to="/" className="btn btn-secondary">
                            <i className="fas fa-arrow-left"></i>&nbsp; Wróć
                        </Link>
                    </div>
                </div>
                <div className="card mt-4">
                    <div className="card-header">
                        <ProductNav 
                            id={id} 
                            active={1}
                            addProduct={this.state.addProduct}
                        />
                    </div>
                    <div className="card-body">
                        <div className="text-center">
                            <h2>{this.state.addProduct ? 'Dodaj produkt' : this.state.product.name}</h2>
                            {this.state.product.initialImage ? <img src={this.props.url + this.state.product.initialImage + '?n=' + new Date().getTime()} onError={(e)=>{e.target.src=this.props.url + 'images/console/sample-product.svg'}} alt={this.state.product.name} width="256" height="256"/> : null}
                        </div>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label>Ean</label>
                                <input type="number" name="ean" className="form-control form-control-lg" value={this.state.product.ean} onChange={this.handleChange} readOnly={!this.state.addProduct}/>
                            </div>
                            <div className="form-group">
                                <label>Zdjęcie</label>
                                <input type="file" name="image" className="form-control form-control-lg" onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Nazwa produktu</label>
                                <input type="text" name="name" className="form-control form-control-lg" value={this.state.product.name} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Opis</label>
                                <textarea type="text" name="description" className="form-control" rows="4" value={this.state.product.description} onChange={this.handleChange}/>
                            </div>
                            <input type="submit" className="btn btn-success" value="Zapisz"/>
                        </form>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default FullProduct;