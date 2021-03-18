import React, { useState, useEffect } from 'react'
import { useHistory, Link, useParams } from "react-router-dom";
import useFetch from '../../../hooks/fetchMSSQL-hook'

const SummariesReport = () => {
    const [machines, setMachines] = useState([])
    const [report, setReports] = useState([])
    const [timeStamps, setTimeStamps] = useState([])
    const [chosenOptions, setChosenOptions] = useState({ machine: ["123", "123"], users: [], products: [], recipies: [] })
    const [actualReportData, setActualReportData] = useState(
        {
            ReportConditionId: "",
            Name: "",
            TimeSpanName: "",
            IncludeAllMachines: "",
            IncludeAllProducts: "",
            IncludeAllRecipes: "",
            IncludeAllUsers: ""
        }
    )



    const { fetchMssqlApi } = useFetch()
    const { summariesReportId } = useParams()
    const history = useHistory()
    // console.log(ac)
    const handleChange = (e, checkbox) => {
        const name = e.target.name
        const value = e.target.value
        console.log(name, value, checkbox)
        if (checkbox === true) {
            setActualReportData(prev => ({
                ...prev,
                [name]: !prev[name],
            }))
        }
        else
            setActualReportData(prev => ({
                ...prev,
                [name]: value
            }))
    }

    const showSelectedTitle = (name) => {

        if (chosenOptions[name].length > 0) {
            return (
                <div>
                    <div className="text-center headerTitle" style={{ background: "#f3f3f3" }}>{name}</div>
                    {chosenOptions[name].map(val =>
                        <div className="text-center">{val}</div>
                    )}
                </div>
            )
        }
        else return null
    }
    console.log(report)
    useEffect(() => {
        fetchMssqlApi(`/machines`, {}, machines => setMachines(machines))
        fetchMssqlApi(`/report-conditions`, {}, report => setReports(report))
        fetchMssqlApi(`time-spans`, {}, timeStamps => setTimeStamps(timeStamps))
        fetchMssqlApi(`report-condition/${summariesReportId}`, {}, report => setActualReportData(...report))
    }, [])
    return (
        <>
            <div className="row mb-4 justify-content-center">
                <div className="col-12 col-md-6 mb-4 mb-md-0">
                    <div className="card h-100">
                        <h5 className="card-header">Podstawowe Dane </h5>
                        <div className="card-body d-flex flex-column justify-content-center ">
                            <form id="machine-form" autoComplete="off">
                                <div className="row  text-center">
                                    <div className="col-lg-12 mb-2  ">
                                        ID:  {actualReportData.ReportConditionId}
                                    </div>
                                </div>
                                <div className="row mb-3 text-center">
                                    <div className="col-lg-4 mb-2  ">
                                        Name
                                    </div>
                                    <div className="col-lg-8 my-auto">
                                        <input
                                            className="form-control mx-auto mx-lg-0 text-center"
                                            style={{ maxWidth: 275 }}
                                            name={"Name"}
                                            value={actualReportData.Name}
                                            onChange={e => handleChange(e)}
                                            minLength={2}
                                            maxLength={50}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3 text-center">
                                    <div className="col-lg-4 mb-2 mb-lg-0 ">
                                        Okres Czasu
                                    </div>
                                    <div className="col-lg-8 my-auto">

                                        <input
                                            className=" form-control mx-auto mx-lg-0 text-center"
                                            style={{ maxWidth: 275 }}
                                            list="browsers"
                                            name="TimeSpanName"
                                            value={actualReportData.TimeSpanName}
                                            onChange={e => handleChange(e)}
                                            minLength={2}
                                            maxLength={50}
                                            required
                                        />
                                        <datalist id="browsers">
                                            {timeStamps.map((timestamp) => <option value={timestamp.Name} />)}

                                        </datalist>
                                    </div>
                                </div>

                                <div className="row mb-3 text-center">
                                    <div className="col-lg-4 mb-2  ">
                                        <input className="col-lg-4 mb-2 mb-lg-0"
                                            name="IncludeAllMachines"
                                            checked={actualReportData.IncludeAllMachines}
                                            type="checkbox" onChange={e => handleChange(e, true)}
                                            value={actualReportData.IncludeAllMachines} />
                                        IncludeAllMachines

                                    </div>
                                    <div className="col-lg-8 my-auto">
                                        <input
                                            className={actualReportData.IncludeAllMachines ? "d-none" : " form-control mx-auto mx-lg-0 text-center"}
                                            style={{ maxWidth: 275 }}
                                            name="IncludeAllMachines"
                                            value={actualReportData.Name}
                                            onChange={(value) => handleChange(value, actualReportData.Name)}
                                            minLength={2}
                                            maxLength={50}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3 text-center">
                                    <div className="col-lg-4 mb-2  ">
                                        <input className="col-lg-4 mb-2 mb-lg-0"
                                            name="IncludeAllProducts"
                                            checked={actualReportData.IncludeAllProducts}
                                            type="checkbox" onChange={e => handleChange(e, true)}
                                            value={actualReportData.IncludeAllProducts} />
                                        IncludeAllProducts
                                    </div>
                                    <div className="col-lg-8 my-auto">
                                        <input
                                            className={actualReportData.IncludeAllProducts ? "d-none" : " form-control mx-auto mx-lg-0 text-center"}
                                            style={{ maxWidth: 275 }}
                                            name="IncludeAllProducts"
                                            value={actualReportData.IncludeAllProducts}
                                            onChange={(value) => handleChange(value, actualReportData.Name)}
                                            minLength={2}
                                            maxLength={50}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3 text-center">
                                    <div className="col-lg-4 mb-2  ">
                                        <input className="col-lg-4 mb-2 mb-lg-0"
                                            name="IncludeAllRecipes"
                                            checked={actualReportData.IncludeAllRecipes}
                                            type="checkbox" onChange={e => handleChange(e, true)}
                                            value={actualReportData.IncludeAllRecipes} />
                                        IncludeAllRecipes
                                    </div>
                                    <div className="col-lg-8 my-auto">
                                        <input
                                            className={actualReportData.IncludeAllRecipes ? "d-none" : " form-control mx-auto mx-lg-0 text-center"}
                                            style={{ maxWidth: 275 }}
                                            name="IncludeAllRecipes"
                                            value={actualReportData.IncludeAllRecipes}
                                            onChange={(value) => handleChange(value, actualReportData.Name)}
                                            minLength={2}
                                            maxLength={50}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3 text-center">
                                    <div className="col-lg-4 mb-2  ">
                                        <input className="col-lg-4 mb-2 mb-lg-0"
                                            name="IncludeAllUsers"
                                            checked={actualReportData.IncludeAllUsers}
                                            type="checkbox" onChange={e => handleChange(e, true)}
                                            value={actualReportData.IncludeAllUsers} />
                                        IncludeAllProducts
                                    </div>
                                    <div className="col-lg-8 my-auto">
                                        <input
                                            className={actualReportData.IncludeAllUsers ? "d-none" : " form-control mx-auto mx-lg-0 text-center"}
                                            style={{ maxWidth: 275 }}
                                            name="IncludeAllUsers"
                                            value={actualReportData.IncludeAllUsers}
                                            onChange={(value) => handleChange(value, actualReportData.Name)}
                                            minLength={2}
                                            maxLength={50}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="text-center my-3">
                                    <button type="button" className="mr-1 btn btn-primary" onClick={() => history.goBack()}>back</button>
                                    <button className="btn btn-primary" >test</button>
                                </div>
                            </form>

                        </div>

                    </div>

                </div>
                <div className="card">
                    <div className="card-header">
                        <span>twoje wybory</span>
                    </div>
                    {showSelectedTitle("machine")}
                    {showSelectedTitle("users")}
                    {showSelectedTitle("products")}
                    {showSelectedTitle("recipies")}

                </div>

            </div >
        </>
    )
}

export default SummariesReport
