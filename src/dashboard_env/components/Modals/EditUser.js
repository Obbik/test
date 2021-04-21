import React, { useContext, useState } from 'react'

import { LangContext } from '../../context/lang-context'
import { NotificationManager } from 'react-notifications'

import useFetch from '../../hooks/fetchMSSQL-hook'
import FormSkel from './FormSkel'

export default ({ handleClose, id, setUsersData }) => {
    const { fetchMssqlApi } = useFetch()
    const { TRL_Pack } = useContext(LangContext)
    const [Name, setName] = useState()
    const [Email, setEmail] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()
        fetchMssqlApi(`user/${id}`, { method: 'PUT', data: { Name: Name, Email: Email } }, () =>

            fetchMssqlApi(`users`, {}, users => setUsersData(users), handleClose()))

    }
    console.log(id)

    return (
        < FormSkel
            headerText={TRL_Pack.Users.ChangeEmail}
            handleClose={handleClose}
            acceptForm="true"
        >
            <>
                <form id="modal-form" onSubmit={e => handleSubmit(e)}>
                    <div className="form-group">
                        <label className="h6">{TRL_Pack.Users.Name}</label> {/* make translation */}

                        <input
                            onChange={e => setName(e.target.value)}
                            type="text"
                            name="password"
                            className="form-control"
                            autoComplete="on"
                            required
                        />
                        <label className="h6">Email</label>{/* make translation */}
                        <input
                            onChange={e => setEmail(e.target.value)}
                            type="email"
                            name="password"
                            className="form-control"
                            autoComplete="on"
                            required
                        />
                    </div>
                </form>
            </>
        </FormSkel >
    )
}
