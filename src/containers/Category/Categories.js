import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Category from '../../components/Category/Category';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';

class Categories extends Component {
    state = {
        categories: [],
        error: null
    }

    componentDidMount() {
        this.getCategories();
    }

    deleteCategory = id => {
        axios.delete(this.props.url + 'api/category/' + id, {
            headers: {
                Authorization: 'Bearer ' + this.props.token
            }
        })
        .then(res => {
            console.log(res.data);
            this.getCategories();
        })
        .catch(err => {
            this.setState({ error: err });

            setTimeout(() => {
                this.setState({ error: null })
            }, 5000);
        });
    }

    getCategories = () => {
        axios.get(this.props.url + 'api/categories', {
            headers: {
                Authorization: 'Bearer ' + this.props.token
            }
        })
        .then(res => {
            this.setState({ categories: res.data })
        })
        .catch(err => {
            this.setState({ error: err });

            setTimeout(() => {
                this.setState({ error: null })
            }, 5000);
        });
    }

    errorHandler = () => {
        this.setState({ error: null });
    }

    render() {
        return(
            <Fragment>
                <ErrorHandler 
                    error={this.state.error} 
                    onHandle={this.errorHandler} 
                />
                <div className="row mb-3">
                    <div className="col-sm">
                        <h1>Kategorie</h1>
                    </div>
                    <div className="col-sm">
                        <Link to="/category/add" className="btn btn-success float-right">
                            <i className="fa fa-plus"></i> &nbsp; Dodaj kategorię
                        </Link>
                    </div>
                </div>
                <div className="row">
                    {this.state.categories.map(category => 
                        <Category 
                            key={category.Id}
                            url={this.props.url}
                            category={category}
                            onDeleteCategory = {() => this.deleteCategory(category.Id)}
                        />
                    )}
                </div>
            </Fragment>
        )
    }
}

export default Categories;