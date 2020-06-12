import React, { Component, Fragment } from 'react';
import { NotificationManager } from 'react-notifications';
// import { Link } from 'react-router-dom';
import axios from 'axios';

// import ProductNav from '../../components/Product/ProductNav';
import Loader from '../../components/Loader/Loader';

class ProductCategory extends Component {
    state = {
        categories: [],
        productCategories: [],
        inputs: null,
        initialInputs: null,
        error: null,
        loader: false
    }

    componentDidMount() {
        this.getCategories();
    }

    getCategories = () => {
        // const id = this.props.match.params.id;
        const id = this.props.ean;

        
        if(id) {
            this.setState({ loader: true });
            let inputs;
            let checked = false;

            axios.get(this.props.url + 'api/categories', {
                headers: {
                    Authorization: 'Bearer ' + this.props.token
                }
            })
            .then(res => {
                const categories = res.data;
                categories.forEach(category => {
                    inputs = {
                        ...inputs,
                        ['category' + category.CategoryId]: {
                            value: category.CategoryId,
                            checked: checked
                        }
                    }
                });
    
                this.setState({ 
                    categories: categories,
                    inputs: inputs,
                    initialInputs: { ...inputs }
                });
    
                return axios.get(this.props.url + 'api/category-product/' + id, {
                    headers: {
                        Authorization: 'Bearer ' + this.props.token
                    }
                })
            })
            .then(res => {
                const categories = this.state.categories;
                const productCategories = res.data;
    
                categories.forEach(category => {
                    const checked = productCategories.some(productCategory => {
                        let _checked = false;
                        if(category.CategoryId === productCategory.CategoryId) {
                            _checked = true;
                        }
                        return _checked;
                    })
    
                    inputs = {
                        ...inputs,
                        ['category' + category.CategoryId]: {
                            value: category.CategoryId,
                            checked: checked
                        }
                    }
                });
    
                this.setState({ 
                    inputs: inputs,
                    initialInputs: { ...inputs },
                    productCategories: productCategories,
                    loader: false
                })
            })
            .catch(err => {
                this.setState({ loader: false });
                // NotificationManager.error(err.response.data.message, null, 4000);
            })
        }
    }

    handleChange = e => {
        const inputName = e.target.name;
        const inputValue = e.target.value;
        const checked = e.target.checked;

        this.setState(prevState => ({
			...prevState,
			inputs: {
				...prevState.inputs,
                [inputName]: {
                    value: inputValue,
                    checked
                }
			},
        }));
    }

    handleSubmit = e => {
        e.preventDefault();
        // const productId = this.props.match.params.id;
        const productId = this.props.ean;

        const categories = this.state.categories;
        const inputArray = categories.map(category => this.state.inputs['category' + category.CategoryId]);
        const initialInputArray = categories.map(category => this.state.initialInputs['category' + category.CategoryId]);  

        initialInputArray.forEach((input, index) => {
            // Check if inputs changed on submit
            if(input.checked !== inputArray[index].checked) {
                const categoryId = inputArray[index].value;
                const productCategory = {
                    CategoryId: categoryId,
                    Ean: productId
                };

                // Add category product
                if(!input.checked) {
                    this.addProductCategory(productCategory);
                } 
                // Delete category product
                else {
                    const id = this.getProductCategoryId(productCategory);
                    this.deleteProductCategory(id);
                }
            }
        });

        this.getCategories();
        this.props.onHideProductCategoryModal();
    }

    errorHandler = () => {
        this.setState({ error: null });
    }

    addProductCategory = productCategory => {
        axios.post(this.props.url + 'api/category-product', productCategory, {
            headers: {
                Authorization: 'Bearer ' + this.props.token
            }
        })
        .then(res => {
            NotificationManager.success(res.data.message, null, 4000);
        })
        .catch(err => {
            NotificationManager.error(err.response.data.message, null, 4000);
        });
    }

    deleteProductCategory = id => {
        axios.delete(this.props.url + 'api/category-product/' + id, {
            headers: {
                Authorization: 'Bearer ' + this.props.token
            }
        })
        .then(res => {
            NotificationManager.success(res.data.message, null, 4000);
        })
        .catch(err => {
            NotificationManager.error(err.response.data.message, null, 4000);
        });
    }

    getProductCategoryId = productCategory => {
        const category = this.state.productCategories.filter(category => category.CategoryId == productCategory.CategoryId && category.EAN === productCategory.Ean);
        return category[0].CategoryProductId;
    }

    render() {
        const modalClass = this.props.showProductCategoryModal ? "modal fade show d-block" : "modal fade";
        return(
            <Fragment>
                <Loader active={this.state.loader}/>
                <div className={modalClass} id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h6 className="modal-title" id="exampleModalLabel">Kategorie produktu</h6>
                                <button onClick={this.props.onHideProductCategoryModal} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        <div className="modal-body">
                            <form id="category-form" onSubmit={this.handleSubmit}>
                                {this.state.categories.map(category => 
                                    <div key={category.CategoryId} className="form-group form-check">
                                        <input type="checkbox" name={"category" + category.CategoryId} checked={this.state.inputs["category" + category.CategoryId].checked} value={category.CategoryId} onChange={this.handleChange} className="form-check-input"/>
                                        <label className="form-check-label">{category.Name}</label>
                                    </div>
                                )}
                                {/* <input type="submit" className="btn btn-success" value="Zapisz"/> */}
                            </form>
                        </div>
                            <div className="modal-footer">
                                <input type="submit" className="btn btn-success" value="Zapisz" form="category-form"/>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default ProductCategory;