import React, { Component } from 'react';

import './FullProduct.css';

import axios from 'axios';

class FullProduct extends Component {
    state = {
        product: {
            ean: '',
            name: '',
            price: '',
            discountedPrice: '',
            description: '',
            defaultCategoryId: ''
        },
        addProduct: false
    }

    componentDidMount() {
        const id = this.props.match.params.id;

        if(id !== 'add') {
            axios.get(this.props.url + 'api/product/' + id, {
                headers: {
                    Authorization: 'Bearer ' + this.props.token
                }
            })
            .then(res => {
                if(res.status !== 200) {
                    throw new Error('Failed to fetch status');
                }
                return res.data;
            })
            .then(res => {
                this.setState({
                    product: {
                        ean: res.Ean,
                        name: res.Name,
                        price: res.Price,
                        discountedPrice: res.DiscountedPrice || '',
                        description: res.Description,
                        defaultCategoryId: res.DefaultCategoryId
                    },
                    addProduct: false
                });
            })
            .catch(err => {
                console.log(err.response.data);
            });
        } else {
            this.setState({
                addProduct: true
            })
        }
    }

    handleChange = (e) => {
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

    handleSubmit = (e) => {
        e.preventDefault();

        const product = {
            Ean: this.state.product.ean,
            Image: this.state.product.image,
            Name: this.state.product.name,
            Price: this.state.product.price,
            DiscountedPrice: this.state.product.discountedPrice === '' ? null : this.state.product.discountedPrice,
            Description: this.state.product.description,
            DefaultCategoryId: this.state.product.defaultCategoryId
        };

        if(this.state.addProduct) {
            this.addProduct(product);
        } else {
            this.editProduct(product);
        }
    }

    addProduct = (product) => {
        const formData = new FormData();
        formData.append('Ean', product.Ean);
        formData.append('Name', product.Name);
        formData.append('Price', product.Price);
        formData.append('DiscountedPrice', product.DiscountedPrice);
        formData.append('Description', product.Description);
        formData.append('Image', product.Image);
        formData.append('DefaultCategoryId', product.DefaultCategoryId);

        axios.post(this.props.url + 'api/product/', formData, {
            headers: {
                Authorization: 'Bearer ' + this.props.token
            }
        })
        .then(res => {
            this.props.history.push('/');
            console.log(res.data);
        })
        .catch(err => {
            console.log('err.response.data', err.response.data);
        });
    }

    editProduct = (product) => {
        const id = this.props.match.params.id;

        const formData = new FormData();
        formData.append('Ean', product.Ean);
        formData.append('Name', product.Name);
        formData.append('Price', product.Price);
        formData.append('DiscountedPrice', product.DiscountedPrice);
        formData.append('Description', product.Description);
        formData.append('Image', product.Image);
        formData.append('DefaultCategoryId', product.DefaultCategoryId);
        
        axios.put(this.props.url + 'api/product/' + id, formData, {
            headers: {
                Authorization: 'Bearer ' + this.props.token
            }
        })
        .then(res => {
            this.props.history.push('/');
            console.log(res.data);
        })
        .catch(err => {
            console.log('err.response', err.response);
        });
    }
     
    render() {
        return(
            <div className="card card-body bg-light mt-5">
                <div className="text-center">
                    <h2>{this.state.addProduct ? 'Dodaj produkt' : this.state.product.name}</h2>
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
                        <label>Cena</label>
                        <input type="number" name="price" className="form-control form-control-lg" value={this.state.product.price} onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <label>Cena promocyjna</label>
                        <input type="number" name="discountedPrice" className="form-control form-control-lg" value={this.state.product.discountedPrice} onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <label>Opis</label>
                        <textarea type="text" name="description" className="form-control" rows="4" value={this.state.product.description} onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <label>Domyślna kategoria</label>
                        <input type="number" name="defaultCategoryId" className="form-control form-control-lg" value={this.state.product.defaultCategoryId} onChange={this.handleChange}/>
                    </div>
                    <input type="submit" className="btn btn-success" value="Zapisz"/>
                </form>
            </div>
        );
    }
}

export default FullProduct;