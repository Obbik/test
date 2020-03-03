import React, { Component } from 'react';
import axios from 'axios';

class FullProduct extends Component {
    state = {
        product: {}
    }

    componentDidMount() {
        const id = this.props.match.params.id;

        if(id !== 'add') {
            axios.get('http://localhost:3000/api/product/' + id, {
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
                this.setState({product: res});
            })
            .catch(err => {
                console.log(err.response.data);
            });
        } else {
            this.setState({
                product: {}
            })
        }
    }
    
    render() {
        console.log('product', this.state.product);
        return(
            <div className="card card-body bg-light mt-5">
                <div className="text-center">
                    <h2>Edytuj produkt</h2>
                </div>
                <form>
                    <div className="form-group">
                        <label>Ean</label>
                        <input type="text" name="ean" className="form-control form-control-lg" value={this.state.product.Ean} />
                    </div>
                    <div className="form-group">
                        <label>Nazwa produktu</label>
                        <input type="text" name="name" className="form-control form-control-lg" value={this.state.product.Name} />
                    </div>
                    <div className="form-group">
                        <label>Cena</label>
                        <input type="number" name="price" className="form-control form-control-lg" value={this.state.product.Price} />
                    </div>
                    <div className="form-group">
                        <label>Cena promocyjna</label>
                        <input type="number" name="discountedPrice" className="form-control form-control-lg" value={this.state.product.DiscountedPrice} />
                    </div>
                    <div className="form-group">
                        <label>Opis</label>
                        <textarea className="form-control" rows="4">{this.state.product.Description}</textarea>
                    </div>
                    <div className="form-group">
                        <label>Domyślna kategoria</label>
                        <input type="text" name="defaultCategory" className="form-control form-control-lg" value={this.state.product.DefaultCategoryId} />
                    </div>
                    <input type="submit" className="btn btn-success" value="Zapisz" />
                </form>
            </div>
        );
    }
}

export default FullProduct;