import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const logo = require('../../assets/images/logo-vendim.png');
const profile = require('../../assets/images/blank-profile.png');

class Sidebar extends Component {
    state = {
        categories: [],
        showProductMenu: false
    };

    componentDidMount() {
        axios.get(this.props.url + 'api/categories', {
            headers: {
                Authorization: 'Bearer ' + this.props.token
            }
        })
        .then(res => {
            this.setState({ categories: res.data });
        })
        .catch(err => {
            console.log(err.response.data);
        });
    }

    toggleProductMenu = () => {
        this.setState({ showProductMenu: !this.state.showProductMenu });
    }

    render() {
        const sidebarClass = this.props.showSidebar ? "sidebar d-none d-lg-block bg-light sticky-top" : "sidebar d-none";
        const productMenuClass = this.state.showProductMenu ? "list-group-item sidebar-list-group-item bg-light ml-3" : "list-group-item sidebar-list-group-item bg-light ml-3 d-none";

        return(
            <div className={sidebarClass}>
                <div className="sidebar-img"> 
                    <div className="text-center mt-2 mb-2">
                        <img src={logo} alt="logo" height="39" />
                    </div>
                </div>
                <ul className="list-group list-group-flush mt-2 ml-2 mr-2">
                    <li className="list-group-item sidebar-list-group-item bg-light">
                        <div className="text-center mt-2 mb-2">
                            <img src={profile} alt="logo" height="80" className="rounded" />
                            <p className="mt-1 text-truncate">{this.props.userName}</p>
                        </div>
                    </li>
                    <li className="list-group-item sidebar-list-group-item bg-light">
                        <Link to="/" onClick={this.toggleProductMenu} className="link">
                            <i className="far fa-list-alt"></i> &nbsp; Produkty
                        </Link>
                    </li>
                    { this.state.categories.map(category => 
                    <li key={category.CategoryId} className={productMenuClass}>
                            <Link to={`/products/${category.CategoryId}`} className="link">{category.Name}</Link>
                        </li>)
                    }
                    <li className="list-group-item sidebar-list-group-item bg-light">
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