import React, { useState, useEffect } from 'react'

import Category from '../../components/Category/Category_alt'
import Title from '../../components/Title/Title_alt'
import SearchInput from '../SearchInput/SearchInput_alt'

import fetchApi from '../../helpers/fetchApi'

export default ({ url, setLoader, NotificationError, NotificationSuccess }) => {
  const [state, setState] = useState({
    categories: [],
    initialCategories: []
  })
  const [tableView, setTableView] = useState(false)

  const deleteCategory = id => {
    const confirm = window.confirm('Czy na pewno chcesz usunąć kategorię?')

    if (confirm) {
      setLoader(true)

      fetchApi({ path: `category/${id}`, method: 'DELETE' }, res => {
        setLoader(false)

        if (res.status && res.status < 400) {
          NotificationSuccess(res.data.message)
          getCategories()
        } else NotificationError(res)
      })
    }
  }

  const getCategories = () => {
    setLoader(true)

    fetchApi({ path: 'categories' }, res => {
      setLoader(false)

      if (res.status !== 200) throw new Error('Failed to fetch status.')

      setState({
        categories: res.data,
        initialCategories: res.data
      })
    })
  }

  // Method for changing the view (table or cards)
  const toggleView = () => {
    setTableView(prev => !prev)
  }

  // Search bar
  const search = value => {
    const suggestions = getSuggestions(value)
    let filteredCategories = state.initialCategories

    if (value !== '') {
      filteredCategories = suggestions
    }

    setState(prev => ({ ...prev, categories: filteredCategories }))
  }

  const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length

    return inputLength === 0
      ? []
      : state.initialCategories.filter(
          category =>
            category.Name.toLowerCase().slice(0, inputLength) === inputValue
        )
  }

  useEffect(() => {
    getCategories()
  }, [])

  return (
    <>
      <Title
        title="Kategorie"
        buttonName="Dodaj kategorię"
        buttonLink="/category/add"
        enableAddButton={true}
      />
      <SearchInput
        tableView={tableView}
        onSearch={search}
        onToggleView={toggleView}
      />
      <Category
        url={url}
        categories={state.categories}
        tableView={tableView}
        onDeleteCategory={deleteCategory}
      />
    </>
  )
}
