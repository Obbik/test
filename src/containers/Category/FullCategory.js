import React, { Component, Fragment } from 'react';
import { NotificationManager } from 'react-notifications';
import axios from 'axios';

import Loader from '../../components/Loader/Loader';

const sampleProduct = require('../../assets/images/sample-product.svg');

class FullCategory extends Component {
    state = {
        category: {
            name: '',
            image: ''
        },
        addCategory: false,
        error: null,
        loader: false
    }

    componentDidMount() {
        const id = this.props.match.params.id;

        if(id !== 'add') {
            this.setState({ loader: true });
            axios.get(this.props.url + 'api/category/' + id, {
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
                    category: {
                        name: res.Name,
                        image: res.Image,
                        initialImage: res.Image
                    },
                    addCategory: false,
                    loader: false
                });
            })
            .catch(err => {
                this.setState({ loader: false });
                NotificationManager.error(err.response.data.message, null, 4000);
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
        this.setState({ loader: true });
        const formData = new FormData();
        formData.append('Name', category.Name);
        formData.append('Image', category.Image);

        axios.post(this.props.url + 'api/category/', formData, {
            headers: {
                Authorization: 'Bearer ' + this.props.token
            }
        })
        .then(res => {
            this.setState({ loader: false });
            NotificationManager.success(res.data.message, null, 4000);
            this.props.history.push('/categories');
        })
        .catch(err => {
            this.setState({ loader: false });
            NotificationManager.error(err.response.data.message, null, 4000);
        });
    }

    editCategory = (category) => {
        this.setState({ loader: true });
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
            this.setState({ loader: false });
            NotificationManager.success(res.data.message, null, 4000);
            this.props.history.push('/categories');
        })
        .catch(err => {
            this.setState({ loader: false });
            NotificationManager.error(err.response.data.message, null, 4000);
        });
    }
     
    render() {
        return(
            <Fragment>
                <Loader active={this.state.loader}/>
                <div className="row mb-3">
                    <div className="col">
                        <button onClick={this.props.history.goBack} className="btn btn-secondary">
                            <i className="fas fa-arrow-left"></i>&nbsp; Wróć
                        </button>
                    </div>
                </div>
                <div className="card card-body bg-light mt-3">
                    <div className="text-center">
                        <h2>{this.state.addCategory ? 'Dodaj kategorię' : this.state.category.name}</h2>
                        {this.state.category.initialImage ? <img src={this.props.url + this.state.category.initialImage} onError={(e)=>{e.target.src=sampleProduct}} alt={this.state.category.name} width="256" height="256"/> : null}
                    </div>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label>Zdjęcie</label>
                            <input type="file" name="image" className="form-control form-control-lg" onChange={this.handleChange} onKeyUp={this.handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>Nazwa kategorii</label>
                            <input type="text" name="name" className="form-control form-control-lg" value={this.state.category.name} onChange={this.handleChange} onKeyUp={this.handleChange}/>
                        </div>
                        <input type="submit" className="btn btn-success" value="Zapisz"/>
                    </form>
                </div>
            </Fragment>
        );
    }
}

export default FullCategory;