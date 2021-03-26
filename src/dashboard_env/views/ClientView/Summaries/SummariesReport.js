import React, { useState, useEffect, useRef, createRef } from 'react'
import { useHistory, Link, useParams } from "react-router-dom";
import useFetch from '../../../hooks/fetchMSSQL-hook'
import { Accordion, Card, Button } from 'react-bootstrap'
const SummariesReport = () => {
    const { fetchMssqlApi } = useFetch()
    const { summariesReportId } = useParams()
    const history = useHistory()
    const input = createRef()
    const [products, setProducts] = useState([])
    const [recipies, setRecipies] = useState([])
    const [machines, setMachines] = useState([])
    const [report, setReports] = useState([])
    const [timeStamps, setTimeStamps] = useState([])
    const [chosenOptions, setChosenOptions] = useState({ machine: [], user: [], product: [], recipe: [] })
    const [displayChosenOptions, setDisplayChosenOptions] = useState(chosenOptions)
    const [inputData, setInputData] = useState({
        machine: "",
        product: "",
        recipe: "",
        user: ""
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
    console.log(actualReportData)
    const addButton = (name) => {
        let nameObject = 0
        const upperFirstLetterName = `${name.charAt(0).toUpperCase() + name.slice(1)}`
        const id = parseInt(inputData[name])
        if (name === "machine") {
            nameObject = machines.find(obj => obj.MachineId == id)
        }
        else if (name === "product") {
            nameObject = products.find(obj => obj.EAN == id)
        }
        else if (name === "recipe") {
            nameObject = recipies.find(obj => obj.RecipeId == id)
        }
        if (!nameObject) return

        fetchMssqlApi(`report-condition-${name}`,
            { method: "POST", data: { ReportConditionId: summariesReportId, [upperFirstLetterName + "Id"]: id } })
        if (name === "machine") {
            setChosenOptions(prev =>
            ({
                ...prev, [name]: [...prev[name],
                {
                    [upperFirstLetterName + "Name"]: nameObject[upperFirstLetterName + "Name"],
                    [`ReportCondition${upperFirstLetterName}Id`]: nameObject[upperFirstLetterName + "Id"]
                }]
            }))
        }
        else if (name === "product" || name === "recipe") {
            setChosenOptions(prev =>
            ({
                ...prev, [name]: [...prev[name],
                {
                    [upperFirstLetterName + "Name"]: nameObject.Name,
                    [`ReportCondition${upperFirstLetterName}Id`]: nameObject[upperFirstLetterName + "Id"]
                }]
            }))
        }
    }

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
    const toggleTitle = (name) => {
        displayChosenOptions[name].length !== 0 ?
            setDisplayChosenOptions(prev => ({ ...prev, [name]: [] }))
            :
            setDisplayChosenOptions(prev => ({ ...prev, [name]: chosenOptions[name] }))
    }
    const showSelectedTitle = (name) => {
        const upperFirstLetterName = `${name.charAt(0).toUpperCase() + name.slice(1)}`
        return (
            <div>
                {chosenOptions[name].length > 0 && <div className="text-center headerTitle" style={{ background: "#f3f3f3" }}>
                    <input className="form-check-input" style={{ marginTop: "6px", position: "relative" }} type="checkbox" id={name} onClick={() => toggleTitle(name)} />
                    <label className="form-check-label" htmlFor={name}>{name}</label>
                </div>}

                {displayChosenOptions[name].map((value, idx) =>
                    <div key={idx} className="text-center chosenOption" onClick={

                        () => fetchMssqlApi(`report-condition-${name}/${value[`ReportCondition${upperFirstLetterName}Id`]}`, { method: "DELETE" },
                            setChosenOptions(prev => (chosenOptions[name].splice(idx, 1), { ...prev, [name]: chosenOptions[name] }))
                        )
                    }>
                        {`${value[upperFirstLetterName + "Name"]}`}
                    </div>)
                }
            </div >
        )
    }

    useEffect(() => {
        fetchMssqlApi(`/products-list`, {}, product => setProducts(product))
        fetchMssqlApi(`/reports-list`, {}, report => setReports(report))
        fetchMssqlApi(`/recipes`, {}, recipies => setRecipies(recipies))
        fetchMssqlApi(`/machines`, {}, machines => setMachines(machines))
        fetchMssqlApi(`/report-conditions`, {}, report => setReports(report))
        fetchMssqlApi(`time-spans`, {}, timeStamps => setTimeStamps(timeStamps))
        fetchMssqlApi(`report-condition/${summariesReportId}`, {}, report => setActualReportData(report))
        fetchMssqlApi(`report-condition-machines?reportConditionId=${summariesReportId}`, {}, value =>
            setChosenOptions(prev => ({ ...prev, machine: value })))
        fetchMssqlApi(`report-condition-users?reportConditionId=${summariesReportId}`, {}, value =>
            setChosenOptions(prev => ({ ...prev, user: value })))
        fetchMssqlApi(`report-condition-products?reportConditionId=${summariesReportId}`, {}, value =>
            setChosenOptions(prev => ({ ...prev, product: value })))
        fetchMssqlApi(`/report-condition-recipes?reportConditionId=${summariesReportId}`, {}, value =>
            setChosenOptions(prev => ({ ...prev, recipe: value })))
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    useEffect(() => {
        setDisplayChosenOptions(chosenOptions)

    }, [chosenOptions])

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
                                        ID: {actualReportData.ReportConditionId}
                                    </div>
                                </div>
                                <div className="row  text-center">
                                    <div className="col-lg-12 mb-2  ">
                                        Typ raportu:  {actualReportData.ReportName}
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
                                            disabled
                                            value={actualReportData.Name}
                                            onChange={e => handleChange(e)}
                                            minLength={2}
                                            maxLength={50}

                                        />
                                        {/* <datalist id="Name">
                                            {report.map((report) => <option key={report.ReportConditionId} value={report.Name} />)}
                                        </datalist> */}
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
                                            {machines.map((machine, idx) => <option key={machine.MachineId} value={parseInt(machine.MachineId)} > {machine.MachineName}</option>)}

                                        </select>
                                        <button className="fas fa-plus btn btn-primary" onClick={() => addButton("machine")} />
                                    </div>) : ""}
                                </div>
                                <div className="row mb-3 text-center">
                                    <div className="col-lg-4 mb-2  ">
                                        <input className="col-lg-4 mb-2 mb-lg-0"
                                            name="IncludeAllProducts"
                                            checked={actualReportData.IncludeAllProducts}
                                            type="checkbox" onChange={e => handleChange(e, true, "product")}
                                            value={actualReportData.IncludeAllProducts} />
                                        IncludeAllProducts
                                    </div>
                                    {actualReportData.IncludeAllProducts === false ? (<div className={"d-flex col-lg-8 my-auto"}>
                                        <select
                                            className={" form-control mx-auto mx-lg-0 text-center"}
                                            style={{ maxWidth: 275 }}
                                            name="product"
                                            value={inputData.product}
                                            onChange={(value) => handleChange(value)}
                                            minLength={2}
                                            maxLength={50}
                                            list="IncludeProducts"
                                            required
                                        >
                                            <option defaultValue >Open this select menu</option>
                                            {products.map((product, idx) => <option key={idx} value={product.EAN} >{product.Name}</option>)}
                                        </select>
                                        <button className="fas fa-plus btn btn-primary" onClick={() => addButton("product")} />
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
                                            name="recipe"
                                            value={inputData.recipies}
                                            onChange={(value) => handleChange(value)}
                                            aria-label="Select Value"
                                            required
                                        >
                                            <option defaultValue >Open this select menu</option>
                                            {recipies.map((recipe) => <option key={recipe.RecipeId} value={recipe.RecipeId} >{recipe.Name}</option>)}
                                        </select>
                                        <button type="button" className="fas fa-plus btn btn-primary" onClick={() => addButton("recipe")} />
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
                                {showSelectedTitle("user")}
                                {showSelectedTitle("product")}
                                {showSelectedTitle("recipe")}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                </Accordion>

            </div>
        </>
    )
}

export default SummariesReport
