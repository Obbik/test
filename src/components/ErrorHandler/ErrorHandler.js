import React, { Fragment } from 'react';

import './ErrorHandler.css'

const errorHandler = (props) => {
    const alert = props.error ?
        <div className="alert alert-danger" role="alert">
            {props.error.response.data.message}
            <button onClick={props.onHandle} type="button" className="close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div> : null
    return (
        <Fragment>
            {alert}
        </Fragment>
    );
}

export default errorHandler;