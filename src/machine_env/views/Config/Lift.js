import React, { useState, useEffect, useContext } from 'react'
import useForm from '../../hooks/form-hook'

import useFetch from '../../hooks/fetch-hook'
import LiftForm from '../../components/Modals/LiftForm'

export default () => {
  const { fetchApi } = useFetch()
  const { form, openForm, closeForm } = useForm()

  const liftReset = () => {
    fetchApi('shop/lift/move/0', { withNotification: true })
  }

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6 col-lg-4 mb-2 position-relative">
          <button
            className="btn list-group-item list-group-item-action"
            onClick={liftReset}
          >
            Reset windy
          </button>
        </div>
        {[1, 2, 3, 4, 5, 6].map(id => (
          <div key={id} className="col-12 col-md-6 col-lg-4 mb-2 position-relative">
            <button
              className="btn list-group-item list-group-item-action"
              onClick={openForm(id)}
            >
              Półka {id}
            </button>
          </div>
        ))}
      </div>
      {form && <LiftForm floor={form} closeModal={closeForm} />}
    </>
  )
}
