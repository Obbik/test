import React, { useState } from 'react'
import MachineForm from '../Modals/MachineForm'

export default ({ machineData, getMachine }) => {
  const [machineForm, setMachineForm] = useState(null)
  const openMachineForm = () => setMachineForm(true)
  const closeMachineForm = () => setMachineForm(null)
  return (
    <>
      <div className="card h-100">
        <h5 className="card-header">
          Informacje
          <button
            className="float-right btn btn-sm btn-link text-decoration-none"
            onClick={openMachineForm}
          >
            <i className="fas fa-pencil-alt mr-2" />
            Edytuj maszyne
          </button>
        </h5>
        <div className="card-body d-flex flex-column justify-content-center">
          <div className="row mb-3">
            <div className="col-lg-4 mb-2 mb-lg-0 text-lg-right font-weight-bolder">
              Nazwa maszyny
            </div>
            <div className="col-lg-8 my-auto text-center text-lg-left">
              {machineData.MachineName}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-lg-4 mb-2 mb-lg-0 text-lg-right font-weight-bolder">
              Model
            </div>
            <div className="col-lg-8 my-auto text-center text-lg-left">
              {machineData.Type}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-lg-4 mb-2 mb-lg-0 text-lg-right font-weight-bolder">
              Nr seryjny
            </div>
            <div className="col-lg-8 my-auto text-center text-lg-left">
              {machineData.SerialNo}
            </div>
          </div>
          {machineData.Terminal && (
            <div className="row mb-3">
              <div className="col-lg-4 mb-2 mb-lg-0 text-lg-right font-weight-bolder">
                Terminal
              </div>
              <div className="col-lg-8 my-auto text-center text-lg-left">
                {machineData.Terminal}
              </div>
            </div>
          )}
          <div className="row">
            <div className="col-lg-4 mb-2 mb-lg-0 text-lg-right font-weight-bolder">
              Klient
            </div>
            <div className="col-lg-8 my-auto text-center text-lg-left">
              {machineData.ClientName}
            </div>
          </div>
        </div>
      </div>
      {machineForm && (
        <MachineForm
          postSubmit={getMachine}
          machineData={machineData}
          handleClose={closeMachineForm}
        />
      )}
    </>
  )
}
