import React from 'react';

const product = (props) => {
    return (
        <div className="col-md-3 col-sm-6 mb-3">
            <div className="card">
                <img src="https://bulma.io/images/placeholders/256x256.png" className="card-img-top" alt={props.Name} />
                <div className="card-body">
                    <h5 className="card-title"></h5>
                    <div className="row">
                        <div className="col-md-6 mt-1">
                            <a href="" className="btn btn-secondary btn-block"><i className="fas fa-pencil-alt"></i></a>
                        </div>
                        <div className="col-md-6 mt-1">
                            <button type="submit" value="delete" className="btn btn-danger btn-block"><i className="fa fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default product;
