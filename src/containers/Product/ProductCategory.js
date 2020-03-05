import React, {Component, Fragment} from 'react';

import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import ProductNav from '../../components/Product/ProductNav';


class ProductCategory extends Component {
    state = {
        error: null
    }

    errorHandler = () => {
        this.setState({ error: null });
    }
    render() {
        const id = this.props.match.params.id;
        return(
            <Fragment>
                <ErrorHandler 
                    error={this.state.error} 
                    onHandle={this.errorHandler} 
                />
                <ProductNav 
                    id={id} 
                    active={2} 
                />
                <div className="card card-body bg-light mt-5">
                    <div className="text-center">
                        <h2>Kategorie produktu</h2>
                    </div>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group form-check">
                            <input type="checkbox" className="form-check-input"/>
                            <label className="form-check-label">Kategoria 1</label>
                        </div>
                        <div className="form-group form-check">
                            <input type="checkbox" className="form-check-input"/>
                            <label className="form-check-label">Kategoria 2</label>
                        </div>
                        <div className="form-group form-check">
                            <input type="checkbox" className="form-check-input"/>
                            <label className="form-check-label">Kategoria 3</label>
                        </div>
                        <div className="form-group form-check">
                            <input type="checkbox" className="form-check-input"/>
                            <label className="form-check-label">Kategoria 4</label>
                        </div>
                        <input type="submit" className="btn btn-success" value="Zapisz"/>
                    </form>
                </div>
            </Fragment>
        );
    }
}

export default ProductCategory;