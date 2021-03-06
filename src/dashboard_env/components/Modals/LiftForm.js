import React, { useState, useEffect } from 'react'

import useFetch from '../../hooks/fetchMSSQL-hook'
import FormSkel from './FormSkel'

export default ({ floor, handleClose }) => {
  const { fetchMssqlApi } = useFetch()

  const getLiftPosition = () => {
    fetchMssqlApi(`shop/lift/position/${floor}'`)
  }

  const [position, setPosition] = useState(10)
  const handleChange = evt => setPosition(evt.target.value)

  const handleSubmit = evt => {
    evt.preventDefault()

    fetchMssqlApi(
      `shop/lift/position/${floor}`,
      { method: 'POST', data: { Position: position * 100 } },
      handleClose
    )
  }

  useEffect(() => getLiftPosition(), [])

  return (
    <FormSkel headerText={`Półka ${floor}`} handleClose={handleClose}>
      <form onSubmit={handleSubmit} id="modal-form" autoComplete="off">
        <div className="d-flex align-items-center">
          <span className="font-weight-bolder" style={{ width: 75 }}>
            10 cm
          </span>
          <input
            type="range"
            min={10}
            max={94}
            value={position}
            onChange={handleChange}
            name="newQuantity"
            className="form-control mx-2"
            placeholder="Nowa ilość"
            required
          />
          <span className="font-weight-bolder text-right" style={{ width: 75 }}>
            94 cm
          </span>
        </div>
        <p className="text-center font-weight-bolder mb-0">{position} cm</p>
      </form>
    </FormSkel>
  )
}
