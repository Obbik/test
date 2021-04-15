import React from 'react'
import FormSkel from './FormSkel'

const DeleteForm = ({ clientData, handleSubmit, handleClose }) => {

    return (
        <>
            <FormSkel>
                <form onSubmit={handleSubmit} id="modal-form" autoComplete="off">
                    <div className="form-group">
                        <label className="h6">Nazwa klienta</label>
                        <input
                            name="name"
                            className="form-control"
                            defaultValue={clientData && clientData.Name}
                            required
                        />
                    </div>
                    <div>
                        <label className="h6">Skrót</label>
                        <input
                            name="abbreviation"
                            className="form-control"
                            defaultValue={clientData && clientData.Abbreviation}
                        />
                    </div>
                </form>
            </FormSkel>
        </>
    )
}

export default DeleteForm
