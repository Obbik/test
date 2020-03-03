import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Route, Switch, Redirect } from 'react-router-dom';

import './App.css';
import '../assets/fontawesome/css/all.css'

import Navbar from './Navbar/Navbar';
import Login from './User/Login';
import Products from './Product/Products';
// import ErrorHandler from './ErrorHandler/ErrorHandler';
import FullProduct from './Product/FullProduct';


class App extends Component {
    state = {
        url: 'http://localhost:3000/',
        token: null,
        userId: null,
        userName: null,
        isAuth: false
    }

    componentDidMount() {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');
        const expiryDate = localStorage.getItem('expiryDate');

        if (!token || !expiryDate) {
            return;
        }

        if (new Date(expiryDate) <= new Date()) {
            this.logoutHandler();
            return;
        }

        const remainingMilliseconds = new Date(expiryDate).getTime() - new Date().getTime();

        this.setState({
            token: token, 
            userId: userId,
            userName: userName,
            isAuth: true
        });

        this.setAutoLogout(remainingMilliseconds);
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
            console.log('res.data', res);
            const token = res.token;
            const userId = res.userId;
            const userName = res.userName;

            this.setState({
                token: token,
                userId: userId,
                userName: userName,
                isAuth: true
            })

            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('userName', userName);

            const remainingMilliseconds = 60 * 60 * 1000;
            const expiryDate = new Date(
                new Date().getTime() + remainingMilliseconds
            );

            localStorage.setItem('expiryDate', expiryDate.toISOString());

            this.setAutoLogout(remainingMilliseconds);

        })
        .catch(err => {
            console.log('err.response.data', err.response.data);
        });
    }

    setAutoLogout = milliseconds => {
        setTimeout(() => {
          this.logout();
        }, milliseconds);
    };

    logout = () => {
        this.setState({ 
            token: null,
            isAuth: false
        });

        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
    };

    render() {
        console.log('isAuth', this.state.isAuth);
        let routes = 
            <Switch>
                <Route
                    exact path="/"
                    render={() => (
                        <Login onLogin={this.login} />
                    )}
                />
                {/* <Redirect to="/" /> */}
            </Switch>

        if (this.state.isAuth) {
            routes =
                <div>
                    <Route
                        exact path="/"
                        render={props => (
                            <Products
                                url={this.state.url}
                                token={this.state.token}
                            />
                        )}
                    />
                    <Route
                        exact path="/:id"
                        render={props => (
                            <FullProduct
                                {...props}
                                url={this.state.url}
                                token={this.state.token}
                            />
                        )}
                    />
                    <Route
                        exact path="/categories"
                        render={props => (
                            <h1>Categories</h1>
                        )}
                    />
                    {/* <Redirect to="/" /> */}
                </div>
        }

        return (
            <Fragment>
                <Navbar onLogout={this.logout} />
                <div className="container">
                    {routes}
                </div>
            </Fragment>
        );
    }
}

export default App;
