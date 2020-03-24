import React, { Component, Fragment } from 'react';
import { NotificationManager } from 'react-notifications';
import axios from 'axios';

import Category from '../../components/Category/Category';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import Title from '../../components/Title/Title';
import SearchInput from '../SearchInput/SearchInput';
import Loader from '../../components/Loader/Loader';

class Categories extends Component {
    state = {
        categories: [],
        error: null,
        tableView: false,
        loader: false
    }

    componentDidMount() {
        this.getCategories();
    }

    deleteCategory = id => {
        const confirm = window.confirm('Czy na pewno chcesz usunąć kategorię?');

        if(confirm) {
            this.setState({ loader: true });
            axios.delete(this.props.url + 'api/category/' + id, {
                headers: {
                    Authorization: 'Bearer ' + this.props.token
                }
            })
            .then(res => {
                NotificationManager.success(res.data.message, null, 4000);
                this.getCategories();
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, null, 4000);
                this.setState({ 
                    // error: err,
                    loader: false 
                });

                // setTimeout(() => {
                //     this.setState({ error: null })
                // }, 5000);
            });
        }
    }

    getCategories = () => {
        this.setState({ loader: true });
        axios.get(this.props.url + 'api/categories', {
            headers: {
                Authorization: 'Bearer ' + this.props.token
            }
        })
        .then(res => {
            this.setState({ 
                categories: res.data,
                initialCategories: res.data,
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
        });
    }

    errorHandler = () => {
        this.setState({ error: null });
    }

    // Method for changing the view (table or cards)
    toggleView = () => {
        this.setState({
            tableView: !this.state.tableView
        })
    }

    // Search bar
    search = value => {
        const suggestions = this.getSuggestions(value);
        let filteredCategories = this.state.initialCategories;

        if(value !== '') {
            filteredCategories = suggestions;
        }

        this.setState({
            categories: filteredCategories
        });
    }

    getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        
        return inputLength === 0 ? [] : this.state.initialCategories.filter(category =>
            category.Name.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

    render() {
        return(
            <Fragment>
                <Loader active={this.state.loader}/>
                <ErrorHandler 
                    error={this.state.error} 
                    onHandle={this.errorHandler} 
                />
                <Title
                    title="Kategorie"
                    buttonName="Dodaj kategorię"
                    buttonLink="/category/add"
                    enableAddButton={true}
                />
                <SearchInput 
                    tableView={this.state.tableView}
                    onSearch={this.search}
                    onToggleView={this.toggleView}
                />
                <Category 
                    url={this.props.url}
                    categories={this.state.categories}
                    tableView={this.state.tableView}
                    onDeleteCategory={this.deleteCategory}
                />
            </Fragment>
        )
    }
}

export default Categories;