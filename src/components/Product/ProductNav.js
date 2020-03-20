import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const productNav = props => {
    const linkProperties = props.sharedProducts ? '/product/shared/' : '/product/';
    const linkCategories = props.sharedProducts ? '/product-category/shared/' : '/product-category/';

    return(
        <Fragment>
            <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                    <Link to={linkProperties + props.id} className={props.active === 1 ? "nav-link active" : "nav-link"}>Właściwości</Link>
                </li>
                {props.addProduct ? 
                    null :
                    <li className="nav-item">
                        <Link to={linkCategories + props.id} className={props.active === 2 ? "nav-link active" : "nav-link"}>Kategorie</Link>
                    </li>}
            </ul>
        </Fragment>
    );
}

export default productNav;