import React, { useState, useContext } from 'react'
import MachineForm from '../Modals/MachineForm'
import { Redirect } from 'react-router'
import { LangContext } from '../../context/lang-context'
export default ({ machineData, getMachine, deleteMachine }) => {
  const [machineForm, setMachineForm] = useState(null)
  const openMachineForm = () => setMachineForm(true)
  const closeMachineForm = () => setMachineForm(null)
  const { TRL_Pack } = useContext(LangContext)
  return (
    <>
      <div className="card h-100">
        <h5 className="card-header">
          {TRL_Pack.fullMachine.information}
          <button className="float-right btn btn-link link-icon" onClick={() => deleteMachine(machineData.MachineId) && <Redirect to="/dashboard/machines" />}>
            <i className="fas fa-trash text-danger ml-2 mr-2" />
            <span style={{ color: "red" }}>{TRL_Pack.fullMachine.deleteMachin}</span>
          </button>
          <button
            className="float-right btn btn-sm btn-link text-decoration-none"
            onClick={openMachineForm}
          >
            <i className="fas fa-pencil-alt mr-2" />
            {TRL_Pack.fullMachine.editMachine}

          </button>

        </h5>
        <div className="card-body d-flex flex-column justify-content-center">
          <div className="row mb-3">
            <div className="col-lg-4 mb-2 mb-lg-0 text-lg-right font-weight-bolder">
              {TRL_Pack.fullMachine.machineName}
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
              {TRL_Pack.fullMachine.serialNumber}
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
              {TRL_Pack.fullMachine.client}
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
