import React, { useEffect, useState } from 'react'
import { Link, Route, Switch, useParams } from "react-router-dom"
import './index.css'

import useFetch from '../../../hooks/fetchMSSQL-hook'


const Summaries = () => {

    const { ReportIdName } = useParams()
    const { fetchMssqlApi } = useFetch()
    const [reports, setReports] = useState([])


    useEffect(() => {
        fetchMssqlApi(`/reports-list`, {}, report => setReports(report))
    }, [])
    return (
        <div className="d-flex align-items-center flex-column justify-content-center align-self-center text-center ">
            <h1>Wybierz raport</h1>
            <div className=" blue border  rounded col-12 my-1 col-md-6 my-2 py-2 ">
                {reports.map((section, key) => (
                    <div key={key} >
                        {console.log(section)}
                        <hr />
                        <Link style={{ textDecoration: 'none' }}
                            to={`/summaries/${section.ReportId}`}
                        >

                            <p className=" font-weight-bold text-decoration-none" style={{ "fontSize": "2rem" }}>{section.Name}</p>
                        </Link>
                        <Switch>
                            <Route
                                exact
                                path={`/summaries/${section.ReportId}`}
                            >
                            </Route>
                        </Switch>
                    </div>
                ))}
                <hr />
            </div>
        </div>
    )
}

export default Summaries
