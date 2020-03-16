import React, {Component, Fragment} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import ProductNav from '../../components/Product/ProductNav';
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
        this.setState({ loader: true });
        const id = this.props.match.params.id;
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
            this.setState({ 
                error: err,
                loader: false 
            });

            setTimeout(() => {
                this.setState({ error: null })
            }, 5000);
        })
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
        const productId = this.props.match.params.id;
        const categories = this.state.categories;
        const inputArray = categories.map(category => this.state.inputs['category' + category.CategoryId]);
        const initialInputArray = categories.map(category => this.state.initialInputs['category' + category.CategoryId]);  

        initialInputArray.forEach((input, index) => {
            // Check if inputs changed on submit
            if(input.checked !== inputArray[index].checked) {
                const categoryId = inputArray[index].value
                const productCategory = {
                    CategoryId: categoryId,
                    Ean: productId
                }

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
            console.log(res.data);
        })
        .catch(err => {
            this.setState({ error: err });

            setTimeout(() => {
                this.setState({ error: null })
            }, 5000);
        });
    }

    deleteProductCategory = id => {
        axios.delete(this.props.url + 'api/category-product/' + id, {
            headers: {
                Authorization: 'Bearer ' + this.props.token
            }
        })
        .then(res => {
            console.log(res.data);
        })
        .catch(err => {
            this.setState({ error: err });

            setTimeout(() => {
                this.setState({ error: null })
            }, 5000);
        });
    }

    getProductCategoryId = productCategory => {
        const category = this.state.productCategories.filter(category => category.CategoryId === productCategory.CategoryId && category.EAN === productCategory.Ean);
        return category[0].CategoryProductId;
    }

    render() {
        const id = this.props.match.params.id;
        return(
            <Fragment>
                <Loader active={this.state.loader}/>
                <ErrorHandler 
                    error={this.state.error} 
                    onHandle={this.errorHandler} 
                />
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
                            active={2}
                        />
                    </div>
                    <div className="card-body">
                        <div className="text-center">
                            <h2>Kategorie produktu</h2>
                        </div>
                        <form onSubmit={this.handleSubmit}>
                            {this.state.categories.map(category => 
                                <div key={category.CategoryId} className="form-group form-check">
                                    <input type="checkbox" name={"category" + category.CategoryId} checked={this.state.inputs["category" + category.CategoryId].checked} value={category.CategoryId} onChange={this.handleChange} className="form-check-input"/>
                                    <label className="form-check-label">{category.Name}</label>
                                </div>
                            )}
                            <input type="submit" className="btn btn-success" value="Zapisz"/>
                        </form>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default ProductCategory;