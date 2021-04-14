import React, { useState, useEffect, useContext, useRef } from 'react'
import { useHistory, useParams } from "react-router-dom";
import useFetch from '../../../hooks/fetchMSSQL-hook'
import { LangContext } from '../../../context/lang-context'
import { Accordion, Card } from 'react-bootstrap'
import { API_URL } from '../../../config/config'
import { NotificationContext } from '../../../context/notification-context'

import { NotificationManager } from 'react-notifications'


import "./index.css"
import axios from "axios"
import moment from "moment"

const SummariesReport = (props) => {
    const { ErrorNotification, SuccessNofication } = useContext(NotificationContext)
    const { TRL_Pack } = useContext(LangContext)
    const { fetchMssqlApi } = useFetch()
    const { summariesReportId } = useParams()
    const history = useHistory()

    const leftDivRef = useRef()
    const rightDivRef = useRef()




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
            IncludeAllMachines: false,
            IncludeAllProducts: false,
            IncludeAllRecipes: false,
            IncludeAllUsers: false,
            EndDateTime: new Date().toISOString().split('T')[0] + "T" + "23:" + "59:" + "59",
            StartDateTime: new Date().toISOString().split('T')[0] + "T" + "00:" + "00:" + "00"
        }
    )



    const addButton = (name) => {
        const token = localStorage.getItem('token')
        let isDuplicate = false

        let nameObject = 0
        const upperFirstLetterName = `${name.charAt(0).toUpperCase() + name.slice(1)}`


        if (name === "machine") {
            nameObject = machines.find(obj => obj.MachineName === inputData.machine)
            displayChosenOptions[name].forEach(elem => {
                if (Object.values(elem).indexOf(nameObject?.MachineName) > -1) {
                    isDuplicate = true
                }
                else isDuplicate = false
            })
        }
        else if (name === "user") {
            nameObject = user.find(obj => obj.UserId === inputData.user)
            console.log(user, inputData)
            displayChosenOptions[name].forEach(elem => {
                if (Object.values(elem).indexOf(nameObject?.Name) > -1) {
                    isDuplicate = true
                }
                else isDuplicate = false
            })

        }
        else if (name === "product") {

            nameObject = products.find(obj => obj.Name === inputData.product)
            displayChosenOptions[name].forEach(elem => {
                if (Object.values(elem).indexOf(nameObject?.Name) > -1) {
                    isDuplicate = true
                }
                else isDuplicate = false
            })
        }
        else if (name === "recipe") {
            nameObject = recipies.find(obj => obj.Name === inputData.recipe)
            displayChosenOptions[name].forEach(elem => {
                if (Object.values(elem).indexOf(nameObject?.Name) > -1) {
                    isDuplicate = true
                }
                else isDuplicate = false
            })
        }

        if (isDuplicate === true) return NotificationManager.error("The record already exists")
        if (!nameObject) return NotificationManager.error("Incorrect data")
        if (nameObject) {


            if (props.match.params.summariesReportId === "new") {
                if (name === "user") {
                    setInputData(prev => ({
                        ...prev, [name]: ""
                    }))
                    setChosenOptions(prev =>
                    ({
                        ...prev, [name]: [...prev[name],
                        {
                            [upperFirstLetterName + "Name"]: nameObject.Name,
                            [`${upperFirstLetterName}Id`]: nameObject[upperFirstLetterName + "Id"]
                        }]
                    }))
                    console.log(inputData)
                }
                else if (name === "product") {
                    setInputData(prev => ({
                        ...prev, [name]: ""
                    }))
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
                    setInputData(prev => ({
                        ...prev, [name]: ""
                    }))
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
                    console.log(inputData, name)
                    setInputData(prev => ({
                        ...prev, [name]: ""
                    }))
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

            if (name === "product")
                axios({
                    method: "POST",
                    url: `${API_URL}/api/report-condition-${name}`,
                    data: { ReportConditionId: summariesReportId, Ean: nameObject.EAN },
                    headers: { Authorization: `Bearer ${token}` }
                }).then((res) => {
                    SuccessNofication(res.data.message)
                    setInputData(prev => ({
                        ...prev, [name]: ""
                    }))
                    setChosenOptions(prev =>
                    ({
                        ...prev, [name]: [...prev[name],
                        {
                            [upperFirstLetterName + "Name"]: nameObject.Name,
                            [`ReportCondition${upperFirstLetterName}Id`]: res.data.rows[0].ReportConditionProductId
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
                    data: { ReportConditionId: parseInt(summariesReportId), UserId: nameObject.UserId },
                    headers: { Authorization: `Bearer ${token}` }
                }).then((res) => {

                    SuccessNofication(res.data.message)
                    setInputData(prev => ({
                        ...prev, [name]: ""
                    }))
                    setChosenOptions(prev =>
                    ({
                        ...prev, [name]: [...prev[name],
                        {
                            [upperFirstLetterName + "Name"]: nameObject.Name,
                            [`ReportCondition${upperFirstLetterName}Id`]: res.data.rows[0].ReportConditionUserId
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
                    data: { ReportConditionId: props.match.params.summariesReportId, MachineId: nameObject.MachineId },
                    headers: { Authorization: `Bearer ${token}` }
                }).then((res) => {

                    SuccessNofication(res.data.message)
                    setInputData(prev => ({
                        ...prev, [name]: ""
                    }))
                    setChosenOptions(prev =>
                    ({
                        ...prev, [name]: [...prev[name],
                        {
                            [upperFirstLetterName + "Name"]: nameObject.MachineName,
                            [`ReportCondition${upperFirstLetterName}Id`]: res.data.rows[0].ReportConditionMachineId
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
                    data: { ReportConditionId: parseInt(summariesReportId), RecipeId: nameObject.RecipeId },
                    headers: { Authorization: `Bearer ${token}` }
                }).then((res) => {
                    SuccessNofication(res.data.message)
                    setInputData(prev => ({
                        ...prev, [name]: ""
                    }))
                    setChosenOptions(prev =>
                    ({
                        ...prev, [name]: [...prev[name],
                        {
                            [upperFirstLetterName + "Name"]: nameObject.Name,
                            [`ReportCondition${upperFirstLetterName}Id`]: res.data.rows[0].ReportConditionRecipeId
                        }]
                    }))
                }).catch(err => {
                    if (err.response.data.message === "jwt malformed") window.location.reload();
                    else ErrorNotification(err.response?.data || err.toString())
                })
            }
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
                    <input type="datetime-local" style={{ border: "1px solid rgba(0, 0, 0, .1)", padding: ".375rem .75rem" }} className="rounded input-group pl-2 date col-lg-6 col-md-8  col-sm-7 mb-2 mb-lg-0"
                        value={moment(actualReportData.StartDateTime).format("YYYY-MM-DDTkk:mm")} onChange={(e) => handleChangeDate(e)}
                    />
                </div>
            )
        }
        else if (timeStamp?.TimeSpanId === "3") {
            return (
                <div className=" mt-3 mb-1 d-flex justify-content-center ">
                    <div className="mr-2">
                        <input type="datetime-local" className="rounded" style={{ padding: ".375rem .75rem", border: "1px solid rgba(0, 0, 0, .1)" }} value={moment(actualReportData.StartDateTime).format("YYYY-MM-DDTkk:mm")} onChange={(e) => handleChangeDate(e)} className=" w-100 input-group " />
                        Data początkowa
                    </div>
                    <div className="">
                        <input type="datetime-local" className="rounded" style={{ padding: ".375rem .75rem", border: "1px solid rgba(0, 0, 0, .1)" }} value={moment(actualReportData.EndDateTime).format("YYYY-MM-DDTkk:mm")} onChange={(e) => handleChangeDate(e, true)} className=" w-100 input-group" />
                        Data końcowa
                    </div>
                </div>
            )
        }
    }

    const handleChange = (e, checkbox, inputName) => {
        const name = e.target.name
        const value = e.target.value
        let objectName

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
                objectName = products.find(obj => obj.Name === value)
        setInputData(prev => ({
            ...prev,
            [name]: objectName ? objectName.Name : value
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
                    <div className="text-center headerTitle d-flex align-items-center" style={{ background: "#f3f3f3", position: "relative" }}>
                        <label style={includeAll ? { textDecoration: "line-through", flex: 1 } : { flex: 1 }} className="form-check-label " htmlFor={name}>
                            {displayName}
                        </label>
                        <div className={displayChosenOptions[name].length > 0 ? "fas fa-arrow-down arrow_clicked" : "fas fa-arrow-down arrow_not_clicked"} id={name}


                            onClick={() => toggleTitle(name)} />
                    </div>}

                {displayChosenOptions[name].map((value, idx) =>
                    <div key={idx} className="text-center chosenOption font-weight-normal" style={includeAll ? { textDecoration: "line-through" } : {}} onClick={
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


        e.preventDefault()
        const { ReportId } = report.find(obj => obj.Name === actualReportData.ReportName)

        const { Name, TimeSpanName, IncludeAllUsers, IncludeAllMachines, StartDateTime, EndDateTime, IncludeAllProducts, IncludeAllRecipes } = actualReportData

        const { TimeSpanId } = timeStamps.find(obj => obj.Name === TimeSpanName)


        const data = {
            Name,
            TimeSpanId: parseInt(TimeSpanId),
            ReportId: parseInt(ReportId),
            IncludeAllMachines: Number(IncludeAllMachines),
            IncludeAllProducts: Number(IncludeAllProducts),
            IncludeAllRecipes: Number(IncludeAllRecipes),
            IncludeAllUsers: Number(IncludeAllUsers),
            StartDateTime,
            EndDateTime
        }

        fetchMssqlApi(`report-condition/${actualReportData.ReportConditionId}`, {
            method: "PUT", data
        })
        getIndividualData()
        getCategoryData()
    }

    const handleSubmitNew = async (e) => {
        let timeData
        let TimeSpanid = 1
        const token = localStorage.getItem('token')
        e.preventDefault()


        const { Name, TimeSpanName, IncludeAllUsers, IncludeAllMachines, StartDateTime, EndDateTime, IncludeAllProducts, IncludeAllRecipes } = actualReportData


        if (TimeSpanName === TRL_Pack.summaries.openSelectBar || TimeSpanName === "") {
            NotificationManager.error("Select the correct date")
            return
        }

        if (TimeSpanName) {
            timeData = timeStamps.find(obj => obj.Name === TimeSpanName)
            TimeSpanid = timeData.TimeSpanId
        }

        const data = {
            Name,
            ReportId: Number(props.match.params.ReportId),
            IncludeAllMachines: Number(IncludeAllMachines),
            IncludeAllProducts: Number(IncludeAllProducts),
            IncludeAllRecipes: Number(IncludeAllRecipes),
            IncludeAllUsers: Number(IncludeAllUsers),
            TimeSpanId: Number(TimeSpanid),
            StartDateTime,
            EndDateTime
        }

        axios({
            method: "POST",
            url: `${API_URL}/api/report-condition`,
            data,
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                const id = res.data.id;
                const requests = []
                if (chosenOptions?.machine?.length > 0) {
                    let MachineData = []
                    chosenOptions.machine.forEach(element => {
                        MachineData.push({ ReportConditionId: id, MachineId: element.MachineId })
                    });
                    requests.push(axios({
                        method: "POST",
                        url: `${API_URL}/api/report-condition-machine`,
                        data: MachineData,
                        headers: { Authorization: `Bearer ${token}` }
                    }))
                }

                if (chosenOptions?.product?.length > 0) {
                    let ProductData = []
                    chosenOptions.product.forEach(element => {
                        ProductData.push({ ReportConditionId: id, Ean: element.ProductId })
                    });

                    requests.push(axios({
                        method: "POST",
                        url: `${API_URL}/api/report-condition-product`,
                        data: ProductData,
                        headers: { Authorization: `Bearer ${token}` }
                    }))

                }

                if (chosenOptions?.recipe?.length > 0) {
                    let RecipeData = []
                    chosenOptions.recipe.forEach(element => {

                        RecipeData.push({ ReportConditionId: id, RecipeId: element.RecipeId })
                    });

                    requests.push(axios({
                        method: "POST",
                        url: `${API_URL}/api/report-condition-recipe`,
                        data: RecipeData,
                        headers: { Authorization: `Bearer ${token}` }
                    }))

                }
                if (chosenOptions?.user?.length > 0) {
                    let UserData = []
                    chosenOptions.user.forEach(element => {

                        UserData.push({ ReportConditionId: id, UserId: element.UserId })
                    });
                    requests.push(axios({
                        method: "POST",
                        url: `${API_URL}/api/report-condition-user`,
                        data: UserData,
                        headers: { Authorization: `Bearer ${token}` }
                    }))
                }
                return axios.all(requests)


            })
            .then(
                res => {
                    NotificationManager.success("Successfully added a statement")
                    history.push(`/summaries/${props.match.params.ReportId}`)
                })
            .catch(err => {
                if (err.response.data.message === "jwt malformed") window.location.reload();
                else ErrorNotification(err.response?.data || err.toString())
            })
    }


    const downloadReport = () => {
        const token = localStorage.getItem('token')
        axios({
            method: "POST",
            url: `${API_URL}/api/report-guid`,
            data: { ReportConditionId: parseInt(props.match.params.summariesReportId) },
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
                        onClick={() => history.push(`/summaries/${props.match.params.ReportId}`)}
                        style={{ width: "1000px !important" }}

                        className=" btn btn-link justify-content-between d-flex text-decoration-none w-100"
                    >
                        <i className="fas fa-arrow-left mr-2 text-decoration-none"  > </i>
                        {props.match.params.summariesReportId !== "new" && (<i className="fa fa-download mr-2 " onClick={() => downloadReport()} > <span style={{ fontWeight: "500", fontFamily: "'Lato', 'Arial', sans-serif" }}>{TRL_Pack.summaries.download}</span></i>)}
                    </div>
                    <div className="card" >
                        <h5 className="card-header">{reportName?.Name} </h5>
                        <div className="card-body justify-content-center " ref={leftDivRef}>
                            <form id="machine-form" onSubmit={(e) => e.preventDefault()} autoComplete="off">
                                <div className="row mb-3 text-center">
                                    <div className="col-lg-4 mb-2 font-weight-normal align-self-center ">
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
                                    <div className="col-lg-4 mb-2 mb-lg-0  font-weight-normal align-self-center">
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
                                        <div className="col-lg-4 col-sm-12 mb-2  d-flex flex-column align-items-center align-self-center">
                                            <input className="col-lg-4 mb-2 mb-lg-0"
                                                name="IncludeAllUsers"
                                                checked={actualReportData.IncludeAllUsers}
                                                type="checkbox" onChange={e => handleChange(e, true)}
                                                value={actualReportData.IncludeAllUsers} />
                                            <span className="text-center font-weight-normal">{TRL_Pack.summaries.includeAllUsers}</span>
                                        </div>
                                        {actualReportData.IncludeAllUsers === false ? (


                                            <div className="d-flex col-sm-12 col-lg-8 my-auto input-group mb-3">
                                                <input
                                                    className={" col-sm-12 form-control mx-auto mx-lg-0 text-center"}
                                                    name="user"
                                                    value={inputData.user}
                                                    onChange={(value) => handleChange(value)}
                                                    minLength={2}
                                                    maxLength={50}

                                                />


                                                {user.map((user, ksx) => <option key={ksx} value={user.UserId} >{user.Name}</option>)}


                                                <button className="fas fa-plus btn btn-primary" onClick={() => addButton("user")} />
                                            </div>
                                        ) :

                                            <div className={" col-sm-12 d-flex col-lg-8 my-auto"}>
                                                <input

                                                    className={" form-control mx-auto mx-lg-0 text-center"}
                                                    disabled
                                                    value={inputData.product}

                                                />
                                                <button className="fas fa-plus btn btn-primary" onClick={() => addButton("product")} />
                                            </div>
                                        }

                                    </div>
                                ) : ""}

                                {category.IncludeMachines && (

                                    <div className="row mb-3 text-center">
                                        <div className="col-lg-4 mb-2  d-flex flex-column align-items-center align-self-center">
                                            <input className="col-lg-4 mb-2 mb-lg-0"
                                                name="IncludeAllMachines"
                                                checked={actualReportData.IncludeAllMachines}
                                                type="checkbox" onChange={e => handleChange(e, true, "machine")}
                                                value={actualReportData.IncludeAllMachines} />
                                            <span className="text-center font-weight-normal">{TRL_Pack.summaries.includeAllMachines}</span>

                                        </div>
                                        {actualReportData.IncludeAllMachines === false ? (<div className={" d-flex  col-sm-12 col-lg-8 my-auto input-group mb-3"}>
                                            <input
                                                className={" form-control mx-auto  mx-lg-0 text-center"}
                                                name="machine"
                                                value={inputData.machine}
                                                onChange={(value) => handleChange(value)}
                                                list="IncludeMachines"
                                                minLength={2}
                                                maxLength={50}
                                            />
                                            <datalist id="IncludeMachines">
                                                {machines.map((machine, idx) => <option key={machine.MachineId} value={machine.MachineName} > {machine.MachineName}
                                                </option>)}
                                            </datalist>
                                            <button className="fas fa-plus btn btn-primary" onClick={() => addButton("machine")} />
                                        </div>) :
                                            <div className={"d-flex col-lg-8 my-auto"}>
                                                <input

                                                    className={" form-control mx-auto mx-lg-0 text-center"}
                                                    disabled
                                                    value={inputData.product}

                                                />
                                                <button className="fas fa-plus btn btn-primary" onClick={() => addButton("product")} />
                                            </div>}
                                    </div>
                                )}

                                {category.IncludeProducts && (

                                    <div className="row mb-3 text-center line-height-2">
                                        <div className="col-lg-4 mb-2  d-flex flex-column align-items-center align-self-center">
                                            <div className="ml-1">
                                                <input className=" mb-2 mt-2 mb-lg-0 "
                                                    name="IncludeAllProducts"
                                                    checked={actualReportData.IncludeAllProducts}
                                                    type="checkbox" onChange={e => handleChange(e, true, "product")}
                                                    value={actualReportData.IncludeAllProducts} />

                                            </div>
                                            <span className="text-center font-weight-normal">{TRL_Pack.summaries.includeAllProducts}</span>
                                        </div>
                                        {actualReportData.IncludeAllProducts === false ? (
                                            <div className={"d-flex col-lg-8 my-auto col-sm-12 "}>

                                                <input
                                                    className={" form-control mx-auto mx-lg-0 text-center"}

                                                    name="product"
                                                    value={inputData.product}
                                                    onChange={(value) => handleChange(value)}
                                                    minLength={2}
                                                    maxLength={50}
                                                    list="IncludeProducts"

                                                />
                                                <datalist id="IncludeProducts" name="product">
                                                    {products.map((product, idx) => <option key={idx} value={product.Name} >{product.Name}</option>)}
                                                </datalist>


                                                <button className="fas fa-plus btn btn-primary" onClick={() => addButton("product")} />
                                            </div>) :
                                            <div className={" col-sm-12 d-flex col-lg-8 my-auto"}>
                                                <input
                                                    className={" form-control mx-auto mx-lg-0 text-center"}
                                                    disabled
                                                    value={inputData.product}
                                                />
                                                <button className="fas fa-plus btn btn-primary" onClick={() => addButton("product")} />
                                            </div>}
                                    </div>
                                )}
                                {category.IncludeRecipes && (
                                    <div className="row mb-3 text-center line-height-2">
                                        <div className="col-lg-4 mb-2   d-flex flex-column align-items-center align-self-center">
                                            <input className="col-lg-4 mb-2 mb-lg-0"
                                                name="IncludeAllRecipes"
                                                checked={actualReportData.IncludeAllRecipes}
                                                type="checkbox" onChange={e => handleChange(e, true, "recipe")}
                                                value={actualReportData.IncludeAllRecipes} />
                                            <span className="text-center font-weight-normal"> {TRL_Pack.summaries.includeAllRecipes}</span>
                                        </div>
                                        {actualReportData.IncludeAllRecipes === false ? (<div className={"d-flex col-sm-12  col-lg-8 my-auto "}>
                                            <input
                                                className={" form-control mx-auto mx-lg-0 text-center"}

                                                name="recipe"
                                                value={inputData.recipe}
                                                onChange={(value) => handleChange(value)}
                                                aria-label="Select Value"
                                                list="IncludeRecipes"
                                            />
                                            <datalist id="IncludeRecipes" >
                                                {recipies.map((recipe) => <option key={recipe.RecipeId} value={recipe.Name} >{recipe.Name}</option>)}
                                            </datalist>
                                            <button type="button" className="fas fa-plus btn btn-primary" onClick={() => addButton("recipe")} />
                                        </div>) : <div className={" col-sm-12 d-flex col-lg-8 my-auto"}>
                                            <input

                                                className={" form-control mx-auto mx-lg-0 text-center"}
                                                disabled
                                                value={inputData.product}

                                            />
                                            <button className="fas fa-plus btn btn-primary" onClick={() => addButton("product")} />
                                        </div>}
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

                    <Card ref={rightDivRef} style={{ marginTop: "28px", }} >
                        <div className="d-flex">
                            <input type="text" className="border-right-0 form-control" style={{ outline: "none", borderRadius: 0, }} placeholder={TRL_Pack.summaries.searchBar} onChange={(e) => handleSortTable(e)} />
                        </div>

                        <Card.Body className="p-0 m-0" style={{ height: leftDivRef?.current?.offsetHeight }}>
                            {showSelectedTitle("machine", TRL_Pack.summaries.machines)}
                            {showSelectedTitle("user", TRL_Pack.summaries.users)}
                            {showSelectedTitle("product", TRL_Pack.summaries.products)}
                            {showSelectedTitle("recipe", TRL_Pack.summaries.recipes)}
                        </Card.Body>
                    </Card>

                </Accordion>

            </div>
        </>
    )
}

export default SummariesReport
