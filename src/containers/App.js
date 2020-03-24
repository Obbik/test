import React, { Component, Fragment } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import axios from 'axios';

import './App.css';
import '../assets/fontawesome/css/all.css'
import 'react-notifications/lib/notifications.css';

import Navbar from './Navbar/Navbar';
import Login from './User/Login';
import Products from './Product/Products';
import Categories from './Category/Categories';
import ErrorHandler from '../components/ErrorHandler/ErrorHandler';
import FullProduct from './Product/FullProduct';
import FullProductShared from './Product/FullProductShared';
import ProductCategory from './Product/ProductCategory';
import FullCategory from './Category/FullCategory';
import Loader from '../components/Loader/Loader';

// import allProducts from '../assets/products.json';

class App extends Component {
    state = {
        url: 'http://localhost:3000/',
        // url: 'https://vendim-rest-api.herokuapp.com/',
        token: null,
        userId: null,
        userName: null,
        isAuth: false,
        error: null,
        loader: false
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
            this.logout();
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
        this.setState({ loader: true });
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
                userName: userName,
                isAuth: true,
                loader: false
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
            NotificationManager.error(err.response.data.message, null, 4000);
            this.setState({
                isAuth: false,
                // error: err,
                loader: false
            })

            // setTimeout(() => {
            //     this.setState({
            //         error: null
            //     })
            // }, 5000);

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

    errorHandler = () => {
        this.setState({ error: null });
    };

    // addProducts = () => {
    //     allProducts.forEach(product => {
    //         axios.post(this.state.url + 'api/product', product, {
    //             headers: {
    //                 Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRyQHZlbmRpbS5wbCIsInVzZXJJZCI6IjciLCJjbGllbnRJZCI6ImNvbnNvbGUiLCJpYXQiOjE1ODQ2MjAwNzQsImV4cCI6MTU4NDYyMzY3NCwiYXVkIjoiaHR0cDovL3ZlbmRpbS5wbCIsImlzcyI6IlZlbmRpbSIsInN1YiI6InVzZXJAdmVuZGltLnBsIn0.bkQvMYF2a8DJfhzXwtQZMoPAwDa4COCHPyD8bLnUBGy35fQAhm2IGK8ACNGqxwxbdO4tliJR1Ow631UU411UcA'
    //             }
    //         })
    //         .then(res => {
    //             if (res.status === 422) {
    //                 throw new Error('Validation failed.');
    //             }
    //             return res.data;
    //         })
    //         .then(res => {
    //             console.log(res.data);
    //         })
    //         .catch(err => {
    //             console.log(err.response.data);
    //         }); 
    //     });
    // }

    render() {
        let routes = 
            <Switch>
                <Route
                    exact path="/"
                    render={() => (
                        <Login onLogin={this.login} />
                    )}
                />
                <Redirect to="/" />
            </Switch>

        if (this.state.isAuth) {
            routes =
                <Fragment>
                    <Route
                        exact path="/"
                        render={props => (
                            <Products
                                url={this.state.url}
                                token={this.state.token}
                                sharedProducts={false}
                            />
                        )}
                    />
                    <Route
                        exact path="/products/shared"
                        render={props => (
                            <Products
                                url={this.state.url}
                                token={this.state.token}
                                sharedProducts={true}
                            />
                        )}
                    />
                    <Route
                        exact path="/product/:id"
                        render={props => (
                            <FullProduct
                                {...props}
                                url={this.state.url}
                                token={this.state.token}
                            />
                        )}
                    />
                    <Route
                        exact path="/product/shared/:id"
                        render={props => (
                            <FullProductShared
                                {...props}
                                url={this.state.url}
                                token={this.state.token}
                            />
                        )}
                    />
                    <Route
                        exact path="/product-category/:id"
                        render={props => (
                            <ProductCategory
                                {...props}
                                url={this.state.url}
                                token={this.state.token}
                            />
                        )}
                    />
                    <Route
                        exact path="/product-category/shared/:id"
                        render={props => (
                            <ProductCategory
                                {...props}
                                url={this.state.url}
                                token={this.state.token}
                                sharedProducts={true}
                            />
                        )}
                    />
                    <Route
                        exact path="/categories"
                        render={props => (
                            <Categories
                                url={this.state.url}
                                token={this.state.token}
                            />
                        )}
                    />
                    <Route
                        exact path="/category/:id"
                        render={props => (
                            <FullCategory
                                {...props}
                                url={this.state.url}
                                token={this.state.token}
                            />
                        )}
                    />
                    <Redirect to="/" />
                </Fragment>
        }

        return (
            <Fragment>
                <Loader active={this.state.loader}/>
                <Navbar onLogout={this.logout} isAuth={this.state.isAuth} />
                <div className="container navbar-margin">
                    <ErrorHandler 
                        error={this.state.error} 
                        onHandle={this.errorHandler} 
                    />
                    {routes}
                </div>
                <NotificationContainer/>
            </Fragment>
        );
    }
}

export default App;
