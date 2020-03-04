import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const logo = require('../../assets/images/logo-vendim.png');

class Navbar extends Component {
    state = {
        showDropdown: false
    }

    handleDropdown = () => {
        this.setState({
            showDropdown: !this.state.showDropdown
        })
    }

    handleLogout = () => {
        this.setState({ showDropdown: false });
        this.props.onLogout();
    }

    render() {
        const dropdown = this.state.showDropdown ? 
            <div className="dropdown-menu">
                <div className="dropdown-item" href="#">test@gmail.com</div>
                <div className="dropdown-divider"></div>
                <div onClick={this.handleLogout} className="dropdown-item">Wyloguj się</div>
            </div> : null

        return (
            <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark mb-">
                <div className="container">
                    <Link to="/" className="navbar-brand"><img src={logo} alt="logo" height="54" /></Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mr-auto">

                        </ul>
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to="/" className="nav-link">Produkty</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/categories" className="nav-link">Kategorie</Link>
                            </li>
                            <li className="nav-item dropdown">
                                {/* <Link to="/" className="nav-link">User</Link> */}
                                <div onClick={this.handleDropdown}  className="nav-link dropdown-toggle">
                                    <i className="far fa-user"></i>
                                </div>
                                {dropdown}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
      );
    }
}

export default Navbar;