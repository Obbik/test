import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const productNav = props => {
    return(
        <Fragment>
            <div className="row mb-3">
                <div className="col">
                    <Link to="/" className="btn btn-secondary">
                        <i class="fas fa-arrow-left"></i>&nbsp; Wróć
                    </Link>
                </div>
            </div>
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <Link to={"/product/" + props.id} className={props.active == 1 ? "nav-link active" : "nav-link"}>Właściwości</Link>
                </li>
                <li className="nav-item">
                    <Link to={"/product-category/" + props.id} className={props.active == 2 ? "nav-link active" : "nav-link"}>Kategorie</Link>
                </li>
            </ul>
        </Fragment>
    );
}

export default productNav;