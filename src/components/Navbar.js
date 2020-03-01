import React from 'react';

const navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-3">
            <div className="container">
                <a className="navbar-brand">Navbar</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item active">
                            <a className="nav-link">Home <span className="sr-only">(current)</span></a>
                            {/* href="#" */}
                        </li>
                        <li className="nav-item">
                            <a className="nav-link">Features</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link">Pricing</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
  );
}

export default navbar;