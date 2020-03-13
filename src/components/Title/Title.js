import React from 'react';
import { Link } from 'react-router-dom';

const title = props => {
    return (
        <div className="row mb-3">
            <div className="col-sm">
                <h1>{props.title}</h1>
            </div>
            <div className="col-sm">
                <Link to={props.buttonLink} className="btn btn-success float-right">
                    <i className="fa fa-plus"></i> &nbsp; {props.buttonName}
                </Link>
            </div>
        </div>
    )
}

export default title;