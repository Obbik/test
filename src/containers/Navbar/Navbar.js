import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

const logo = require('../../assets/images/logo-vendim.png');

class Navbar extends Component {
    state = {
        showDropdown: false,
        showMobileNavbar: false
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    // Handle mobile navbar
    handleMobileNavbarClick = () => {
        this.toggleMobileNavbar();
    }

    toggleMobileNavbar = () => this.setState({ showMobileNavbar: !this.state.showMobileNavbar });

    hideMobileNavbar = () => this.setState({ showMobileNavbar: false });

    setMobileNavbarWrapperRef = node => this.mobileNavbarWrapper = node;

    // Handle navbar dropdown
    handleClick = () => this.toggleDropdown();

    toggleDropdown = () => this.setState({ showDropdown: !this.state.showDropdown });

    hideDropdown = () => this.setState({ showDropdown: false });

    setDropdownWrapperRef = node => this.dropdownWrapper = node;

    // Handle logout
    handleLogout = () => {
        this.hideDropdown();
        this.props.onLogout();
    }

    // Handle clicking outside specific div
    handleClickOutside = e => {
        if (this.wrapper && !this.wrapper.contains(e.target)) {
            this.hideDropdown();
        }
    }

    render() {
        const dropdown = this.state.showDropdown ? 
            <div className="dropdown-menu dropdown-menu-right">
                <div className="dropdown-item">test@gmail.com</div>
                <div className="dropdown-divider"></div>
                <div onClick={this.handleLogout} className="btn dropdown-item">Wyloguj się</div>
            </div> : null

        const mobileNavbarClass = this.state.showMobileNavbar ? "collapse navbar-collapse show" : "collapse navbar-collapse";

        return (
            <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link to="/" className="navbar-brand">
                        <img src={logo} alt="logo" height="54" />
                    </Link>
                    <button onClick={this.handleMobileNavbarClick} className="navbar-toggler" type="button">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div ref={this.setMobileNavbarWrapperRef} className={mobileNavbarClass} id="navbarNav">
                        <ul className="navbar-nav mr-auto">

                        </ul>
                        <ul className="navbar-nav ml-auto">
                            {this.props.isAuth ?
                                <Fragment>
                                    <li className="nav-item">
                                        <Link to="/" className="nav-link">Produkty</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/categories" className="nav-link">Kategorie</Link>
                                    </li>
                                    <li ref={this.setDropdownWrapperRef} className="nav-item dropdown">
                                        <div onClick={this.handleClick} className="btn nav-link dropdown-toggle">
                                            <i className="far fa-user"></i>
                                        </div>
                                        {dropdown}
                                    </li> 
                                </Fragment> : null
                            }
                        </ul>
                    </div>
                </div>
            </nav>
      );
    }
}

export default Navbar;