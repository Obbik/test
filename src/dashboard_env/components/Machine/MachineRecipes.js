import React, { useState, useRef, useEffect, useContext } from 'react'
import useFetch from '../../hooks/fetchMSSQL-hook'
import { NotificationContext } from '../../context/notification-context'
import DatalistInput from '../FormElements/DatalistInput'
import TextInput from '../FormElements/TextInput'
import { API_URL } from '../../config/config'
import { Prompt } from 'react-router'

export default ({ machineId }) => {
  const { fetchMssqlApi } = useFetch()
  const { ErrorNotification } = useContext(NotificationContext)

  const initialMachineRecipes = useRef(null)
  const [machineRecipesData, setMachineRecipesData] = useState([])

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
  // console.log(m)
  // console.log(recipesData)

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
        PriceBrutto: 3,
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
    fetchMssqlApi(`machine/${machineId}/recipes`, { method: 'POST', data: slot }, () => {
      initialMachineRecipes.current = initialMachineRecipes.current.concat({
        SlotNo: slot.slotNo,
        PriceBrutto: slot.price,
        RecipeName: slot.recipeName,
        id: slot.id
      })
      setMachineRecipesData(prev =>
        prev.map(machineRecipe =>
          machineRecipe.id === slot.id
            ? {
              SlotNo: slot.slotNo,
              PriceBrutto: slot.price,
              RecipeName: slot.recipeName,
              id: slot.id
            }
            : machineRecipe
        )
      )
    })
  }

  const modifyFeeder = slot => {
    fetchMssqlApi(
      `machine/${machineId}/recipes/${slot.slotNo}`,
      { method: 'PUT', data: slot },
      () => {
        initialMachineRecipes.current = initialMachineRecipes.current.map(
          machineRecipes =>
            machineRecipes.id === slot.id
              ? {
                SlotNo: slot.slotNo,
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
                SlotNo: slot.slotNo,
                PriceBrutto: slot.price,
                RecipeName: slot.recipeName,
                id: slot.id
              }
              : machineRecipes
          )
        )
      }
    )
  }

  const deleteFeeder = slot => {
    fetchMssqlApi(
      `machine/${machineId}/recipes/${slot.slotNo}`,
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
          const { SlotNo, RecipeName, PriceBrutto } = machineRecipe
          const RecipeId = recipeNameToId(RecipeName)

          if (!SlotNo || isNaN(RecipeId) || isNaN(PriceBrutto)) return false

          changedSlots.added.push({
            id: machineRecipe.id,
            slotNo: SlotNo,
            recipeId: RecipeId,
            recipeName: RecipeName,
            price: parseFloat(PriceBrutto)
          })
        } else if (machineRecipe.toDelete) {
          const { SlotNo } = machineRecipe

          changedSlots.deleted.push({ id: machineRecipe.id, slotNo: SlotNo })
        } else {
          const initialRecipe = initialMachineRecipes.current.find(
            recipe => recipe.id === machineRecipe.id
          )

          if (
            initialRecipe.SlotNo !== machineRecipe.SlotNo ||
            initialRecipe.PriceBrutto !== machineRecipe.PriceBrutto ||
            initialRecipe.RecipeName !== machineRecipe.RecipeName
          ) {
            const { SlotNo, RecipeName, PriceBrutto } = machineRecipe
            const RecipeId = recipeNameToId(RecipeName)

            if (!SlotNo || isNaN(RecipeId) || isNaN(PriceBrutto)) return false

            changedSlots.modified.push({
              id: machineRecipe.id,
              slotNo: SlotNo,
              recipeId: RecipeId,
              price: parseFloat(PriceBrutto)
            })
          }
        }
        return true
      })
    ) {
      ErrorNotification('Invalid inputs.')
      return
    }

    if (changedSlots.added.length) changedSlots.added.forEach(slot => addSlot(slot))
    if (changedSlots.deleted.length)
      changedSlots.deleted.forEach(slotNo => deleteFeeder(slotNo))
    if (changedSlots.modified.length)
      changedSlots.modified.forEach(slot => modifyFeeder(slot))
  }

  const discardChanges = () => setMachineRecipesData(initialMachineRecipes.current)

  const handleDownload = () => {
    fetchMssqlApi(
      `/machine-recipes/${machineId}`,
      { method: 'POST', hideNotification: true },
      path => window.open(`${API_URL}/${path}`, '_blank')
    )
  }

  const handleResetLastSales = () => {
    const confirmReset = window.confirm('Potwierdź reset sprzedaży')

    if (confirmReset)
      fetchMssqlApi(`/machine/${machineId}/reset-sales`, { method: 'POST' }, () => {
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
        Wybory
        <span className="ml-2 badge badge-info">{machineRecipesData.length}</span>
        <button
          className="float-right btn btn-sm btn-link text-decoration-none"
          onClick={handleAddRecipe}
        >
          <i className="fas fa-plus mr-2" />
          Nowy
        </button>
        {initialMachineRecipes.current.length > 0 && (
          <>
            <button
              className="float-right btn btn-sm btn-link text-decoration-none mr-2"
              onClick={handleDownload}
            >
              <i className="fas fa-file-download mr-2" />
              Pobierz
            </button>
            <button
              className="float-right btn btn-sm btn-link text-decoration-none mr-2"
              onClick={handleResetLastSales}
            >
              <i className="fas fa-eraser mr-2" />
              Reset sprzedaży
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
              <th>Nr</th>
              <th>Receptura</th>
              <th>Cena (zł)</th>
              <th className="text-center">Ostatnia sprzedaż</th>
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
                      name="SlotNo"
                      value={machineRecipe.SlotNo}
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
                      style={{ maxWidth: 75 }}
                      name="SlotNo"
                      value={machineRecipe.SlotNo}
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
          Anuluj
        </button>
        <button
          className="btn btn-success btn-sm"
          onClick={submitChanges}
          disabled={!isUnsavedData}
        >
          Zapisz
        </button>
      </div>
    </div>
  ) : (
      <div className="text-center py-2">
        <button className="btn btn-link text-decoration-none" onClick={handleAddRecipe}>
          <i className="fas fa-plus mr-2" /> Dodaj recepture
      </button>
      </div>
    )
}
