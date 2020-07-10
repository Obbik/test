import React, { useState, useEffect, useContext } from 'react'
import { LangContext } from '../../context/lang-context'

import Category from '../../components/Category/Category'
import Title from '../../components/Title/Title'
import SearchInput from '../SearchInput/SearchInput'

import fetchApi from '../../util/fetchApi'

export default ({ url, setLoader, NotificationError, NotificationSuccess }) => {
  const {
    languagePack: { categories }
  } = useContext(LangContext)

  const [state, setState] = useState({
    categories: [],
    initialCategories: []
  })
  const [tableView, setTableView] = useState(false)

  const deleteCategory = id => {
    const confirm = window.confirm('Czy na pewno chcesz usunąć kategorię?')

    if (confirm) {
      setLoader(true)

      fetchApi(`category/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.status && res.status < 400) {
            setLoader(false)
            NotificationSuccess(res.data.message)
            getCategories()
          } else throw new Error(res)
        })
        .catch(err => {
          setLoader(false)
          NotificationError(err)
        })
    }
  }

  const getCategories = () => {
    setLoader(true)

    fetchApi('categories')
      .then(res => {
        if (res.status !== 200) throw new Error()

        setLoader(false)
        setState({
          categories: res.data,
          initialCategories: res.data
        })
      })
      .catch(() => {
        setLoader(false)
        throw new Error('Failed to fetch status.')
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
          category => category.Name.toLowerCase().slice(0, inputLength) === inputValue
        )
  }

  useEffect(() => {
    getCategories()
  }, [])

  return (
    <>
      <Title
        title={categories.header}
        buttonName={categories.addCategoryButton}
        buttonLink="/category/add"
        enableAddButton={true}
      />
      <SearchInput tableView={tableView} onSearch={search} onToggleView={toggleView} />
      <Category
        url={url}
        categoryItems={state.categories}
        tableView={tableView}
        onDeleteCategory={deleteCategory}
      />
    </>
  )
}
