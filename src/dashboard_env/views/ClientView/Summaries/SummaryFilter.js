
import React, { useState, useContext, useEffect } from 'react'
import { useHistory, Link } from "react-router-dom";
import { NavigationContext } from '../../../context/navigation-context'
import { LangContext } from '../../../context/lang-context'



import useFetch from '../../../hooks/fetchMSSQL-hook'
import useForm from '../../../hooks/form-hook'

const SummaryFilter = (props) => {
    let history = useHistory();
    const { fetchMssqlApi } = useFetch()
    const { TRL_Pack } = useContext(LangContext)

    const { form, openForm, closeForm } = useForm()

    const input = ["maszyna", "maszyna", "maszyna", "maszyna",]
    const users = [
        {
            ID: "1",
            name: "test",
            email: "test",
            time: "dzis",
            shared: true,
            mailSender: true,
            stworzony: "11.12.2017"
        },
        {
            ID: "32",
            name: "test",
            email: "test",
            time: "jutro",
            shared: false,
            mailSender: true,
            stworzony: "11.12.2017"
        },
        {
            ID: "32",
            name: "test",
            email: "test",
            time: "jutro",
            shared: false,
            mailSender: true,
            stworzony: "11.12.2017"
        },
        {
            ID: "32",
            name: "test",
            email: "test",
            time: "jutro",
            shared: false,
            mailSender: true,
            stworzony: "11.12.2017"
        }

    ]
    return (
        <>
            <div>
                <div className="d-flex justify-content-end">
                    <button
                        onClick={() => history.goBack()}
                        className=" btn btn-link text-decoration-none"
                    // onClick={openForm()}
                    >
                        <i className="fas fa-arrow-left mr-2" /> wróć
                </button>
                    <div style={{ flex: "1" }} />
                    <button
                        className=" btn btn-link text-decoration-none "
                    // onClick={openForm()}
                    >
                        <i className="fa fa-download mr-2" /> Pobierz raport
                </button>
                    <button
                        className=" btn btn-link text-decoration-none "
                    // onClick={openForm()}
                    >
                        <i className="fas fa-plus ml-2" /> Dodaj Raport
                </button>

                </div>
            </div>
            <div className="overflow-auto text-center">
                <table className="table table-striped border table-hover" >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>name</th>
                            <th>time</th>
                            <th>shared</th>
                            <th>mail sender</th>
                            <th>datetime</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody >
                        {users
                            .map((machine, idx) => (
                                <tr key={idx} className="mx-2">
                                    <td>{machine.ID}</td>
                                    <td>{machine.name}</td>
                                    <td>{machine.email}</td>
                                    <td>{machine.time}</td>
                                    <td><input type="checkbox" value={machine.mailSender} checked={machine.mailSender ? true : null} disabled /></td>
                                    <td><input type="checkbox" value={machine.shared} checked={machine.shared ? true : null} disabled /></td>
                                    <td style={{ width: "30px" }}>{machine.stworzony}</td>
                                    <td style={{ width: "30px" }}>  <Link
                                        to={`/machine/${machine.MachineId}`}
                                        className="btn btn-link link-icon"
                                    >
                                        <i className="far fa-edit" />
                                    </Link></td>
                                </tr>

                            ))}
                    </tbody>
                </table>
                <div className="border rounded my-2">
                    <div className="d-flex flex-wrap justify-content-around py-2  text-center ">
                        {input.map((input, x) =>
                            <div key={x} >
                                {/* <label for="exampleDataList" class="form-label">Datalist example</label> */}
                                <input className="form-control" list="datalistOptions" id="exampleDataList" placeholder="Type to search..." />
                                <datalist id="datalistOptions">
                                    <option value={input} />
                                </datalist>
                            </div >)}
                    </div>
                </div>
            </div>
            {/* {form !== "acceptModal" && form && (
                <AdminForm
                    handleClose={closeForm}
                />
            )} */}
        </>

    )
}

export default SummaryFilter
