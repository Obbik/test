import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

const logo = require('../../assets/images/logo-vendim.png');

class Navbar extends Component {
    state = {
        showDropdown: false,
        showMobileNavbar: false,
        showProductDropdown: false
    }

    componentDidMount() { document.addEventListener('mousedown', this.handleClickOutside); }

    componentWillUnmount() { document.removeEventListener('mousedown', this.handleClickOutside); }

    // Handle mobile navbar
    toggleMobileNavbar = () => this.setState({ showMobileNavbar: !this.state.showMobileNavbar });

    hideMobileNavbar = () => this.setState({ showMobileNavbar: false });

    setMobileNavbarWrapperRef = node => this.mobileNavbarWrapper = node;

    // Handle product dropdown
    toggleProductDropdown = () => this.setState({ showProductDropdown: !this.state.showProductDropdown });

    hideProductDropdown = () => this.setState({ showProductDropdown: false });

    setProductDropdownWrapperRef = node => this.productDropdownWrapper = node;

    // Handle user dropdown
    toggleUserDropdown = () => this.setState({ showDropdown: !this.state.showDropdown });

    hideUserDropdown = () => this.setState({ showDropdown: false });

    setUserDropdownWrapperRef = node => this.userDropdownWrapper = node;

    // Handle logout
    handleLogout = () => {
        this.hideUserDropdown();
        this.props.onLogout();
    }

    // Handle clicking outside specific div
    handleClickOutside = e => {
        if (this.userDropdownWrapper && !this.userDropdownWrapper.contains(e.target)) {
            this.hideUserDropdown();
        }

        if (this.productDropdownWrapper && !this.productDropdownWrapper.contains(e.target)) {
            this.hideProductDropdown();
        }

        if (this.mobileNavbarWrapper && !this.mobileNavbarWrapper.contains(e.target)) {
            this.hideMobileNavbar();
        }
    }

    render() {
        const dropdown = this.state.showDropdown ? 
            <div className="dropdown-menu dropdown-menu-right">
                {/* <div className="dropdown-item">test@gmail.com</div> */}
                {/* <div className="dropdown-divider"></div> */}
                <div onClick={this.handleLogout} className="btn dropdown-item">Wyloguj się</div>
            </div> : null

        const productDropdown = this.state.showProductDropdown ? 
            <div className="dropdown-menu">
                <Link to="/" onClick={this.toggleProductDropdown} className="dropdown-item">Moje</Link>
                <Link to="/products-shared" onClick={this.toggleProductDropdown} className="dropdown-item">Współdzielone</Link>
            </div> : null
        const mobileNavbarClass = this.state.showMobileNavbar ? "collapse navbar-collapse show" : "collapse navbar-collapse";

        return (
            <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link to="/" className="navbar-brand">
                        <img src={logo} alt="logo" height="54" />
                    </Link>
                    <button ref={this.setMobileNavbarWrapperRef} onClick={this.toggleMobileNavbar} className="navbar-toggler" type="button">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div ref={this.setMobileNavbarWrapperRef} className={mobileNavbarClass} id="navbarNav">
                        <ul className="navbar-nav mr-auto">

                        </ul>
                        <ul className="navbar-nav ml-auto">
                            {this.props.isAuth ?
                                <Fragment>
                                    <li ref={this.setProductDropdownWrapperRef} className="nav-item dropdown">
                                        {/* <Link to="/" className="nav-link">Produkty</Link> */}
                                        <Link to="#" onClick={this.toggleProductDropdown} className="nav-link dropdown-toggle">
                                            Produkty
                                        </Link>
                                        {productDropdown}
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/categories" className="nav-link">Kategorie</Link>
                                    </li>
                                    <li ref={this.setUserDropdownWrapperRef} className="nav-item dropdown">
                                        <Link to="#" onClick={this.toggleUserDropdown} className="nav-link dropdown-toggle">
                                            <i className="far fa-user"></i>
                                        </Link>
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