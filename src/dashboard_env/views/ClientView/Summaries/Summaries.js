import React, { useEffect, useState } from 'react'
import { Link, Route, Switch, useParams } from "react-router-dom"
import './index.css'

import _ from "lodash"
import useFetch from '../../../hooks/fetchMSSQL-hook'

const Summaries = () => {

    const { ReportIdName } = useParams()
    const { fetchMssqlApi } = useFetch()
    const [reports, setReports] = useState([])

    const sortedItems = _.sortBy(reports, ["Name"])
    const chunkedItems = _.chunk(sortedItems, 30);

    useEffect(() => {
        fetchMssqlApi(`/reports-list`, {}, report => setReports(report))

    }, [])
    return (
        <div className="d-flex align-items-center flex-column justify-content-center align-self-center text-center ">
            <h1>Wybierz raport</h1>
            <div className=" blue border d-flex flex-wrap justify-content-between text-center  rounded col-lg-12 my-1 col-md-6 col-sm-3 my-2 py-2 ">
                <div >
                    {chunkedItems[0] ? (
                        chunkedItems[0].map((section) =>
                            <div className="border p-1" key={section.ReportId} >

                                <Link className="font-weight-bold" style={{ textDecoration: 'none' }}
                                    to={`/summaries/${section.ReportId}`}
                                >

                                    {section.Name}
                                </Link>
                                <Switch>
                                    <Route
                                        exact
                                        path={`/summaries/${section.ReportId}`}
                                    >
                                    </Route>
                                </Switch>

                            </div>)
                    ) : ""}
                </div>
                <div>
                    {chunkedItems[1] ? (
                        chunkedItems[1].map((section) =>


                            <div className="border  p-1" key={section.ReportId}>

                                <Link className="font-weight-bold" style={{ textDecoration: 'none' }}
                                    to={`/summaries/${section.ReportId}`}
                                >

                                    {section.Name}
                                </Link>
                                <Switch>
                                    <Route
                                        exact
                                        path={`/summaries/${section.ReportId}`}
                                    >
                                    </Route>
                                </Switch>

                            </div>)
                    ) : ""}
                </div>
                <div>
                    {chunkedItems[2] ? (
                        chunkedItems[2].map((section) => <div key={section.ReportId} className="border p-1" >
                            <Link className="font-weight-bold" style={{ textDecoration: 'none' }}
                                to={`/summaries/${section.ReportId}`}
                            >
                                {section.Name}
                            </Link>
                            <Switch>
                                <Route
                                    exact
                                    path={`/summaries/${section.ReportId}`}
                                >
                                </Route>
                            </Switch>


                        </div>)
                    ) : ""}
                </div>
                {/* {displayReport()} */}
                {/* {reports.map((section, key) => (
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
                ))} */}
                <hr />
            </div>
        </div>
    )
}

export default Summaries
