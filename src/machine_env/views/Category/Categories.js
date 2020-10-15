import React, { useState, useEffect, useContext } from 'react'
import { NavigationContext } from '../../context/navigation-context'
import { LangContext } from '../../context/lang-context'

import CategoryForm from '../../components//Modals/CategoryForm'

import CategoriesTable from '../../components/Category/CategoriesTable'
import CategoriesCards from '../../components/Category/CategoriesCards'
import Fab from '../../components/FloatingActionButton/Fab'
import SearchInput from '../../components/SearchInput/SearchInput'

import useFetch from '../../hooks/fetch-hook'

export default () => {
  const { fetchApi } = useFetch()

  const { setHeaderData } = useContext(NavigationContext)
  const {
    languagePack: { categories: categoriesTRL }
  } = useContext(LangContext)

  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState([])
  const [tableView, setTableView] = useState(false)

  const [categoryFormModal, setCategoryFormModal] = useState(null)

  const deleteCategory = id => {
    const confirm = window.confirm('Czy na pewno chcesz usunąć kategorię?')

    if (confirm) {
      fetchApi(`category/${id}`, { method: 'DELETE' }, getCategories)
    }
  }

  const getCategories = () => {
    fetchApi('categories', {}, data => setCategories(data))
  }

  const toggleView = () => setTableView(prev => !prev)

  const handleSearch = value => setSearch(value)

  useEffect(() => {
    getCategories()
    setHeaderData({ text: categoriesTRL.header })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const listProps = {
    categoryItems: categories.filter(c =>
      c.Name.toLowerCase().includes(search.toLowerCase())
    ),
    setModal: setCategoryFormModal,
    handleDeleteCategory: deleteCategory
  }

  return (
    <>
      <Fab action={() => setCategoryFormModal('add')} />
      <SearchInput
        tableView={tableView}
        onSearch={handleSearch}
        onToggleView={toggleView}
      />

      {tableView ? (
        <CategoriesTable {...listProps} />
      ) : (
        <CategoriesCards {...listProps} />
      )}
      {categoryFormModal && (
        <CategoryForm
          categoryId={categoryFormModal}
          closeModal={() => setCategoryFormModal(null)}
          getCategories={getCategories}
        />
      )}
    </>
  )
}
