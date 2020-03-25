import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const logo = require('../../assets/images/logo-vendim.png');

class Sidebar extends Component {
    render() {
        const sidebarClass = this.props.showSidebar ? "sidebar d-none d-lg-block bg-light sticky-top" : "sidebar d-none";
        return(
            <div className={sidebarClass}>
                <ul className="list-group list-group-flush sticky-top ml-2 mr-2">
                    <div className="text-center mt-5 mb-5">
                        <img src={logo} alt="logo" height="60" />
                    </div>
                    <li className="list-group-item bg-light">
                        <Link to="#" className="link">
                            <i className="far fa-list-alt"></i> &nbsp; Produkty
                        </Link>
                    </li>
                    <li className="list-group-item bg-light ml-3">
                        <Link to="/" className="link">Moje</Link>
                    </li>
                    <li className="list-group-item bg-light ml-3">
                        <Link to="/products/shared" className="link">Współdzielone</Link>
                    </li>
                    <li className="list-group-item bg-light">
                        <Link to="/categories" className="link">
                            <i className="fas fa-th-large"></i> &nbsp; Kategorie
                        </Link>
                    </li>
                </ul>
            </div>
        )
    }
}

export default Sidebar;