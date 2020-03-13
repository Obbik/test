import React from 'react';
import './Loader.css';

const loader = props => {
    const loaderClass = props.active ? "loading" : "";
    return (
        <div className={loaderClass}></div>
    )
}

export default loader;