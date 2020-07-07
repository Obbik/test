import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component {
    state = {
        showDropdown: false,
        showDropdownMachine: false,
        showMobileNavbar: false
    }

    componentDidMount() { 
        document.addEventListener('mousedown', this.handleClickOutside); 
    }

    componentWillUnmount() { 
        document.removeEventListener('mousedown', this.handleClickOutside); 
    }

    // Handle mobile navbar
    toggleMobileNavbar = () => this.setState({ showMobileNavbar: !this.state.showMobileNavbar });

    hideMobileNavbar = () => this.setState({ showMobileNavbar: false });

    // setMobileNavbarWrapperRef = node => this.mobileNavbarWrapper = node;

    // Handle user dropdown
    toggleUserDropdown = () => this.setState({ showDropdown: !this.state.showDropdown });

    hideUserDropdown = () => this.setState({ showDropdown: false });

    setUserDropdownWrapperRef = node => this.userDropdownWrapper = node;

    // Handle machine dropdown
    toggleMachineDropdown = () => this.setState({ showDropdownMachine: !this.state.showDropdownMachine });

    hideMachineDropdown = () => this.setState({ showDropdownMachine: false });

    setMachineDropdownWrapperRef = node => this.machineDropdownWrapper = node;

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

        // if (this.mobileNavbarWrapper && !this.mobileNavbarWrapper.contains(e.target)) {
        //     this.hideMobileNavbar();
        // }

        if (this.machineDropdownWrapper && !this.machineDropdownWrapper.contains(e.target)) {
            this.hideMachineDropdown();
        }
    }

    render() {
        const { showDropdownMachine } = this.state;

        const dropdown = this.state.showDropdown ? 
            <div className="dropdown-menu dropdown-menu-right">
                <Link to="#" onClick={this.handleLogout} className="dropdown-item">Wyloguj się</Link>
            </div> : null

        const dropdownMachine = showDropdownMachine ? 
            <div className="dropdown-menu dropdown-menu-right">
                <Link to="/machine-products" onClick={this.toggleMachineDropdown} className="dropdown-item">Konfiguracja</Link>
                <Link to="/machine-boost" onClick={this.toggleMachineDropdown} className="dropdown-item">Doładowanie</Link>
            </div> : null

        const navbarClass = this.props.showSidebar ? "navbar navbar-expand-lg navbar-dark bg-dark fixed-top" : "navbar navbar-expand-lg navbar-dark navbar-full-width bg-dark fixed-top"
        const mobileNavbarClass = this.state.showMobileNavbar ? "collapse navbar-collapse show" : "collapse navbar-collapse";

        return (
            <nav className={navbarClass}>
                <div className="container-fluid">
                    <button onClick={this.props.onToggleSidebar} className="btn btn-dark">
                        <span className="navbar-toggler-icon d-none d-lg-block"></span>
                    </button>
                    <button ref={this.setMobileNavbarWrapperRef} onClick={this.toggleMobileNavbar} className="navbar-toggler" type="button">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div ref={this.setMobileNavbarWrapperRef} className={mobileNavbarClass} id="navbarNav">
                        <ul className="navbar-nav mr-auto">

                        </ul>
                        <ul className="navbar-nav ml-auto">
                            <Fragment>
                                <li className="nav-item">
                                    <Link to="/" className="nav-link">
                                        Produkty
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/categories" className="nav-link">Kategorie</Link>
                                </li>
                                <li ref={this.setMachineDropdownWrapperRef} className="nav-item dropdown">
                                    <Link to="#" onClick={this.toggleMachineDropdown} className="nav-link dropdown-toggle">
                                        Maszyna
                                    </Link>
                                    {dropdownMachine}
                                </li>
                                <li ref={this.setUserDropdownWrapperRef} className="nav-item dropdown">
                                    <Link to="#" onClick={this.toggleUserDropdown} className="nav-link dropdown-toggle">
                                        <i className="far fa-user"></i>
                                    </Link>
                                    {dropdown}
                                </li>
                            </Fragment>
                        </ul>
                    </div>
                </div>
            </nav>
      );
    }
}

export default Navbar;