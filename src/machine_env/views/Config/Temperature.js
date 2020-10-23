import React, { useState, useEffect } from 'react'
import Thermometer from 'react-thermometer-component'

import useFetch from '../../hooks/fetch-hook'

export default () => {
  const { fetchApi } = useFetch()
  const [temperature, setTemperature] = useState(7)

  const incrementTemperature = () => setTemperature(prev => prev + 1)
  const decrementTemperature = () => setTemperature(prev => prev - 1)

  // const getTemperature = () => {
  //   fetchApi('shop/temperature', {}, temperature => setTemperature(temperature))
  // }

  const submitTemperature = () => {
    fetchApi('shop/temperature', { method: 'POST', data: { Temperature: temperature } })
  }

  useEffect(() => {
    // getTemperature()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="d-flex justify-content-center mb-4">
        <div className="d-flex align-items-center mr-3">
          <button
            className="btn icon-button"
            disabled={temperature <= 5}
            onClick={decrementTemperature}
          >
            <i className="fas fa-minus text-danger icon-large" />
          </button>
        </div>
        <Thermometer
          theme="light"
          value={temperature}
          max="21"
          format="°C"
          size="large"
          height="300"
        />
        <div className="d-flex align-items-center ml-3">
          <button
            className="btn icon-button"
            disabled={temperature >= 21}
            onClick={incrementTemperature}
          >
            <i className="fas fa-plus text-success icon-large" />
          </button>
        </div>
      </div>
      <div>
        <button className="mx-auto d-block btn icon-button" onClick={submitTemperature}>
          <i className="fas fa-save text-info icon-large" />
        </button>
      </div>
    </>
  )
}
