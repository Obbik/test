import React, { useState, useEffect, useContext, useCallback } from 'react'
import { LangContext } from '../../context/lang-context'
import { NotificationContext } from '../../context/notification-context'
import useFetch from '../../hooks/fetchMSSQL-hook'
import useForm from '../../hooks/form-hook'

import TextInput from '../FormElements/TextInput'
import DatalistInput from '../FormElements/DatalistInput'

import checkValidation from '../../util/checkValidation'
import { Prompt } from 'react-router'
import TagsFilter from '../Modals/TagsFilter'

export default ({ machineData: initialMachineData, updateMachine, machineId, data }) => {
  const { TRL_Pack } = useContext(LangContext)
  const { ErrorNotification } = useContext(NotificationContext)
  const { fetchMssqlApi } = useFetch()

  const [machineData, setMachineData] = useState({
    machineName: initialMachineData.MachineName,
    location: initialMachineData.LocationName,
    machineType: initialMachineData.MachineTypeName,
    maintenance: initialMachineData.MaintenanceName,
    machineTags: initialMachineData.MachineTags
  })

  const { form, openForm, closeForm } = useForm()

  const [isUnsavedData, setIsUnsavedData] = useState(false)
  useEffect(
    () =>
      setIsUnsavedData(
        () =>
          machineData.machineName !== initialMachineData.MachineName ||
          machineData.location !== initialMachineData.LocationName ||
          machineData.machineType !== initialMachineData.MachineTypeName ||
          machineData.maintenance !== initialMachineData.MaintenanceName
      ),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [machineData]
  )

  const handleChange = evt => {
    const { name, value } = evt.target
    setMachineData(prev => ({ ...prev, [name]: value }))
  }

  const [locationsData, setLocationsData] = useState([])
  const [maintenancesData, setMaintenancesData] = useState([])
  const [machineTypesData, setMachineTypesData] = useState([])
  const [tags, setTags] = useState([])

  const getLocations = () => {
    fetchMssqlApi('locations', {}, locations => setLocationsData(locations))
  }
  const getMachineTypes = () => {
    fetchMssqlApi('machine-types', {}, machineTypes => setMachineTypesData(machineTypes))
  }

  const getMaintenances = () => {
    if (initialMachineData.MaintenanceType === 'SNACK')
      fetchMssqlApi('maintenances/snack', {}, maintenances =>
        setMaintenancesData(maintenances)
      )
    else if (initialMachineData.MaintenanceType === 'COFFEE')
      fetchMssqlApi('maintenances/coffee', {}, maintenances =>
        setMaintenancesData(maintenances)
      )
  }

  console.log(tags)

  const getTags = () => {
    fetchMssqlApi(`tags/${initialMachineData.MachineId}`, {}, tags =>
      setTags(() => {
        return tags.machine.map((label, idx_1) => {
          return {
            ...label,
            options: label.options.map((opt, idx) => {
              if (
                opt.machineTagId !== null
              )
                return { ...opt, isActive: true }
              else return opt
            })
          }

        })
      })

    )

  }

  useEffect(() => {
    getLocations()
    getMaintenances()
    getMachineTypes()
    getTags()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = evt => {
    evt.preventDefault()

    let sender = false
    let postData = []
    let deleteData = []


    tags.forEach(label => {
      label.options.forEach((options, i) => {
        if (options.isActive && options.machineTagId === null) {
          postData.push(options.tagId)
        }
        else if (!options.isActive && options.machineTagId !== null) {
          deleteData.push(options.machineTagId)
        }
      }
      )
    })
    postData.forEach((tagId, i) => {
      sender = false
      if (i === postData.length - 1) {
        sender = true;
      }
      fetchMssqlApi(`machine-tag`, {
        method: 'POST',
        data: { "MachineId": parseInt(machineId), "TagId": parseInt(tagId) }
      },
        res => {
          if (sender) {
            getTags();
            sender = false;
          }
        }
      )
    })
    deleteData.forEach((machineTagId, i) => {
      sender = false
      if (i === deleteData.length - 1) {
        sender = true;
      }
      fetchMssqlApi(`machine-tag/${machineTagId}`, {
        method: 'DELETE'
      }, res => {

        if (sender) {
          getTags();
          sender = false;
        }
      })
    })

    if (!checkValidation(evt.target.elements)) return ErrorNotification(TRL_Pack.errors.invalidInput)

    const { machineName, location, machineType, maintenance } = evt.target.elements

    const updatedMachine = {}

    updatedMachine.MachineName = machineName.value
    updatedMachine.LocationId = Number(
      locationsData.find(l => l.Name === location.value).LocationId
    )
    updatedMachine.MachineTypeId = Number(
      machineTypesData.find(mt => mt.Name === machineType.value)?.MachineTypeId
    )
    updatedMachine.MaintenanceId = Number(
      maintenancesData.find(m => m.Name === maintenance.value).MaintenanceTypeId
    )

    fetchMssqlApi(
      `machine/${initialMachineData.MachineId}`,
      { method: 'PUT', data: updatedMachine },
      () => {
        if (sender) {
          getTags();
          sender = false;
        }
        updateMachine(prev => ({
          ...prev,
          MachineName: machineName.value,
          LocationName: location.value,
          MachineTypeName: machineType.value,
          MaintenanceName: maintenance.value
        }))
        setIsUnsavedData(false)
      },
    )

  }

  const discardChanges = () =>
    setMachineData({
      machineName: initialMachineData.MachineName,
      location: initialMachineData.LocationName,
      machineType: initialMachineData.MachineTypeName,
      maintenance: initialMachineData.MaintenanceName
    })

  return (
    <div className="row mb-4">
      <div className="col-12 col-md-6 mb-4 mb-md-0">
        <div className="card h-100">
          <h5 className="card-header">{TRL_Pack.machine.settings.header}</h5>
          <div className="card-body d-flex flex-column justify-content-center">
            <Prompt
              when={isUnsavedData}
              message={TRL_Pack.machineTypes.confirmUnsaved}
            />
            <form onSubmit={handleSubmit} id="machine-form" autoComplete="off">
              <div className="row mb-3">
                <div className="col-lg-4 mb-2 mb-lg-0 text-lg-right">
                  {TRL_Pack.machines.properties.machineName}
                </div>
                <div className="col-lg-8 my-auto">
                  <TextInput
                    className="mx-auto mx-lg-0"
                    style={{ maxWidth: 275 }}
                    name="machineName"
                    value={machineData.machineName}
                    handleChange={handleChange}
                    minLength={2}
                    maxLength={50}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-lg-4 mb-2 mb-lg-0 text-lg-right">
                  {TRL_Pack.machines.properties.location}
                </div>
                <div className="col-lg-8 my-auto">
                  <DatalistInput
                    style={{ maxWidth: 275 }}
                    className="mx-auto mx-lg-0"
                    name="location"
                    value={machineData.location}
                    handleChange={handleChange}
                    list={locationsData.map(location => location.Name)}
                    newList
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-lg-4 mb-2 mb-lg-0 text-lg-right">
                  {TRL_Pack.machines.properties.machineType}
                </div>
                <div className="col-lg-8 my-auto">
                  <DatalistInput
                    style={{ maxWidth: 275 }}
                    className="mx-auto mx-lg-0"
                    name="machineType"
                    value={machineData.machineType}
                    handleChange={handleChange}
                    list={machineTypesData.map(machineType => machineType.Name)}
                    newList
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-lg-4 mb-2 mb-lg-0 text-lg-right">
                  {TRL_Pack.machines.properties.maintenance}
                </div>
                <div className="col-lg-8 my-auto">
                  <DatalistInput
                    style={{ maxWidth: 275 }}
                    className="mx-auto mx-lg-0"
                    name="maintenance"
                    value={machineData.maintenance}
                    handleChange={handleChange}
                    list={maintenancesData.map(maintenances => maintenances.Name)}
                    newList
                  />
                </div>
              </div>
              <div className="row mb-n1">
                <div className="col-lg-4 mb-2 mb-lg-0 text-lg-right">{TRL_Pack.navbar.tags}</div>
                <div className="col-lg-8 my-auto">
                  {tags.map(tag =>
                    tag.options.filter(opt => opt)
                      .map(opt => {
                        if (opt.isActive === true) {
                          return (
                            <button
                              key={opt.tagId}
                              type="button"
                              className="btn btn-info badge badge-pill px-2 py-1 mx-2 mb-1"
                            >
                              {tag.label ? `${tag.label} - ${opt.name}` : opt.name}
                            </button>

                          )
                        }
                        else if (opt.isActive === true && opt.machineTagId !== null) {
                          return (
                            <button
                              key={opt.tagId}
                              type="button"
                              className="btn btn-info badge badge-pill px-2 py-1 mx-2 mb-1"
                            >
                              {tag.label ? `${tag.label} - ${opt.name}` : opt.name}
                            </button>
                          )
                        }
                      }
                      )
                  )}
                  <button
                    type="button"
                    className="btn btn-info badge badge-pill px-2 py-1 mx-2 mb-1"
                    onClick={openForm()}
                  >
                    <i className="fas fa-plus" />
                  </button>
                </div>
                {form && (
                  <TagsFilter tags={tags} handleClose={closeForm} setTags={setTags} />
                )}
              </div>
            </form>
          </div>
          <div className="card-footer text-center">
            <button
              className="btn btn-secondary btn-sm mr-3"
              onClick={discardChanges}
              disabled={!isUnsavedData}
            >
              {TRL_Pack.buttons.cancel}
            </button>
            <button
              className="btn btn-success btn-sm"
              form="machine-form"
            // disabled={!isUnsavedData}
            >
              {TRL_Pack.buttons.save}
            </button>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6">
        <div className="card h-100">
          <h5 className="card-header">{TRL_Pack.machine.info.header}</h5>
          <div className="card-body d-flex flex-column justify-content-center">
            <div className="row mb-3">
              <div className="col-lg-4 mb-2 mb-lg-0 text-lg-right">{TRL_Pack.fullMachine.serialNumber}</div>
              <strong className="col-lg-8 text-center text-lg-left">
                {initialMachineData.SerialNo}
              </strong>
            </div>
            {initialMachineData.LastVisit && (
              <div className="row mb-3">
                <div className="col-lg-4 mb-2 mb-lg-0 text-lg-right">{TRL_Pack.fullMachine.LastVisit}</div>
                <strong className="col-lg-8 text-center text-lg-left">
                  {initialMachineData.LastVisit}
                </strong>
              </div>
            )}
            <div className="row">
              <div className="col-lg-4 mb-2 mb-lg-0 text-lg-right">{TRL_Pack.fullMachine.support}</div>
              <strong className="col-lg-8 text-center text-lg-left">
                {initialMachineData.MaintenanceType}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
