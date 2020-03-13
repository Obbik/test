import React from 'react';
import { Link } from 'react-router-dom';

const category = (props) => {
    const view = props.tableView ? 
        <div className="col">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Nazwa</th>
                        <th scope="col">Zdjęcie</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {props.categories.map(category => 
                        <tr key={category.Id}>
                            <td className="align-middle">{category.Name}</td>
                            <td className="align-middle">
                                <img src={props.url + category.Image} alt={category.Name} width="64" height="64"/>
                            </td>
                            <td className="align-middle">
                                <Link to={"/category/" + category.Id} className="btn btn-secondary btn-block"><i className="fas fa-pencil-alt"></i></Link>
                                <button onClick={() => props.onDeleteCategory(category.Id)} className="btn btn-danger btn-block"><i className="fa fa-trash"></i></button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div> : 
        props.categories.map(category => 
            <div key={category.Id} className="col-lg-3 col-sm-6 mb-3">
                <div className="card">
                    <h5 className="card-header">{category.Name}</h5>
                    <img src={props.url + category.Image} className="card-img-top" alt={category.Name} />
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mt-1">
                                <Link to={"/category/" + category.Id} className="btn btn-secondary btn-block"><i className="fas fa-pencil-alt"></i></Link>
                            </div>
                            <div className="col-md-6 mt-1">
                                <button onClick={() => props.onDeleteCategory(category.Id)} className="btn btn-danger btn-block"><i className="fa fa-trash"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    return <div className="row">{view}</div>;
};

export default category;