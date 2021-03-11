import React, { useState, useRef, useEffect, useContext } from 'react'
import useFetch from '../../hooks/fetchMSSQL-hook'
import { NotificationContext } from '../../context/notification-context'
import DatalistInput from '../FormElements/DatalistInput'
import TextInput from '../FormElements/TextInput'
import { API_URL } from '../../config/config'
import { Prompt } from 'react-router'
import { LangContext } from '../../context/lang-context'
import { NotificationManager } from 'react-notifications';
import axios from 'axios'

export default ({ machineId }) => {
  const { fetchMssqlApi } = useFetch()
  const { ErrorNotification } = useContext(NotificationContext)

  const initialMachineRecipes = useRef(null)
  const [machineRecipesData, setMachineRecipesData] = useState([])
  const { TRL_Pack } = useContext(LangContext)
  const slotsCounter = useRef(0)

  const [recipesData, setRecipesData] = useState([])

  const [isUnsavedData, setIsUnsavedData] = useState(false)
  useEffect(
    () =>
      setIsUnsavedData(
        machineRecipesData.some(machineRecipe => {
          const initialRecipe = initialMachineRecipes.current.find(
            recipe => recipe.id === machineRecipe.id
          )

          return (
            machineRecipe.added ||
            machineRecipe.toDelete ||
            machineRecipe.SlotNo !== initialRecipe.SlotNo ||
            Number(machineRecipe.PriceBrutto) !== initialRecipe.PriceBrutto ||
            machineRecipe.RecipeName !== initialRecipe.RecipeName
          )
        })
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [machineRecipesData]
  )

  const getMachineRecipes = () => {
    fetchMssqlApi(`machine-products?machineId=${machineId}`, {}, machineRecipes => {
      machineRecipes.forEach(machineRecipe => (machineRecipe.id = slotsCounter.current++))
      initialMachineRecipes.current = machineRecipes
      setMachineRecipesData(machineRecipes)
    })
  }
  const getRecipes = () => {
    fetchMssqlApi('recipes', {}, recipes => setRecipesData(recipes))
  }


  useEffect(() => {
    getMachineRecipes()
    getRecipes()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = id => evt => {
    const { name, value } = evt.target
    setMachineRecipesData(prev =>
      prev.map(machineRecipe =>
        machineRecipe.id === id ? { ...machineRecipe, [name]: value } : machineRecipe
      )
    )
  }

  const handleAddRecipe = () =>
    setMachineRecipesData(prev => [
      ...prev,
      {
        added: true,
        SlotNo: '',
        PriceBrutto: "",
        notDisabled: true,
        RecipeName: '',
        id: slotsCounter.current++
      }
    ])

  const handleRemoveNewSlot = id => () =>
    setMachineRecipesData(prev => prev.filter(machineRecipe => id !== machineRecipe.id))

  const handleToggleOldFeeder = id => () => {
    setMachineRecipesData(prev =>
      prev.map(machineRecipe =>
        machineRecipe.id === id
          ? { ...machineRecipe, toDelete: !machineRecipe.toDelete }
          : machineRecipe
      )
    )
  }

  const recipeNameToId = name =>
    Number(recipesData.find(recipe => recipe.Name === name)?.RecipeId)

  const addSlot = slot => {
    fetchMssqlApi(`machine-product`, { method: 'POST', data: slot }, () => {
      initialMachineRecipes.current = initialMachineRecipes.current.concat({
        MachineFeederNo: slot.slotNo,
        Price: slot.price,
        RecipeName: slot.recipeName,
        id: slot.id,
        MaxItemCount: null
      })
      setMachineRecipesData(prev =>
        prev.map(machineRecipe =>
          machineRecipe.id === slot.id
            ? {
              MachineFeederNo: slot.slotNo,
              Price: slot.price,
              RecipeName: slot.recipeName,
              id: slot.id,
              MaxItemCount: null
            }
            : machineRecipe
        )
      )
    })
    getMachineRecipes()
    getRecipes()
  }

  const modifyFeeder = slot => {
    console.log(slot)
    fetchMssqlApi(
      `machine-product/${slot.MachineProductId}`,
      { method: 'PUT', data: slot },
      () => {
        initialMachineRecipes.current = initialMachineRecipes.current.map(
          machineRecipes =>
            machineRecipes.id === slot.id
              ? {
                MachineFeederNo: slot.slotNo,
                PriceBrutto: slot.price,
                RecipeName: slot.recipeName,
                id: slot.id
              }
              : machineRecipes
        )
        setMachineRecipesData(prev =>
          prev.map(machineRecipes =>
            machineRecipes.id === slot.id
              ? {
                MachineFeederNo: slot.slotNo,
                PriceBrutto: slot.price,
                RecipeName: slot.recipeName,
                id: slot.id
              }
              : machineRecipes
          )
        )
      }
    )
    getMachineRecipes()
    getRecipes()
  }

  const deleteFeeder = (slot) => {
    fetchMssqlApi(
      `machine-product/${slot.MachineProductId}`,
      { method: 'DELETE' },
      () => {
        initialMachineRecipes.current = initialMachineRecipes.current.filter(
          machineRecipes => machineRecipes.id !== slot.id
        )
        setMachineRecipesData(prev =>
          prev.filter(machineRecipes => machineRecipes.id !== slot.id)
        )
      }
    )
    getMachineRecipes()
    getRecipes()
  }

  const submitChanges = () => {

    const changedSlots = {
      added: [],
      deleted: [],
      modified: []
    }
    if (
      !machineRecipesData.every(machineRecipe => {
        if (machineRecipe.added) {
          const { MachineFeederNo, RecipeName, PriceBrutto } = machineRecipe
          const RecipeId = recipeNameToId(RecipeName)

          if (!MachineFeederNo || isNaN(RecipeId) || isNaN(PriceBrutto)) return false

          changedSlots.added.push({
            MachineId: parseInt(machineId),
            MachineFeederNo: parseInt(MachineFeederNo),
            RecipeId: RecipeId,
            RecipeName: RecipeName,
            Price: parseFloat(PriceBrutto),
          })
        } else if (machineRecipe.toDelete) {
          // const { SlotNo } = machineRecipe
          changedSlots.deleted.push({ id: machineRecipe.id, MachineProductId: machineRecipe.MachineProductId })
        } else {
          const initialRecipe = initialMachineRecipes.current.find(
            recipe => recipe.id === machineRecipe.id
          )
          if (
            initialRecipe.SlotNo !== machineRecipe.SlotNo ||
            initialRecipe.PriceBrutto !== machineRecipe.PriceBrutto ||
            initialRecipe.RecipeName !== machineRecipe.RecipeName
          ) {
            const { MachineProductId, RecipeName, PriceBrutto } = machineRecipe
            const RecipeId = recipeNameToId(RecipeName)

            if (!MachineProductId || isNaN(RecipeId) || isNaN(PriceBrutto)) return false
            console.log(machineRecipe)
            changedSlots.modified.push({
              RecipeId: RecipeId,
              RecipeName: RecipeName,
              Price: parseFloat(PriceBrutto),
              MachineFeederNo: parseInt(machineRecipe.MachineFeederNo),
              MachineProductId: parseInt(MachineProductId),

            })
          }
        }
        return true
      })
    ) {
      NotificationManager.error('Invalid data')
      return
    }


    let isEqual
    for (let x = 0; x < changedSlots.added.length - 1; x++) {
      console.log(changedSlots.added[x].MachineFeederNo)
      if (changedSlots.added[x].MachineFeederNo === changedSlots.added[x + 1].MachineFeederNo) {
        isEqual = true
      }
    }
    if (isEqual === true) {
      return NotificationManager.error(TRL_Pack.errors.sameNumber);
    }
    else {

      if (changedSlots.added.length) changedSlots.added.forEach(slot => addSlot(slot))
      if (changedSlots.deleted.length)
        changedSlots.deleted.forEach(slot => deleteFeeder(slot))
      if (changedSlots.modified.length)
        changedSlots.modified.forEach(slot => modifyFeeder(slot))
      getMachineRecipes()
      getRecipes()
    }
    getMachineRecipes()
    getRecipes()
  }

  const discardChanges = () => setMachineRecipesData(initialMachineRecipes.current)

  const handleDownload = () => {
    const token = localStorage.getItem('token')
    axios({
      url: `${API_URL}/api/machine-products-file?machineId=${machineId}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
      responseType: 'blob', // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file.csv');
      document.body.appendChild(link);
      link.click();
    });
  }

  const handleResetLastSales = () => {
    const confirmReset = window.confirm('Potwierdź reset sprzedaży')

    if (confirmReset)
      fetchMssqlApi(`machine-product-sales/${machineId}`, { method: 'PUT' }, () => {
        initialMachineRecipes.current = initialMachineRecipes.current.map(
          machineRecipe => ({ ...machineRecipe, LastSalesTotal: 0 })
        )
        setMachineRecipesData(prev =>
          prev.map(machineRecipe => ({ ...machineRecipe, LastSalesTotal: 0 }))
        )
      })
  }

  return machineRecipesData.length ? (
    <div className="card">
      <h5 className="card-header">
        {TRL_Pack.fullMachine.listOfProduct}
        <span className="ml-2 badge badge-info">{machineRecipesData.length}</span>
        <button
          className="float-right btn btn-sm btn-link text-decoration-none"
          onClick={handleAddRecipe}
        >
          <i className="fas fa-plus mr-2" />
          {TRL_Pack.fullMachine.new}
        </button>
        {initialMachineRecipes.current.length > 0 && (
          <>
            <button
              className="float-right btn btn-sm btn-link text-decoration-none mr-2"
              onClick={handleDownload}
            >
              <i className="fas fa-file-download mr-2" />
              {TRL_Pack.fullMachine.download}
            </button>
            <button
              className="float-right btn btn-sm btn-link text-decoration-none mr-2"
              onClick={handleResetLastSales}
            >
              <i className="fas fa-eraser mr-2" />
              {TRL_Pack.fullMachine.salesReset}
            </button>
          </>
        )}
      </h5>
      <datalist id="RecipeName">
        {recipesData.map((recipe, idx) => (
          <option key={idx}>{recipe.Name}</option>
        ))}
      </datalist>
      <div className="card-body overflow-auto" style={{ maxHeight: 550 }}>
        <Prompt
          when={isUnsavedData}
          message="Wykryto niezapisane zmiany, czy na pewno chcesz opuścić stronę?"
        />
        <table className="table table-striped">
          <thead>
            <tr>
              <th>{TRL_Pack.machineRecipies.number}</th>
              <th>{TRL_Pack.machineRecipies.recipies}</th>
              <th>{TRL_Pack.machineRecipies.price}</th>
              <th className="text-center">{TRL_Pack.machineRecipies.lastSales}</th>
              <th style={{ width: '1%' }} />
            </tr>
          </thead>
          <tbody>
            {machineRecipesData
              .filter(machineRecipe => machineRecipe.added)
              .map((machineRecipe, idx) => (
                <tr key={idx}>
                  <td>
                    <TextInput
                      style={{ maxWidth: 75 }}
                      name="MachineFeederNo"
                      value={machineRecipe.MachineFeederNo}
                      handleChange={handleChange(machineRecipe.id)}
                      required
                    />
                  </td>
                  <td>
                    <DatalistInput
                      name="RecipeName"
                      value={machineRecipe.RecipeName}
                      handleChange={handleChange(machineRecipe.id)}
                      list={recipesData.map(recipe => recipe.Name)}
                    />
                  </td>
                  <td>
                    <TextInput
                      style={{ maxWidth: 100 }}
                      name="PriceBrutto"
                      value={machineRecipe.PriceBrutto}
                      handleChange={handleChange(machineRecipe.id)}
                      type="number"
                      min={0}
                      max={1000}
                      required
                    />
                  </td>
                  <td />
                  <td className="text-center">
                    <button
                      className="btn btn-link btn-sm"
                      onClick={handleRemoveNewSlot(machineRecipe.id)}
                    >
                      <i className="fas fa-times" />
                    </button>
                  </td>
                </tr>
              ))}
            {machineRecipesData
              .filter(machineRecipe => !machineRecipe.added)
              .map((machineRecipe, idx) => (
                <tr key={idx}>
                  <td>
                    <TextInput
                      disabled
                      style={{ maxWidth: 75 }}
                      name="SlotNo"
                      value={machineRecipe.MachineFeederNo}
                      handleChange={handleChange(machineRecipe.id)}
                      required
                    />
                  </td>
                  <td>
                    <DatalistInput
                      name="RecipeName"
                      value={machineRecipe.RecipeName}
                      handleChange={handleChange(machineRecipe.id)}
                      list={recipesData.map(product => product.Name)}
                    />
                  </td>
                  <td>
                    <TextInput
                      style={{ maxWidth: 100 }}
                      name="PriceBrutto"
                      value={machineRecipe.PriceBrutto}
                      handleChange={handleChange(machineRecipe.id)}
                      type="number"
                      min={0}
                      max={1000}
                      required
                    />
                  </td>
                  <td className="text-center">{machineRecipe.LastSalesTotal || 0}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-link btn-sm"
                      onClick={handleToggleOldFeeder(machineRecipe.id)}
                    >
                      {machineRecipe.toDelete ? (
                        <i className="fas fa-trash-restore" />
                      ) : (
                        <i className="fas fa-trash" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
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
          onClick={submitChanges}
          disabled={!isUnsavedData}
        >
          {TRL_Pack.buttons.save}
        </button>
      </div>
    </div >
  ) : (
    <div className="text-center py-2">
      <button className="btn btn-link text-decoration-none" onClick={handleAddRecipe}>
        <i className="fas fa-plus mr-2" /> Dodaj recepture
      </button>
    </div>
  )
}
