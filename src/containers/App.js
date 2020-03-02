import React, { Component } from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';

import './App.css';
import '../assets/fontawesome/css/all.css'

import Navbar from '../components/Navbar/Navbar';
import Login from './User/Login';
import Products from './Product/Products';
import ErrorHandler from './ErrorHandler/ErrorHandler';


class App extends Component {
    state = {
        url: 'http://localhost:3000/',
        token: null,
        userId: null,
        userName: null,
        test: null
    }

    componentDidMount() {
        // const token = localStorage.getItem('token');
        // const userId = localStorage.getItem('userId');
        // const userName = localStorage.getItem('userName');

        // // if (!token) {
        // //     return;
        // // }

        // this.setState({
        //     token: token, 
        //     userId: userId,
        //     userName: userName
        // });
    }

    login = (user) => {
        axios.put(this.state.url + 'api/auth/login', user)
        .then(res => {
            if (res.status === 422) {
                throw new Error('Validation failed.');
            }
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Could not authenticate.');
            }
            return res.data;
        })
        .then(res => {
            const token = res.token;
            const userId = res.userId;
            const userName = res.userName;

            this.setState({
                token: token,
                userId: userId,
                userName: userName 
            })

            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('userName', userName);

        })
        .catch(err => {
            console.log('err.response.data', err.response.data);
        });
    }

    logout = () => {
        this.setState({ token: null });
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
    };

    render() {
        return (
            <div>
                <Navbar/>
                <div className="container">
                    <Route
                        exact path="/"
                        render={() => (
                            <Login onLogin={this.login} />
                        )}
                    />
                    <Route
                        exact path="/products"
                        render={() => (
                            <Products
                                url={this.state.url}
                                token={this.state.token}
                            />
                        )}
                    />
                </div>
            </div>
        );
    }
}

export default App;
