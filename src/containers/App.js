import React, { Component, Fragment } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import axios from 'axios';

import 'react-notifications/lib/notifications.css';
import '../containers/Sidebar/Sidebar.css';
import '../assets/fontawesome/css/all.css';
import './App.css';

import Navbar from './Navbar/Navbar';
import Login from './User/Login';
import Products from './Product/Products';
import Categories from './Category/Categories';
import FullProduct from './Product/FullProduct';
import ProductCategory from './Product/ProductCategory';
import FullCategory from './Category/FullCategory';
import Loader from '../components/Loader/Loader';
import Sidebar from '../containers/Sidebar/Sidebar';
import MachineProductsView from './MachineProduct/MachineProductsView';

class App extends Component {
    state = {
        url: 'http://localhost:3000/',
        // url: 'http://46.41.150.192/vendim-rest-api/',
        // url: 'https://vendim-rest-api.herokuapp.com/',
        token: null,
        userId: null,
        userName: null,
        isAuth: false,
        error: null,
        loader: false,
        showSidebar: true
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
            this.setState({
                isAuth: false,
                loader: false
            });
            NotificationManager.error(err.response.data.message, null, 4000);
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

    // Sidebar
    toggleSidebar = () => { this.setState({showSidebar: !this.state.showSidebar}) }

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
                                {...props}
                                url={this.state.url}
                                token={this.state.token}
                                sharedProducts={false}
                            />
                        )}
                    />
                    <Route
                        exact path="/products/:categoryId"
                        render={props => (
                            <Products
                                {...props}
                                key={props.match.params.categoryId}
                                url={this.state.url}
                                token={this.state.token}
                                sharedProducts={false}
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
                        path="/product-category/:id"
                        render={props => (
                            <ProductCategory
                                {...props}
                                url={this.state.url}
                                token={this.state.token}
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
                    <Route
                        exact path="/machine-products"
                        render={props => (
                            <MachineProductsView
                                {...props}
                                url={this.state.url}
                                token={this.state.token}
                            />
                        )}
                    />
                    {/* <Redirect to="/" /> */}
                </Fragment>
        }

        return (
            // <Fragment>
            //     <Loader active={this.state.loader}/>
            //     <Navbar onLogout={this.logout} isAuth={this.state.isAuth} />
            //     <div className="container navbar-margin">
            //         {routes}
            //     </div>
            //     <NotificationContainer/>
            // </Fragment>

            <Fragment>
                <Loader active={this.state.loader}/>
                <NotificationContainer/>
                <div className="row body-row">
                    { this.state.isAuth ? <Sidebar 
                            showSidebar={this.state.showSidebar}
                            url={this.state.url}
                            token={this.state.token}
                            userName={this.state.userName}
                        /> : null }
                    <div className="col body-col">
                        { this.state.isAuth ? <Navbar 
                            onLogout={this.logout} 
                            isAuth={this.state.isAuth} 
                            onToggleSidebar={this.toggleSidebar}
                            showSidebar={this.state.showSidebar}
                        /> : null }
                        <div className="container navbar-margin">
                        {/* container-fluid */}
                            {routes}
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default App;
