import React, { Component, Fragment } from 'react';
import axios from 'axios';

import Category from '../../components/Category/Category';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import Title from '../../components/Title/Title';
import SearchInput from '../SearchInput/SearchInput';

class Categories extends Component {
    state = {
        categories: [],
        error: null,
        tableView: false
    }

    componentDidMount() {
        this.getCategories();
    }

    deleteCategory = id => {
        const confirm = window.confirm('Czy na pewno chcesz usunąć kategorię?\nProdukty znajdujące się w tej kategori również zostaną usunięte.');

        if(confirm) {
            axios.delete(this.props.url + 'api/category/' + id, {
                headers: {
                    Authorization: 'Bearer ' + this.props.token
                }
            })
            .then(res => {
                this.getCategories();
            })
            .catch(err => {
                this.setState({ error: err });

                setTimeout(() => {
                    this.setState({ error: null })
                }, 5000);
            });
        }
    }

    getCategories = () => {
        axios.get(this.props.url + 'api/categories', {
            headers: {
                Authorization: 'Bearer ' + this.props.token
            }
        })
        .then(res => {
            this.setState({ 
                categories: res.data,
                initialCategories: res.data 
            })
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
                <ErrorHandler 
                    error={this.state.error} 
                    onHandle={this.errorHandler} 
                />
                <Title
                    title="Kategorie"
                    buttonName="Dodaj kategorię"
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