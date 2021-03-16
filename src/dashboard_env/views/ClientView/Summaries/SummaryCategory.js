import React from 'react'
import { useHistory } from "react-router-dom";
import { Link, Route, Switch, Redirect } from "react-router-dom"
import './index.css'


const SummaryCategory = (props) => {

    let history = useHistory();
    const filterCategory = ["utworzone", "zmodyfikowane", "płatności", "bieżacy stan"]
    return (
        <div>
            <h1 className="text-center">Wybierz typ raportu</h1>
            <button
                className=" btn btn-link text-decoration-none"
                // onClick={openForm()}
                onClick={() => history.goBack()}
            >
                <i className="fas fa-arrow-left mr-2" /> wróć
                </button>
            <div className="d-flex flex-wrap align-items-center   text-center row card-body">
                {filterCategory.map((section, key) =>
                    <div key={key} className=" card blue border card rounded col-12 my-1 col-md-6   tile" style={{ "lineHeight": "5" }}>
                        <Link style={{ textDecoration: 'none' }} to={`/summaries/${props.match.params.summariesId.toLowerCase()}/${section}`}>
                            <p className="card-title font-weight-bold" style={{ "fontSize": "2rem" }}>{section}</p>
                        </Link>
                        <Switch>
                            <Route
                                exact
                                path={`/summaries/${props.match.params.summariesId.toLowerCase()}/${section}`}
                            >
                                <SummaryCategory data={section} />
                            </Route>
                        </Switch>
                    </div>)}
            </div>
        </div>
    )
}

export default SummaryCategory
