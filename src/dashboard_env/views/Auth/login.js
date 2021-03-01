import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import { NotificationContext } from '../../context/notification-context'
import { LoaderContext } from '../../context/loader-context'
import axios from 'axios'

import { NotificationManager } from 'react-notifications'
import gbFlag from '../../assets/flags/gb.png'
import plFlag from '../../assets/flags/pl.png'

import logo from '../../assets/images/logo-vendim.png'
import { API_URL } from '../../config/config'
import Loader from '../../components/Loader/Loader'

export default ({ login, setPermission }) => {
    const { ErrorNotification } = useContext(NotificationContext)
    const { loader, incrementRequests, decrementRequests } = useContext(LoaderContext)
    const { changeLanguage, TRL_Pack } = useContext(LangContext)

    const handleSubmit = evt => {
        evt.preventDefault()



        const { email, password, clientId } = evt.target.elements

        if (email.value && password.value && clientId.value) {
            incrementRequests()

            axios
                .put(`${API_URL}/api/auth/login`, {
                    Email: email.value.toLowerCase(),
                    Password: password.value,
                    ClientId: clientId.value.toLowerCase()
                }).catch(res => (res.status === 200 ? "" : NotificationManager.error(Object.values(res.response.data)[0])))
                .then(res => {
                    decrementRequests()



                    if (res.status === 422) return ErrorNotification('Validation failed.')
                    if (res.status !== 200 && res.status !== 201)
                        return ErrorNotification('Could not authenticate.')

                    localStorage.setItem(
                        'lastLogin',
                        JSON.stringify({
                            email: email.value.toLowerCase(),
                            clientId: clientId.value.toLowerCase()
                        })
                    )

                    login(res.data.token, clientId.value.toLowerCase())

                    axios
                        .get(`${API_URL}/api/permissions`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            },
                        }).then(({ data }) => setPermission(data))

                        .catch(err => {
                            decrementRequests()
                            ErrorNotification(err.response?.data || err.toString() || "No Connection with server")
                        })
                })
                .catch(err => {
                    decrementRequests()
                })
        }
    }
    return (
        <>
            {loader && <Loader />}
            <div className="col col-md-6 col-lg-5 mx-auto d-flex align-items-center">
                <div className="container">
                    <div className="card card-body bg-fade mb-4">
                        <div className="text-center mt-2 mb-3">
                            <img src={logo} alt="logo" height="60" />
                        </div>
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <div className="form-group">
                                <label className="small">{TRL_Pack.auth.email}</label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={
                                        localStorage.getItem('lastLogin')
                                            ? JSON.parse(localStorage.getItem('lastLogin')).email
                                            : 'jakub@vendim.pl'
                                    }
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="small">{TRL_Pack.auth.password}</label>
                                <input
                                    type="password"
                                    name="password"
                                    defaultValue=""
                                    autoComplete="off"
                                    className="form-control"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label className="small">{TRL_Pack.auth.clientId}</label>
                                <input
                                    type="text"
                                    name="clientId"
                                    className="form-control"
                                    disabled={(sessionStorage.getItem("DB_TYPE") === "mysql") ? 1 : 0}
                                    defaultValue={
                                        (sessionStorage.getItem("DB_TYPE") === "mysql") ?
                                            ("multivend") :
                                            (localStorage.getItem('lastLogin') ? JSON.parse(localStorage.getItem('lastLogin')).clientId : "console")
                                    }
                                    autoCapitalize="none"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-success btn-block">
                                {TRL_Pack.buttons.login}
                            </button>
                        </form>
                    </div>
                    <div className="text-center">
                        <button
                            className="btn btn-link p-0 mx-3 rounded-circle"
                            onClick={changeLanguage('en')}
                        >
                            <img className="flag" src={gbFlag} alt="en_flag" />
                        </button>
                        <button
                            className="btn btn-link p-0 mx-3 rounded-circle"
                            onClick={changeLanguage('pl')}
                        >
                            <img className="flag" src={plFlag} alt="pl_flag" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
