import React from 'react';
import { Link } from 'react-router-dom';

const title = props => {
    // console.log(props.enableAddButton);
    return (
        <div className="row mb-3">
            <div className="col-sm">
                <h2>{props.title}</h2>
            </div>
            <div className="col-sm">
                {props.buttonName ? <Link to={props.buttonLink} className="btn btn-success btn-sm float-right">
                    <i className="fa fa-plus"></i> &nbsp; {props.buttonName}
                </Link> : null}
            </div>
        </div>
    )
}

export default title;