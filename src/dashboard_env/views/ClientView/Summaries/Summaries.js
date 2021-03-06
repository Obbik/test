import React, { useEffect, useState, useContext } from 'react'
import { Link, Route, Switch } from "react-router-dom"
import { NavigationContext } from '../../../context/navigation-context'
import './index.css'

import _ from "lodash"
import useFetch from '../../../hooks/fetchMSSQL-hook'

import "./index.css"


const Summaries = () => {
    const { setHeaderData } = useContext(NavigationContext)
    const { fetchMssqlApi } = useFetch()
    const [clickedCategory, setClickedCategory] = useState()
    const [reports, setReports] = useState([])

    const groupedReports = _.groupBy(reports, (data) => data.ParentName)
    useEffect(() => {
        fetchMssqlApi(`/reports`, {}, report => setReports(report))

        setHeaderData({ text: "Zestawienia" })

    }, [])



    const divStyle = {
        width: "200px",
        backgroundColor: "#f1f1f1"
    };


    return (
        <div className="d-flex align-items-center flex-column justify-content-center align-self-center text-center ">
            <h1>Wybierz raport</h1>
            <div className=" blue d-flex flex-wrap sm-justify-content-start md-justify-content-center text-center my-1 rounded col-lg-12 my-1  col-sm-12 my-2 py-2  ">
                <div className="left mr-2">
                    {Object.keys(groupedReports).map((elem, idx) => <div key={idx} className="font-weight-bold button " onClick={() => setClickedCategory(elem)}>

                        {elem}

                    </div>)}
                </div>
                <div className="right">
                    {groupedReports[clickedCategory]?.map(elem =>

                        <div className="p-3 button " key={elem.ReportId}  >
                            <Link className="font-weight-bold"
                                title={elem.GeneralDescription}
                                data-toggle="popover"
                                data-placement="top"
                                data-trigger="hover"
                                data-content="Click anywhere in the document to close this popover"
                                data-container="body"
                                style={{ textDecoration: 'none', color: "#000000" }}
                                to={`/summaries/${elem.ReportId}`}
                            >

                                {elem.Name}
                            </Link>
                            <Switch>
                                <Route
                                    exact
                                    path={`/summaries/${elem.ReportId}`}
                                >
                                </Route>
                            </Switch>

                        </div>

                    )}
                </div>
            </div>
        </div >
    )
}

export default Summaries
