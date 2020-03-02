import React from 'react';
import { Link } from 'react-router-dom';

const navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-3">
            <div className="container">
                <Link to="/" className="navbar-brand">Navbar</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        {/* <li className="nav-item active">
                            <Link className="nav-link">Home</Link>
                        </li> */}
                        <li className="nav-item">
                            <Link to="/products" className="nav-link">Produkty</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Kategorie</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
  );
}

export default navbar;