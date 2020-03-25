import React, { Component, Fragment } from 'react';
import { NotificationManager } from 'react-notifications';
import axios from 'axios';
import { Link } from 'react-router-dom';

import ProductNav from '../../components/Product/ProductNav';
import Loader from '../../components/Loader/Loader';

class FullProductShared extends Component {
    state = {
        product: {
            ean: '',
            name: '',
            description: '',
            image: ''
        },
        loader: false
    }

    componentDidMount() {
        const id = this.props.match.params.id;

        this.setState({ loader: true });
        axios.get(this.props.url + 'api/product-shared/' + id, {
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
                loader: false,
                readonly: true
            });
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
                        <Link to="/products/shared" className="btn btn-secondary">
                            <i className="fas fa-arrow-left"></i>&nbsp; Wróć
                        </Link>
                    </div>
                </div>
                <div className="card mt-4">
                    <div className="card-header">
                        <ProductNav 
                            id={id} 
                            active={1}
                            addProduct={false}
                            sharedProducts={true}
                        />
                    </div>
                    <div className="card-body">
                        <div className="text-center">
                            <h2>{this.state.addProduct ? 'Dodaj produkt' : this.state.product.name}</h2>
                            {this.state.product.initialImage ? <img src={this.props.url + this.state.product.initialImage + '?n=' + new Date().getTime()} onError={(e)=>{e.target.src=this.props.url + 'images/console/sample-product.svg'}} alt={this.state.product.name} width="256" height="256"/> : null}
                        </div>
                        <div className="row justify-content-md-center">
                            <div className="col col-md-10">
                                <h6 className="mt-2">{this.state.product.ean}</h6>
                                {/* <p>{this.state.product.description}</p> */}
                                <p dangerouslySetInnerHTML={{ __html: this.state.product.description }}/>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default FullProductShared;