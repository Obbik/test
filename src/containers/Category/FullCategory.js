import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';

class FullCategory extends Component {
    state = {
        category: {
            name: '',
            image: ''
        },
        addCategory: false,
        error: null
    }

    componentDidMount() {
        const id = this.props.match.params.id;

        if(id !== 'add') {
            axios.get(this.props.url + 'api/category/' + id, {
                headers: {
                    Authorization: 'Bearer ' + this.props.token
                }
            })
            .then(res => {
                if(res.status !== 200) {
                    throw new Error('Failed to fetch status.');
                }
                return res.data;
            })
            .then(res => {
                this.setState({
                    category: {
                        name: res.Name,
                        image: res.Image
                    },
                    addCategory: false
                });
            })
            .catch(err => {
                this.setState({ error: err });

                setTimeout(() => {
                    this.setState({ error: null })
                }, 5000);
            });
        } else {
            this.setState({
                addCategory: true
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
			category: {
				...prevState.category,
				[inputName]: inputValue
			},
        }));
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const category = {
            Name: this.state.category.name,
            Image: this.state.category.image
        };

        if(this.state.addCategory) {
            this.addCategory(category);
        } else {
            this.editCategory(category);
        }
    }

    addCategory = (category) => {
        const formData = new FormData();
        formData.append('Name', category.Name);
        formData.append('Image', category.Image);

        axios.post(this.props.url + 'api/category/', formData, {
            headers: {
                Authorization: 'Bearer ' + this.props.token
            }
        })
        .then(res => {
            this.props.history.push('/categories');
        })
        .catch(err => {
            this.setState({ error: err });

            setTimeout(() => {
                this.setState({ error: null })
            }, 5000);
        });
    }

    editCategory = (category) => {
        const id = this.props.match.params.id;

        const formData = new FormData();
        formData.append('Name', category.Name);
        formData.append('Image', category.Image);
        
        axios.put(this.props.url + 'api/category/' + id, formData, {
            headers: {
                Authorization: 'Bearer ' + this.props.token
            }
        })
        .then(res => {
            this.props.history.push('/categories');
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
                    <div className="col">
                        <Link to="/categories" className="btn btn-secondary">
                            <i class="fas fa-arrow-left"></i>&nbsp; Wróć
                        </Link>
                    </div>
                </div>
                <div className="card card-body bg-light mt-5">
                    <div className="text-center">
                        <h2>{this.state.addCategory ? 'Dodaj kategorię' : this.state.category.name}</h2>
                    </div>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label>Zdjęcie</label>
                            <input type="file" name="image" className="form-control form-control-lg" onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>Nazwa kategorii</label>
                            <input type="text" name="name" className="form-control form-control-lg" value={this.state.category.name} onChange={this.handleChange}/>
                        </div>
                        <input type="submit" className="btn btn-success" value="Zapisz"/>
                    </form>
                </div>
            </Fragment>
        );
    }
}

export default FullCategory;