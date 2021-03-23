import React, { useState, useEffect } from 'react'
import { useHistory, Link, useParams } from "react-router-dom";
import useFetch from '../../../hooks/fetchMSSQL-hook'
import { Accordion, Card, Button } from 'react-bootstrap'
const SummariesReport = () => {
    const { fetchMssqlApi } = useFetch()
    const { summariesReportId } = useParams()
    const history = useHistory()

    const [products, setProducts] = useState([])
    const [recipies, setRecipies] = useState([])
    const [machines, setMachines] = useState([])
    const [report, setReports] = useState([])
    const [timeStamps, setTimeStamps] = useState([])
    const [chosenOptions, setChosenOptions] = useState({ machine: ["123", "1234", "4321"], users: [], products: [], recipies: [] })
    const [inputData, setInputData] = useState({
        machine: "",
        products: "",
        recipies: "",
        users: ""
    })
    const [actualReportData, setActualReportData] = useState(
        {
            ReportConditionId: "",
            Name: "",
            TimeSpanName: "",
            IncludeAllMachines: "",
            IncludeAllProducts: "",
            IncludeAllRecipes: "",
            IncludeAllUsers: "",
        }
    )
    const addButton = (name) => {
        if (inputData[name].length > 0)
            setChosenOptions(prev => ({ ...prev, [name]: [...prev[name], inputData[name]] }))
    }
    console.log(chosenOptions)
    const handleChange = (e, checkbox, inputName) => {

        const name = e.target.name
        const value = e.target.value

        if (value === "false" && checkbox) {
            setChosenOptions(prev => ({ ...prev, [inputName]: [] }))
        }

        if (checkbox === true) {
            setActualReportData(prev => ({
                ...prev,
                [name]: !prev[name],
            }))
        }
        else if (name === "TimeSpanName" || name === "Name") {
            console.log(name)
            setActualReportData(prev => ({
                ...prev,
                [name]: value
            }))
        }
        else
            if (value !== "Open this select menu")
                setInputData(prev => ({
                    ...prev,
                    [name]: value
                }))
    }
    const showSelectedTitle = (name) => {
        return (
            <div>
                {chosenOptions[name].length > 0 && <div className="text-center headerTitle" style={{ background: "#f3f3f3" }}>{name}</div>}
                {chosenOptions[name].map((val, idx) =>
                    <div key={idx} className="text-center chosenOption" onClick={() => setChosenOptions(prev => (chosenOptions[name].splice(idx, 1), { ...prev, [name]: chosenOptions[name] }))}>{val}</div>)
                }
            </div >
        )
    }

    useEffect(() => {
        fetchMssqlApi(`/products`, {}, product => setProducts(product))
        fetchMssqlApi(`/recipes`, {}, recipies => setRecipies(recipies))
        fetchMssqlApi(`/machines`, {}, machines => setMachines(machines))
        fetchMssqlApi(`/report-conditions`, {}, report => setReports(report))
        fetchMssqlApi(`time-spans`, {}, timeStamps => setTimeStamps(timeStamps))
        fetchMssqlApi(`report-condition/${summariesReportId}`, {}, report => setActualReportData(...report))
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
    }


    return (
        <>
            <div className="row mb-4 justify-content-center">
                <div className="col-12 col-md-6 mb-4 mb-md-0">
                    <button
                        style={{ width: "1000px !important" }}
                        onClick={() => history.goBack()}
                        className=" btn btn-link text-left text-decoration-none w-100"

                    >
                        <i className="fas fa-arrow-left mr-2" /> wróć
                </button>
                    <div className="card">
                        <h5 className="card-header">Podstawowe Dane </h5>
                        <div className="card-body d-flex flex-column justify-content-center ">
                            <form id="machine-form" onSubmit={(e) => handleSubmit(e)} autoComplete="off">
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
                                            list="Name"
                                            name="Name"
                                            value={actualReportData.Name}
                                            onChange={e => handleChange(e)}
                                            minLength={2}
                                            maxLength={50}

                                        />
                                        <datalist id="Name">
                                            {report.map((report) => <option key={report.ReportConditionId} value={report.Name} />)}
                                        </datalist>
                                    </div>
                                </div>
                                <div className="row mb-3 text-center">
                                    <div className="col-lg-4 mb-2 mb-lg-0 ">
                                        Okres Czasu
                                    </div>
                                    <div className="col-lg-8 my-auto">
                                        <select
                                            className=" form-control mx-auto mx-lg-0 text-center"
                                            style={{ maxWidth: 275 }}
                                            name="TimeSpanName"
                                            value={actualReportData.TimeSpanName}
                                            onChange={e => handleChange(e)}
                                            minLength={2}
                                            maxLength={50}
                                            required
                                        >
                                            {timeStamps.map((timestamp) => <option key={timestamp.TimeSpanId} value={timestamp.Name} > {timestamp.Name} </option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="row mb-3 text-center">
                                    <div className="col-lg-4 mb-2  ">
                                        <input className="col-lg-4 mb-2 mb-lg-0"
                                            name="IncludeAllMachines"
                                            checked={actualReportData.IncludeAllMachines}
                                            type="checkbox" onChange={e => handleChange(e, true, "machine")}
                                            value={actualReportData.IncludeAllMachines} />
                                        IncludeAllMachines

                                    </div>
                                    {actualReportData.IncludeAllMachines === false ? (<div className={" d-flex col-lg-8 my-auto input-group mb-3"}>
                                        <select
                                            type="select"
                                            className={" form-control mx-auto mx-lg-0 text-center"}
                                            style={{ maxWidth: 275 }}
                                            name="machine"
                                            value={inputData.machine}
                                            onChange={(value) => handleChange(value)}
                                            minLength={2}
                                            maxLength={50}
                                        >
                                            <option defaultValue >Open this select menu</option>
                                            {machines.map((machine, idx) => <option key={idx} value={machine.MachineName} > {machine.MachineName}</option>)}

                                        </select>
                                        <button className="fas fa-plus btn btn-primary" onClick={() => addButton("machine")} />
                                    </div>) : ""}
                                </div>
                                <div className="row mb-3 text-center">
                                    <div className="col-lg-4 mb-2  ">
                                        <input className="col-lg-4 mb-2 mb-lg-0"
                                            name="IncludeAllProducts"
                                            checked={actualReportData.IncludeAllProducts}
                                            type="checkbox" onChange={e => handleChange(e, true, "products")}
                                            value={actualReportData.IncludeAllProducts} />
                                        IncludeAllProducts
                                    </div>
                                    {actualReportData.IncludeAllProducts === false ? (<div className={"d-flex col-lg-8 my-auto"}>
                                        <select
                                            className={" form-control mx-auto mx-lg-0 text-center"}
                                            style={{ maxWidth: 275 }}
                                            name="products"
                                            value={inputData.product}
                                            onChange={(value) => handleChange(value)}
                                            minLength={2}
                                            maxLength={50}
                                            list="IncludeProducts"
                                            required
                                        >
                                            <option defaultValue >Open this select menu</option>
                                            {products.map((product, idx) => <option key={idx} value={product.Name} >{product.Name}</option>)}
                                        </select>
                                        <button className="fas fa-plus btn btn-primary" onClick={() => addButton("products")} />
                                    </div>) : ""}
                                </div>
                                <div className="row mb-3 text-center">
                                    <div className="col-lg-4 mb-2  ">
                                        <input className="col-lg-4 mb-2 mb-lg-0"
                                            name="IncludeAllRecipes"
                                            checked={actualReportData.IncludeAllRecipes}
                                            type="checkbox" onChange={e => handleChange(e, true, "recipies")}
                                            value={actualReportData.IncludeAllRecipes} />
                                        IncludeAllRecipes
                                    </div>
                                    {actualReportData.IncludeAllRecipes === false ? (<div className={"d-flex col-lg-8 my-auto "}>
                                        <select
                                            className={" form-control mx-auto mx-lg-0 text-center"}
                                            style={{ maxWidth: 275 }}
                                            name="recipies"
                                            value={inputData.recipies}
                                            onChange={(value) => handleChange(value)}
                                            aria-label="Select Value"
                                            required
                                        >
                                            <option defaultValue >Open this select menu</option>
                                            {recipies.map((recipe) => <option key={recipe.RecipeId} value={recipe.Name} >{recipe.Name}</option>)}
                                        </select>
                                        <button type="button" className="fas fa-plus btn btn-primary" onClick={() => addButton("recipies")} />
                                    </div>) : ""}
                                </div>


                                {/* <div className="row mb-3 text-center">
                                    <div className="col-lg-4 mb-2  ">
                                        <input className="col-lg-4 mb-2 mb-lg-0"
                                            name="IncludeAllUsers"
                                            checked={actualReportData.IncludeAllUsers}
                                            type="checkbox" onChange={e => handleChange(e, true)}
                                            value={actualReportData.IncludeAllUsers} />
                                        IncludeAllUsers
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
                                            list="IncludeUsers"
                                            required
                                        />
                                        <datalist id="IncludeUsers">
                                            {users.map((recipe) => <option value={recipe.Name} />)}
                                        </datalist>
                                    </div>
                                </div> */}
                                <div className="text-center my-3">
                                    <button className="btn btn-primary" >Submit</button>
                                </div>
                            </form>

                        </div>

                    </div>

                </div>
                <Accordion defaultActiveKey="0" className="col-lg-3 col-md-6 col-sm-12">
                    <Card style={{ marginTop: "37.5px" }}>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                Twoje wybory
                         </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0" style={{ overflowY: "scroll", height: "437.5px" }}>
                            <Card.Body className="p-0 m-0" style={{ height: "437.5px" }}>
                                {showSelectedTitle("machine")}
                                {showSelectedTitle("users")}
                                {showSelectedTitle("products")}
                                {showSelectedTitle("recipies")}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                </Accordion>

            </div>
        </>
    )
}

export default SummariesReport
