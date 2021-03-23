
import React, { useState, useContext, useEffect } from 'react'
import { useHistory, Link, useParams } from "react-router-dom";
import { NavigationContext } from '../../../context/navigation-context'
import { LangContext } from '../../../context/lang-context'


import useFetch from '../../../hooks/fetchMSSQL-hook'
import useForm from '../../../hooks/form-hook'

import SummaryForm from '../../../components/Modals/SummaryForm';

const SummaryFilter = (props) => {
    const [reports, setReports] = useState([])
    const [timeStamps, setTimeStamps] = useState([])
    const { fetchMssqlApi } = useFetch()
    const { TRL_Pack } = useContext(LangContext)

    const { form, openForm, closeForm } = useForm()

    let history = useHistory();

    useEffect(() => {
        fetchMssqlApi(`report-conditions`, {}, reports => setReports(reports))
        fetchMssqlApi(`time-spans`, {}, timeStamps => setTimeStamps(timeStamps))
    }, [])
    return (
        <>
            <div>
                <div className="d-flex justify-content-end">
                    <button
                        onClick={() => history.goBack()}
                        className=" btn btn-link text-decoration-none"

                    >
                        {/* <i className="fas fa-arrow-left mr-2" /> wróć */}
                    </button>
                    <div style={{ flex: "1" }} />
                    <button
                        className=" btn btn-link text-decoration-none "
                        onClick={openForm()}
                    >
                        <i className="fas fa-plus ml-2" /> Dodaj Raport
                </button>
                    {console.log(reports)}
                </div>
            </div>
            <div className="overflow-auto text-center">
                <table className="table table-striped border table-hover" >
                    <thead>
                        <tr>
                            <th>ID</th>
                            {/* <th>User</th> */}
                            <th>Name</th>
                            <th>Time</th>
                            <th>shared</th>
                            {/* <th>mail sender</th>
                            <th>datetime</th> */ }
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody >
                        {reports
                            .map((data, idx) => (
                                <tr key={idx} className="mx-2">
                                    <td>{data.ReportConditionId}</td>
                                    <td>{data.Name}</td>
                                    <td>{data.TimeSpanName}</td>
                                    <td style={{ width: "30px" }}>
                                        <Link
                                            to={`${props.location.pathname}/${data.ReportConditionId}`}
                                            className="btn btn-link link-icon"
                                        >
                                            <i className="far fa-edit" />
                                        </Link></td>

                                    <td style={{ width: "30px" }}>
                                        <button
                                            className=" btn btn-link text-decoration-none "
                                        >
                                            <i className="fa fa-download" />
                                        </button>
                                    </td>

                                </tr>

                            ))}
                    </tbody>
                </table>
            </div>
            {form !== "acceptModal" && form && (
                <SummaryForm
                    headerText="Podsumownie"
                    handleClose={closeForm}
                    timeStamps={timeStamps}
                    reportName={reports}
                />
            )}
        </>

    )
}

export default SummaryFilter
