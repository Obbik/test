import React, { useState } from 'react'
import FormSkel from './../../components/Modals/FormSkel'

import useFetch from '../../hooks/fetchMSSQL-hook'


const SummaryForm = ({ headerText, handleClose, timeStamps, reportId }) => {
    const { fetchMssqlApi } = useFetch()

    const [time, setTime] = useState(1)
    const [name, SetName] = useState()

    const handleSubmit = (e) => {
        fetchMssqlApi("report-condition", {
            method: "POST",
            data: {
                ReportId: parseInt(reportId),
                Name: name,
                IncludeAllMachines: 0,
                IncludeAllProducts: 0,
                IncludeAllRecipes: 0,
                IncludeAllUsers: 0,
                TimeSpanId: parseInt(time),
                StartDateTime: new Date().toISOString().split('T')[0] + "T" + "00:" + "00:" + "00"
            }
        })
    }
    return (
        <>
            <FormSkel
                headerText={headerText}
                handleClose={handleClose}
            >
                <form onSubmit={e => handleSubmit(e)} id="modal-form" autoComplete="off">
                    <div className="form-group">
                        <label className="h6">Nazwa </label>
                        <input
                            name="name"
                            className="form-control"
                            value={name}
                            onChange={(e) => SetName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="h6">Czas</label>
                        <div className="form-group">
                            <select
                                className=" form-control w-100  text-center mx-0"

                                name="TimeSpanName"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                minLength={2}
                                maxLength={50}
                                required
                            >
                                {timeStamps.map((timestamp) => <option key={timestamp.TimeSpanId} value={timestamp.TimeSpanId} > {timestamp.Name} </option>)}
                            </select>
                        </div>
                    </div>
                </form>
            </FormSkel>
        </>
    )
}

export default SummaryForm
