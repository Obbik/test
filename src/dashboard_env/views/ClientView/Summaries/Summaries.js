import React from 'react'
import { Link, Route, Switch, Redirect } from "react-router-dom"
import SummaryCategory from "./SummaryCategory"
import './index.css'



const Summaries = () => {

    const categories = ["Dokumenty", "Faktury", "Magazyn", "Maszyny", "Produkty"]

    return (
        <div className="d-flex align-items-center flex-column justify-content-center text-center ">
            <h1>Wybierz raport</h1>
            {categories.map((section, key) => (
                <div key={key} className="card blue border card rounded col-12 my-1 col-md-6 tile" style={{ "lineHeight": "5" }}>
                    <Link style={{ textDecoration: 'none' }} to={`/summaries/${section.toLowerCase()}`}>
                        <p className="card-title font-weight-bold text-decoration-none" style={{ "fontSize": "2rem" }}>{section}</p>
                    </Link>
                    <Switch>
                        <Route
                            exact
                            path={`/summaries/${section.toLowerCase()}`}
                        >
                            <SummaryCategory data={section} />
                        </Route>
                    </Switch>
                </div>
            ))}
        </div>
    )
}

export default Summaries
