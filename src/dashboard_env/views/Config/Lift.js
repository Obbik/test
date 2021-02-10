import React, { useState, useEffect, useContext } from 'react'
import useForm from '../../hooks/form-hook'

import useFetch from '../../hooks/fetchMSSQL-hook'
import LiftForm from '../../components/Modals/LiftForm'
import Feeder from './Feeder';
// import MergeFeeder from './MergeFeeder';

export default () => {
    const { fetchApi } = useFetch()
    const { form, openForm, closeForm } = useForm()

    const resetLift = () => {
        fetchApi('shop/lift/move/0', { withNotification: true })
    }

    const moveLift = floor => () => {
        fetchApi(`shop/lift/move/${floor}`, { withNotification: true })
    }

    return (
        <>
            <Feeder />
            <div className="row">
                <div className="col-12 mt-4 mb-2">
                    <h5>Ustawienia windy</h5>
                </div>
                <div className="col-12 col-md-6 col-lg-4 mb-2">
                    <button
                        className="btn list-group-item list-group-item-action"
                        onClick={resetLift}
                    >
                        Reset windy
                </button>
                </div>
                {[1, 2, 3, 4, 5, 6].map(floor => (
                    <div key={floor} className="col-12 col-md-6 col-lg-4 mb-2 position-relative">
                        <button
                            className="btn list-group-item list-group-item-action"
                            onClick={openForm(floor)}
                        >
                            Półka {floor}
                        </button>
                        <button
                            type="button"
                            className="btn btn-light position-absolute"
                            onClick={moveLift(floor)}
                            style={{
                                top: '50%',
                                right: 22,
                                transform: 'translateY(-50%)',
                                zIndex: 25
                            }}
                        >
                            <i className="fas fa-chevron-up text-info" />
                        </button>
                    </div>
                ))}
            </div>
            {form && <LiftForm floor={form} closeModal={closeForm} />}
        </>
    )
}
