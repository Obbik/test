import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const productNav = props => {
    return(
        <Fragment>
            <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                    <Link to={"/product/" + props.id} className={props.active === 1 ? "nav-link active" : "nav-link"}>Właściwości</Link>
                </li>
                <li className="nav-item">
                    <Link to={"/product-category/" + props.id} className={props.active === 2 ? "nav-link active" : "nav-link"}>Kategorie</Link>
                </li>
            </ul>
        </Fragment>
    );
}

export default productNav;