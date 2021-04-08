import React, { useState, useEffect, useContext } from 'react'
import { Redirect, useHistory, useParams } from "react-router-dom";
import useFetch from '../../../hooks/fetchMSSQL-hook'
import { LangContext } from '../../../context/lang-context'
import { Accordion, Card, Button } from 'react-bootstrap'
import { API_URL } from '../../../config/config'
import { NotificationContext } from '../../../context/notification-context'

import { NotificationManager } from 'react-notifications'

import axios from "axios"
import moment from "moment"
const SummariesReport = (props) => {
    const { ErrorNotification, SuccessNofication } = useContext(NotificationContext)
    const { TRL_Pack } = useContext(LangContext)
    const { fetchMssqlApi } = useFetch()
    const { summariesReportId } = useParams()
    const history = useHistory()
    const [category, setCategory] = useState([])
    const [products, setProducts] = useState([])
    const [recipies, setRecipies] = useState([])
    const [machines, setMachines] = useState([])
    const [report, setReports] = useState([])
    const [user, setUsers] = useState([])

    const [timeStamps, setTimeStamps] = useState([])
    const [chosenOptions, setChosenOptions] = useState({ machine: [], user: [], product: [], recipe: [] })
    const [displayChosenOptions, setDisplayChosenOptions] = useState(chosenOptions)
    const [inputData, setInputData] = useState({
        machine: "",
        product: "",
        recipe: "",
        user: ""
    })

    let reportName = report.find((obj) => obj.ReportId == props.match.params.ReportId)
    const [actualReportData, setActualReportData] = useState(
        {
            ReportConditionId: "",
            Name: "",
            TimeSpanName: "",
            IncludeAllMachines: true,
            IncludeAllProducts: true,
            IncludeAllRecipes: true,
            IncludeAllUsers: true,
            EndDateTime: new Date().toISOString().split('T')[0] + "T" + "23:" + "59:" + "59",
            StartDateTime: new Date().toISOString().split('T')[0] + "T" + "00:" + "00:" + "00"
        }
    )

    const addButton = (name) => {
        const token = localStorage.getItem('token')


        let nameObject = 0
        const upperFirstLetterName = `${name.charAt(0).toUpperCase() + name.slice(1)}`
        const id = parseInt(inputData[name])

        if (name === "machine") {
            nameObject = machines.find(obj => obj.MachineId == id)
        }
        else if (name === "user") {
            nameObject = user.find(obj => obj.UserId == id)
        }
        else if (name === "product") {
            nameObject = products.find(obj => obj.EAN == id)
        }
        else if (name === "recipe") {
            nameObject = recipies.find(obj => obj.RecipeId == id)
        }
        if (!nameObject) return

        if (props.match.params.summariesReportId === "new") {
            if (name === "user") {
                setChosenOptions(prev =>
                ({
                    ...prev, [name]: [...prev[name],
                    {
                        [upperFirstLetterName + "Name"]: nameObject.Name,
                        [`${upperFirstLetterName}Id`]: nameObject[upperFirstLetterName + "Id"]
                    }]
                }))
            }
            else if (name === "product") {
                setChosenOptions(prev =>
                ({
                    ...prev, [name]: [...prev[name],
                    {
                        [upperFirstLetterName + "Name"]: nameObject.Name,
                        [`${upperFirstLetterName}Id`]: nameObject.EAN
                    }]
                }))
            }
            else if (name === "machine") {
                setChosenOptions(prev =>
                ({
                    ...prev, [name]: [...prev[name],
                    {
                        [upperFirstLetterName + "Name"]: nameObject.MachineName,
                        [`${upperFirstLetterName}Id`]: nameObject[upperFirstLetterName + "Id"]
                    }]
                }))
            }
            else if (name === "recipe") {
                setChosenOptions(prev =>
                ({
                    ...prev, [name]: [...prev[name],
                    {
                        [upperFirstLetterName + "Name"]: nameObject.Name,
                        [`${upperFirstLetterName}Id`]: nameObject.RecipeId
                    }]
                }))
            }


            return
        }
        else if (name === "product")
            axios({
                method: "POST",
                url: `${API_URL}/api/report-condition-${name}`,
                data: { ReportConditionId: parseInt(summariesReportId), Ean: id },
                headers: { Authorization: `Bearer ${token}` }
            }).then((res) => {
                SuccessNofication(res.data.message)
                setChosenOptions(prev =>
                ({
                    ...prev, [name]: [...prev[name],
                    {
                        [upperFirstLetterName + "Name"]: nameObject.Name,
                        [`ReportCondition${upperFirstLetterName}Id`]: res.data.id
                    }]
                }))
            }).catch(err => {
                if (err.response.data.message === "jwt malformed") window.location.reload();
                else ErrorNotification(err.response?.data || err.toString())
            })
        else if (name === "user")
            axios({
                method: "POST",
                url: `${API_URL}/api/report-condition-${name}`,
                data: { ReportConditionId: parseInt(summariesReportId), UserId: id },
                headers: { Authorization: `Bearer ${token}` }
            }).then((res) => {
                SuccessNofication(res.data.message)
                setChosenOptions(prev =>
                ({
                    ...prev, [name]: [...prev[name],
                    {
                        [upperFirstLetterName + "Name"]: nameObject.Name,
                        [`ReportCondition${upperFirstLetterName}Id`]: res.data.id
                    }]
                }))
            }).catch(err => {
                if (err.response.data.message === "jwt malformed") window.location.reload();
                else ErrorNotification(err.response?.data || err.toString())
            })

        if (name === "machine") {
            axios({
                method: "POST",
                url: `${API_URL}/api/report-condition-${name}`,
                data: { ReportConditionId: parseInt(summariesReportId), MachineId: id },
                headers: { Authorization: `Bearer ${token}` }
            }).then((res) => {
                SuccessNofication(res.data.message)
                setChosenOptions(prev =>
                ({
                    ...prev, [name]: [...prev[name],
                    {
                        [upperFirstLetterName + "Name"]: nameObject.MachineName,
                        [`ReportCondition${upperFirstLetterName}Id`]: res.data.id
                    }]
                }))
            }).catch(err => {
                if (err.response.data.message === "jwt malformed") window.location.reload();
                else ErrorNotification(err.response?.data || err.toString())
            })
        }
        else if (name === "recipe") {
            axios({
                method: "POST",
                url: `${API_URL}/api/report-condition-${name}`,
                data: { ReportConditionId: parseInt(summariesReportId), RecipeId: id },
                headers: { Authorization: `Bearer ${token}` }
            }).then((res) => {
                SuccessNofication(res.data.message)
                setChosenOptions(prev =>
                ({
                    ...prev, [name]: [...prev[name],
                    {
                        [upperFirstLetterName + "Name"]: nameObject.Name,
                        [`ReportCondition${upperFirstLetterName}Id`]: res.data.id
                    }]
                }))
            }).catch(err => {
                if (err.response.data.message === "jwt malformed") window.location.reload();
                else ErrorNotification(err.response?.data || err.toString())
            })
        }

    }

    const getIndividualData = () => {
        getCategoryData()

        fetchMssqlApi(`report-condition-machines?reportConditionId=${summariesReportId}`, {}, value =>
            setChosenOptions(prev => ({ ...prev, machine: value })))
        fetchMssqlApi(`report-condition-users?reportConditionId=${summariesReportId}`, {}, value =>
            setChosenOptions(prev => ({ ...prev, user: value })))
        fetchMssqlApi(`report-condition-products?reportConditionId=${summariesReportId}`, {}, value =>
            setChosenOptions(prev => ({ ...prev, product: value })))
        fetchMssqlApi(`/report-condition-recipes?reportConditionId=${summariesReportId}`, {}, value =>
            setChosenOptions(prev => ({ ...prev, recipe: value })))
        fetchMssqlApi(`report-condition/${summariesReportId}`, {}, report => setActualReportData(report))
    }

    const getCategoryData = () => {
        fetchMssqlApi(`report/${props.match.params.ReportId}`, {}, category => setCategory(category))
        fetchMssqlApi(`users`, {}, users => setUsers(users))
        fetchMssqlApi(`/products-list`, {}, product => setProducts(product))
        fetchMssqlApi(`/reports-list`, {}, report => setReports(report))
        fetchMssqlApi(`/recipes`, {}, recipies => setRecipies(recipies))
        fetchMssqlApi(`/machines`, {}, machines => setMachines(machines))
        fetchMssqlApi(`report-time-spans?reportId=${props.match.params.ReportId}`, {}, timeStamps => setTimeStamps(timeStamps))

    }

    const handleChangeDate = (e, endtime) => {
        let value = e.target.value
        endtime ?
            setActualReportData((prev) => ({ ...prev, EndDateTime: value }))
            :
            setActualReportData((prev) => ({ ...prev, StartDateTime: value }))

    }
    const isCustomDateNeeded = () => {
        const timeStamp = (timeStamps.find(obj => obj.Name === actualReportData.TimeSpanName))
        if (timeStamp?.TimeSpanId === "2" || timeStamp?.TimeSpanId === "18") {
            return (
                <div className="  mt-3 mb-3 d-flex justify-content-center">
                    <input type="datetime-local" style={{ borderRadius: "25px 25px 25px 25px", border: "1px solid #6c757d " }} className=" input-group pl-2 date col-lg-6 col-md-8  col-sm-7 mb-2 mb-lg-0"
                        value={moment(actualReportData.StartDateTime).format("YYYY-MM-DDTkk:mm")} onChange={(e) => handleChangeDate(e)}
                    />
                </div>
            )
        }
        else if (timeStamp?.TimeSpanId === "3") {
            return (
                <div className=" mt-3 mb-1 d-flex justify-content-center ">
                    <div className="mr-2">
                        <input type="datetime-local" value={moment(actualReportData.StartDateTime).format("YYYY-MM-DDTkk:mm")} onChange={(e) => handleChangeDate(e)} className=" w-100 input-group " />
                        Data początkowa
                    </div>
                    <div className="">
                        <input type="datetime-local" value={moment(actualReportData.EndDateTime).format("YYYY-MM-DDTkk:mm")} onChange={(e) => handleChangeDate(e, true)} className=" w-100 input-group" />
                        Data końcowa
                    </div>
                </div>
            )
        }


    }

    const handleChange = (e, checkbox, inputName) => {
        const name = e.target.name
        const value = e.target.value

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

            if (value !== "Open this select menu" || value !== "Naciśnij aby otworzyć menu")
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
    const showSelectedTitle = (name, displayName) => {


        const upperFirstLetterName = `${name.charAt(0).toUpperCase() + name.slice(1)}`
        const includeAll = actualReportData[`IncludeAll${upperFirstLetterName}s`]
        return (
            <div>
                {chosenOptions[name].length > 0 &&
                    <div className="text-center headerTitle " style={{ background: "#f3f3f3" }}>
                        <input className="form-check-input" type="checkbox" id={name} onClick={() => toggleTitle(name)} />
                        <label style={includeAll ? { textDecoration: "line-through" } : {}} className="form-check-label" htmlFor={name}>
                            {displayName}
                        </label>
                    </div>}

                {displayChosenOptions[name].map((value, idx) =>
                    <div key={idx} className="text-center chosenOption" style={includeAll ? { textDecoration: "line-through" } : {}} onClick={
                        props.match.params.summariesReportId !== "new" ?
                            () => fetchMssqlApi(`report-condition-${name}/${value[`ReportCondition${upperFirstLetterName}Id`]}`, { method: "DELETE" },
                                setChosenOptions(prev => (chosenOptions[name].splice(idx, 1), { ...prev, [name]: chosenOptions[name] })))
                            :
                            () => setChosenOptions(prev => (chosenOptions[name].splice(idx, 1), { ...prev, [name]: chosenOptions[name] }))
                    }>
                        {`${value[upperFirstLetterName + "Name"]}`}
                    </div>)
                }
            </div >
        )
    }
    const handleSortTable = (e) => {
        for (const [key, value] of Object.entries(displayChosenOptions)) {
            const uppercaseName = `${key.charAt(0).toUpperCase() + key.slice(1)}Name`
            const filtered = value.filter(item => item[uppercaseName].toLowerCase().includes(e.target.value));
            e.target.value.length == 0 ? setDisplayChosenOptions(chosenOptions) :
                setDisplayChosenOptions((prev) => ({
                    ...prev,
                    [key]: filtered
                }))
        }
    }


    const handleSubmit = (e) => {

        let data
        e.preventDefault()
        const { ReportId } = report.find(obj => obj.Name === actualReportData.ReportName)

        const { Name, TimeSpanName, IncludeAllUsers, IncludeAllMachines, StartDateTime, EndDateTime, IncludeAllProducts, IncludeAllRecipes } = actualReportData

        const { TimeSpanId } = timeStamps.find(obj => obj.Name === TimeSpanName)


        EndDateTime?.length > 0 ? data = {
            Name,
            TimeSpanId: parseInt(TimeSpanId),
            ReportId: parseInt(ReportId),
            IncludeAllMachines: Number(IncludeAllMachines),
            IncludeAllProducts: Number(IncludeAllProducts),
            IncludeAllRecipes: Number(IncludeAllRecipes),
            IncludeAllUsers: Number(IncludeAllUsers),
            StartDateTime,
            EndDateTime
        } :
            data = {
                Name,
                TimeSpanId: parseInt(TimeSpanId),
                ReportId: parseInt(ReportId),
                IncludeAllMachines: Number(IncludeAllMachines),
                IncludeAllProducts: Number(IncludeAllProducts),
                IncludeAllRecipes: Number(IncludeAllRecipes),
                IncludeAllUsers: Number(IncludeAllUsers),
                StartDateTime

            }

        fetchMssqlApi(`report-condition/${actualReportData.ReportConditionId}`, {
            method: "PUT", data
        })
        getIndividualData()
        getCategoryData()
    }


    const handleSubmitNew = (e) => {
        let data
        let timeData
        let TimeSpanid = 1
        const token = localStorage.getItem('token')
        e.preventDefault()


        const { Name, TimeSpanName, IncludeAllUsers, IncludeAllMachines, StartDateTime, EndDateTime, IncludeAllProducts, IncludeAllRecipes } = actualReportData


        if (TimeSpanName === TRL_Pack.summaries.openSelectBar || TimeSpanName === "") {
            NotificationManager.error("Wybierz prawidłową datę")
            return
        }

        if (TimeSpanName) {
            timeData = timeStamps.find(obj => obj.Name === TimeSpanName)
            TimeSpanid = timeData.TimeSpanId
        }

        EndDateTime?.length > 0 ? data = {
            Name,
            ReportId: Number(props.match.params.ReportId),
            IncludeAllMachines: Number(IncludeAllMachines),
            IncludeAllProducts: Number(IncludeAllProducts),
            IncludeAllRecipes: Number(IncludeAllRecipes),
            IncludeAllUsers: Number(IncludeAllUsers),
            TimeSpanId: Number(TimeSpanid),
            StartDateTime,
            EndDateTime
        } :
            data = {
                Name,
                ReportId: Number(props.match.params.ReportId),
                IncludeAllMachines: Number(IncludeAllMachines),
                IncludeAllProducts: Number(IncludeAllProducts),
                IncludeAllRecipes: Number(IncludeAllRecipes),
                IncludeAllUsers: Number(IncludeAllUsers),
                TimeSpanId: Number(TimeSpanid),
                StartDateTime,


            }

        axios({
            method: "POST",
            url: `${API_URL}/api/report-condition`,
            data,
            headers: { Authorization: `Bearer ${token}` }
        }).then((res) => {
            if (chosenOptions?.machine?.length > 0) {
                let MachineData = []
                chosenOptions.machine.forEach(element => {
                    MachineData.push({ ReportConditionId: res.data.id, MachineId: element.MachineId })
                });

                fetchMssqlApi(`/report-condition-machine`, {
                    method: "POST", data: MachineData
                })
            }

            if (chosenOptions?.product?.length > 0) {
                let ProductData = []
                chosenOptions.product.forEach(element => {

                    ProductData.push({ ReportConditionId: res.data.id, Ean: element.ProductId })
                });

                fetchMssqlApi(`/report-condition-product`, {
                    method: "POST", data: ProductData
                })

            }
            if (chosenOptions?.recipe?.length > 0) {
                let RecipeData = []
                chosenOptions.recipe.forEach(element => {

                    RecipeData.push({ ReportConditionId: res.data.id, RecipeId: element.RecipeId })
                });
                fetchMssqlApi(`/report-condition-recipe`, {
                    method: "POST", data: RecipeData
                })

            }
            console.log(chosenOptions)
            if (chosenOptions?.user?.length > 0) {
                let UserData = []
                chosenOptions.user.forEach(element => {

                    UserData.push({ ReportConditionId: res.data.id, UserId: element.UserId })
                });
                fetchMssqlApi(`/report-condition-user`, {
                    method: "POST", data: UserData
                })

            }

            history.push(`/summaries/${props.match.params.ReportId}/${res.data.id}`)
            window.location.reload()



        }).catch(err => {
            if (err.response.data.message === "jwt malformed") window.location.reload();
            else ErrorNotification(err.response?.data || err.toString())
        })
    }



    const downloadReport = () => {
        const token = localStorage.getItem('token')
        axios({
            method: "POST",
            url: `${API_URL}/api/report-guid`,
            data: { ReportConditionId: parseInt(summariesReportId) },
            headers: { Authorization: `Bearer ${token}` }
        }).then((res) => {
            window.open(res.data.url)
        }).catch(err => {
            if (err.response.data.message === "jwt malformed") window.location.reload();
            else ErrorNotification(err.response?.data || err.toString())
        })
    }
    useEffect(() => {
        setDisplayChosenOptions(chosenOptions)

    }, [chosenOptions])

    useEffect(() => {
        if (props.match.params.summariesReportId === "new") {
            getCategoryData()
        }
        else {
            getIndividualData()
            getCategoryData()
        }
    }, [])
    return (
        <>
            <div className="row mb-4 justify-content-center">
                <div className="col-12 col-md-6 mb-4 mb-md-0">
                    <div
                        style={{ width: "1000px !important" }}

                        className=" btn btn-link justify-content-between d-flex text-decoration-none w-100"

                    >
                        <i className="fas fa-arrow-left mr-2 text-decoration-none" onClick={() => history.push(`/summaries/${props.match.params.ReportId}`)} > {TRL_Pack.summaries.back}</i>
                        {props.match.params.summariesReportId !== "new" && (<i className="fa fa-download mr-2 text-decoration-none" onClick={() => downloadReport()} > {TRL_Pack.summaries.download}</i>)}
                    </div>

                    <div className="card">
                        <h5 className="card-header">Podstawowe Dane </h5>
                        <div className="card-body d-flex flex-column justify-content-center ">
                            <form id="machine-form" onSubmit={(e) => e.preventDefault()} autoComplete="off">

                                <div className="row  text-center">
                                    <div className="col-lg-12 mb-2  ">
                                        {TRL_Pack.summaries.reportType}  {reportName?.Name}
                                    </div>
                                </div>
                                <div className="row mb-3 text-center">
                                    <div className="col-lg-4 mb-2  ">
                                        {TRL_Pack.summaries.name}
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
                                    </div>
                                </div>

                                <div className="row mb-3 text-center justify-content-center">
                                    <div className="col-lg-4 mb-2 mb-lg-0 ">
                                        {TRL_Pack.summaries.timeStamp}
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
                                            {props.match.params.summariesReportId === "new" && <option defaultValue value={TRL_Pack.summaries.openSelectBar} >{TRL_Pack.summaries.openSelectBar}</option>}
                                            {timeStamps.map((timestamp) => <option key={timestamp.TimeSpanId} value={timestamp.Name} > {timestamp.Name} </option>)}
                                        </select>
                                    </div>

                                </div>
                                {
                                    isCustomDateNeeded()
                                }

                                {category.IncludeUsers ? (
                                    <div className="row mb-3 text-center">
                                        <div className="col-lg-4 mb-2  d-flex flex-column align-items-center">
                                            <input className="col-lg-4 mb-2 mb-lg-0"
                                                name="IncludeAllUsers"
                                                checked={actualReportData.IncludeAllUsers}
                                                type="checkbox" onChange={e => handleChange(e, true)}
                                                value={actualReportData.IncludeAllUsers} />
                                            <span className="text-center">{TRL_Pack.summaries.includeAllUsers}</span>
                                        </div>
                                        {actualReportData.IncludeAllUsers === false && (


                                            <div className="d-flex col-lg-8 my-auto input-group mb-3">
                                                <select
                                                    className={" form-control mx-auto mx-lg-0 text-center"}
                                                    style={{ maxWidth: 275 }}
                                                    name="user"
                                                    value={inputData.users}
                                                    onChange={(value) => handleChange(value)}
                                                    minLength={2}
                                                    maxLength={50}
                                                    required
                                                >

                                                    <option defaultValue >{TRL_Pack.summaries.openSelectBar}</option>
                                                    {user.map((user, ksx) => <option key={ksx} value={user.UserId} >{user.Name}</option>)}

                                                </select>
                                                <button className="fas fa-plus btn btn-primary" onClick={() => addButton("user")} />
                                            </div>
                                        )}

                                    </div>
                                ) : ""}

                                {category.IncludeMachines && (

                                    <div className="row mb-3 text-center">
                                        <div className="col-lg-4 mb-2  d-flex flex-column align-items-center">
                                            <input className="col-lg-4 mb-2 mb-lg-0"
                                                name="IncludeAllMachines"
                                                checked={actualReportData.IncludeAllMachines}
                                                type="checkbox" onChange={e => handleChange(e, true, "machine")}
                                                value={actualReportData.IncludeAllMachines} />
                                            <span className="text-center">{TRL_Pack.summaries.includeAllMachines}</span>

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
                                )}

                                {category.IncludeProducts && (

                                    <div className="row mb-3 text-center">
                                        <div className="col-lg-4 mb-2 d-flex flex-column align-items-center ">
                                            <input className="col-lg-4 mb-2 mb-lg-0"
                                                name="IncludeAllProducts"
                                                checked={actualReportData.IncludeAllProducts}
                                                type="checkbox" onChange={e => handleChange(e, true, "product")}
                                                value={actualReportData.IncludeAllProducts} />
                                            <span className="text-center">{TRL_Pack.summaries.includeAllProducts}</span>
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
                                                <option defaultValue >{TRL_Pack.summaries.openSelectBar}</option>
                                                {products.map((product, idx) => <option key={idx} value={product.EAN} >{product.Name}</option>)}
                                            </select>
                                            <button className="fas fa-plus btn btn-primary" onClick={() => addButton("product")} />
                                        </div>) : ""}
                                    </div>
                                )}
                                {category.IncludeRecipes && (

                                    <div className="row mb-3 text-center">
                                        <div className="col-lg-4 mb-2   d-flex flex-column align-items-center">
                                            <input className="col-lg-4 mb-2 mb-lg-0"
                                                name="IncludeAllRecipes"
                                                checked={actualReportData.IncludeAllRecipes}
                                                type="checkbox" onChange={e => handleChange(e, true, "recipe")}
                                                value={actualReportData.IncludeAllRecipes} />
                                            <span className="text-center"> {TRL_Pack.summaries.includeAllRecipes}</span>
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
                                                <option defaultValue >{TRL_Pack.summaries.openSelectBar}</option>
                                                {recipies.map((recipe) => <option key={recipe.RecipeId} value={recipe.RecipeId} >{recipe.Name}</option>)}
                                            </select>
                                            <button type="button" className="fas fa-plus btn btn-primary" onClick={() => addButton("recipe")} />
                                        </div>) : ""}
                                    </div>
                                )}
                                <div className="text-center my-3">
                                    <button className="btn btn-primary" onClick={(e) => props.match.params.summariesReportId === "new" ? handleSubmitNew(e) : handleSubmit(e)} >{TRL_Pack.summaries.submit}</button>
                                </div>
                            </form>

                        </div>

                    </div>

                </div >
                <Accordion defaultActiveKey="0" className="col-12 col-md-6 mb-4 mb-md-0">

                    <Card style={{ marginTop: "28px", resize: "horizontal" }} >
                        <input type="text" className="w-100 form-control" placeholder={TRL_Pack.summaries.searchBar} onChange={(e) => handleSortTable(e)} />
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                {TRL_Pack.summaries.choices}
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0" style={{ overflowY: "scroll", height: "430px" }}>
                            <Card.Body className="p-0 m-0" style={{ height: "430px" }}>
                                {showSelectedTitle("machine", TRL_Pack.summaries.machines)}
                                {showSelectedTitle("user", TRL_Pack.summaries.users)}
                                {showSelectedTitle("product", TRL_Pack.summaries.products)}
                                {showSelectedTitle("recipe", TRL_Pack.summaries.recipes)}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                </Accordion>

            </div>
        </>
    )
}

export default SummariesReport
