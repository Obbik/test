import React, { useState } from 'react'
import FormSkel from './../../components/Modals/FormSkel'




const SummaryForm = ({ headerText, handleClose, timeStamps, reportName }) => {

    const [time, setTime] = useState()

    const handleChange = (e) => {


        setTime(e.target.value)

    }

    return (
        <>
            <FormSkel
                headerText={headerText}
                handleClose={handleClose}
            >
                <form onSubmit={null} id="modal-form" autoComplete="off">
                    <div className="form-group">
                        <label className="h6">Nazwa </label>
                        <input
                            name="name"
                            className="form-control"
                            // defaultValue={clientData && clientData.Name}
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
                                onChange={e => handleChange(e)}
                                minLength={2}
                                maxLength={50}
                                required
                            >
                                {timeStamps.map((timestamp) => <option key={timestamp.TimeSpanId} value={timestamp.Name} > {timestamp.Name} </option>)}
                            </select>
                        </div>
                    </div>
                </form>
            </FormSkel>
        </>
    )
}

export default SummaryForm
