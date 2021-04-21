import React, { useContext, useState } from 'react'

import { LangContext } from '../../context/lang-context'
import { NotificationManager } from 'react-notifications'

import useFetch from '../../hooks/fetchMSSQL-hook'
import FormSkel from './FormSkel'

export default ({ handleClose, id }) => {
    const { fetchMssqlApi } = useFetch()
    const { TRL_Pack } = useContext(LangContext)
    const [previousPassword, setPreviousPassword] = useState()
    const [newPassword, setNewPassword] = useState()
    const [RepeatNewPassword, setRepeatNewPassword] = useState()

    const handleSubmit = (e) => {
        e.preventDefault()

        if (newPassword === RepeatNewPassword) {
            fetchMssqlApi(`auth/change-password/${id}`, { method: 'PUT', data: { Password: newPassword, CurrentPassword: previousPassword } })
        }
        else if (previousPassword) {
            NotificationManager.error("current password is empty")
        }
        else {
            NotificationManager.error("password not equal") // make translation
        }

    }
    console.log(id)

    return (
        < FormSkel
            headerText={TRL_Pack.Users.ChangePassword}
            handleClose={handleClose}
            acceptForm="true"
        >
            <>
                <form id="modal-form" onSubmit={e => handleSubmit(e)}>
                    <div className="form-group">
                        <label className="h6">{TRL_Pack.Users.CurrentPassword}</label>

                        <input
                            onChange={e => setPreviousPassword(e.target.value)}
                            type="password"
                            name="password"
                            className="form-control"
                            autoComplete="on"
                            required
                        />
                        <label className="h6">{TRL_Pack.Users.newPassword}</label>
                        <input
                            onChange={e => setNewPassword(e.target.value)}
                            type="password"
                            name="password"
                            className="form-control"
                            minLength="6"
                            autoComplete="on"
                            required
                        />
                        <label className="h6">{TRL_Pack.Users.RepeatNewPassword}</label>
                        <input
                            onChange={e => setRepeatNewPassword(e.target.value)}
                            type="password"
                            name="password"
                            className="form-control"
                            minLength="6"
                            autoComplete="on"
                            required
                        />
                    </div>
                </form>
            </>
        </FormSkel >
    )
}
