import React from 'react';
import { Link } from 'react-router-dom';

const category = (props) => {
    return (
        <div className="col-lg-3 col-sm-6 mb-3">
            <div className="card">
                <h5 className="card-header">{props.category.Name}</h5>
                <img src={props.url + props.category.Image} className="card-img-top" alt={props.category.Name} width="160" height="160" />
                <div className="card-body">
                    {/* <h4 className="card-title">{props.category.Name}</h4> */}
                    <div className="row">
                        <div className="col-md-6 mt-1">
                            <Link to={"/category/" + props.category.Id} className="btn btn-secondary btn-block"><i className="fas fa-pencil-alt"></i></Link>
                        </div>
                        <div className="col-md-6 mt-1">
                            <button onClick={props.onDeleteCategory} className="btn btn-danger btn-block"><i className="fa fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default category;